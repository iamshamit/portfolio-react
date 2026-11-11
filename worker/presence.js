// Live presence: one Durable Object named "site" holds every visitor's WebSocket.
// Hibernation keeps it asleep (no duration billed) between joins/leaves; "ping" → "pong" is answered
// by the runtime without waking it. Each join/leave broadcasts the visitor count.
// Pages also report which section they are on ({s}) and terminal commands by name ({c}), for `owner live`.
import { DurableObject } from 'cloudflare:workers';

const clip = (v, n) => String(v || '').replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ').slice(0, n);   // eslint-disable-line no-control-regex

export class Presence extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair('ping', 'pong'));
    this.feed = [];   // recent { who, c, at }: in memory only, gone when the object sleeps (fine for a live view)
  }

  async fetch(req) {
    // only the Worker calls https://do/…; visitor requests arrive with the public /presence path
    const path = new URL(req.url).pathname;
    if (req.method === 'POST' && path === '/broadcast') {
      const msg = await req.text();
      for (const w of this.ctx.getWebSockets()) { try { w.send(msg); } catch { /* gone */ } }
      return new Response(null, { status: 204 });
    }
    if (req.method === 'POST' && path === '/snapshot') {
      const now = Date.now();
      const visitors = this.ctx.getWebSockets().filter((w) => w.readyState === 1).map((w) => {
        const a = w.deserializeAttachment() || {};
        return { id: a.id || '', who: a.who || '?', s: a.s || 'arriving', for: Math.round((now - (a.at || now)) / 1000), on: Math.round((now - (a.t0 || now)) / 1000) };
      });
      return Response.json({ visitors, feed: this.feed.slice(-30) });
    }
    if (req.headers.get('upgrade') !== 'websocket') return new Response('expected websocket', { status: 426 });
    const [client, server] = Object.values(new WebSocketPair());
    this.ctx.acceptWebSocket(server);
    const now = Date.now();
    server.serializeAttachment({ id: crypto.randomUUID().slice(0, 8), who: clip(req.headers.get('x-who'), 8), s: 'arriving', at: now, t0: now });   // id: one per tab, so tabs of the same visitor stay apart
    this.broadcast();
    return new Response(null, { status: 101, webSocket: client });
  }

  webSocketClose(ws) { try { ws.close(); } catch { /* already closed */ } this.broadcast(ws); }
  webSocketError(ws) { this.broadcast(ws); }
  webSocketMessage(ws, msg) {
    let m; try { m = JSON.parse(msg); } catch { return; }
    const a = ws.deserializeAttachment() || {};
    if (m.s) ws.serializeAttachment({ ...a, s: clip(m.s, 60), at: Date.now() });
    if (m.c) { this.feed.push({ who: a.who || '?', c: clip(m.c, 20), at: Date.now() }); if (this.feed.length > 60) this.feed.splice(0, 30); }
  }

  broadcast(leaving) {
    const open = this.ctx.getWebSockets().filter((w) => w !== leaving && w.readyState === 1);
    const msg = JSON.stringify({ here: open.length });
    for (const w of open) { try { w.send(msg); } catch { /* gone */ } }
  }
}
