-- apply: npx wrangler d1 execute portfolio --remote --file schema.sql
-- daily caps: key = "<feature>:<visitor hash>" or "<feature>:*" for the global cap
CREATE TABLE IF NOT EXISTS usage (day TEXT NOT NULL, key TEXT NOT NULL, n INTEGER NOT NULL, PRIMARY KEY (day, key));

-- guestbook: entries stay hidden until approved from the Discord links
CREATE TABLE IF NOT EXISTS guestbook (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  approved INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS guestbook_approved ON guestbook (approved, id);

-- per-article counters: kind = 'views' | 'sparks'
CREATE TABLE IF NOT EXISTS counters (slug TEXT NOT NULL, kind TEXT NOT NULL, n INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (slug, kind));

-- analytics: one row per event name per day
CREATE TABLE IF NOT EXISTS events (day TEXT NOT NULL, name TEXT NOT NULL, n INTEGER NOT NULL, PRIMARY KEY (day, name));

-- status note (Instagram-notes style): one row, expires 24h after it is set
CREATE TABLE IF NOT EXISTS note (id INTEGER PRIMARY KEY CHECK (id = 1), text TEXT NOT NULL, set_at TEXT NOT NULL DEFAULT (datetime('now')));

-- owner tools (the terminal's `owner …`) ──────────────────────────────────
-- live switches: status, music, spotlight, resume, sphere, mood, banner, lock, digest, say
CREATE TABLE IF NOT EXISTS settings (k TEXT PRIMARY KEY, v TEXT NOT NULL);
-- facts taught to Ask Shamit from the terminal
CREATE TABLE IF NOT EXISTS facts (id INTEGER PRIMARY KEY AUTOINCREMENT, q TEXT NOT NULL, a TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')));
-- hidden terminal commands added from the terminal
CREATE TABLE IF NOT EXISTS eggs (cmd TEXT PRIMARY KEY, reply TEXT NOT NULL);
-- what visitors asked the AI (kept 30 days; who = first 8 chars of the hashed visitor id)
CREATE TABLE IF NOT EXISTS asks (id INTEGER PRIMARY KEY AUTOINCREMENT, who TEXT NOT NULL, q TEXT NOT NULL, at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE INDEX IF NOT EXISTS asks_at ON asks (at);
-- terminal messages, also kept here (not only in Discord)
CREATE TABLE IF NOT EXISTS inbox (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT NOT NULL, place TEXT, at TEXT NOT NULL DEFAULT (datetime('now')));
-- silenced visitors (who = 8-char id), until a UTC datetime
CREATE TABLE IF NOT EXISTS blocks (who TEXT PRIMARY KEY, until TEXT NOT NULL);
-- tracked links (?r=<name>); their visits are counted in events as link:<name>:<event>
CREATE TABLE IF NOT EXISTS links (name TEXT PRIMARY KEY, created_at TEXT NOT NULL DEFAULT (datetime('now')));
