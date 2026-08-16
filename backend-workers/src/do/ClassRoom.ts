import { DurableObject } from 'cloudflare:workers';
import type { Pool } from 'pg';
import type { Env } from '../types';
import { createPool } from '../db';

/**
 * ClassRoom — one Durable Object per live class (idFromName `class:<id>`).
 * Ports backend/src/socket/classController.ts: presence + attendance for a live
 * class. RealtimeKit owns the in-meeting UX; this only carries lifecycle signals
 * (join/heartbeat/leave/end) and writes live_class_attendance.
 *
 * NOTE: currently no frontend consumer emits these events (the app joins classes
 * via the REST /join + RealtimeKit). Ported for parity so Railway can be retired
 * without losing this backend capability.
 */
interface ClassUser {
  id: number;
  username: string;
  role: string;
  full_name?: string | null;
}

export class ClassRoom extends DurableObject<Env> {
  async fetch(request: Request): Promise<Response> {
    if (request.headers.get('Upgrade') !== 'websocket') {
      return new Response('expected websocket', { status: 426 });
    }
    const userHeader = request.headers.get('x-class-user');
    if (!userHeader) return new Response('unauthorized', { status: 401 });
    const user = JSON.parse(userHeader) as ClassUser;
    const classId = Number(request.headers.get('x-class-id'));

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({ user, classId });
    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): Promise<void> {
    const { user, classId } = ws.deserializeAttachment() as { user: ClassUser; classId: number };
    let msg: { type: string; classId?: number };
    try {
      msg = JSON.parse(typeof message === 'string' ? message : new TextDecoder().decode(message));
    } catch {
      return;
    }
    try {
      switch (msg.type) {
        case 'class:join':
          return await this.onJoin(ws, user, classId);
        case 'class:heartbeat':
          return await this.onHeartbeat(user, classId);
        case 'class:leave':
          return await this.onLeave(user, classId);
        case 'class:end':
          return await this.onEnd(user, classId);
      }
    } catch (err) {
      console.error(`ClassRoom ${classId} ${msg.type} error:`, err);
    }
  }

  async webSocketClose(ws: WebSocket, code: number): Promise<void> {
    // Best-effort: mark attendance left on disconnect.
    try {
      const { user, classId } = ws.deserializeAttachment() as { user: ClassUser; classId: number };
      await this.markLeft(classId, user.id);
    } catch {
      /* no attachment */
    }
    try {
      ws.close(code);
    } catch {
      /* already closed */
    }
  }

  private broadcast(obj: Record<string, unknown>): void {
    const data = JSON.stringify(obj);
    for (const ws of this.ctx.getWebSockets()) {
      try {
        ws.send(data);
      } catch {
        /* socket gone */
      }
    }
  }

  private sendTo(ws: WebSocket, obj: Record<string, unknown>): void {
    try {
      ws.send(JSON.stringify(obj));
    } catch {
      /* socket gone */
    }
  }

  private async withDb<T>(fn: (pool: Pool) => Promise<T>): Promise<T> {
    const pool = createPool(this.env);
    try {
      return await fn(pool);
    } finally {
      await pool.end();
    }
  }

  private async ensureMember(userId: number, role: string, classId: number): Promise<boolean> {
    if (role === 'super_admin' || role === 'admin') return true;
    return this.withDb(async (pool) => {
      const r = await pool.query('SELECT batch_id, teacher_id FROM live_classes WHERE id = $1', [classId]);
      if (r.rows.length === 0) return false;
      const { batch_id, teacher_id } = r.rows[0];
      if (role === 'teacher') {
        if (teacher_id === userId) return true;
        const t = await pool.query('SELECT 1 FROM batch_teachers WHERE batch_id = $1 AND teacher_id = $2', [batch_id, userId]);
        return t.rows.length > 0;
      }
      if (role === 'student' || role === 'user') {
        const s = await pool.query(
          `SELECT 1 FROM batch_students WHERE batch_id = $1 AND student_id = $2 AND status = 'active'`,
          [batch_id, userId],
        );
        return s.rows.length > 0;
      }
      return false;
    });
  }

  private async onJoin(ws: WebSocket, user: ClassUser, classId: number): Promise<void> {
    if (!Number.isInteger(classId)) return;
    const ok = await this.ensureMember(user.id, user.role, classId);
    if (!ok) {
      this.sendTo(ws, { type: 'class:error', message: 'Not a member of this class' });
      return;
    }
    await this.withDb((pool) =>
      pool.query(
        `INSERT INTO live_class_attendance (live_class_id, user_id, joined_at, last_heartbeat_at)
         VALUES ($1, $2, NOW(), NOW())
         ON CONFLICT (live_class_id, user_id) DO UPDATE
           SET last_heartbeat_at = NOW(), left_at = NULL`,
        [classId, user.id],
      ),
    );
    this.broadcast({
      type: 'class:participant-joined',
      userId: user.id,
      username: user.username,
      fullName: user.full_name ?? null,
    });
  }

  private async onHeartbeat(user: ClassUser, classId: number): Promise<void> {
    if (!Number.isInteger(classId)) return;
    await this.withDb((pool) =>
      pool.query(
        `UPDATE live_class_attendance
            SET last_heartbeat_at = NOW(),
                duration_seconds  = EXTRACT(EPOCH FROM (NOW() - joined_at))::INT
          WHERE live_class_id = $1 AND user_id = $2`,
        [classId, user.id],
      ),
    );
  }

  private async onLeave(user: ClassUser, classId: number): Promise<void> {
    await this.markLeft(classId, user.id);
    this.broadcast({ type: 'class:participant-left', userId: user.id });
  }

  private async onEnd(user: ClassUser, classId: number): Promise<void> {
    if (!Number.isInteger(classId)) return;
    if (user.role !== 'super_admin' && user.role !== 'teacher' && user.role !== 'admin') return;
    const ended = await this.withDb(async (pool) => {
      const r = await pool.query(
        `UPDATE live_classes
            SET status = 'ENDED', ended_at = NOW()
          WHERE id = $1 AND status = 'LIVE'
            AND ($2 = 'super_admin' OR $2 = 'admin' OR teacher_id = $3)
          RETURNING id`,
        [classId, user.role, user.id],
      );
      return r.rows.length > 0;
    });
    if (ended) this.broadcast({ type: 'class:ended', classId });
  }

  private async markLeft(classId: number, userId: number): Promise<void> {
    if (!Number.isInteger(classId)) return;
    await this.withDb((pool) =>
      pool.query(
        `UPDATE live_class_attendance
            SET left_at = NOW(),
                duration_seconds = EXTRACT(EPOCH FROM (NOW() - joined_at))::INT
          WHERE live_class_id = $1 AND user_id = $2 AND left_at IS NULL`,
        [classId, userId],
      ),
    ).catch((err) => console.error('markLeft error', err));
  }
}
