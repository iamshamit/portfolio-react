// Changes the owner key (NOTE_KEY): sets a fresh random key on the Worker and rewrites the k= in worker/.note-link.
// The old key stops working at once, on every browser. Run from the project folder: node worker/rotate-key.mjs
// The key is never printed; it ends up in the Cloudflare secret and in the gitignored .note-link only.
import { randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const key = randomBytes(24).toString('base64url');

const put = spawnSync('npx', ['wrangler', 'secret', 'put', 'NOTE_KEY'], { cwd: here, input: key, stdio: ['pipe', 'inherit', 'inherit'], shell: process.platform === 'win32' });
if (put.status !== 0) { console.error('✕ wrangler could not set the secret; nothing changed'); process.exit(1); }

const linkFile = join(here, '.note-link');
if (existsSync(linkFile)) {
  const link = readFileSync(linkFile, 'utf8');
  writeFileSync(linkFile, /([?&]k=)[^&\s]+/.test(link) ? link.replace(/([?&]k=)[^&\s]+/, `$1${key}`) : link);
  console.log('✓ new key set; worker/.note-link has the new note-page link (the key is its k= value)');
} else {
  writeFileSync(linkFile, `https://shamit-portfolio-api.shamitmishra22.workers.dev/note?k=${key}\n`);
  console.log('✓ new key set and saved in worker/.note-link (the key is its k= value)');
}
console.log('  unlock the terminal again on your browsers: owner <new key>');
