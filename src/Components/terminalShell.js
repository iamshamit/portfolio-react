// shamit.sh: the shell behind the hidden terminal. xterm + a small line editor + commands.
// createShell(host, { onExit }) → Promise<{ focus, blur, dims, boot }>; xterm is only loaded on first open.
import { PORTFOLIO } from '../data/config';
import { localNow } from './LocalTime';

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

// ── GitHub data: the portfolio Worker when VITE_API_URL is set (your token, cached an hour),
// otherwise straight from the public APIs (60 requests/hour per visitor). Both give the same shape:
// { user: {login,name,bio,url,createdAt,publicRepos}, repos: [{name,description,stars,fork,pushedAt,language}],
//   calendar: {total, days: [{date,count,level}]}, events: [{type,repo,at,size,refType}] }
export const API = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
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

function neofetch(ctx) {
  const t = localNow(), grad = document.documentElement.dataset.grad || 'ocean';
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
    '',
    ['160;224;171', '255;172;46', '165;45;37', '73;197;182', '79;124;255', '176;48;110', '240;238;232', '90;90;90'].map((c) => A(c)('███')).join(''),
  ];
  const W = Math.max(...LOGO.map((l) => l.length));
  const logo = LOGO.map((l, i) => A(SGRAD[i])(l.slice(0, 13)) + white(l.slice(13).padEnd(W - 13)));   // equal widths keep the info column straight
  if (ctx.cols < 70) return [...logo, '', ...info];   // narrow window: stack instead of side by side
  return info.map((line, i) => (logo[i - 1] ?? ' '.repeat(W)) + '  ' + line);
}

// ── commands ──
const HELP = [
  ['whoami', 'who is this'], ['about', 'the longer version'], ['neofetch', 'system info, the fun way'],
  ['ls', 'list projects'], ['open <project>', 'open a project'], ['skills', 'the toolkit'],
  ['gh [repos|langs|activity]', 'live GitHub'], ['message <text>', 'send me a note, straight to my phone'], ['contact', 'copy my email'], ['socials', 'where else to find me'],
  ['theme <name>', THEMES.join(' | ')], ['time', 'my local time'], ['clear', 'clear the screen  (ctrl+l)'], ['exit', 'close the terminal  (esc)'],
];
const COMMANDS = {
  help: () => ['available commands:', ...HELP.map(([c, d]) => `  ${amber(pad(c, 26))}${dim(d)}`)],
  whoami: () => [`${green(PORTFOLIO.fullName)} · ${PORTFOLIO.role}`, dim(PORTFOLIO.location)],
  about: () => PORTFOLIO.about.body,
  neofetch,
  ls: () => projects().map((p) => `  ${amber(pad(p.name, 16))}${dim(p.tagline || p.tag || '')}`),
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
  contact: () => {
    const e = PORTFOLIO.contact.email;
    navigator.clipboard?.writeText(e).catch(() => {});
    return [`${green(e)} ${dim('(copied)')}`];
  },
  socials: () => PORTFOLIO.contact.socials.map((s) => `  ${amber(pad(s.label, 12))}${s.href}`),
  theme: (arg) => {
    if (!THEMES.includes(arg)) return [`usage: ${amber('theme')} ${THEMES.join(' | ')}`];
    document.documentElement.dataset.grad = arg;   // fluid.js + gradient CSS read this live
    return [`palette → ${green(arg)}`];
  },
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
const COMPLETE = { gh: Object.keys(GH), theme: THEMES, open: () => projects().map((p) => slug(p.name)) };

const BOOT = [
  ['shamit.sh — cold boot', 'ok'], ['mounting ~/projects', `${projects().length} found`], ['loading palette', 'ocean'],
  ['linking github.com/' + GH_USER, 'ok'], ['warming up the sphere', 'ok'],
];

export async function createShell(host, { onExit }) {
  const [{ Terminal: X }, { FitAddon }, { WebglAddon }] = await Promise.all([import('xterm'), import('xterm-addon-fit'), import('xterm-addon-webgl'), import('xterm/css/xterm.css')]);
  const t = new X({
    fontFamily: '"Fira Code", ui-monospace, monospace', fontSize: 13, lineHeight: 1.35, cursorBlink: true, cursorStyle: 'bar',
    allowTransparency: true, scrollback: 2000,
    theme: { background: '#00000000', foreground: '#e6e3dc', cursor: '#ffac2e', cursorAccent: '#000', selectionBackground: 'rgba(255,172,46,.3)' },
  });
  const fit = new FitAddon();
  t.loadAddon(fit);
  t.open(host);
  // WebGL renderer: block glyphs (logo, bars) drawn on the exact cell grid; DOM renderer stays as the fallback
  try { const gl = new WebglAddon(); gl.onContextLoss(() => gl.dispose()); t.loadAddon(gl); } catch { /* no WebGL: DOM renderer */ }
  fit.fit();
  const listeners = new Set();
  new ResizeObserver(() => { fit.fit(); listeners.forEach((f) => f(t.cols, t.rows)); }).observe(host);

  const PS = `${green('shamit')}${dim('@')}${amber('portfolio')} ${dim('~ $')} `;
  const hist = JSON.parse(localStorage.getItem('shamit.term.hist') || '[]');
  let line = '', h = hist.length, busy = false, cancelled = false;
  const prompt = () => { t.write('\r\n' + PS); line = ''; h = hist.length; };
  const redraw = (s) => { t.write('\x1b[2K\r' + PS + s); line = s; };
  const ctx = {
    get cols() { return t.cols; },
    spin(label) {   // braille spinner on its own line; stop() erases it and returns to the prompt line
      const F = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';
      let i = 0;
      t.write('\r\n');
      const id = setInterval(() => t.write(`\r${amber(F[i++ % F.length])} ${dim(label + '…')}`), 80);
      return () => { clearInterval(id); t.write('\r\x1b[2K\x1b[1A'); };
    },
  };

  const run = async (raw) => {
    const [cmd, ...rest] = raw.trim().split(/\s+/);
    if (!cmd) return;
    hist.push(raw.trim());
    localStorage.setItem('shamit.term.hist', JSON.stringify(hist.slice(-100)));
    if (cmd === 'clear') { t.clear(); return; }
    if (cmd === 'exit') { onExit(); return; }
    const fn = COMMANDS[cmd.toLowerCase()];
    let out;
    try { out = fn ? await fn(rest.join(' '), ctx) : [`command not found: ${cmd}. try ${amber('help')}`]; }
    catch (e) { out = [rust('✕ ' + (e.message || 'something went wrong'))]; }
    if (!cancelled) out.forEach((l) => t.write('\r\n' + l));
  };

  t.onData(async (d) => {
    if (d === '\x03') {   // ctrl+c
      if (busy) cancelled = true;
      t.write(dim('^C'));
      if (!busy) prompt();
      return;
    }
    if (busy) return;
    if (d === '\x0c') { t.clear(); redraw(line); return; }   // ctrl+l
    if (d === '\r') {
      busy = true; cancelled = false;
      await run(line);
      busy = false;
      prompt();
    } else if (d === '\x7f') { if (line) { line = line.slice(0, -1); t.write('\b \b'); } }
    else if (d === '\x1b[A') { if (h > 0) redraw(hist[--h]); }
    else if (d === '\x1b[B') { if (h < hist.length) { h++; redraw(hist[h] || ''); } }
    else if (d === '\t') {
      const [c, arg] = line.split(/ (.*)/);
      const pool = arg === undefined ? Object.keys(COMMANDS) : [].concat(typeof COMPLETE[c] === 'function' ? COMPLETE[c]() : COMPLETE[c] || []);
      const m = pool.find((x) => x.startsWith(arg ?? c));
      if (m) redraw(arg === undefined ? m + ' ' : `${c} ${m}`);
    } else if (d === '`' || d === '~') { /* the toggle key, handled by the window */ }
    else { const s = d.replace(/[\x00-\x1f\x7f]/g, ''); line += s; t.write(s); }   // eslint-disable-line no-control-regex -- strip pasted control chars
  });

  const banner = () => {
    t.writeln(`${amber('✦')} ${green(bold('shamit.sh'))} ${dim('— you found the back door.')}`);
    t.write(dim(`type ${amber('help')} to look around, or try ${amber('neofetch')} and ${amber('gh activity')}.`));
    prompt();
  };

  return {
    focus: () => t.focus(),
    blur: () => t.blur(),
    dims: () => [t.cols, t.rows],
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
