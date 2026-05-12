import { Router, Response } from 'express';
import pool from '../db';
import { authMiddleware, roleGuard, batchMember, AuthRequest } from '../middleware/auth';
import { CreateBatchSchema, validateBody } from '../lib/validation';
import { notifyMany } from '../services/notifications';

const router = Router();

// GET /api/batches — scoped by role
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { role, id: userId } = req.user!;
    let query: string;
    let params: any[];

    if (role === 'super_admin') {
      query = `SELECT b.*, c.title AS course_title, c.slug AS course_slug
                 FROM batches b
                 JOIN courses c ON b.course_id = c.id
                 ORDER BY b.start_date DESC`;
      params = [];
    } else if (role === 'teacher') {
      query = `SELECT b.*, c.title AS course_title, c.slug AS course_slug
                 FROM batches b
                 JOIN courses c ON b.course_id = c.id
                 JOIN batch_teachers bt ON bt.batch_id = b.id
                WHERE bt.teacher_id = $1
                ORDER BY b.start_date DESC`;
      params = [userId];
    } else {
      query = `SELECT b.*, c.title AS course_title, c.slug AS course_slug
                 FROM batches b
                 JOIN courses c ON b.course_id = c.id
                 JOIN batch_students bs ON bs.batch_id = b.id
                WHERE bs.student_id = $1 AND bs.status = 'active'
                ORDER BY b.start_date DESC`;
      params = [userId];
    }

    const r = await pool.query(query, params);
    res.json(r.rows);
  } catch (err) {
    console.error('GET /batches error', err);
    res.status(500).json({ error: 'Failed to list batches' });
  }
});

// GET /api/batches/:id — full detail (members only)
router.get('/:id', authMiddleware, batchMember('id'), async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [batch, teachers, students] = await Promise.all([
      pool.query(
        `SELECT b.*, c.title AS course_title, c.slug AS course_slug
           FROM batches b JOIN courses c ON b.course_id = c.id WHERE b.id = $1`,
        [id]
      ),
      pool.query(
        `SELECT u.id, u.username, u.full_name, u.avatar_url, bt.is_primary
           FROM batch_teachers bt JOIN users u ON u.id = bt.teacher_id
          WHERE bt.batch_id = $1`,
        [id]
      ),
      pool.query(
        `SELECT u.id, u.username, u.full_name, u.avatar_url, bs.enrolled_at, bs.status
           FROM batch_students bs JOIN users u ON u.id = bs.student_id
          WHERE bs.batch_id = $1
          ORDER BY bs.enrolled_at`,
        [id]
      ),
    ]);
    if (batch.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ ...batch.rows[0], teachers: teachers.rows, students: students.rows });
  } catch (err) {
    console.error('GET /batches/:id error', err);
    res.status(500).json({ error: 'Failed to load batch' });
  }
});

// GET /api/batches/:id/my-attendance — caller's attendance over past classes
// in this batch. Used by the student dashboard Attendance card. Open to any
// member (teacher/student/super_admin); shows the SELF row, never others.
router.get(
  '/:id/my-attendance',
  authMiddleware,
  batchMember('id'),
  async (req: AuthRequest, res: Response) => {
    try {
      const batchId = parseInt(req.params.id, 10);
      const userId  = req.user!.id;
      const r = await pool.query(
        `SELECT
            COUNT(*) FILTER (WHERE lc.status = 'ENDED')                                         AS total_past,
            COUNT(*) FILTER (WHERE lc.status = 'ENDED' AND att.id IS NOT NULL)                  AS attended,
            COALESCE(SUM(att.duration_seconds) FILTER (WHERE lc.status = 'ENDED'), 0)::INTEGER  AS total_seconds
           FROM live_classes lc
           LEFT JOIN live_class_attendance att
             ON att.live_class_id = lc.id AND att.user_id = $2
          WHERE lc.batch_id = $1`,
        [batchId, userId]
      );
      const row = r.rows[0];
      res.json({
        total_past:    Number(row.total_past),
        attended:      Number(row.attended),
        total_seconds: Number(row.total_seconds),
      });
    } catch (err) {
      console.error('GET /batches/:id/my-attendance error', err);
      res.status(500).json({ error: 'Failed to load attendance' });
    }
  }
);

// POST /api/batches — super_admin
router.post(
  '/',
  authMiddleware,
  roleGuard('super_admin'),
  validateBody(CreateBatchSchema),
  async (req: AuthRequest, res: Response) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { course_id, name, start_date, end_date, schedule_description, capacity, status, teacher_ids = [], student_ids = [] } = req.body;

      const r = await client.query(
        `INSERT INTO batches (course_id, name, start_date, end_date, schedule_description, capacity, status, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 'upcoming'), $8) RETURNING *`,
        [course_id, name, start_date, end_date ?? null, schedule_description ?? null, capacity ?? null, status ?? null, req.user!.id]
      );
      const batch = r.rows[0];

      for (const tid of teacher_ids) {
        await client.query(
          `INSERT INTO batch_teachers (batch_id, teacher_id, is_primary)
             VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
          [batch.id, tid, tid === teacher_ids[0]]
        );
      }
      for (const sid of student_ids) {
        await client.query(
          `INSERT INTO batch_students (batch_id, student_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [batch.id, sid]
        );
      }

      await client.query('COMMIT');

      if (teacher_ids.length || student_ids.length) {
        notifyMany([...teacher_ids, ...student_ids], {
          type: 'enrolled',
          title: `Added to batch: ${batch.name}`,
          linkUrl: `/dashboard/batches/${batch.id}`,
        }).catch(() => {});
      }

      res.status(201).json(batch);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('POST /batches error', err);
      res.status(500).json({ error: 'Failed to create batch' });
    } finally {
      client.release();
    }
  }
);

// PATCH /api/batches/:id — super_admin
router.patch('/:id', authMiddleware, roleGuard('super_admin'), async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const fields = ['name', 'start_date', 'end_date', 'schedule_description', 'capacity', 'status'];
    const set: string[] = [];
    const values: any[] = [];
    for (const f of fields) {
      if (f in req.body) {
        values.push(req.body[f]);
        set.push(`${f} = $${values.length}`);
      }
    }
    if (set.length === 0) return res.status(400).json({ error: 'No fields to update' });
    values.push(id);
    const r = await pool.query(
      `UPDATE batches SET ${set.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
      values
    );
    if (r.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(r.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update batch' });
  }
});

// POST /api/batches/:id/teachers — assign teacher
router.post('/:id/teachers', authMiddleware, roleGuard('super_admin'), async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { teacher_id, is_primary = false } = req.body;
    if (!teacher_id) return res.status(400).json({ error: 'teacher_id required' });
    await pool.query(
      `INSERT INTO batch_teachers (batch_id, teacher_id, is_primary) VALUES ($1, $2, $3)
       ON CONFLICT (batch_id, teacher_id) DO UPDATE SET is_primary = EXCLUDED.is_primary`,
      [id, teacher_id, is_primary]
    );
    notifyUser(teacher_id, id, 'Assigned to batch').catch(() => {});
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to assign teacher' });
  }
});

router.delete('/:id/teachers/:teacherId', authMiddleware, roleGuard('super_admin'), async (req: AuthRequest, res: Response) => {
  try {
    await pool.query(
      'DELETE FROM batch_teachers WHERE batch_id = $1 AND teacher_id = $2',
      [parseInt(req.params.id, 10), parseInt(req.params.teacherId, 10)]
    );
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove teacher' });
  }
});

// PATCH /api/batches/:id/teachers/:teacherId/primary — flip primary flag.
// Enforces single-primary-per-batch by clearing all flags first, then setting
// the target's. Safer than calling POST with is_primary=true (which leaves
// any prior primary in place).
router.patch(
  '/:id/teachers/:teacherId/primary',
  authMiddleware,
  roleGuard('super_admin'),
  async (req: AuthRequest, res: Response) => {
    const batchId   = parseInt(req.params.id, 10);
    const teacherId = parseInt(req.params.teacherId, 10);
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('UPDATE batch_teachers SET is_primary = FALSE WHERE batch_id = $1', [batchId]);
      const r = await client.query(
        'UPDATE batch_teachers SET is_primary = TRUE WHERE batch_id = $1 AND teacher_id = $2',
        [batchId, teacherId]
      );
      if (r.rowCount === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Teacher is not assigned to this batch' });
      }
      await client.query('COMMIT');
      res.status(204).end();
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('set primary teacher error', err);
      res.status(500).json({ error: 'Failed to set primary teacher' });
    } finally {
      client.release();
    }
  }
);

// POST /api/batches/:id/students — enroll students (super_admin or teacher of batch)
router.post('/:id/students', authMiddleware, roleGuard('super_admin', 'teacher'), batchMember('id'), async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const ids: number[] = Array.isArray(req.body.student_ids) ? req.body.student_ids : (req.body.student_id ? [req.body.student_id] : []);
    if (ids.length === 0) return res.status(400).json({ error: 'student_id(s) required' });

    for (const sid of ids) {
      await pool.query(
        `INSERT INTO batch_students (batch_id, student_id) VALUES ($1, $2)
         ON CONFLICT (batch_id, student_id) DO UPDATE SET status = 'active'`,
        [id, sid]
      );
    }
    notifyMany(ids, {
      type: 'enrolled',
      title: 'You were enrolled in a new batch',
      linkUrl: `/dashboard/batches/${id}`,
    }).catch(() => {});
    res.status(204).end();
  } catch (err) {
    console.error('POST /batches/:id/students error', err);
    res.status(500).json({ error: 'Failed to enroll students' });
  }
});

router.delete('/:id/students/:studentId', authMiddleware, roleGuard('super_admin', 'teacher'), batchMember('id'), async (req: AuthRequest, res: Response) => {
  try {
    await pool.query(
      'DELETE FROM batch_students WHERE batch_id = $1 AND student_id = $2',
      [parseInt(req.params.id, 10), parseInt(req.params.studentId, 10)]
    );
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove student' });
  }
});

async function notifyUser(userId: number, batchId: number, title: string) {
  // tiny inline helper to avoid importing notifications service twice
  const { notifyUser: nu } = await import('../services/notifications');
  return nu({ userId, type: 'enrolled', title, linkUrl: `/dashboard/batches/${batchId}` });
}

export default router;
