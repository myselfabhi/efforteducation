import { Hono } from 'hono';
import type { AppContext } from '../types';
import { requireAuth, roleGuard } from '../middleware/auth';

const recordings = new Hono<AppContext>();

// GET /api/recordings/mine — recordings of the student's classes, newest first.
recordings.get('/mine', requireAuth, roleGuard('student', 'super_admin'), async (c) => {
  const r = await c.get('db').query(
    `SELECT lc.id, lc.title, lc.recording_url, lc.scheduled_start, lc.ended_at,
            b.name AS batch_name, co.title AS course_title
       FROM live_classes lc
       JOIN batches b  ON b.id = lc.batch_id
       JOIN courses co ON co.id = b.course_id
       JOIN batch_students bs ON bs.batch_id = lc.batch_id
            AND bs.student_id = $1 AND bs.status = 'active'
      WHERE lc.recording_url IS NOT NULL
      ORDER BY COALESCE(lc.ended_at, lc.scheduled_start) DESC
      LIMIT 100`,
    [c.get('user')!.id],
  );
  return c.json({ recordings: r.rows });
});

export default recordings;
