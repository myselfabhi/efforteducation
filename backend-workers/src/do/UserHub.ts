import { DurableObject } from 'cloudflare:workers';
import type { Env } from '../types';

/**
 * UserHub — one Durable Object per user (idFromName `user:<id>`). Holds that
 * user's live notification WebSocket(s) and pushes `notification:new` frames to
 * them. Replaces the Socket.IO per-user room (`io.to('user:id').emit(...)`).
 *
 * Two entry points on fetch():
 *   - WebSocket upgrade  → the browser's notification channel (/ws/user).
 *   - POST /notify       → internal push from notifyUser() with the row to fan out.
 *
 * No storage: notifications are persisted in Postgres by notifyUser(); this DO
 * only mirrors them live to whoever is connected right now.
 */
export class UserHub extends DurableObject<Env> {
  async fetch(request: Request): Promise<Response> {
    if (request.headers.get('Upgrade') === 'websocket') {
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);
      this.ctx.acceptWebSocket(server);
      return new Response(null, { status: 101, webSocket: client });
    }

    // Internal push: broadcast the notification row to all connected sockets.
    const url = new URL(request.url);
    if (request.method === 'POST' && url.pathname.endsWith('/notify')) {
      const notification = await request.json().catch(() => null);
      if (notification) {
        const frame = JSON.stringify({ type: 'notification:new', notification });
        for (const ws of this.ctx.getWebSockets()) {
          try {
            ws.send(frame);
          } catch {
            /* socket gone */
          }
        }
      }
      return new Response(null, { status: 204 });
    }

    return new Response('not found', { status: 404 });
  }

  // The notification channel is server→client; ignore anything the client sends
  // except an optional keepalive ping.
  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): Promise<void> {
    if (typeof message === 'string' && message === 'ping') {
      try {
        ws.send('pong');
      } catch {
        /* socket gone */
      }
    }
  }

  async webSocketClose(ws: WebSocket, code: number): Promise<void> {
    try {
      ws.close(code);
    } catch {
      /* already closed */
    }
  }
}
