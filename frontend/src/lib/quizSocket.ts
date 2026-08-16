/**
 * Quiz WebSocket client — talks to the per-quiz QuizRoom Durable Object on
 * Cloudflare Workers, replacing socket.io-client for the live-quiz pages.
 *
 * It exposes the small slice of the socket.io API the quiz pages use
 * (`emit` / `on` / `off` / `connected` + the `connect`/`disconnect`/
 * `connect_error`/`error` pseudo-events) over a raw WebSocket that speaks the
 * `{ type, ...payload }` envelope. Event names are unchanged, so the pages only
 * swap `getSocket()` → `getQuizSocket(quizId)`.
 *
 * Class presence + notifications still use the socket.io client in `./socket`
 * (Railway) until Phase 3.
 */

// Loose payload typing mirrors socket.io's listener signature; each quiz page
// narrows the shape per event at the call site (as it did with socket.io).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Handler = (payload: any) => void;

const WS_BASE = process.env.NEXT_PUBLIC_QUIZ_WS_URL || 'ws://localhost:8787';
const MAX_RETRIES = 10;

class QuizSocket {
  connected = false;
  private ws: WebSocket | null = null;
  private handlers = new Map<string, Set<Handler>>();
  private outbox: string[] = [];
  private lastJoin: string | null = null;
  private closedByUser = false;
  private retries = 0;

  constructor(private readonly quizId: number) {
    this.open();
  }

  private url(): string {
    const token = typeof window !== 'undefined' ? localStorage.getItem('quiz_token') || '' : '';
    return `${WS_BASE}/ws/quiz/${this.quizId}?token=${encodeURIComponent(token)}`;
  }

  private open(): void {
    if (typeof window === 'undefined') return;
    const ws = new WebSocket(this.url());
    this.ws = ws;

    ws.onopen = () => {
      this.connected = true;
      this.retries = 0;
      // Re-establish the room on (re)connect, then flush anything queued
      // before the socket was open.
      if (this.lastJoin) this.rawSend(this.lastJoin);
      for (const frame of this.outbox) this.rawSend(frame);
      this.outbox = [];
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

    ws.onerror = () => {
      this.dispatch('connect_error', {});
    };
  }

  private rawSend(frame: string): void {
    try {
      this.ws?.send(frame);
    } catch {
      this.outbox.push(frame);
    }
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
        console.error(`quizSocket handler for "${event}" threw:`, err);
      }
    }
  }

  // ── socket.io-compatible surface ────────────────────────────────────────────
  emit(type: string, data: Record<string, unknown> = {}): void {
    const frame = JSON.stringify({ type, ...data });
    if (type === 'quiz:join') this.lastJoin = frame;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) this.rawSend(frame);
    else this.outbox.push(frame);
  }

  on(event: string, cb: Handler): void {
    let set = this.handlers.get(event);
    if (!set) {
      set = new Set();
      this.handlers.set(event, set);
    }
    set.add(cb);
  }

  once(event: string, cb: Handler): void {
    const wrapper: Handler = (payload) => {
      this.off(event, wrapper);
      cb(payload);
    };
    this.on(event, wrapper);
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

const sockets = new Map<number, QuizSocket>();

/** Get (or lazily create) the shared WebSocket for a quiz. */
export function getQuizSocket(quizId: number): QuizSocket {
  let s = sockets.get(quizId);
  if (!s) {
    s = new QuizSocket(quizId);
    sockets.set(quizId, s);
  }
  return s;
}

/** Fully close and forget a quiz socket (e.g. leaving the quiz entirely). */
export function closeQuizSocket(quizId: number): void {
  const s = sockets.get(quizId);
  if (s) {
    s.disconnect();
    sockets.delete(quizId);
  }
}

export type { QuizSocket };
