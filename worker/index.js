// Portfolio API on a free Cloudflare Worker.
//   POST /message              { text }            → your Discord (webhook never leaves the Worker)
//   GET  /github                                   → profile, repos, contribution calendar, events (cached 1h)
//   POST /ask                  { q, history? }     → Ask Shamit (Workers AI), daily caps per visitor + overall
//   GET  /guestbook                                → approved entries      POST /guestbook { name, text } → pending + Discord approve/delete links
//   GET  /guestbook/moderate   ?id&action&sig      → the link clicked in Discord (HMAC-signed; no origin check)
//   POST /views/:slug  · POST /spark/:slug  · GET /counts/:slug   → article views and ✦ sparks
//   GET  /presence  (WebSocket)                    → live visitor count (Durable Object)
//   GET  /now-playing                              → Spotify, cached 30s (off until the SPOTIFY_* secrets exist)
//   POST /events  (sendBeacon, one per visit)      → analytics counters
// Secrets: DISCORD_WEBHOOK, GITHUB_TOKEN, ADMIN_SECRET, [SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN]
import { answer } from './ask.js';
export { Presence } from './presence.js';

const LIMITS = { ask: 8, askAll: 300, message: 10, sign: 3, spark: 30, events: 20 };   // per visitor per day; askAll is global

const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', ...headers } });
const today = () => new Date().toISOString().slice(0, 10);
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
const visitor = async (req) => hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(req.headers.get('cf-connecting-ip') || 'local'))).slice(0, 16);   // hashed: no raw IPs stored

function corsFor(req, env) {
  const origin = req.headers.get('origin') || '';
  if (!env.ALLOWED_ORIGINS.split(',').map((s) => s.trim()).includes(origin)) return null;
  return { 'access-control-allow-origin': origin, 'access-control-allow-methods': 'GET, POST', 'access-control-allow-headers': 'content-type', vary: 'origin' };
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
const where = (req) => `${req.cf?.city || '?'}, ${req.cf?.country || '?'}`;

async function body(req) { try { return await req.json(); } catch { return {}; } }
const clean = (s, max) => String(s || '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);   // eslint-disable-line no-control-regex

// ── message ──
async function message(req, env, who) {
  const { text } = await body(req);
  const t = clean(text, 1001);
  if (!t) return json({ error: 'empty message' }, 400);
  if (t.length > 1000) return json({ error: 'too long (1000 characters max)' }, 400);
  if (!(await under(env, `message:${who}`, LIMITS.message))) return json({ error: `that's ${LIMITS.message} messages today, email works too` }, 429);
  const res = await discord(env, { embeds: [{ description: t, color: 0xffac2e, author: { name: 'terminal message' }, footer: { text: `${where(req)} · ${(req.headers.get('user-agent') || '').slice(0, 80)}` }, timestamp: new Date().toISOString() }] });
  return res.ok ? json({ ok: true }) : json({ error: 'discord said no' }, 502);
}

// ── ask ──
async function ask(req, env, who) {
  const { q, history } = await body(req);
  const question = clean(q, 301);
  if (!question) return json({ error: 'ask me something' }, 400);
  if (question.length > 300) return json({ error: 'keep it under 300 characters' }, 400);
  if (!(await under(env, 'ask:*', LIMITS.askAll))) return json({ error: 'resting', message: "I've answered a lot today and I'm resting. Back tomorrow, or type message <your question> to ask Shamit directly." }, 429);
  if (!(await under(env, `ask:${who}`, LIMITS.ask))) return json({ error: 'limit', message: `That's your ${LIMITS.ask} questions for today. Type message <your question> to ask Shamit directly.` }, 429);
  const used = (await env.DB.prepare('SELECT n FROM usage WHERE day = ?1 AND key = ?2').bind(today(), `ask:${who}`).first())?.n || 0;
  const text = await answer(env, question, Array.isArray(history) ? history : []);
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
  if (!(await under(env, `sign:${who}`, LIMITS.sign))) return json({ error: 'you have signed enough for today ✦' }, 429);
  const { id } = await env.DB.prepare('INSERT INTO guestbook (name, text) VALUES (?1, ?2) RETURNING id').bind(name, text).first();
  const base = new URL(req.url).origin;
  const link = async (action) => `${base}/guestbook/moderate?id=${id}&action=${action}&sig=${await sign(env, `${id}:${action}`)}`;
  await discord(env, { embeds: [{
    title: 'New guestbook entry', color: 0xa0e0ab,
    description: `**${name}**\n${text}\n\n[✓ Approve](${await link('approve')})  ·  [✕ Delete](${await link('delete')})`,
    footer: { text: where(req) }, timestamp: new Date().toISOString(),
  }] });
  return json({ ok: true });
}

async function moderate(url, env) {
  const id = +url.searchParams.get('id'), action = url.searchParams.get('action'), sig = url.searchParams.get('sig') || '';
  const page = (msg) => new Response(`<!doctype html><meta name=viewport content="width=device-width"><body style="background:#000;color:#e6e3dc;font:16px ui-monospace,monospace;display:grid;place-items:center;height:100vh;margin:0">${msg}</body>`, { headers: { 'content-type': 'text/html; charset=utf-8' } });
  if (!id || !['approve', 'delete'].includes(action) || sig !== (await sign(env, `${id}:${action}`))) return page('✕ invalid link');
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
async function nowPlaying(env, ctx) {
  if (!env.SPOTIFY_REFRESH_TOKEN) return json({ configured: false });
  const key = new Request('https://cache.local/now-playing');
  const hit = await caches.default.match(key);
  if (hit) return json(await hit.json());
  const tok = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { authorization: 'Basic ' + btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`), 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: env.SPOTIFY_REFRESH_TOKEN }),
  }).then((r) => r.json());
  if (!tok.access_token) return json({ configured: true, playing: false });
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
  return json(out);
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

    const cors = corsFor(req, env);
    if (!cors) return new Response('forbidden', { status: 403 });   // only the portfolio's own pages may call this
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...cors, 'access-control-max-age': '86400' } });

    const who = await visitor(req);
    if (env.BURST && !(await env.BURST.limit({ key: who })).success) return json({ error: 'slow down' }, 429, cors);

    if (path === '/presence' && req.headers.get('upgrade') === 'websocket') return env.PRESENCE.get(env.PRESENCE.idFromName('site')).fetch(req);

    let res;
    try {
      const m = path.match(/^\/(views|spark|counts)\/([^/]+)$/);
      if (path === '/message' && req.method === 'POST') res = await message(req, env, who);
      else if (path === '/github' && req.method === 'GET') res = await github(env, ctx);
      else if (path === '/ask' && req.method === 'POST') res = await ask(req, env, who);
      else if (path === '/guestbook' && req.method === 'GET') res = await guestbookList(env, ctx);
      else if (path === '/guestbook' && req.method === 'POST') res = await guestbookSign(req, env, who);
      else if (path === '/now-playing' && req.method === 'GET') res = await nowPlaying(env, ctx);
      else if (path === '/events' && req.method === 'POST') res = await events(req, env, who);
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
};
