import { Router, Response } from 'express';
import pool from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const limit = Math.min(parseInt((req.query.limit as string) || '50', 10), 200);
    const r = await pool.query(
      `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`,
      [req.user!.id, limit]
    );
    const unread = await pool.query(
      `SELECT COUNT(*)::INT AS count FROM notifications WHERE user_id = $1 AND read_at IS NULL`,
      [req.user!.id]
    );
    res.json({ items: r.rows, unread: unread.rows[0].count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load notifications' });
  }
});

router.patch('/:id/read', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await pool.query(
      `UPDATE notifications SET read_at = NOW() WHERE id = $1 AND user_id = $2 AND read_at IS NULL`,
      [parseInt(req.params.id, 10), req.user!.id]
    );
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark read' });
  }
});

router.post('/read-all', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await pool.query(
      `UPDATE notifications SET read_at = NOW() WHERE user_id = $1 AND read_at IS NULL`,
      [req.user!.id]
    );
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark all read' });
  }
});

export default router;
