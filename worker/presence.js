// Live presence: one Durable Object named "site" holds every visitor's WebSocket.
// Hibernation keeps it asleep (no duration billed) between joins/leaves; "ping" → "pong" is answered
// by the runtime without waking it. Each join/leave broadcasts the visitor count.
import { DurableObject } from 'cloudflare:workers';

export class Presence extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair('ping', 'pong'));
  }

  async fetch() {
    const [client, server] = Object.values(new WebSocketPair());
    this.ctx.acceptWebSocket(server);
    this.broadcast();
    return new Response(null, { status: 101, webSocket: client });
  }

  webSocketClose(ws) { try { ws.close(); } catch { /* already closed */ } this.broadcast(ws); }
  webSocketError(ws) { this.broadcast(ws); }
  webSocketMessage() { /* visitors only ever send pings, which the auto-response handles */ }

  broadcast(leaving) {
    const open = this.ctx.getWebSockets().filter((w) => w !== leaving && w.readyState === 1);
    const msg = JSON.stringify({ here: open.length });
    for (const w of open) { try { w.send(msg); } catch { /* gone */ } }
  }
}
