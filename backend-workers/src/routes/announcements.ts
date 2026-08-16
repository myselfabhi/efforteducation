import { Hono } from 'hono';
import type { AppContext } from '../types';
import { requireAuth, roleGuard, batchMember } from '../middleware/auth';
import { CreateAnnouncementSchema, validateBody, getValid } from '../lib/validation';
import { notifyMany } from '../services/notifications';

// Mounted at /api (paths are nested under /batches).
const announcements = new Hono<AppContext>();

// GET /api/batches/:id/announcements
announcements.get('/batches/:id/announcements', requireAuth, batchMember('id'), async (c) => {
  try {
    const r = await c.get('db').query(
      `SELECT a.*, u.full_name AS poster_name, u.username AS poster_username
         FROM batch_announcements a JOIN users u ON u.id = a.posted_by
        WHERE a.batch_id = $1
        ORDER BY a.is_pinned DESC, a.created_at DESC`,
      [parseInt(c.req.param('id'), 10)],
    );
    return c.json(r.rows);
  } catch {
    return c.json({ error: 'Failed to load announcements' }, 500);
  }
});

// POST /api/batches/:id/announcements
announcements.post(
  '/batches/:id/announcements',
  requireAuth,
  roleGuard('super_admin', 'teacher'),
  batchMember('id'),
  validateBody(CreateAnnouncementSchema),
  async (c) => {
    try {
      const id = parseInt(c.req.param('id'), 10);
      const { title, body, is_pinned } = getValid<{ title: string; body: string; is_pinned?: boolean }>(c);
      const db = c.get('db');
      const r = await db.query(
        `INSERT INTO batch_announcements (batch_id, posted_by, title, body, is_pinned)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [id, c.get('user')!.id, title, body, !!is_pinned],
      );

      const students = await db.query(
        `SELECT student_id FROM batch_students WHERE batch_id = $1 AND status = 'active'`,
        [id],
      );
      await notifyMany(c.env, db, students.rows.map((s) => s.student_id), {
        type: 'announcement',
        title: `Announcement: ${title}`,
        body: body.slice(0, 200),
        linkUrl: `/dashboard/batches/${id}`,
      }).catch(() => {});

      return c.json(r.rows[0], 201);
    } catch {
      return c.json({ error: 'Failed to post announcement' }, 500);
    }
  },
);

export default announcements;
