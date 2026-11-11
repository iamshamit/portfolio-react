// shamit.sh: the shell behind the hidden terminal. xterm + a small line editor + commands.
// createShell(host, { onExit }) → Promise<{ focus, blur, dims, boot }>; xterm is only loaded on first open.
import { PORTFOLIO } from '../data/config';
import { localNow } from './LocalTime';
import { API, api, presenceCount, presenceCommand, nowPlaying, shortArtists, track, onActivity } from '../api';

let site = {};   // owner switches pushed with the hero activity: banner, eggs …
onActivity((a) => { site = a?.site || {}; });

const GH_USER = 'iamshamit';
const A = (rgb) => (s) => `\x1b[38;2;${rgb}m${s}\x1b[0m`;
const amber = A('255;172;46'), green = A('160;224;171'), dim = A('120;120;120'), rust = A('225;90;70'), white = A('240;238;232');
const bold = (s) => `\x1b[1m${s}\x1b[22m`;
const THEMES = ['ocean', 'silk', 'teal', 'aurora', 'ember'];
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');
const projects = () => [...PORTFOLIO.featured, ...PORTFOLIO.gallery];
const pad = (s, n) => String(s).padEnd(n).slice(0, n);   // pad before colouring: ANSI codes break padEnd

const ago = (iso) => {
  const s = (Date.now() - new Date(iso)) / 1000;
  for (const [u, n] of [['y', 31536000], ['mo', 2592000], ['d', 86400], ['h', 3600], ['m', 60]]) if (s >= n) return `${Math.floor(s / n)}${u} ago`;
  return 'just now';
};
const uptime = () => {
  const s = Math.floor(performance.now() / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  return h ? `${h}h ${m}m` : m ? `${m}m ${s % 60}s` : `${s}s`;
};
// horizontal bar with eighth-block precision
const bar = (v, max, width) => {
  const e = Math.round((v / (max || 1)) * width * 8);
  return '█'.repeat(Math.floor(e / 8)) + (e % 8 ? '▏▎▍▌▋▊▉'[(e % 8) - 1] : '');
};

// soft-wrap plain text to the terminal width
const wrap = (text, width) => String(text).split('\n').flatMap((para) => {
  const out = []; let cur = '';
  for (const w of para.split(/\s+/)) {
    if (cur && (cur + ' ' + w).length > width) { out.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w;
  }
  return [...out, cur];
});
const askHist = [];   // the last exchanges, so follow-up questions make sense

// ── GitHub data: the portfolio Worker when VITE_API_URL is set (your token, cached an hour),
// otherwise straight from the public APIs (60 requests/hour per visitor). Both give the same shape:
// { user: {login,name,bio,url,createdAt,publicRepos}, repos: [{name,description,stars,fork,pushedAt,language}],
//   calendar: {total, days: [{date,count,level}]}, events: [{type,repo,at,size,refType}] }
const getJSON = async (url) => {
  const r = await fetch(url);
  if (r.ok) return r.json();
  throw new Error(r.status === 403 || r.status === 429 ? 'GitHub rate limit reached, try again in a few minutes' : `GitHub answered ${r.status}`);
};
async function direct() {
  const gh = (path) => getJSON(`https://api.github.com/${path}`);
  const [u, repos, cal, events] = await Promise.all([
    gh(`users/${GH_USER}`), gh(`users/${GH_USER}/repos?per_page=100`),
    getJSON(`https://github-contributions-api.jogruber.de/v4/${GH_USER}?y=last`).catch(() => null),
    gh(`users/${GH_USER}/events/public?per_page=60`).catch(() => []),
  ]);
  return {
    user: { login: u.login, name: u.name, bio: u.bio, url: u.html_url, createdAt: u.created_at, publicRepos: u.public_repos },
    repos: repos.map((r) => ({ name: r.name, description: r.description, stars: r.stargazers_count, fork: r.fork, pushedAt: r.pushed_at, language: r.language })),
    calendar: cal && { total: cal.total.lastYear, days: cal.contributions },
    events: events.map((e) => ({ type: e.type, repo: e.repo.name, at: e.created_at, size: e.payload.size || e.payload.commits?.length || 0, refType: e.payload.ref_type || null })),
  };
}
let ghCache = null;   // one fetch per page visit
const ghData = () => (ghCache ??= (API ? getJSON(API + '/github').catch(direct) : direct()).catch((e) => { ghCache = null; throw e; }));
const LANG = { JavaScript: '241;224;90', TypeScript: '49;120;198', Python: '53;114;165', Go: '0;173;216', Kotlin: '169;123;255', Java: '176;114;25', HTML: '227;76;38', CSS: '86;61;124', Shell: '137;224;81' };
const langDot = (l) => (l ? A(LANG[l] || '150;150;150')('●') + ' ' + pad(l, 11) : dim(pad('—', 13)));

// What the terminal shows off: repos in this order (anything not listed stays hidden: forks, the profile README,
// experiments). Star counts appear only when they impress; followers and totals are never shown.
const SHOWCASE = ['fmhy-search-flow-launcher', 'portfolio-react', 'instadown', 'disbot', 'goapi', 'TimeTuner', 'Freelancer', 'Finance'];
const STAR_MIN = 10;
const pick = (repos) => SHOWCASE.map((n) => repos.find((r) => r.name === n)).filter(Boolean);

const GH = {
  async profile(ctx) {
    const stop = ctx.spin('reaching github.com');
    const { user: u, repos: all, calendar: cal } = await ghData().finally(stop);
    const repos = pick(all);
    const langs = new Set(repos.map((r) => r.language).filter(Boolean)).size;
    return [
      `${green(bold(u.name || u.login))} ${dim('@' + u.login)}`,
      u.bio ? white(u.bio.replace(/^\W+/u, '')) : '',
      '',
      `  ${cal ? amber(pad(cal.total.toLocaleString('en-IN'), 7)) + dim('contributions this year') + '     ' : ''}${amber(pad(u.publicRepos, 4))}${dim('public repos')}     ${amber(pad(langs, 3))}${dim('languages')}`,
      `  ${dim('building in the open since ' + new Date(u.createdAt).getFullYear() + ' · ' + u.url)}`,
      '',
      dim(`try ${amber('gh repos')}, ${amber('gh langs')}, ${amber('gh activity')}`),
    ];
  },
  async repos(ctx) {
    const stop = ctx.spin('fetching highlights');
    const list = pick((await ghData().finally(stop)).repos);
    const w = Math.max(...list.map((r) => r.name.length)) + 2, dw = ctx.cols - w - 38;
    if (ctx.cols < w + 29) {   // narrow (phones): two lines per repo
      return [
        ...list.flatMap((r) => [
          `  ${amber(r.name)}${r.stars >= STAR_MIN ? amber('  ★ ' + r.stars) : ''}`,
          `    ${langDot(r.language).trimEnd()} ${dim('· ' + ago(r.pushedAt))}`,
        ]),
        '', dim('  the rest live at github.com/' + GH_USER),
      ];
    }
    return [
      dim(`  ${pad('repository', w)}${pad('language', 13)}${pad('updated', 10)}${pad('', 6)}${dw > 12 ? 'about' : ''}`),
      ...list.map((r) => {
        const star = r.stars >= STAR_MIN ? amber(pad('★ ' + r.stars, 6)) : pad('', 6);   // only counts that impress
        const about = dw > 12 && r.description ? dim(r.description.length > dw ? r.description.slice(0, dw - 1) + '…' : r.description) : '';
        return `  ${amber(pad(r.name, w))}${langDot(r.language)}${dim(pad(ago(r.pushedAt), 10))}${star}${about}`;
      }),
      '', dim(`  highlights · the rest live at github.com/${GH_USER}`),
    ];
  },
  async langs(ctx) {
    const stop = ctx.spin('reading languages');
    const list = pick((await ghData().finally(stop)).repos);
    const count = {};
    list.forEach((r) => { if (r.language) count[r.language] = (count[r.language] || 0) + 1; });
    const rows = Object.entries(count).sort((a, b) => b[1] - a[1]);
    const max = rows[0][1], bw = Math.max(8, Math.min(30, ctx.cols - 34));
    return [
      ...rows.map(([l, n]) => `  ${A(LANG[l] || '150;150;150')('●')} ${white(pad(l, 12))}${A(LANG[l] || '150;150;150')(bar(n, max, bw))} ${dim(n + (n === 1 ? ' project' : ' projects'))}`),
      '', dim('  primary language of each highlighted repo · also: ' + PORTFOLIO.skills.flatMap((s) => s.items).filter((x) => !count[x]).slice(0, 3).join(', ')),
    ];
  },
  async activity(ctx) {
    const stop = ctx.spin('reading contribution graph');
    const { calendar: cal, events } = await ghData().finally(stop);
    if (!cal) return [rust('✕ the contribution graph is unavailable right now')];
    const days = cal.days.slice(-26 * 7), weeks = [];
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7).reduce((s, d) => s + d.count, 0));
    const max = Math.max(...weeks, 1), ticks = '▁▂▃▄▅▆▇█';
    const spark = weeks.map((v) => (v ? ticks[Math.min(7, Math.floor((v / max) * 8))] : dim('·'))).join('');
    const streak = (() => { let n = 0; for (let i = cal.days.length - 1; i >= 0 && cal.days[i].count > 0; i--) n++; return n; })();
    // one line per repo + kind, newest first: "pushed 6 commits to portfolio-react"
    const groups = [];
    for (const e of events) {
      const repo = e.repo.replace(GH_USER + '/', '');
      const kind = { PushEvent: 'push', CreateEvent: e.refType === 'repository' ? 'new' : null, PullRequestEvent: 'pr', ReleaseEvent: 'release' }[e.type];
      if (!kind) continue;
      const g = groups.find((x) => x.repo === repo && x.kind === kind);
      const n = kind === 'push' ? e.size || 1 : 1;
      if (g) g.n += n; else groups.push({ repo, kind, n, at: e.at });
    }
    const say = { push: (n) => `pushed ${n} commit${n === 1 ? '' : 's'} to`, new: () => 'started', pr: (n) => `opened ${n} pull request${n === 1 ? '' : 's'} in`, release: () => 'shipped a release of' };
    return [
      `  ${green(spark)}  ${dim('last 26 weeks')}`,
      `  ${amber(cal.total.toLocaleString('en-IN'))} ${dim('contributions this year · busiest week:')} ${amber(max)}${streak > 1 ? dim(' · current streak: ') + amber(streak + ' days') : ''}`,
      '',
      ...groups.slice(0, 5).map((g) => `  ${dim(pad(ago(g.at), 9))} ${say[g.kind](g.n)} ${amber(g.repo)}`),
    ];
  },
};
// ── neofetch ──
const LOGO = [
  '   ▄▄███▄▄     ▄▄        ▄▄ ',
  '  ██▀    ▀▀    ███▄    ▄███ ',
  '  ▀██▄▄▄       ██▀█▄  ▄█▀██ ',
  '     ▀▀▀██▄    ██  ▀██▀  ██ ',
  '  ▄▄      ██   ██   ▀▀   ██ ',
  '   ▀▀████▀▀    ▀▀        ▀▀ ',
];
const SGRAD = ['160;224;171', '195;204;120', '230;186;80', '255;172;46', '220;110;45', '165;45;37'];

async function neofetch(arg, ctx) {
  const t = localNow(), grad = document.documentElement.dataset.grad || 'ocean';
  const np = API ? await Promise.race([nowPlaying(), new Promise((r) => setTimeout(() => r(null), 1200))]) : null;
  const here = presenceCount();
  const stack = PORTFOLIO.skills.flatMap((s) => s.items).slice(0, 5).join(', ');
  const info = [
    `${green(bold('shamit'))}${dim('@')}${amber(bold('portfolio'))}`,
    dim('─'.repeat(22)),
    `${amber('Role')}      ${PORTFOLIO.role}`,
    `${amber('OS')}        Portfolio OS · React + WebGL`,
    `${amber('Shell')}     shamit.sh`,
    `${amber('Uptime')}    ${uptime()} ${dim('(since you arrived)')}`,
    `${amber('Local')}     ${t.time} IST · ${t.status}`,
    `${amber('Stack')}     ${stack}`,
    `${amber('Projects')}  ${projects().length}`,
    `${amber('Screen')}    ${innerWidth}×${innerHeight} @ ${devicePixelRatio}x`,
    `${amber('Theme')}     ${grad}`,
    ...(np?.playing ? [`${amber('Music')}     ♪ ${np.title} ${dim('— ' + shortArtists(np.artist))}`] : []),
    ...(here > 1 ? [`${amber('Here')}      ${here} visitors right now`] : []),
    '',
    ['160;224;171', '255;172;46', '165;45;37', '73;197;182', '79;124;255', '176;48;110', '240;238;232', '90;90;90'].map((c) => A(c)('███')).join(''),
  ];
  const W = Math.max(...LOGO.map((l) => l.length));
  const logo = LOGO.map((l, i) => A(SGRAD[i])(l.slice(0, 13)) + white(l.slice(13).padEnd(W - 13)));   // equal widths keep the info column straight
  if (ctx.cols < 70) return info;   // narrow window (phones): the info alone; a 6-row logo above it would push it off screen
  return info.map((line, i) => (logo[i - 1] ?? ' '.repeat(W)) + '  ' + line);
}

// ── owner tools (hidden from help): `owner <key>` unlocks this browser; the rest talk to the Worker's /owner ──
const OWNER_HELP = [
  ['', 'access'],
  ['owner', 'this list, and whether this browser is unlocked'], ['owner <key>', 'unlock this browser (your note-page key)'], ['owner off', 'lock it again'],
  ['', 'visitors'],
  ['owner stats [days]', 'visits, reading depth, terminal, AI, clicks, contact'], ['owner sources [days]', 'where visitors came from'],
  ['owner live', 'who is on the site and what they are reading (ctrl+c stops)'], ['owner asks [days]', 'what people asked the AI'],
  ['owner link <name>', 'make a tracked link for one application'], ['owner links', 'how each tracked link did'],
  ['owner sparks', 'posts and case studies by views and sparks'],
  ['', 'change the site live'],
  ['owner status open|busy|hidden', 'the top-bar badge and what the AI says about hiring'], ['owner note [text|-]', 'show, set or clear the hero note'],
  ['owner teach [q = a]', 'list or add something the AI should know'], ['owner forget <id>', 'remove a taught fact'],
  ['owner spotlight <project|off>', 'which project leads Selected Work'], ['owner music on|off', 'show or hide what you are listening to'],
  ['owner resume on|off', 'the résumé link in Contact (needs public/resume.pdf)'], ['owner sphere <colour|calm|party|off>', "everyone's sphere colour or mood"],
  ['owner banner [text|reset]', 'the line visitors see when the terminal opens'], ['owner egg [cmd = reply|cmd -]', 'your own hidden commands'],
  ['', 'talk'],
  ['owner say <text> [for 30m]', 'a note on screen for everyone here now (- clears)'], ['owner inbox [clear]', 'messages sent from the terminal'],
  ['owner pending', 'guestbook entries waiting'], ['owner approve|delete <id>', 'publish or remove a guestbook entry'],
  ['owner journal-ideas', 'post ideas from what people asked'],
  ['', 'health and safety'],
  ['owner health', 'AI use, database writes, GitHub, Spotify, switches'], ['owner digest on|off|now', 'a daily summary in Discord (09:00 IST)'],
  ['owner block [id]', 'silence one visitor for 24h (ids from asks / live)'], ['owner unblock <id>', 'undo a block'],
  ['owner lock', 'switch off AI, messages and guestbook for everyone'], ['owner unlock', 'switch them back on'],
  ['owner reset', "clear today's ask, message and sign limits"], ['owner key', 'how to change your key'],
];
const OWNER_SUBS = ['stats', 'sources', 'live', 'asks', 'link', 'links', 'sparks', 'status', 'note', 'teach', 'forget', 'spotlight', 'music', 'resume', 'sphere',
  'banner', 'egg', 'say', 'inbox', 'pending', 'approve', 'delete', 'journal-ideas', 'health', 'digest', 'block', 'unblock', 'lock', 'unlock', 'reset', 'key'];
const hasOwnerKey = () => { try { return !!localStorage.getItem('shamit.owner'); } catch { return false; } };
const ownerApi = (body) => api('/owner', { body });
const ok = (s) => `${green('✓')} ${s}`;
const secs = (s) => (s < 60 ? `${s}s` : s < 3600 ? `${Math.floor(s / 60)}m` : `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`);
const sqlAgo = (t) => ago(String(t).replace(' ', 'T') + 'Z');
const shareBar = (n, max, w) => amber(bar(n, max, w)) + ' ' + white(n);

async function ownerCmd(arg, ctx) {
  const raw = (arg || '').trim(), [sub = '', ...rest] = raw.split(/\s+/), more = rest.join(' ');
  const help = () => OWNER_HELP.flatMap(([c, d]) => (!c ? ['', dim('  ' + d)] : ctx.cols < 70 ? [`  ${amber(c)}`, `    ${dim(d)}`] : [`  ${amber(pad(c, 34))}${dim(d)}`]));
  if (!API) return [dim('owner tools need the API')];
  if (sub === 'off') { try { localStorage.removeItem('shamit.owner'); } catch { /* */ } return [dim('locked. owner tools are off on this browser')]; }
  if (sub === 'key') return [
    dim('the key is a Cloudflare secret, so it changes from your computer, not from here. in the project folder run:'),
    '  ' + amber('node worker/rotate-key.mjs'),
    dim('it sets a new key, updates worker/.note-link, and the old key stops working on every browser.'),
  ];
  if (sub && !OWNER_SUBS.includes(sub)) {   // anything else is a key
    try { localStorage.setItem('shamit.owner', sub); } catch { return [rust('✕ this browser blocks storage')]; }
    const stop = ctx.spin('checking the key');
    const good = await ownerApi({ action: 'status' }).then(() => true, () => false).finally(stop);
    if (!good) { try { localStorage.removeItem('shamit.owner'); } catch { /* */ } return [rust('✕ wrong key')]; }
    return [ok('unlocked. unlimited ask on this browser, and everything below:'), ...help().slice(5)];
  }
  if (!hasOwnerKey()) return sub ? [dim('locked. unlock first: ') + amber('owner <key>')] : [dim('locked on this browser.'), ...help()];

  const stop = ctx.spin('asking the worker');
  const set = (k, v, extra = {}) => ownerApi({ action: 'set', k, v, ...extra });
  try {
    switch (sub) {
      case '': await ownerApi({ action: 'status' }); return [`${green('●')} unlocked on this browser`, ...help()];

      // ── visitors ──
      case 'stats': {
        const s = await ownerApi({ action: 'stats', days: +more || 1 });
        const ev = Object.fromEntries(s.events.map((e) => [e.name, e.n]));
        const sum = (re) => s.events.filter((e) => re.test(e.name)).reduce((t, e) => t + e.n, 0);
        const top = (re, strip, n = 5) => s.events.filter((e) => re.test(e.name)).slice(0, n).map((e) => `${e.name.replace(strip, '')} ${dim('×' + e.n)}`).join(dim(' · ')) || dim('none');
        const use = Object.fromEntries(s.usage.map((u) => [u.f, u]));
        const visits = (ev['visit:desktop'] || 0) + (ev['visit:touch'] || 0);
        return [
          bold(s.days === 1 ? 'today' : `last ${s.days} days`),
          `  ${amber(pad('visits', 12))}${white(visits)} ${dim(`(${ev['visit:desktop'] || 0} desktop · ${ev['visit:touch'] || 0} touch)`)}`,
          `  ${amber(pad('read to', 12))}${[25, 50, 75, 100].map((q) => `${q}% ${white(ev['scroll:' + q] || 0)}`).join(dim(' · '))}`,
          `  ${amber(pad('from', 12))}${top(/^src:/, 'src:', 4)}`,
          `  ${amber(pad('terminal', 12))}${white(ev['terminal:open'] || 0)} opens ${dim('·')} ${top(/^term:/, 'term:')}`,
          `  ${amber(pad('ai', 12))}${white(use.ask?.n || 0)} questions from ${white(use.ask?.people || 0)} ${dim('people · today')} ${white(s.asksToday)}${dim('/' + s.askCap)}`,
          `  ${amber(pad('clicks out', 12))}${top(/^out:/, 'out:')}`,
          `  ${amber(pad('contact', 12))}${white(sum(/^contact:/))} ${dim('(copy + mailto)')} ${dim('·')} ${white(use.message?.n || 0)} ${dim('messages')} ${dim('·')} ${white(ev['resume:download'] || 0)} ${dim('résumé')}`,
          `  ${amber(pad('reading', 12))}${top(/^(article|study):/, /^(article|study):/, 4)}`,
          `  ${amber(pad('guestbook', 12))}${s.pending ? amber(s.pending + ' waiting') + dim(' · owner pending') : dim('nothing waiting')}`,
        ];
      }
      case 'sources': {
        const s = await ownerApi({ action: 'stats', days: +more || 7 });
        const src = s.events.filter((e) => e.name.startsWith('src:')).map((e) => [e.name.slice(4), e.n]);
        if (!src.length) return [dim(`  no visits recorded in the last ${s.days} day${s.days === 1 ? '' : 's'}`)];
        const max = src[0][1], total = src.reduce((t, [, n]) => t + n, 0), w = Math.max(8, Math.min(24, ctx.cols - 40));
        return [bold(`where visitors came from · ${s.days === 1 ? 'today' : `last ${s.days} days`}`),
          ...src.slice(0, 12).map(([h, n]) => `  ${white(pad(h, 24))}${shareBar(n, max, w)} ${dim(Math.round((n / total) * 100) + '%')}`)];
      }
      case 'asks': {
        const r = await ownerApi({ action: 'asks', days: +more || 7 });
        if (!r.asks.length) return [dim(`  no questions in the last ${r.days} days`)];
        const groups = [];
        for (const a of r.asks) {
          const k = a.q.toLowerCase().replace(/[?!.\s]+$/, '');
          const g = groups.find((x) => x.k === k);
          if (g) { g.n++; g.who.add(a.who); } else groups.push({ k, q: a.q, n: 1, at: a.at, who: new Set([a.who]) });
        }
        const w = Math.max(20, ctx.cols - 30);
        return [bold(`${r.asks.length} questions · last ${r.days} days`),
          ...groups.slice(0, 25).map((g) => `  ${amber(pad(g.n > 1 ? '×' + g.n : '', 4))}${white(g.q.length > w ? g.q.slice(0, w - 1) + '…' : g.q)} ${dim('· ' + sqlAgo(g.at) + ' · ' + [...g.who].slice(0, 2).join(' '))}`),
          '', dim(`  ids are visitors: ${amber('owner block <id>')} silences one · teach the AI: ${amber('owner teach <q> = <a>')}`)];
      }
      case 'live': {
        stop();
        const seen = new Map(); let lastFeed = Date.now() - 60000, first = true;
        const until = Date.now() + 10 * 60000;   // stops by itself after 10 minutes
        ctx.print(dim('  live · ctrl+c stops'));
        while (!ctx.cancelled && Date.now() < until) {
          const snap = await ownerApi({ action: 'live' });
          const now = new Map();
          snap.visitors.forEach((v, i) => now.set(`${v.who}#${snap.visitors.slice(0, i).filter((x) => x.who === v.who).length}`, v));
          if (first) {
            ctx.print(`  ${white(snap.visitors.length)} ${dim(snap.visitors.length === 1 ? 'person here (you, probably)' : 'people here')}`);
            for (const v of now.values()) ctx.print(`  ${amber(v.who)} ${white(v.s)} ${dim(`· ${secs(v.for)} here · on the site ${secs(v.on)}`)}`);
            first = false;
          } else {
            for (const [k, v] of now) {
              const was = seen.get(k);
              if (!was) ctx.print(`  ${green('+')} ${amber(v.who)} arrived ${dim('·')} ${white(v.s)}`);
              else if (was.s !== v.s) ctx.print(`  ${dim('→')} ${amber(v.who)} ${white(v.s)}`);
            }
            for (const [k, v] of seen) if (!now.has(k)) ctx.print(`  ${rust('−')} ${amber(v.who)} left ${dim(`after ${secs(v.on)}`)}`);
          }
          for (const f of snap.feed.filter((x) => x.at > lastFeed)) ctx.print(`  ${dim('$')} ${amber(f.who)} ran ${white(f.c)}`);
          lastFeed = Math.max(lastFeed, ...snap.feed.map((x) => x.at));
          seen.clear(); now.forEach((v, k) => seen.set(k, v));
          for (let i = 0; i < 20 && !ctx.cancelled; i++) await new Promise((r) => setTimeout(r, 100));   // ~2s, but ctrl+c is instant
        }
        return ctx.cancelled ? [] : [dim('  live view stopped after 10 minutes')];
      }
      case 'link': {
        const name = more.toLowerCase();
        if (!name) return [dim('usage: ') + amber('owner link <name>') + dim('   e.g. owner link acme-backend')];
        await ownerApi({ action: 'link', name });
        const url = `${location.origin}/?r=${name}`;
        navigator.clipboard?.writeText(url).catch(() => {});
        return [ok(`${white(url)} ${dim('(copied)')}`), dim(`  put it in your application. see how it did with ${amber('owner links')}`)];
      }
      case 'links': {
        const r = await ownerApi({ action: 'link' });
        if (!r.links.length) return [dim('  no tracked links yet: ') + amber('owner link <name>')];
        return r.links.flatMap((l) => {
          const ev = r.events.filter((e) => e.name.startsWith(`link:${l.name}:`)).map((e) => ({ ...e, k: e.name.slice(l.name.length + 6) }));
          const n = (re) => ev.filter((e) => re.test(e.k)).reduce((t, e) => t + e.n, 0);
          const deep = Math.max(0, ...ev.filter((e) => /^scroll:/.test(e.k)).map((e) => +e.k.split(':')[1]));
          const read = ev.filter((e) => /^(study|article):/.test(e.k)).map((e) => e.k.split(':')[1]);
          const last = ev.reduce((m, e) => (e.last > m ? e.last : m), '');
          const visits = n(/^visit/);
          return [
            `  ${amber(l.name)} ${dim('· made ' + sqlAgo(l.created_at))}`,
            visits ? `    ${white(visits)} ${dim(visits === 1 ? 'visit' : 'visits')} ${dim('· last')} ${white(last)} ${dim('· read to')} ${white(deep + '%')}${read.length ? dim(' · opened ') + white(read.join(', ')) : ''}${n(/^contact|^resume/) ? dim(' · ') + green('reached out / took your résumé') : ''}${n(/^terminal/) ? dim(' · opened the terminal') : ''}`
              : `    ${dim('not opened yet')}`,
          ];
        });
      }
      case 'sparks': {
        const r = await ownerApi({ action: 'sparks' });
        const rows = {};
        for (const c of r.totals) (rows[c.slug] ??= { views: 0, sparks: 0 })[c.kind] = c.n;
        const week = Object.fromEntries(r.week.map((w) => [w.name.split(':')[1], w]));
        const names = [...new Set([...Object.keys(rows), ...Object.keys(week)])];
        if (!names.length) return [dim('  nothing read yet')];
        names.sort((a, b) => (week[b]?.now || 0) - (week[a]?.now || 0) || (rows[b]?.views || 0) - (rows[a]?.views || 0));
        return [dim(`  ${pad('', 36)}${pad('views', 8)}${pad('sparks', 8)}this week`),
          ...names.map((n) => {
            const w = week[n] || { now: 0, before: 0 }, d = w.now - w.before;
            return `  ${white(pad(n, 36))}${pad(rows[n]?.views ?? '—', 8)}${amber(pad(rows[n]?.sparks ?? '—', 8))}${white(w.now)} ${d ? (d > 0 ? green('↑' + d) : rust('↓' + -d)) : dim('·')}`;
          })];
      }

      // ── change the site live ──
      case 'status': {
        if (!more) { const s = await ownerApi({ action: 'settings' }); return [`status is ${white(s.status)} ${dim('· open | busy | hidden')}`]; }
        await set('status', more);
        return [ok({ open: 'badge says Open to work; the AI says you are looking', busy: 'badge says Heads down; the AI says you are not looking but happy to talk', hidden: 'badge hidden; the AI only gives your email' }[more.toLowerCase()] || 'set')];
      }
      case 'note': {
        const r = await ownerApi({ action: 'note', text: more === '-' ? null : more });
        if (!more) return [r.note ? `${white(r.note.text)} ${dim('· set ' + ago(r.note.at))}` : dim('no note. set one: ') + amber('owner note <text>')];
        return [r.note ? ok(`live: ${white(r.note.text)}`) : ok('cleared')];
      }
      case 'teach': {
        const i = more.indexOf(' = ');
        if (more && i < 0) return [dim('usage: ') + amber('owner teach <question or topic> = <answer>')];
        const list = await ownerApi(i < 0 ? { action: 'teach' } : { action: 'teach', q: more.slice(0, i), a: more.slice(i + 3) });
        const w = Math.max(20, ctx.cols - 12);
        if (!list.length) return [dim('  nothing taught yet. e.g. ') + amber('owner teach notice period = 30 days')];
        return [...(i < 0 ? [] : [ok('the AI knows this from the next question')]),
          ...list.flatMap((f) => [`  ${amber('#' + f.id)} ${white(f.q)}`, ...wrap(f.a, w).map((l) => '      ' + dim(l))]),
          dim(`  remove one with ${amber('owner forget <id>')}`)];
      }
      case 'forget': await ownerApi({ action: 'forget', id: parseInt(more.replace('#', ''), 10) }); return [ok('forgotten')];
      case 'spotlight': {
        const p = more.toLowerCase(), v = p === 'off' ? '' : p;
        if (!more) { const s = await ownerApi({ action: 'settings' }); return [s.spotlight ? `${white(s.spotlight)} leads Selected Work` : dim('the usual order. ') + amber('owner spotlight <project>')]; }
        await set('spotlight', v);
        return [ok(v ? `${white(more)} now leads Selected Work for everyone` : 'back to the usual order')];
      }
      case 'music': await set('music', more); return [ok(more === 'off' ? 'your music is hidden' : 'your music shows again')];
      case 'resume': {
        if (!more) { const [s, st] = await Promise.all([ownerApi({ action: 'settings' }), ownerApi({ action: 'stats', days: 30 })]); return [`résumé link is ${white(s.resume)} ${dim('·')} ${white(st.events.find((e) => e.name === 'resume:download')?.n || 0)} ${dim('downloads in 30 days')}`]; }
        if (more === 'on') {
          const r = await fetch('/resume.pdf', { method: 'HEAD' }).catch(() => null);
          if (!r?.ok || !/pdf/.test(r.headers.get('content-type') || '')) return [rust('✕ no résumé yet: ') + dim('add public/resume.pdf, push, then run this again')];
        }
        await set('resume', more);
        return [ok(more === 'on' ? 'a Résumé link is in Contact now' : 'résumé link hidden')];
      }
      case 'sphere': {
        const v = more.toLowerCase();
        if (['calm', 'party', 'still'].includes(v)) { await set('mood', v === 'still' ? '' : v); return [ok(`the sphere is ${v === 'still' ? 'back to its usual pace' : v} for everyone`)]; }
        if (v === 'off' || v === 'reset') { await set('sphere', ''); await set('mood', ''); return [ok('the sphere is back to normal')]; }
        if (!THEMES.includes(v)) return [dim('usage: ') + amber('owner sphere ') + dim(THEMES.join(' | ') + ' | calm | party | off')];
        await set('sphere', v);
        return [ok(`everyone's sphere is ${v} now`)];
      }
      case 'banner': {
        if (!more) { const s = await ownerApi({ action: 'settings' }); return [s.banner ? white(s.banner) : dim('the default greeting')]; }
        await set('banner', more === 'reset' ? '' : more);
        return [ok(more === 'reset' ? 'default greeting back' : 'new greeting set. visitors see it when the terminal opens')];
      }
      case 'egg': {
        const i = more.indexOf(' = '), del = /^\S+\s+-$/.test(more);
        const cmd = (i >= 0 ? more.slice(0, i) : more.split(/\s+/)[0] || '').toLowerCase();
        if (cmd && (COMMANDS[cmd] || ['clear', 'exit'].includes(cmd))) return [rust(`✕ ${cmd} is already a command`)];
        if (more && i < 0 && !del) return [dim('usage: ') + amber('owner egg <cmd> = <reply>') + dim('  ·  remove: owner egg <cmd> -')];
        const list = await ownerApi({ action: 'egg', ...(cmd && { cmd, reply: del ? '' : more.slice(i + 3) }) });
        if (!list.length) return [dim('  no eggs yet. e.g. ') + amber('owner egg coffee = currently on cup 3')];
        return list.map((e) => `  ${amber(pad(e.cmd, 14))}${dim(e.reply)}`);
      }

      // ── talk ──
      case 'say': {
        if (!more) return [dim('usage: ') + amber('owner say <text> [for 30m]') + dim('  ·  clear: owner say -')];
        if (more === '-') { await set('say', '', { text: '' }); return [ok('cleared')]; }
        const m = more.match(/^(.*?)(?:\s+for\s+(\d+)\s*m?)?$/);
        await set('say', '', { text: m[1], minutes: +m[2] || 10 });
        return [ok(`showing to everyone here for ${+m[2] || 10} minutes`)];
      }
      case 'inbox': {
        const list = await ownerApi({ action: 'inbox', clear: more === 'clear' });
        if (more === 'clear') return [ok('inbox cleared')];
        if (!list.length) return [dim('  no messages')];
        const w = Math.max(20, ctx.cols - 8);
        return list.flatMap((m) => [`  ${amber('#' + m.id)} ${dim(sqlAgo(m.at) + (m.place ? ' · ' + m.place : ''))}`, ...wrap(m.text, w).map((l) => '    ' + white(l)), '']);
      }
      case 'pending': {
        const list = await ownerApi({ action: 'pending' });
        if (!list.length) return [dim('  nothing waiting ✦')];
        return list.flatMap((g) => [`  ${amber('#' + g.id)} ${green(g.name)} ${dim('· ' + sqlAgo(g.created_at))}`, ...wrap(g.text, Math.max(20, ctx.cols - 8)).map((l) => '    ' + white(l)), ''])
          .concat(dim(`  ${amber('owner approve <id>')} or ${amber('owner delete <id>')}`));
      }
      case 'approve':
      case 'delete': {
        const id = parseInt(more.replace('#', ''), 10);
        await ownerApi({ action: sub, id });
        return [ok(`#${id} ${sub === 'approve' ? 'is on the site now' : 'deleted'}`)];
      }
      case 'journal-ideas': {
        const r = await ownerApi({ action: 'ideas' });
        if (!r.ideas.length) return [dim('  ' + (r.note || 'no ideas yet'))];
        const w = Math.max(20, ctx.cols - 8);
        return [bold('post ideas from what people asked'), ...r.ideas.flatMap((l) => wrap(l, w).map((x, i) => (i ? '    ' : `  ${amber('✦')} `) + white(x)))];
      }

      // ── health and safety ──
      case 'health': {
        const h = await ownerApi({ action: 'health' });
        const pct = Math.round((h.neurons / h.neuronCap) * 100);
        const s = h.settings;
        return [
          `  ${amber(pad('ai', 12))}${white(h.asksToday)}${dim('/' + h.askCap)} ${dim('answers today ·')} ${white('~' + h.neurons)} ${dim(`of ${h.neuronCap.toLocaleString('en-IN')} free neurons (${pct}%)`)}`,
          `  ${amber(pad('database', 12))}${white('~' + h.writesApprox)} ${dim('writes today (free: 100,000)')}`,
          `  ${amber(pad('github', 12))}${h.github ? `${white(h.github.left)}${dim('/' + h.github.limit + ' requests left this hour')}` : rust('token not working')}`,
          `  ${amber(pad('spotify', 12))}${h.spotify ? green('connected') : dim('not connected')}${s.music === 'off' ? dim(' · hidden') : ''}`,
          `  ${amber(pad('discord', 12))}${h.discord ? green('connected') : rust('missing')}`,
          `  ${amber(pad('switches', 12))}${['status', 'lock', 'digest', 'resume', 'spotlight', 'sphere', 'mood'].filter((k) => s[k]).map((k) => `${k} ${white(s[k])}`).join(dim(' · '))}`,
        ];
      }
      case 'digest': {
        if (more === 'now') { await ownerApi({ action: 'digest' }); return [ok("today's digest so far is in your Discord")]; }
        if (!more) { const s = await ownerApi({ action: 'settings' }); return [`daily digest is ${white(s.digest)} ${dim('· on | off | now')}`]; }
        await set('digest', more);
        return [ok(more === 'on' ? 'a summary lands in Discord every day at 09:00 IST' : 'daily digest off')];
      }
      case 'block':
      case 'unblock': {
        const list = await ownerApi({ action: 'block', who: more, off: sub === 'unblock' });
        const head = more ? [ok(sub === 'block' ? `${more} is silenced for 24 hours (AI, messages, guestbook)` : `${more} can talk again`)] : [];
        return [...head, ...(list.length ? list.map((b) => `  ${amber(b.who)} ${dim('until ' + b.until + ' UTC')}`) : [dim('  nobody is blocked')])];
      }
      case 'lock':
      case 'unlock': await set('lock', sub === 'lock' ? 'on' : 'off'); return [ok(sub === 'lock' ? 'AI, messages and guestbook are off for everyone. ' + dim('owner unlock') : 'AI, messages and guestbook are back on')];
      case 'reset': { const r = await ownerApi({ action: 'reset' }); return [ok(`cleared ${r.cleared} limit${r.cleared === 1 ? '' : 's'} for today`)]; }
    }
  } catch (e) {
    return [e.status === 404 && e.message === 'not found' ? rust('✕ the key on this browser is no longer valid. ') + dim('owner off, then owner <key>') : rust('✕ ' + e.message)];
  } finally { stop(); }
  return [];
}

// ── commands ──
const HELP = [
  ['ask <question>', 'ask anything about me (AI)'], ['whoami', 'who is this'], ['about', 'the longer version'], ['neofetch', 'system info, the fun way'],
  ['ls', 'list projects'], ['case <project>', 'read a case study'], ['open <project>', 'open a project'], ['skills', 'the toolkit'],
  ['gh [repos|langs|activity]', 'live GitHub'], ['message <text>', 'send me a note, straight to my phone'], ['sign', 'sign the guestbook'], ['guestbook', 'read what people left'],
  ['who', 'who else is here'], ['np', "what I'm listening to"], ['contact', 'copy my email'], ['socials', 'where else to find me'],
  ['theme <name>', THEMES.join(' | ')], ['time', 'my local time'], ['clear', 'clear the screen  (ctrl+l)'], ['exit', 'close the terminal  (esc)'],
];
const COMMANDS = {
  help: (arg, ctx) => ['available commands:', ...HELP.flatMap(([c, d]) => (ctx.cols < 60 ? [`  ${amber(c)}`, `    ${dim(d)}`] : [`  ${amber(pad(c, 26))}${dim(d)}`]))],   // phones: description under the command
  whoami: () => [`${green(PORTFOLIO.fullName)} · ${PORTFOLIO.role}`, dim(PORTFOLIO.location)],
  about: () => PORTFOLIO.about.body,
  neofetch,
  ls: () => [
    ...projects().map((p) => `  ${amber(pad(p.name, 16))}${pad(p.study ? '✦' : '', 3)}${dim(p.tagline || p.tag || '')}`),
    '', dim(`  ✦ has a case study: ${amber('case <project>')}`),
  ],
  case: (arg, ctx) => {
    const studies = PORTFOLIO.featured.filter((p) => p.study);
    const p = studies.find((q) => slug(q.name) === slug(arg || ''));
    if (!p) return [
      arg ? `no case study for "${arg}". these have one:` : 'case studies:',
      ...studies.map((q) => `  ${amber(pad(q.name, 10))}${dim(((w) => (q.study.excerpt.length > w ? q.study.excerpt.slice(0, w - 1).trimEnd() + '…' : q.study.excerpt))(Math.max(20, ctx.cols - 14)))}`),
      '', dim(`  read one with ${amber('case <project>')}`),
    ];
    // the router listens for popstate: this opens the case study sheet on the page, then the terminal steps aside
    setTimeout(() => { history.pushState({}, '', '/work/' + p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')); dispatchEvent(new PopStateEvent('popstate')); ctx.exit(); }, 450);
    return [`opening the ${green(p.name)} case study…`];
  },
  open: (arg) => {
    const p = projects().find((q) => slug(q.name) === slug(arg || ''));
    if (!p) return [arg ? `no project called "${arg}". try ${amber('ls')}` : `usage: ${amber('open <project>')}`];
    window.open(p.url, '_blank', 'noopener');
    return [`opening ${green(p.name)} ↗`];
  },
  skills: () => PORTFOLIO.skills.map((s) => `  ${amber(pad(s.group, 12))}${s.items.join(', ')}`),
  gh: (arg, ctx) => {
    const sub = (arg || 'profile').toLowerCase();
    return GH[sub] ? GH[sub](ctx) : [`usage: ${amber('gh')} ${dim('[repos | langs | activity]')}`];
  },
  message: async (arg, ctx) => {
    const text = (arg || '').trim();
    if (!text) return [`usage: ${amber('message')} ${dim('<your note>')}  ${dim('e.g.')} message loved the sphere, let's talk`, dim('  add a way to reach you if you want a reply')];
    if (!API) return [dim('messages are offline here, use ') + amber('contact') + dim(' to copy my email')];
    const stop = ctx.spin('sending');
    const r = await fetch(API + '/message', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text }) })
      .then(async (x) => ({ ok: x.ok, ...(await x.json().catch(() => ({}))) }), () => ({ ok: false, error: 'network error' }))
      .finally(stop);
    return r.ok
      ? [`${green('✓')} delivered. ${dim("I'll read it soon.")}`]
      : [`${rust('✕')} ${r.error || 'could not send'}. ${dim('try')} ${amber('contact')} ${dim('for my email')}`];
  },
  ask: async (arg, ctx) => {
    const q = (arg || '').trim();
    if (!q) return [`usage: ${amber('ask')} ${dim('<question>')}  ${dim('or just type a question ending in ?')}`, dim('  try: ask what has he built?   ask is he good with backend?   ask can I hire him?')];
    if (!API) return [dim('the AI is offline here. try ') + amber('about') + dim(' or ') + amber('message')];
    const stop = ctx.spin('thinking');
    let r;
    try { r = await api('/ask', { body: { q, history: askHist.slice(-4) } }); }
    catch (e) { stop(); return [`${e.status === 429 ? amber('◷') : rust('✕')} ${e.message}`]; }
    stop();
    askHist.push({ role: 'user', content: q }, { role: 'assistant', content: r.answer });
    await ctx.type(wrap(r.answer, Math.max(20, ctx.cols - 6)).map((l) => '  ' + l));
    return r.left <= 3 ? [dim(`  ${r.left} question${r.left === 1 ? '' : 's'} left today`)] : [];
  },
  sign: async (arg, ctx) => {
    if (!API) return [dim('the guestbook is offline here')];
    const name = (await ctx.ask(`${amber('your name')} ${dim('›')} `))?.trim().slice(0, 40);
    if (!name) return [dim('cancelled')];
    const text = (arg || '').trim() || (await ctx.ask(`${amber('your note')} ${dim('›')} `))?.trim();
    if (!text) return [dim('cancelled')];
    const stop = ctx.spin('signing');
    try { await api('/guestbook', { body: { name, text: text.slice(0, 280) } }); }
    catch (e) { return [`${rust('✕')} ${e.message}`]; }
    finally { stop(); }
    return [`${green('✓')} signed. ${dim('it shows up in')} ${amber('guestbook')} ${dim('once Shamit has had a look ✦')}`];
  },
  guestbook: async (arg, ctx) => {
    if (!API) return [dim('the guestbook is offline here')];
    const stop = ctx.spin('opening the guestbook');
    const list = await api('/guestbook').finally(stop);
    if (!list.length) return [dim('  empty so far. be the first: ') + amber('sign')];
    const w = Math.max(20, ctx.cols - 8);
    return list.slice(0, 12).flatMap((g) => [
      `  ${green(g.name)} ${dim('· ' + ago(g.created_at.replace(' ', 'T') + 'Z'))}`,
      ...wrap(g.text, w).map((l) => '    ' + white(l)), '',
    ]).concat(dim(`  ${list.length} ${list.length === 1 ? 'entry' : 'entries'} · add yours with `) + amber('sign'));
  },
  who: () => {
    const n = presenceCount();
    if (!n) return [dim('presence is offline right now')];
    return [n === 1 ? `just you here right now ${dim('(hi ✦)')}` : `${amber(n)} people are on the site right now ${dim('(you included)')}`];
  },
  np: async (arg, ctx) => {
    if (!API) return [dim('offline')];
    const stop = ctx.spin('checking spotify');
    const m = await nowPlaying(true).finally(stop);
    if (!m.configured) return [dim("Shamit hasn't connected Spotify yet")];
    if (m.hidden) return [dim("Shamit's music is private right now")];
    if (m.playing) return [`${green('♪')} ${white(m.title)} ${dim('—')} ${m.artist}`, dim('  ' + m.url)];
    return m.title ? [`${dim('last played')} ${white(m.title)} ${dim('—')} ${m.artist} ${dim('· ' + ago(m.at))}`] : [dim('nothing playing')];
  },
  contact: () => {
    const e = PORTFOLIO.contact.email;
    navigator.clipboard?.writeText(e).catch(() => {});
    return [`${green(e)} ${dim('(copied)')}`];
  },
  socials: () => PORTFOLIO.contact.socials.map((s) => `  ${amber(pad(s.label, 12))}${s.href}`),
  theme: (arg) => {
    if (!THEMES.includes(arg)) return [`usage: ${amber('theme')} ${THEMES.join(' | ')}`];
    document.documentElement.dataset.grad = arg;   // fluid.js + gradient CSS read this live
    try { sessionStorage.setItem('shamit.theme', arg); } catch { /* */ }   // this visitor's pick beats owner sphere
    return [`palette → ${green(arg)}`];
  },
  owner: (arg, ctx) => ownerCmd(arg, ctx),
  time: () => { const t = localNow(); return [`${t.time} in India · ${t.status}`]; },
  date: () => [new Date().toString()],
  echo: (arg) => [arg || ''],
  sudo: (arg) => {
    if (slug(arg || '') === 'hireshamit') {
      setTimeout(() => { window.location.href = `mailto:${PORTFOLIO.contact.email}?subject=Let's%20work%20together`; }, 700);
      return [green('[sudo] permission granted.'), 'drafting the email for you…'];
    }
    return [rust('nice try.')];
  },
};
const COMPLETE = { owner: [...OWNER_SUBS, 'off'], gh: Object.keys(GH), theme: THEMES, open: () => projects().map((p) => slug(p.name)), case: () => PORTFOLIO.featured.filter((p) => p.study).map((p) => slug(p.name)) };
// fish-style ghost: the rest of the newest matching history entry, else of the tab completion
const suggest = (line, hist) => {
  if (!line) return '';
  for (let i = hist.length - 1; i >= 0; i--) if (hist[i].startsWith(line) && hist[i] !== line) return hist[i].slice(line.length);
  const [c, arg] = line.split(/ (.*)/);
  const pool = arg === undefined ? Object.keys(COMMANDS) : [].concat(typeof COMPLETE[c] === 'function' ? COMPLETE[c]() : COMPLETE[c] || []);
  const m = pool.find((x) => x.startsWith(arg ?? c) && x !== (arg ?? c));
  return m ? m.slice((arg ?? c).length) : '';
};

const BOOT = [
  ['shamit.sh — cold boot', 'ok'], ['mounting ~/projects', `${projects().length} found`], ['loading palette', 'ocean'],
  ['linking github.com/' + GH_USER, 'ok'], ['warming up the sphere', 'ok'],
];

export async function createShell(host, { onExit }) {
  const [{ Terminal: X }, { FitAddon }, { CanvasAddon }] = await Promise.all([import('xterm'), import('xterm-addon-fit'), import('xterm-addon-canvas'), import('xterm/css/xterm.css')]);
  const t = new X({
    fontFamily: '"Fira Code", ui-monospace, monospace', fontSize: 13, lineHeight: devicePixelRatio < 1.5 ? 1.35 : 1.15, cursorBlink: true, cursorStyle: 'bar',   // DOM renderer (high-DPR): tighter rows so block glyphs touch
    allowTransparency: true, scrollback: 2000,
    theme: { background: '#00000000', foreground: '#e6e3dc', cursor: '#ffac2e', cursorAccent: '#000', selectionBackground: 'rgba(255,172,46,.3)' },
  });
  const fit = new FitAddon();
  t.loadAddon(fit);
  t.open(host);
  // renderer: canvas on standard screens (block glyphs sit on the exact cell grid); the DOM renderer on
  // high-density screens, where xterm's canvas/WebGL renderers draw everything at devicePixelRatio× size (phones, Retina)
  if (devicePixelRatio < 1.5) try { t.loadAddon(new CanvasAddon()); } catch { /* DOM renderer */ }
  fit.fit();
  const listeners = new Set();
  new ResizeObserver(() => { fit.fit(); listeners.forEach((f) => f(t.cols, t.rows)); }).observe(host);

  const PS = `${green('shamit')}${dim('@')}${amber('portfolio')} ${dim('~ $')} `;
  const hist = JSON.parse(localStorage.getItem('shamit.term.hist') || '[]');
  let line = '', h = hist.length, busy = false, cancelled = false, asking = null;
  let fresh = false;   // after clear: the prompt goes on the (now empty) top row, not below it
  const prompt = () => { t.write((fresh ? '' : '\r\n') + PS); fresh = false; line = ''; h = hist.length; };
  const PS_W = 21;   // visible width of PS
  let ghost = '';
  // redraw the input line; the ghost suggestion trails it in dim and the cursor steps back over it
  const redraw = (s) => {
    line = s;
    ghost = busy ? '' : suggest(s, hist);
    if (PS_W + s.length + ghost.length >= t.cols) ghost = '';   // one row only: a wrapped ghost can't be erased cleanly
    t.write('\x1b[2K\r' + PS + s + (ghost ? dim(ghost) + `\x1b[${ghost.length}D` : ''));
  };
  const ctx = {
    exit: () => onExit(),
    get cols() { return t.cols; },
    spin(label) {   // braille spinner on its own line; stop() erases it and returns to the prompt line
      const F = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';
      let i = 0;
      t.write('\r\n');
      const id = setInterval(() => t.write(`\r${amber(F[i++ % F.length])} ${dim(label + '…')}`), 80);
      let done = false;
      return () => { if (done) return; done = true; clearInterval(id); t.write('\r\x1b[2K\x1b[1A'); };
    },
    print: (l) => t.write('\r\n' + l),   // a line now, for commands that stream (owner live)
    get cancelled() { return cancelled; },
    // one line of input mid-command (sign's name/note); resolves null on ctrl+c
    ask(label) {
      t.write('\r\n' + label);
      line = '';
      return new Promise((res) => { asking = res; });
    },
    // typewriter: a few characters per frame, stops early on ctrl+c
    async type(lines) {
      for (const l of lines) {
        if (cancelled) return;
        t.write('\r\n');
        for (let i = 0; i < l.length && !cancelled; i += 3) { t.write(l.slice(i, i + 3)); await new Promise((r) => setTimeout(r, 12)); }
      }
    },
  };

  const run = async (raw) => {
    const [cmd, ...rest] = raw.trim().split(/\s+/);
    if (!cmd) return;
    if (cmd.toLowerCase() !== 'owner') hist.push(raw.trim());   // never keep the key in history
    localStorage.setItem('shamit.term.hist', JSON.stringify(hist.slice(-100)));
    if (cmd === 'clear') { t.clear(); t.write('\x1b[2K\r'); fresh = true; return; }   // clear() keeps the cursor row, which still says "clear\"
    if (cmd === 'exit') { onExit(); return; }
    let fn = COMMANDS[cmd.toLowerCase()], arg = rest.join(' ');
    if (!fn && site.eggs?.[cmd.toLowerCase()]) { const reply = site.eggs[cmd.toLowerCase()]; fn = () => [white(reply)]; }   // owner eggs
    if (!fn && raw.trim().endsWith('?')) { fn = COMMANDS.ask; arg = raw.trim(); }   // a plain question goes to the AI
    if (cmd.toLowerCase() !== 'owner') presenceCommand(fn === COMMANDS.ask ? 'ask' : fn ? cmd.toLowerCase().slice(0, 20) : '?');   // name only, for owner live
    track('term:' + (fn === COMMANDS.ask ? 'ask' : fn ? cmd.toLowerCase() : 'unknown'));
    let out;
    try { out = fn ? await fn(arg, ctx) : [`command not found: ${cmd}. try ${amber('help')}, or ask a question ending in ?`]; }
    catch (e) { out = [rust('✕ ' + (e.message || 'something went wrong'))]; }
    if (!cancelled) out.forEach((l) => t.write('\r\n' + l));
  };

  t.onData(async (d) => {
    if (asking) {   // a command is waiting for one line of input
      const done = (v) => { const r = asking; asking = null; r(v); };
      if (d === '\r') done(line);
      else if (d === '\x03') { t.write(dim('^C')); done(null); }
      else if (d === '\x7f') { if (line) { line = line.slice(0, -1); t.write('\b \b'); } }
      else if (!d.startsWith('\x1b')) { const s = d.replace(/[\x00-\x1f\x7f]/g, ''); line += s; t.write(s); }   // eslint-disable-line no-control-regex
      return;
    }
    if (d === '\x03') {   // ctrl+c
      if (busy) cancelled = true;
      t.write(dim('^C'));
      if (!busy) prompt();
      return;
    }
    if (busy) return;
    if (d === '\x0c') { t.clear(); redraw(line); return; }   // ctrl+l
    if (d === '\r') submit();
    else if ((d === '\x1b[C' || d === '\x1b[F' || d === '\x1bOF') && ghost) redraw(line + ghost);   // → / end takes the ghost
    else if (d === '\x7f') { if (line) redraw(line.slice(0, -1)); }
    else if (d === '\x1b[A') { if (h > 0) redraw(hist[--h]); }
    else if (d === '\x1b[B') { if (h < hist.length) { h++; redraw(hist[h] || ''); } }
    else if (d === '\t') {
      const [c, arg] = line.split(/ (.*)/);
      const pool = arg === undefined ? Object.keys(COMMANDS) : [].concat(typeof COMPLETE[c] === 'function' ? COMPLETE[c]() : COMPLETE[c] || []);
      const m = pool.find((x) => x.startsWith(arg ?? c));
      if (m) redraw(arg === undefined ? m + ' ' : `${c} ${m}`);
    } else if (d === '`' || d === '~') { /* the toggle key, handled by the window */ }
    else if (!d.startsWith('\x1b')) { const s = d.replace(/[\x00-\x1f\x7f]/g, ''); if (s) redraw(line + s); }   // eslint-disable-line no-control-regex -- strip pasted control chars
  });
  const submit = async () => {
    if (ghost) t.write('\x1b[K');   // drop the ghost before the output starts
    busy = true; cancelled = false; ghost = '';
    await run(line);
    busy = false;
    prompt();
  };

  const banner = () => {
    t.writeln(`${amber('✦')} ${green(bold('shamit.sh'))} ${dim('— you found the back door.')}`);
    if (site.banner) t.write(white(site.banner));   // owner banner
    else t.write(dim(`type ${amber('help')} to look around, or just ask: `) + white('what has he built?'));
    prompt();
  };

  return {
    focus: () => t.focus(),
    blur: () => t.blur(),
    dims: () => [t.cols, t.rows],
    // run a command as if typed (the suggestion chips); ignored while one runs or a prompt is waiting
    exec(cmd) {
      if (busy || asking) return;
      redraw(cmd); submit(); t.focus();
    },
    onResize: (f) => listeners.add(f),
    // first ever open: ~0.8s of boot log, then the banner; afterwards the banner alone
    boot(first) {
      if (!first) return banner();
      busy = true;
      let i = 0, clock = 0;
      const next = () => {
        if (i === BOOT.length) { t.write('\r\n'); busy = false; banner(); return; }
        const [what, res] = BOOT[i++];
        clock += 0.02 + Math.random() * 0.05;
        const dots = '.'.repeat(Math.max(2, 34 - what.length));
        t.writeln(`${dim('[' + clock.toFixed(3).padStart(7) + ']')} ${white(what)} ${dim(dots)} ${res === 'ok' ? green(res) : amber(res)}`);
        setTimeout(next, 90 + Math.random() * 90);
      };
      next();
    },
  };
}
