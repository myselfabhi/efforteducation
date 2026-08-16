import { Hono } from 'hono';
import type { AppContext } from '../types';
import { requireAuth } from '../middleware/auth';

const notifications = new Hono<AppContext>();

notifications.get('/', requireAuth, async (c) => {
  try {
    const db = c.get('db');
    const limit = Math.min(parseInt(c.req.query('limit') || '50', 10), 200);
    const r = await db.query(
      `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`,
      [c.get('user')!.id, limit],
    );
    const unread = await db.query(
      `SELECT COUNT(*)::INT AS count FROM notifications WHERE user_id = $1 AND read_at IS NULL`,
      [c.get('user')!.id],
    );
    return c.json({ items: r.rows, unread: unread.rows[0].count });
  } catch {
    return c.json({ error: 'Failed to load notifications' }, 500);
  }
});

notifications.patch('/:id/read', requireAuth, async (c) => {
  try {
    await c.get('db').query(
      `UPDATE notifications SET read_at = NOW() WHERE id = $1 AND user_id = $2 AND read_at IS NULL`,
      [parseInt(c.req.param('id'), 10), c.get('user')!.id],
    );
    return c.body(null, 204);
  } catch {
    return c.json({ error: 'Failed to mark read' }, 500);
  }
});

notifications.post('/read-all', requireAuth, async (c) => {
  try {
    await c.get('db').query(
      `UPDATE notifications SET read_at = NOW() WHERE user_id = $1 AND read_at IS NULL`,
      [c.get('user')!.id],
    );
    return c.body(null, 204);
  } catch {
    return c.json({ error: 'Failed to mark all read' }, 500);
  }
});

export default notifications;
