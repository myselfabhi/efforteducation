/**
 * User notification WebSocket — connects to the per-user UserHub Durable Object
 * (/ws/user) and receives `notification:new` pushes, replacing the socket.io
 * per-user room used by NotificationsBootstrap.
 *
 * The DO sends `{ type: 'notification:new', notification: <row> }` (the row is
 * nested to avoid colliding with its own `type` column), so handlers read
 * `msg.notification`.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Handler = (payload: any) => void;

const WS_BASE = process.env.NEXT_PUBLIC_QUIZ_WS_URL || 'ws://localhost:8787';
const MAX_RETRIES = 10;

class UserSocket {
  connected = false;
  private ws: WebSocket | null = null;
  private handlers = new Map<string, Set<Handler>>();
  private closedByUser = false;
  private retries = 0;

  constructor() {
    this.open();
  }

  private url(): string {
    const token = typeof window !== 'undefined' ? localStorage.getItem('quiz_token') || '' : '';
    return `${WS_BASE}/ws/user?token=${encodeURIComponent(token)}`;
  }

  private open(): void {
    if (typeof window === 'undefined') return;
    const ws = new WebSocket(this.url());
    this.ws = ws;

    ws.onopen = () => {
      this.connected = true;
      this.retries = 0;
      this.dispatch('connect', {});
    };
    ws.onmessage = (ev) => {
      let msg: Record<string, unknown>;
      try {
        msg = JSON.parse(typeof ev.data === 'string' ? ev.data : '');
      } catch {
        return;
      }
      if (msg && typeof msg.type === 'string') this.dispatch(msg.type, msg);
    };
    ws.onclose = () => {
      this.connected = false;
      this.dispatch('disconnect', {});
      if (!this.closedByUser) this.scheduleReconnect();
    };
    ws.onerror = () => this.dispatch('connect_error', {});
  }

  private scheduleReconnect(): void {
    if (this.retries >= MAX_RETRIES) return;
    const delay = Math.min(1000 * 2 ** this.retries, 5000);
    this.retries += 1;
    setTimeout(() => {
      if (!this.closedByUser) this.open();
    }, delay);
  }

  private dispatch(event: string, payload: Record<string, unknown>): void {
    const set = this.handlers.get(event);
    if (!set) return;
    for (const cb of set) {
      try {
        cb(payload);
      } catch (err) {
        console.error(`userSocket handler for "${event}" threw:`, err);
      }
    }
  }

  on(event: string, cb: Handler): void {
    let set = this.handlers.get(event);
    if (!set) {
      set = new Set();
      this.handlers.set(event, set);
    }
    set.add(cb);
  }

  off(event: string, cb?: Handler): void {
    if (!cb) {
      this.handlers.delete(event);
      return;
    }
    this.handlers.get(event)?.delete(cb);
  }

  disconnect(): void {
    this.closedByUser = true;
    try {
      this.ws?.close();
    } catch {
      /* already closed */
    }
    this.ws = null;
    this.connected = false;
  }
}

let sock: UserSocket | null = null;

export function getUserSocket(): UserSocket {
  if (!sock) sock = new UserSocket();
  return sock;
}

export function closeUserSocket(): void {
  sock?.disconnect();
  sock = null;
}
