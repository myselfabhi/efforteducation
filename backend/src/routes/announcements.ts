import { Router, Response } from 'express';
import pool from '../db';
import { authMiddleware, roleGuard, batchMember, AuthRequest } from '../middleware/auth';
import { CreateAnnouncementSchema, validateBody } from '../lib/validation';
import { notifyMany } from '../services/notifications';

const router = Router();

// GET /api/batches/:id/announcements
router.get('/batches/:id/announcements', authMiddleware, batchMember('id'), async (req: AuthRequest, res: Response) => {
  try {
    const r = await pool.query(
      `SELECT a.*, u.full_name AS poster_name, u.username AS poster_username
         FROM batch_announcements a JOIN users u ON u.id = a.posted_by
        WHERE a.batch_id = $1
        ORDER BY a.is_pinned DESC, a.created_at DESC`,
      [parseInt(req.params.id, 10)]
    );
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load announcements' });
  }
});

// POST /api/batches/:id/announcements
router.post(
  '/batches/:id/announcements',
  authMiddleware,
  roleGuard('super_admin', 'teacher'),
  batchMember('id'),
  validateBody(CreateAnnouncementSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { title, body, is_pinned } = req.body;
      const r = await pool.query(
        `INSERT INTO batch_announcements (batch_id, posted_by, title, body, is_pinned)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [id, req.user!.id, title, body, !!is_pinned]
      );

      const students = await pool.query(
        `SELECT student_id FROM batch_students WHERE batch_id = $1 AND status = 'active'`,
        [id]
      );
      notifyMany(students.rows.map((s) => s.student_id), {
        type: 'announcement',
        title: `Announcement: ${title}`,
        body: body.slice(0, 200),
        linkUrl: `/dashboard/batches/${id}`,
      }).catch(() => {});

      res.status(201).json(r.rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Failed to post announcement' });
    }
  }
);

export default router;
