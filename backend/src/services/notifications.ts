import pool from '../db';
import { getIO } from '../socket';

export type NotificationType =
  | 'class_starting'
  | 'class_ended'
  | 'quiz_launched'
  | 'material_added'
  | 'enrolled'
  | 'announcement';

export interface CreateNotificationInput {
  userId: number;
  type: NotificationType;
  title: string;
  body?: string | null;
  linkUrl?: string | null;
}

/**
 * Create a notification row and push it to the user via Socket.IO if they're online.
 * Safe to call from anywhere — doesn't throw on socket errors.
 */
export async function notifyUser(input: CreateNotificationInput) {
  const r = await pool.query(
    `INSERT INTO notifications (user_id, type, title, body, link_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, user_id, type, title, body, link_url, read_at, created_at`,
    [input.userId, input.type, input.title, input.body ?? null, input.linkUrl ?? null]
  );
  const row = r.rows[0];

  try {
    const io = getIO();
    io.to(`user:${input.userId}`).emit('notification:new', row);
  } catch {
    // Socket layer not initialized (e.g. running in a script); ignore.
  }

  return row;
}

export async function notifyMany(userIds: number[], input: Omit<CreateNotificationInput, 'userId'>) {
  await Promise.all(userIds.map((userId) => notifyUser({ ...input, userId })));
}
