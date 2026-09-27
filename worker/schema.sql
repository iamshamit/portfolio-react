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
