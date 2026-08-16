import type { Pool } from 'pg';
import type { Env } from '../types';

export type NotificationType =
  | 'class_starting'
  | 'class_ended'
  | 'quiz_launched'
  | 'material_added'
  | 'enrolled'
  | 'announcement'
  | 'enrolment_requested'
  | 'enrolment_approved'
  | 'enrolment_declined';

export interface CreateNotificationInput {
  userId: number;
  type: NotificationType;
  title: string;
  body?: string | null;
  linkUrl?: string | null;
}

/**
 * Insert a notification row, then push it live to the user's UserHub Durable
 * Object (replacing the old `io.to('user:id').emit('notification:new')`). The
 * push is best-effort — if no socket is connected, the row is still persisted
 * and surfaces on the next GET /api/notifications. Never throws to the caller.
 */
export async function notifyUser(env: Env, db: Pool, input: CreateNotificationInput) {
  const r = await db.query(
    `INSERT INTO notifications (user_id, type, title, body, link_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, user_id, type, title, body, link_url, read_at, created_at`,
    [input.userId, input.type, input.title, input.body ?? null, input.linkUrl ?? null],
  );
  const row = r.rows[0];

  try {
    const stub = env.USER_HUB.get(env.USER_HUB.idFromName(`user:${input.userId}`));
    await stub.fetch('https://user-hub/notify', { method: 'POST', body: JSON.stringify(row) });
  } catch {
    // UserHub unreachable / no live socket — the row is still in the DB.
  }

  return row;
}

export async function notifyMany(
  env: Env,
  db: Pool,
  userIds: number[],
  input: Omit<CreateNotificationInput, 'userId'>,
) {
  await Promise.all(userIds.map((userId) => notifyUser(env, db, { ...input, userId })));
}
