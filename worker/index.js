// Portfolio API on a free Cloudflare Worker.
//   POST /message              { text }            → your Discord (webhook never leaves the Worker)
//   GET  /github                                   → profile, repos, contribution calendar, events (cached 1h)
//   POST /ask                  { q, history? }     → Ask Shamit (Workers AI), daily caps per visitor + overall
//   GET  /guestbook                                → approved entries      POST /guestbook { name, text } → pending + Discord approve/delete links
//   GET  /guestbook/moderate   ?id&action&sig      → the link clicked in Discord (HMAC-signed; no origin check)
//   POST /views/:slug  · POST /spark/:slug  · GET /counts/:slug   → article views and ✦ sparks
//   GET  /presence  (WebSocket)                    → live visitor count (Durable Object)
//   GET  /now-playing                              → Spotify, cached 30s (off until the SPOTIFY_* secrets exist)
//   GET  /activity                                 → hero line: status note (24h) + music + latest push
//   GET|POST /note?k=NOTE_KEY                      → your private page to set the note; pushes it live to every visitor
//   POST /events  (sendBeacon, one per visit)      → analytics counters
//   POST /owner                { action, ... }     → owner tools for the terminal (x-owner header = NOTE_KEY)
//   scheduled (cron, daily)                        → owner digest to Discord while it is switched on
// Secrets: DISCORD_WEBHOOK, GITHUB_TOKEN, ADMIN_SECRET, NOTE_KEY, [SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN]
import { answer } from './ask.js';
import { PORTFOLIO as P } from '../src/data/config.js';
export { Presence } from './presence.js';

const LIMITS = { ask: 8, askAll: 300, message: 10, sign: 3, spark: 30, events: 20 };   // per visitor per day; askAll is global

const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', ...headers } });
const today = () => new Date().toISOString().slice(0, 10);
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
const visitor = async (req) => hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(req.headers.get('cf-connecting-ip') || 'local'))).slice(0, 16);   // hashed: no raw IPs stored

function corsFor(req, env) {
  const origin = req.headers.get('origin') || '';
  if (!env.ALLOWED_ORIGINS.split(',').map((s) => s.trim()).includes(origin)) return null;
  return { 'access-control-allow-origin': origin, 'access-control-allow-methods': 'GET, POST', 'access-control-allow-headers': 'content-type, x-owner', vary: 'origin' };
}

// daily cap: one atomic upsert, true while under `max`
async function under(env, key, max) {
  const row = await env.DB.prepare('INSERT INTO usage (day, key, n) VALUES (?1, ?2, 1) ON CONFLICT (day, key) DO UPDATE SET n = n + 1 RETURNING n').bind(today(), key).first();
  return row.n <= max;
}

async function sign(env, data) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.ADMIN_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))).slice(0, 32);
}

const discord = (env, payload) => fetch(env.DISCORD_WEBHOOK, {
  method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ username: 'portfolio', allowed_mentions: { parse: [] }, ...payload }),   // no @everyone / role pings from strangers
});
const md = (s) => s.replace(/[\\[\]()*_~`|>#<-]/g, '\\$&');   // visitor text can't fake links or buttons in the Discord embed
const where = (req) => `${req.cf?.city || '?'}, ${req.cf?.country || '?'}`;

async function body(req) { try { return await req.json(); } catch { return {}; } }
const clean = (s, max) => String(s || '').replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ').trim().slice(0, max);   // eslint-disable-line no-control-regex

// ── live switches (owner tools). Read once per request that needs them; D1 reads are cheap. ──
const DEFAULTS = { status: 'open', music: 'on', spotlight: '', resume: 'off', sphere: '', mood: '', banner: '', lock: 'off', digest: 'off', say: '' };
async function settings(env) {
  const { results } = await env.DB.prepare('SELECT k, v FROM settings').all();
  return { ...DEFAULTS, ...Object.fromEntries(results.map((r) => [r.k, r.v])) };
}
const short = (who) => who.slice(0, 8);   // the visitor id the owner sees and blocks by
// lock (sitewide) or block (this visitor) for the features strangers can write to
async function gate(env, who, s) {
  if (s.lock === 'on') return json({ error: 'locked', message: 'This is switched off for a little while. Email works: ' + P.contact.email }, 503);
  const b = await env.DB.prepare("SELECT 1 FROM blocks WHERE who = ?1 AND until > datetime('now')").bind(short(who)).first();
  return b ? json({ error: 'limit', message: "That's enough for today. Email works: " + P.contact.email }, 429) : null;
}

// ── message ──
async function message(req, env, who) {
  const { text } = await body(req);
  const t = clean(text, 1001);
  if (!t) return json({ error: 'empty message' }, 400);
  if (t.length > 1000) return json({ error: 'too long (1000 characters max)' }, 400);
  const shut = await gate(env, who, await settings(env));
  if (shut) return shut;
  if (!(await under(env, `message:${who}`, LIMITS.message))) return json({ error: `that's ${LIMITS.message} messages today, email works too` }, 429);
  await env.DB.prepare('INSERT INTO inbox (text, place) VALUES (?1, ?2)').bind(t, where(req)).run();   // readable with `owner inbox`
  const res = await discord(env, { embeds: [{ description: t, color: 0xffac2e, author: { name: 'terminal message' }, footer: { text: `${where(req)} · ${(req.headers.get('user-agent') || '').slice(0, 80)}` }, timestamp: new Date().toISOString() }] });
  return res.ok ? json({ ok: true }) : json({ error: 'discord said no' }, 502);
}

// ── ask ──
async function ask(req, env, who) {
  const { q, history } = await body(req);
  const question = clean(q, 301);
  if (!question) return json({ error: 'ask me something' }, 400);
  if (question.length > 300) return json({ error: 'keep it under 300 characters' }, 400);
  const s = await settings(env), owned = isOwner(req, env);
  if (!owned) { const shut = await gate(env, who, s); if (shut) return shut; }
  const { results: taught } = await env.DB.prepare('SELECT q, a FROM facts ORDER BY id').all();
  const opts = { facts: taught, status: s.status };
  if (!(await under(env, 'ask:*', LIMITS.askAll))) return json({ error: 'resting', message: "I've answered a lot today and I'm resting. Back tomorrow, or type message <your question> to ask Shamit directly." }, 429);
  // owner: the x-owner header matches NOTE_KEY (set in the terminal with `owner <key>`) → no per-visitor cap; the global cap still applies
  if (owned) {
    const text = await answer(env, question, Array.isArray(history) ? history : [], opts);
    return json({ answer: text || "I'm not sure.", left: 999 });
  }
  if (!(await under(env, `ask:${who}`, LIMITS.ask))) return json({ error: 'limit', message: `That's your ${LIMITS.ask} questions for today. Type message <your question> to ask Shamit directly.` }, 429);
  const used = (await env.DB.prepare('SELECT n FROM usage WHERE day = ?1 AND key = ?2').bind(today(), `ask:${who}`).first())?.n || 0;
  // the question itself, kept 30 days for `owner asks` (the AI's facts tell visitors this)
  await env.DB.batch([
    env.DB.prepare('INSERT INTO asks (who, q) VALUES (?1, ?2)').bind(short(who), question),
    env.DB.prepare("DELETE FROM asks WHERE at < datetime('now', '-30 days')"),
  ]);
  const text = await answer(env, question, Array.isArray(history) ? history : [], opts);
  return json({ answer: text || "I'm not sure. Try message <your question> to ask Shamit directly.", left: Math.max(0, LIMITS.ask - used) });
}

// ── guestbook ──
const GB_CACHE = new Request('https://cache.local/guestbook/v1');
async function guestbookList(env, ctx) {
  const hit = await caches.default.match(GB_CACHE);
  if (hit) return json(await hit.json());
  const { results } = await env.DB.prepare('SELECT id, name, text, created_at FROM guestbook WHERE approved = 1 ORDER BY id DESC LIMIT 30').all();
  ctx.waitUntil(caches.default.put(GB_CACHE, json(results, 200, { 'cache-control': 'max-age=300' })));
  return json(results);
}

async function guestbookSign(req, env, who) {
  const b = await body(req);
  const name = clean(b.name, 40), text = clean(b.text, 281);
  if (!name || !text) return json({ error: 'a name and a message, please' }, 400);
  if (text.length > 280) return json({ error: 'keep it under 280 characters' }, 400);
  const shut = await gate(env, who, await settings(env));
  if (shut) return shut;
  if (!(await under(env, `sign:${who}`, LIMITS.sign))) return json({ error: 'you have signed enough for today ✦' }, 429);
  const { id } = await env.DB.prepare('INSERT INTO guestbook (name, text) VALUES (?1, ?2) RETURNING id').bind(name, text).first();
  const base = new URL(req.url).origin;
  const link = async (action) => `${base}/guestbook/moderate?id=${id}&action=${action}&sig=${await sign(env, `${id}:${action}`)}`;
  await discord(env, { embeds: [{
    title: 'New guestbook entry', color: 0xa0e0ab,
    description: `**${md(name)}**\n${md(text)}\n\n[✓ Approve](${await link('approve')})  ·  [✕ Delete](${await link('delete')})`,
    footer: { text: where(req) }, timestamp: new Date().toISOString(),
  }] });
  return json({ ok: true });
}

async function moderate(url, env) {
  const id = +url.searchParams.get('id'), action = url.searchParams.get('action'), sig = url.searchParams.get('sig') || '';
  const page = (msg) => new Response(`<!doctype html><meta name=viewport content="width=device-width"><body style="background:#000;color:#e6e3dc;font:16px ui-monospace,monospace;display:grid;place-items:center;height:100vh;margin:0">${msg}</body>`, { headers: { 'content-type': 'text/html; charset=utf-8' } });
  if (!id || !['approve', 'delete'].includes(action) || !same(sig, await sign(env, `${id}:${action}`))) return page('✕ invalid link');
  if (action === 'approve') await env.DB.prepare('UPDATE guestbook SET approved = 1 WHERE id = ?1').bind(id).run();
  else await env.DB.prepare('DELETE FROM guestbook WHERE id = ?1').bind(id).run();
  await caches.default.delete(GB_CACHE);
  return page(action === 'approve' ? '✓ approved: it is on the site now' : '✓ deleted');
}

// ── article views + sparks ──
const SLUG = /^[a-z0-9-]{1,80}$/;
async function counts(env, slug) {
  const { results } = await env.DB.prepare('SELECT kind, n FROM counters WHERE slug = ?1').bind(slug).all();
  return Object.fromEntries([['views', 0], ['sparks', 0], ...results.map((r) => [r.kind, r.n])]);
}
async function bump(env, slug, kind) {
  await env.DB.prepare('INSERT INTO counters (slug, kind, n) VALUES (?1, ?2, 1) ON CONFLICT (slug, kind) DO UPDATE SET n = n + 1').bind(slug, kind).run();
  return json(await counts(env, slug));
}

// ── Spotify now playing ──
async function spotify(env, ctx) {
  if (!env.SPOTIFY_REFRESH_TOKEN) return { configured: false };
  const key = new Request('https://cache.local/now-playing');
  const hit = await caches.default.match(key);
  if (hit) return hit.json();
  const tok = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { authorization: 'Basic ' + btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`), 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: env.SPOTIFY_REFRESH_TOKEN }),
  }).then((r) => r.json());
  if (!tok.access_token) return { configured: true, playing: false };
  const h = { authorization: `Bearer ${tok.access_token}` };
  const track = (t) => t && { title: t.name, artist: t.artists.map((a) => a.name).join(', '), url: t.external_urls?.spotify };
  let out;
  const cur = await fetch('https://api.spotify.com/v1/me/player/currently-playing', { headers: h });
  const now = cur.status === 200 ? await cur.json() : null;
  if (now?.is_playing && now.item) out = { configured: true, playing: true, ...track(now.item) };
  else {
    const last = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', { headers: h }).then((r) => (r.ok ? r.json() : null));
    const item = last?.items?.[0];
    out = { configured: true, playing: false, ...(item ? { ...track(item.track), at: item.played_at } : {}) };
  }
  ctx.waitUntil(caches.default.put(key, json(out, 200, { 'cache-control': 'max-age=30' })));
  return out;
}
const nowPlaying = async (env, ctx) => json((await settings(env)).music === 'off' ? { configured: true, playing: false, hidden: true } : await spotify(env, ctx));

// ── live activity for the hero: status note + music + latest push ──
const NOTE_TTL = 24 * 3600 * 1000;
async function currentNote(env) {
  const row = await env.DB.prepare('SELECT text, set_at FROM note WHERE id = 1').first();
  if (!row) return null;
  const at = new Date(row.set_at.replace(' ', 'T') + 'Z');
  return Date.now() - at < NOTE_TTL ? { text: row.text, at: at.toISOString() } : null;
}
async function lastPush(env, ctx) {
  const key = new Request('https://cache.local/last-push');
  const hit = await caches.default.match(key);
  if (hit) return hit.json();
  const ev = await fetch(`https://api.github.com/users/${env.GH_USER}/events/public?per_page=15`, {
    headers: { authorization: `Bearer ${env.GITHUB_TOKEN}`, 'user-agent': 'portfolio-worker', accept: 'application/vnd.github+json' },
  }).then((r) => (r.ok ? r.json() : [])).catch(() => []);
  const e = ev.find((x) => x.type === 'PushEvent');
  const out = e ? { repo: e.repo.name.replace(env.GH_USER + '/', ''), at: e.created_at } : null;
  ctx.waitUntil(caches.default.put(key, json(out, 200, { 'cache-control': 'max-age=300' })));
  return out;
}
async function activityData(env, ctx) {
  const s = await settings(env);
  const [note, music, push, eggs] = await Promise.all([
    currentNote(env), s.music === 'off' ? null : spotify(env, ctx).catch(() => null), lastPush(env, ctx).catch(() => null),
    env.DB.prepare('SELECT cmd, reply FROM eggs').all().then((r) => r.results),
  ]);
  let say = null;
  try { const v = s.say && JSON.parse(s.say); if (v && Date.parse(v.until) > Date.now()) say = v; } catch { /* old value */ }
  // only what pages need: lock, digest and the rest stay on the server
  const site = { status: s.status, spotlight: s.spotlight, resume: s.resume, sphere: s.sphere, mood: s.mood, banner: s.banner, say, eggs: Object.fromEntries(eggs.map((e) => [e.cmd, e.reply])) };
  return { note, music: music?.playing ? { title: music.title, artist: music.artist, url: music.url } : null, push, site };
}
// push fresh activity (note, switches, a `say`) to every open page
async function pushActivity(env, ctx) {
  const activity = await activityData(env, ctx);
  ctx.waitUntil(env.PRESENCE.get(env.PRESENCE.idFromName('site')).fetch('https://do/broadcast', { method: 'POST', body: JSON.stringify({ activity }) }));
}

// set (text) or clear (null) the hero note, then push the new activity to every open page
async function setNote(env, ctx, text) {
  if (text) await env.DB.prepare("INSERT INTO note (id, text, set_at) VALUES (1, ?1, datetime('now')) ON CONFLICT (id) DO UPDATE SET text = ?1, set_at = datetime('now')").bind(text).run();
  else await env.DB.prepare('DELETE FROM note WHERE id = 1').run();
  await pushActivity(env, ctx);
}

// ── owner tools: the terminal's `owner …` commands. Same key as the note page, sent as the x-owner header. ──
const isOwner = (req, env) => !!env.NOTE_KEY && same(req.headers.get('x-owner') || '', env.NOTE_KEY);
const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);
async function owner(req, env, ctx) {
  if (!isOwner(req, env)) return json({ error: 'not found' }, 404);   // same answer as an unknown path
  const b = await body(req), id = Number.isInteger(b.id) ? b.id : 0;
  switch (b.action) {
    case 'status': return json({ ok: true });
    case 'stats': {
      const days = Math.min(Math.max(+b.days || 1, 1), 30), from = daysAgo(days - 1);
      const { results: ev } = await env.DB.prepare('SELECT name, SUM(n) AS n FROM events WHERE day >= ?1 GROUP BY name ORDER BY n DESC').bind(from).all();
      const { results: use } = await env.DB.prepare("SELECT substr(key, 1, instr(key, ':') - 1) AS f, SUM(n) AS n, COUNT(*) AS people FROM usage WHERE day >= ?1 AND key NOT LIKE '%:*' GROUP BY f").bind(from).all();
      const asksToday = (await env.DB.prepare("SELECT n FROM usage WHERE day = ?1 AND key = 'ask:*'").bind(daysAgo(0)).first())?.n || 0;
      const pending = (await env.DB.prepare('SELECT COUNT(*) AS n FROM guestbook WHERE approved = 0').first()).n;
      const { results: top } = await env.DB.prepare("SELECT slug, kind, n FROM counters ORDER BY n DESC LIMIT 8").all();
      return json({ days, events: ev, usage: use, asksToday, askCap: LIMITS.askAll, pending, counters: top });
    }
    case 'pending': {
      const { results } = await env.DB.prepare('SELECT id, name, text, created_at FROM guestbook WHERE approved = 0 ORDER BY id').all();
      return json(results);
    }
    case 'approve':
    case 'delete': {
      if (!id) return json({ error: 'which entry? give its id' }, 400);
      const r = b.action === 'approve'
        ? await env.DB.prepare('UPDATE guestbook SET approved = 1 WHERE id = ?1').bind(id).run()
        : await env.DB.prepare('DELETE FROM guestbook WHERE id = ?1').bind(id).run();
      if (!r.meta.changes) return json({ error: `no entry #${id}` }, 404);
      await caches.default.delete(GB_CACHE);
      return json({ ok: true });
    }
    case 'note': {
      const text = b.text === null ? null : clean(b.text, 60);
      if (text === '') { const n = await currentNote(env); return json({ note: n }); }   // no text: show the current one
      await setNote(env, ctx, text);
      return json({ ok: true, note: await currentNote(env) });
    }
    case 'reset': {
      const r = await env.DB.prepare("DELETE FROM usage WHERE day = ?1 AND key NOT LIKE '%:*' AND (key LIKE 'ask:%' OR key LIKE 'message:%' OR key LIKE 'sign:%')").bind(daysAgo(0)).run();
      return json({ ok: true, cleared: r.meta.changes });
    }
    case 'set': {   // the live switches
      const k = String(b.k || ''), raw = b.v == null ? '' : String(b.v);
      const ok = {
        status: ['open', 'busy', 'hidden'], music: ['on', 'off'], resume: ['on', 'off'], lock: ['on', 'off'], digest: ['on', 'off'],
        sphere: ['', 'ocean', 'silk', 'teal', 'aurora', 'ember'], mood: ['', 'calm', 'party'],
        spotlight: ['', ...P.featured.map((f) => f.name.toLowerCase())],
      };
      let v;
      if (ok[k]) { v = raw.toLowerCase(); if (!ok[k].includes(v)) return json({ error: `${k}: ${ok[k].filter(Boolean).join(' | ')}` }, 400); }
      else if (k === 'banner') v = clean(raw, 120);
      else if (k === 'say') {
        const text = clean(b.text, 120), min = Math.min(Math.max(parseInt(b.minutes, 10) || 10, 1), 120);
        v = text ? JSON.stringify({ text, until: new Date(Date.now() + min * 60000).toISOString() }) : '';
      } else return json({ error: 'unknown switch' }, 400);
      await env.DB.prepare('INSERT INTO settings (k, v) VALUES (?1, ?2) ON CONFLICT (k) DO UPDATE SET v = ?2').bind(k, v).run();
      await pushActivity(env, ctx);
      return json({ ok: true, k, v });
    }
    case 'settings': return json(await settings(env));
    case 'asks': {
      const days = Math.min(Math.max(+b.days || 7, 1), 30);
      const { results } = await env.DB.prepare(`SELECT who, q, at FROM asks WHERE at >= datetime('now', ?1) ORDER BY id DESC LIMIT 200`).bind(`-${days} days`).all();
      return json({ days, asks: results });
    }
    case 'teach': {
      const q = clean(b.q, 200), a = clean(b.a, 400);
      if (q && a) await env.DB.prepare('INSERT INTO facts (q, a) VALUES (?1, ?2)').bind(q, a).run();
      const { results } = await env.DB.prepare('SELECT id, q, a FROM facts ORDER BY id').all();
      return json(results);
    }
    case 'forget': {
      const r = await env.DB.prepare('DELETE FROM facts WHERE id = ?1').bind(id).run();
      return r.meta.changes ? json({ ok: true }) : json({ error: `no fact #${id}` }, 404);
    }
    case 'egg': {
      const cmd = String(b.cmd || '').toLowerCase();
      if (cmd) {
        if (!/^[a-z0-9-]{1,20}$/.test(cmd)) return json({ error: 'egg names: a-z, 0-9 and -, up to 20' }, 400);
        const reply = clean(b.reply, 300);
        if (reply) await env.DB.prepare('INSERT INTO eggs (cmd, reply) VALUES (?1, ?2) ON CONFLICT (cmd) DO UPDATE SET reply = ?2').bind(cmd, reply).run();
        else await env.DB.prepare('DELETE FROM eggs WHERE cmd = ?1').bind(cmd).run();
        await pushActivity(env, ctx);
      }
      const { results } = await env.DB.prepare('SELECT cmd, reply FROM eggs ORDER BY cmd').all();
      return json(results);
    }
    case 'inbox': {
      if (b.clear) await env.DB.prepare('DELETE FROM inbox').run();
      const { results } = await env.DB.prepare('SELECT id, text, place, at FROM inbox ORDER BY id DESC LIMIT 20').all();
      return json(results);
    }
    case 'block': {
      const w = String(b.who || '').toLowerCase();
      if (w) {
        if (!/^[0-9a-f]{8}$/.test(w)) return json({ error: 'visitor ids are 8 characters, as shown in owner asks / owner live' }, 400);
        if (b.off) await env.DB.prepare('DELETE FROM blocks WHERE who = ?1').bind(w).run();
        else await env.DB.prepare("INSERT INTO blocks (who, until) VALUES (?1, datetime('now', '+1 day')) ON CONFLICT (who) DO UPDATE SET until = datetime('now', '+1 day')").bind(w).run();
      }
      const { results } = await env.DB.prepare("SELECT who, until FROM blocks WHERE until > datetime('now') ORDER BY until").all();
      return json(results);
    }
    case 'link': {
      const name = String(b.name || '').toLowerCase();
      if (name) {
        if (!/^[a-z0-9-]{1,20}$/.test(name)) return json({ error: 'link names: a-z, 0-9 and -, up to 20' }, 400);
        await env.DB.prepare('INSERT OR IGNORE INTO links (name) VALUES (?1)').bind(name).run();
      }
      const { results: names } = await env.DB.prepare('SELECT name, created_at FROM links ORDER BY created_at DESC').all();
      const { results: ev } = await env.DB.prepare("SELECT name, SUM(n) AS n, MAX(day) AS last FROM events WHERE name LIKE 'link:%' GROUP BY name").all();
      return json({ links: names, events: ev });
    }
    case 'sparks': {
      const { results: totals } = await env.DB.prepare('SELECT slug, kind, n FROM counters').all();
      const { results: week } = await env.DB.prepare("SELECT name, SUM(CASE WHEN day >= ?1 THEN n ELSE 0 END) AS now, SUM(CASE WHEN day < ?1 THEN n ELSE 0 END) AS before FROM events WHERE day >= ?2 AND (name LIKE 'article:%' OR name LIKE 'study:%') GROUP BY name").bind(daysAgo(6), daysAgo(13)).all();
      return json({ totals, week });
    }
    case 'ideas': {   // journal ideas from what people asked
      const { results } = await env.DB.prepare("SELECT DISTINCT q FROM asks WHERE at >= datetime('now', '-30 days') ORDER BY id DESC LIMIT 80").all();
      if (results.length < 3) return json({ ideas: [], note: 'not enough questions yet (need a few days of asks)' });
      const covered = [...P.journal.map((j) => j.title), ...P.featured.filter((f) => f.study).map((f) => f.name + ' case study')].join('; ');
      const out = await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fp8-fast', { max_tokens: 300, temperature: 0.4, messages: [
        { role: 'system', content: 'You help a software engineer plan blog posts. Reply with exactly 5 lines, each a short post title, then " — " and why, in under 20 words. No numbering, no markdown.' },
        { role: 'user', content: `Already written: ${covered}\n\nQuestions visitors asked about him:\n${results.map((r) => '- ' + r.q).join('\n')}\n\nSuggest 5 posts that would answer what visitors want to know and are not already written.` },
      ] });
      return json({ ideas: String(out.response || '').split('\n').map((l) => l.replace(/^[\s\-*\d.]+/, '').trim()).filter(Boolean).slice(0, 5) });
    }
    case 'live': {
      const r = await env.PRESENCE.get(env.PRESENCE.idFromName('site')).fetch('https://do/snapshot', { method: 'POST' });
      return json(await r.json());
    }
    case 'health': {
      const s = await settings(env);
      const asksToday = (await env.DB.prepare("SELECT n FROM usage WHERE day = ?1 AND key = 'ask:*'").bind(today()).first())?.n || 0;
      const writes = (await env.DB.prepare('SELECT (SELECT COALESCE(SUM(n), 0) FROM usage WHERE day = ?1) + (SELECT COUNT(*) FROM events WHERE day = ?1) AS n').bind(today()).first()).n;
      const gh = await fetch('https://api.github.com/rate_limit', { headers: { authorization: `Bearer ${env.GITHUB_TOKEN}`, 'user-agent': 'portfolio-worker' } })
        .then((r) => (r.ok ? r.json() : null)).then((j) => j && { left: j.rate.remaining, limit: j.rate.limit }).catch(() => null);
      return json({
        asksToday, askCap: LIMITS.askAll, neurons: asksToday * 30, neuronCap: 10000, writesApprox: writes,
        github: gh, spotify: !!env.SPOTIFY_REFRESH_TOKEN, discord: !!env.DISCORD_WEBHOOK,
        settings: s,
      });
    }
    case 'digest': {   // send one now (to check it)
      const ok = await sendDigest(env, today());
      return ok ? json({ ok: true }) : json({ error: 'discord said no' }, 502);
    }
    default: return json({ error: 'unknown action' }, 400);
  }
}

// ── /note: your private page for setting the note (bookmark it on your phone). Key = NOTE_KEY secret. ──
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const same = (a, b) => a.length === b.length && [...a].reduce((d, c, i) => d | (c.charCodeAt(0) ^ b.charCodeAt(i)), 0) === 0;
async function notePage(req, env, ctx, url) {
  const key = url.searchParams.get('k') || '';
  if (!env.NOTE_KEY || !same(key, env.NOTE_KEY)) return new Response('not found', { status: 404 });
  let flash = '';
  if (req.method === 'POST') {
    const form = await req.formData();
    const text = clean(form.get('text'), 60);
    if (form.get('action') === 'clear') { await setNote(env, ctx, null); flash = 'cleared'; }
    else if (text) { await setNote(env, ctx, text); flash = 'live on the site ✦'; }
  }
  const note = await currentNote(env);
  const left = note ? Math.max(1, Math.round((NOTE_TTL - (Date.now() - new Date(note.at))) / 3600000)) : 0;
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><meta name="theme-color" content="#0a0907"><title>note</title><style>
*{box-sizing:border-box}body{margin:0;min-height:100svh;display:grid;place-items:center;background:radial-gradient(120% 80% at 80% 0%,#2a1e0c,#0a0907 60%);color:#ece8df;font:16px/1.4 ui-sans-serif,system-ui,sans-serif;padding:24px}
main{width:min(420px,100%)}h1{font:500 12px ui-monospace,monospace;letter-spacing:.18em;text-transform:uppercase;color:#8a8577;margin:0 0 18px}
.cur{padding:16px 18px;border:1px solid #ffffff1a;border-radius:18px;background:#ffffff08;margin-bottom:22px}.cur b{display:block;font-weight:500;font-size:18px;margin-bottom:4px}.cur small{color:#8a8577}
input{width:100%;font:inherit;font-size:18px;color:inherit;background:#ffffff0d;border:1px solid #ffffff26;border-radius:14px;padding:14px 16px;outline:none}input:focus{border-color:#ffac2e}
.row{display:flex;gap:10px;margin-top:12px}button{flex:1;font:inherit;padding:13px;border-radius:14px;border:1px solid #ffffff26;background:none;color:inherit}button.go{background:#ffac2e;color:#1a1204;border:0;font-weight:600}
.flash{color:#a0e0ab;font:13px ui-monospace,monospace;margin-bottom:14px}.count{text-align:right;color:#8a8577;font-size:12px;margin-top:6px}
</style></head><body><main><h1>✦ your note · iamshamit.com</h1>${flash ? `<div class="flash">${esc(flash)}</div>` : ''}
<div class="cur">${note ? `<b>${esc(note.text)}</b><small>live · disappears in ~${left}h</small>` : '<small>no note right now: the hero shows your music or latest push</small>'}</div>
<form method="post"><input name="text" maxlength="60" placeholder="what's on your mind? (60)" autocomplete="off" oninput="document.getElementById('c').textContent=this.value.length+'/60'">
<div class="count" id="c">0/60</div><div class="row"><button class="go" name="action" value="set">Share</button>${note ? '<button name="action" value="clear">Clear</button>' : ''}</div></form></main></body></html>`;
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'referrer-policy': 'no-referrer' } });
}

// ── analytics: one beacon per visit, { e: { "event:name": count } } ──
async function events(req, env, who) {
  let data;
  try { data = JSON.parse(await req.text()); } catch { return new Response(null, { status: 204 }); }
  if (!(await under(env, `events:${who}`, LIMITS.events))) return new Response(null, { status: 204 });
  const rows = Object.entries(data?.e || {}).filter(([k, n]) => /^[a-z0-9:._/-]{1,60}$/i.test(k) && Number.isInteger(n) && n > 0).slice(0, 30);
  if (rows.length) {
    const stmt = env.DB.prepare('INSERT INTO events (day, name, n) VALUES (?1, ?2, ?3) ON CONFLICT (day, name) DO UPDATE SET n = n + ?3');
    await env.DB.batch(rows.map(([k, n]) => stmt.bind(today(), k.toLowerCase(), Math.min(n, 50))));
  }
  return new Response(null, { status: 204 });
}

// ── GitHub ──
const LEVEL = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };
const QUERY = `query($u: String!) { user(login: $u) {
  login name bio url createdAt
  repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC, orderBy: {field: PUSHED_AT, direction: DESC}) {
    totalCount nodes { name description url stargazerCount isFork pushedAt primaryLanguage { name } } }
  contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount contributionLevel } } } }
} }`;

async function github(env, ctx) {
  const key = new Request('https://cache.local/github/v1');
  const hit = await caches.default.match(key);
  if (hit) return json(await hit.json());
  const h = { authorization: `Bearer ${env.GITHUB_TOKEN}`, 'user-agent': 'portfolio-worker', accept: 'application/vnd.github+json' };
  const [gql, ev] = await Promise.all([
    fetch('https://api.github.com/graphql', { method: 'POST', headers: h, body: JSON.stringify({ query: QUERY, variables: { u: env.GH_USER } }) }).then((r) => r.json()),
    fetch(`https://api.github.com/users/${env.GH_USER}/events/public?per_page=60`, { headers: h }).then((r) => (r.ok ? r.json() : [])),
  ]);
  const u = gql.data?.user;
  if (!u) return json({ error: gql.errors?.[0]?.message || 'github unavailable' }, 502);
  const cal = u.contributionsCollection.contributionCalendar;
  const out = {
    user: { login: u.login, name: u.name, bio: u.bio, url: u.url, createdAt: u.createdAt, publicRepos: u.repositories.totalCount },
    repos: u.repositories.nodes.map((r) => ({ name: r.name, description: r.description, url: r.url, stars: r.stargazerCount, fork: r.isFork, pushedAt: r.pushedAt, language: r.primaryLanguage?.name || null })),
    calendar: { total: cal.totalContributions, days: cal.weeks.flatMap((w) => w.contributionDays).map((d) => ({ date: d.date, count: d.contributionCount, level: LEVEL[d.contributionLevel] ?? 0 })) },
    events: ev.map((e) => ({ type: e.type, repo: e.repo.name, at: e.created_at, size: e.payload.size || e.payload.commits?.length || 0, refType: e.payload.ref_type || null })),
  };
  ctx.waitUntil(caches.default.put(key, json(out, 200, { 'cache-control': 'max-age=3600' })));
  return json(out);
}

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url), path = url.pathname;
    // the moderation link is opened from Discord (no Origin header): it carries its own HMAC signature instead
    if (path === '/guestbook/moderate' && req.method === 'GET') return moderate(url, env);
    if (path === '/note') return notePage(req, env, ctx, url);   // your phone, no Origin: guarded by the NOTE_KEY in the link

    const cors = corsFor(req, env);
    if (!cors) return new Response('forbidden', { status: 403 });   // only the portfolio's own pages may call this
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...cors, 'access-control-max-age': '86400' } });

    const who = await visitor(req);
    if (env.BURST && !(await env.BURST.limit({ key: who })).success) return json({ error: 'slow down' }, 429, cors);

    if (path === '/presence' && req.headers.get('upgrade') === 'websocket') {
      const fwd = new Request(req); fwd.headers.set('x-who', short(who));   // set by the Worker only; the DO never trusts a client value
      return env.PRESENCE.get(env.PRESENCE.idFromName('site')).fetch(fwd);
    }

    let res;
    try {
      const m = path.match(/^\/(views|spark|counts)\/([^/]+)$/);
      if (path === '/message' && req.method === 'POST') res = await message(req, env, who);
      else if (path === '/github' && req.method === 'GET') res = await github(env, ctx);
      else if (path === '/ask' && req.method === 'POST') res = await ask(req, env, who);
      else if (path === '/guestbook' && req.method === 'GET') res = await guestbookList(env, ctx);
      else if (path === '/guestbook' && req.method === 'POST') res = await guestbookSign(req, env, who);
      else if (path === '/now-playing' && req.method === 'GET') res = await nowPlaying(env, ctx);
      else if (path === '/activity' && req.method === 'GET') res = json(await activityData(env, ctx));
      else if (path === '/events' && req.method === 'POST') res = await events(req, env, who);
      else if (path === '/owner' && req.method === 'POST') res = await owner(req, env, ctx);
      else if (m && SLUG.test(m[2])) {
        if (m[1] === 'counts' && req.method === 'GET') res = json(await counts(env, m[2]));
        else if (m[1] === 'views' && req.method === 'POST') res = await bump(env, m[2], 'views');
        else if (m[1] === 'spark' && req.method === 'POST') res = (await under(env, `spark:${who}`, LIMITS.spark)) ? await bump(env, m[2], 'sparks') : json({ error: 'enough sparks for today ✦' }, 429);
      }
      res ??= json({ error: 'not found' }, 404);
    } catch (e) {
      console.error(path, e?.stack || e);
      res = json({ error: 'worker error' }, 500);
    }
    const out = new Response(res.body, res);
    for (const [k, v] of Object.entries(cors)) out.headers.set(k, v);
    return out;
  },
  // daily at 09:00 IST: yesterday's summary, only while `owner digest on`
  async scheduled(event, env, ctx) {
    if ((await settings(env)).digest === 'on') ctx.waitUntil(sendDigest(env, daysAgo(1)));
  },
};

// ── owner digest: one Discord embed with a day's numbers ──
async function sendDigest(env, day) {
  const { results: ev } = await env.DB.prepare('SELECT name, n FROM events WHERE day = ?1 ORDER BY n DESC').bind(day).all();
  const n = (name) => ev.find((e) => e.name === name)?.n || 0;
  const top = (prefix, k = 3) => ev.filter((e) => e.name.startsWith(prefix)).slice(0, k).map((e) => `${e.name.slice(prefix.length)} ×${e.n}`).join(', ') || '—';
  const asks = (await env.DB.prepare("SELECT COUNT(*) AS n FROM asks WHERE date(at) = ?1").bind(day).first()).n;
  const inbox = (await env.DB.prepare("SELECT COUNT(*) AS n FROM inbox WHERE date(at) = ?1").bind(day).first()).n;
  const pending = (await env.DB.prepare('SELECT COUNT(*) AS n FROM guestbook WHERE approved = 0').first()).n;
  const r = await discord(env, { embeds: [{
    title: `iamshamit.com · ${day}`, color: 0x49c5b6,
    description: [
      `**${n('visit:desktop') + n('visit:touch')}** visits (${n('visit:desktop')} desktop · ${n('visit:touch')} touch) · **${n('scroll:100')}** read to the end`,
      `from: ${top('src:')}`,
      `read: ${top('study:')} ${top('article:') === '—' ? '' : '· ' + top('article:')}`,
      `terminal: **${n('terminal:open')}** opens · AI: **${asks}** questions · messages: **${inbox}**`,
      `tracked links: ${ev.filter((e) => /^link:[^:]+:visit/.test(e.name)).map((e) => e.name.split(':')[1] + ' ×' + e.n).join(', ') || '—'}`,
      pending ? `guestbook: **${pending}** waiting (owner pending)` : '',
    ].filter(Boolean).join('\n'),
  }] });
  return r.ok;
}
