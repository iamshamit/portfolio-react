// Client side of the portfolio Worker (worker/). Everything here degrades quietly when VITE_API_URL is unset
// or the Worker is down: the site never waits on it.
export const API = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export async function api(path, { method = 'GET', body } = {}) {
  if (!API) throw new Error('offline');
  const r = await fetch(API + path, body ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) } : { method });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(data.message || data.error || `error ${r.status}`), { status: r.status });
  return data;
}

// ── live presence: one socket per tab, count shared with anyone who subscribes ──
let here = 0, ws = null, tries = 0, pinger;
const subs = new Set();
const emit = () => subs.forEach((f) => f(here));
function connect() {
  if (!API || ws) return;
  ws = new WebSocket(API.replace(/^http/, 'ws') + '/presence');
  ws.onmessage = (e) => { try { here = JSON.parse(e.data).here ?? here; tries = 0; emit(); } catch { /* pong */ } };
  ws.onclose = () => {
    ws = null; clearInterval(pinger); here = 0; emit();
    if (document.visibilityState === 'visible' && tries++ < 4) setTimeout(connect, 2000 * tries);
  };
  pinger = setInterval(() => ws?.readyState === 1 && ws.send('ping'), 45000);   // answered at the edge without waking the Durable Object
}
export function onPresence(fn) {
  subs.add(fn); fn(here); connect();
  return () => subs.delete(fn);
}
export const presenceCount = () => here;
addEventListener('pagehide', () => ws?.close());

// ── analytics: counts batched in memory, one beacon when the tab is hidden ──
let batch = {};
export function track(name) {
  const k = String(name).toLowerCase().replace(/[^a-z0-9:._/-]+/g, '-').slice(0, 60);
  batch[k] = (batch[k] || 0) + 1;
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'hidden' || !API || !Object.keys(batch).length) return;
  navigator.sendBeacon(API + '/events', new Blob([JSON.stringify({ e: batch })], { type: 'text/plain' }));   // text/plain: no CORS preflight
  batch = {};
});

// ── Spotify: fetched once and shared (the Worker caches it for 30s anyway) ──
let np = null;
// "A, B, C, D" → "A, B +2": keeps one-line spots one line
export const shortArtists = (s = '') => { const a = s.split(', '); return a.length > 2 ? `${a.slice(0, 2).join(', ')} +${a.length - 2}` : s; };
export const nowPlaying = (fresh) => ((fresh || !np) ? (np = api('/now-playing').catch(() => ({ configured: false }))) : np);
