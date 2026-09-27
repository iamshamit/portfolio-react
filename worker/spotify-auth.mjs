// One-time Spotify setup for /now-playing. Run from worker/:  node spotify-auth.mjs
// 1. developer.spotify.com/dashboard → Create app → Redirect URI: http://127.0.0.1:8888/callback → tick "Web API"
// 2. Run this, paste the Client ID and Client Secret, approve in the browser.
// It stores SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET and SPOTIFY_REFRESH_TOKEN as Worker secrets; nothing is written to disk.
import http from 'node:http';
import { spawn, exec } from 'node:child_process';
import { createInterface } from 'node:readline/promises';

const REDIRECT = 'http://127.0.0.1:8888/callback';
const rl = createInterface({ input: process.stdin, output: process.stdout });
const id = (await rl.question('Spotify Client ID: ')).trim();
const secret = (await rl.question('Spotify Client Secret: ')).trim();
rl.close();

const auth = 'https://accounts.spotify.com/authorize?' + new URLSearchParams({
  client_id: id, response_type: 'code', redirect_uri: REDIRECT, scope: 'user-read-currently-playing user-read-recently-played',
});

const code = await new Promise((resolve, reject) => {
  const server = http.createServer((req, res) => {
    const u = new URL(req.url, REDIRECT);
    if (u.pathname !== '/callback') return res.end();
    res.end(u.searchParams.get('code') ? 'Spotify connected. You can close this tab.' : 'Spotify said: ' + u.searchParams.get('error'));
    server.close();
    u.searchParams.get('code') ? resolve(u.searchParams.get('code')) : reject(new Error(u.searchParams.get('error')));
  }).listen(8888, '127.0.0.1', () => {
    console.log('\nApprove in the browser (opening it now). If nothing opens, visit:\n' + auth + '\n');
    exec((process.platform === 'win32' ? 'start "" ' : process.platform === 'darwin' ? 'open ' : 'xdg-open ') + JSON.stringify(auth));
  });
});

const tok = await fetch('https://accounts.spotify.com/api/token', {
  method: 'POST',
  headers: { authorization: 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64'), 'content-type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: REDIRECT }),
}).then((r) => r.json());
if (!tok.refresh_token) { console.error('No refresh token:', tok.error_description || tok.error); process.exit(1); }

const put = (name, value) => new Promise((resolve, reject) => {
  const p = spawn('npx', ['wrangler', 'secret', 'put', name], { stdio: ['pipe', 'inherit', 'inherit'], shell: true });
  p.stdin.end(value);
  p.on('close', (c) => (c === 0 ? resolve() : reject(new Error(`wrangler exited ${c} for ${name}`))));
});
await put('SPOTIFY_CLIENT_ID', id);
await put('SPOTIFY_CLIENT_SECRET', secret);
await put('SPOTIFY_REFRESH_TOKEN', tok.refresh_token);
console.log('\n✓ Spotify is connected. Try "np" in the site terminal (updates within ~30s).');
