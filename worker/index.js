// Portfolio API on a free Cloudflare Worker.
//   POST /message  { text, from? }  → your Discord (the webhook URL never leaves the Worker)
//   GET  /github                    → profile, repos, contribution calendar and recent events, cached for an hour
// Secrets (wrangler secret put …): DISCORD_WEBHOOK, GITHUB_TOKEN.  Vars (wrangler.toml): GH_USER, ALLOWED_ORIGINS.

const json = (body, status, cors) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', ...cors } });

function corsFor(req, env) {
  const origin = req.headers.get('origin') || '';
  const ok = env.ALLOWED_ORIGINS.split(',').map((s) => s.trim()).includes(origin);
  return ok ? { 'access-control-allow-origin': origin, 'access-control-allow-methods': 'GET, POST', 'access-control-allow-headers': 'content-type', vary: 'origin' } : null;
}

// ponytail: per-IP limit kept in the edge cache (per data centre, no storage writes). Move to the rate-limit binding or D1 if abused across regions.
async function limited(ip, max, seconds) {
  const key = new Request(`https://rate.limit/${encodeURIComponent(ip)}`);
  const hit = await caches.default.match(key);
  const n = hit ? +(await hit.text()) : 0;
  if (n >= max) return true;
  await caches.default.put(key, new Response(String(n + 1), { headers: { 'cache-control': `max-age=${seconds}` } }));
  return false;
}

async function message(req, env, cors) {
  let body;
  try { body = await req.json(); } catch { return json({ error: 'bad json' }, 400, cors); }
  const text = String(body.text || '').trim(), from = String(body.from || '').trim().slice(0, 60);
  if (!text) return json({ error: 'empty message' }, 400, cors);
  if (text.length > 1000) return json({ error: 'too long (1000 characters max)' }, 400, cors);
  const ip = req.headers.get('cf-connecting-ip') || 'local';
  if (await limited(ip, 3, 600)) return json({ error: 'slow down: 3 messages per 10 minutes' }, 429, cors);

  const res = await fetch(env.DISCORD_WEBHOOK, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      username: 'portfolio terminal',
      allowed_mentions: { parse: [] },   // no @everyone / @here / role pings from strangers
      embeds: [{
        description: text,
        color: 0xffac2e,
        author: { name: from || 'anonymous visitor' },
        footer: { text: `${req.cf?.city || '?'}, ${req.cf?.country || '?'} · ${(req.headers.get('user-agent') || '').slice(0, 80)}` },
        timestamp: new Date().toISOString(),
      }],
    }),
  });
  return res.ok ? json({ ok: true }, 200, cors) : json({ error: 'discord said no' }, 502, cors);
}

const LEVEL = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };
const QUERY = `query($u: String!) { user(login: $u) {
  login name bio url createdAt
  repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC, orderBy: {field: PUSHED_AT, direction: DESC}) {
    totalCount nodes { name description url stargazerCount isFork pushedAt primaryLanguage { name } } }
  contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount contributionLevel } } } }
} }`;

async function github(env, ctx, cors) {
  const cache = caches.default, key = new Request('https://cache.github/v1');
  const hit = await cache.match(key);
  if (hit) return new Response(hit.body, { headers: { 'content-type': 'application/json', ...cors } });

  const h = { authorization: `Bearer ${env.GITHUB_TOKEN}`, 'user-agent': 'portfolio-worker', accept: 'application/vnd.github+json' };
  const [gql, events] = await Promise.all([
    fetch('https://api.github.com/graphql', { method: 'POST', headers: h, body: JSON.stringify({ query: QUERY, variables: { u: env.GH_USER } }) }).then((r) => r.json()),
    fetch(`https://api.github.com/users/${env.GH_USER}/events/public?per_page=60`, { headers: h }).then((r) => (r.ok ? r.json() : [])),
  ]);
  const u = gql.data?.user;
  if (!u) return json({ error: gql.errors?.[0]?.message || 'github unavailable' }, 502, cors);

  const cal = u.contributionsCollection.contributionCalendar;
  const out = {
    user: { login: u.login, name: u.name, bio: u.bio, url: u.url, createdAt: u.createdAt, publicRepos: u.repositories.totalCount },
    repos: u.repositories.nodes.map((r) => ({ name: r.name, description: r.description, url: r.url, stars: r.stargazerCount, fork: r.isFork, pushedAt: r.pushedAt, language: r.primaryLanguage?.name || null })),
    calendar: { total: cal.totalContributions, days: cal.weeks.flatMap((w) => w.contributionDays).map((d) => ({ date: d.date, count: d.contributionCount, level: LEVEL[d.contributionLevel] ?? 0 })) },
    events: events.map((e) => ({ type: e.type, repo: e.repo.name, at: e.created_at, size: e.payload.size || e.payload.commits?.length || 0, refType: e.payload.ref_type || null })),
  };
  const res = json(out, 200, { 'cache-control': 'max-age=3600' });
  ctx.waitUntil(cache.put(key, res.clone()));
  return new Response(res.body, { headers: { 'content-type': 'application/json', ...cors } });
}

export default {
  async fetch(req, env, ctx) {
    const cors = corsFor(req, env);
    if (!cors) return new Response('forbidden', { status: 403 });   // only the portfolio's own pages may call this
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...cors, 'access-control-max-age': '86400' } });
    const { pathname } = new URL(req.url);
    try {
      if (pathname === '/message' && req.method === 'POST') return await message(req, env, cors);
      if (pathname === '/github' && req.method === 'GET') return await github(env, ctx, cors);
      return json({ error: 'not found' }, 404, cors);
    } catch (e) {
      return json({ error: 'worker error' }, 500, cors);
    }
  },
};
