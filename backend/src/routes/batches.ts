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

// =============================================================================
// HYBRID REQUEST-TO-JOIN ENROLMENT (migration 006)
//
// Students browse a course's batches, click "Request to join", and the row
// lands in `batch_enrolment_requests` with status='pending'. Any teacher of
// that batch or any super_admin can then approve or decline.
// =============================================================================

// POST /api/batches/:id/enrolment-requests — student asks to join
router.post(
  '/:id/enrolment-requests',
  authMiddleware,
  roleGuard('student'),
  async (req: AuthRequest, res: Response) => {
    const batchId = parseInt(req.params.id, 10);
    const userId  = req.user!.id;
    const message = typeof req.body?.message === 'string'
      ? req.body.message.slice(0, 500)
      : null;
    try {
      const batchRes = await pool.query(
        `SELECT id, status, capacity FROM batches WHERE id = $1`,
        [batchId]
      );
      if (batchRes.rows.length === 0) return res.status(404).json({ error: 'Batch not found' });
      const batch = batchRes.rows[0];
      if (batch.status === 'completed' || batch.status === 'archived') {
        return res.status(410).json({ error: 'Batch is closed' });
      }
      // Already enrolled?
      const enrolled = await pool.query(
        `SELECT 1 FROM batch_students WHERE batch_id = $1 AND student_id = $2 AND status = 'active'`,
        [batchId, userId]
      );
      if (enrolled.rowCount && enrolled.rowCount > 0) {
        return res.status(409).json({ error: 'Already enrolled in this batch' });
      }
      // Capacity check
      if (batch.capacity != null) {
        const counted = await pool.query(
          `SELECT COUNT(*)::INTEGER AS n FROM batch_students WHERE batch_id = $1 AND status = 'active'`,
          [batchId]
        );
        if (counted.rows[0].n >= batch.capacity) {
          return res.status(409).json({ error: 'Batch is full' });
        }
      }
      // Insert; the partial unique index rejects duplicate pending rows.
      try {
        const inserted = await pool.query(
          `INSERT INTO batch_enrolment_requests (batch_id, student_id, message)
           VALUES ($1, $2, $3)
           RETURNING *`,
          [batchId, userId, message]
        );
        // Fan out to all teachers of the batch + super_admins.
        const recipients = await pool.query<{ id: number }>(
          `SELECT bt.teacher_id AS id FROM batch_teachers bt WHERE bt.batch_id = $1
           UNION
           SELECT u.id FROM users u WHERE u.role IN ('super_admin', 'admin')`,
          [batchId]
        );
        const { notifyMany } = await import('../services/notifications');
        await notifyMany(
          recipients.rows.map((r) => r.id),
          {
            type: 'enrolment_requested',
            title: 'New join request',
            body: `${req.user!.full_name || req.user!.username} asked to join the batch.`,
            linkUrl: `/dashboard/teacher/batches/${batchId}?tab=requests`,
          }
        );
        res.status(201).json(inserted.rows[0]);
      } catch (e: unknown) {
        const err = e as { code?: string };
        if (err.code === '23505') {
          return res.status(409).json({ error: 'You already have a pending request for this batch' });
        }
        throw e;
      }
    } catch (err) {
      console.error('POST /batches/:id/enrolment-requests error', err);
      res.status(500).json({ error: 'Failed to create enrolment request' });
    }
  }
);

// GET /api/batches/:id/enrolment-requests — admin/teacher lists requests
router.get(
  '/:id/enrolment-requests',
  authMiddleware,
  roleGuard('super_admin', 'teacher'),
  batchMember('id'),
  async (req: AuthRequest, res: Response) => {
    const batchId = parseInt(req.params.id, 10);
    const filter  = (typeof req.query.status === 'string' ? req.query.status : 'pending')
      .toLowerCase();
    const validStatuses = new Set(['pending', 'approved', 'declined', 'cancelled', 'all']);
    if (!validStatuses.has(filter)) {
      return res.status(400).json({ error: 'invalid status filter' });
    }
    try {
      const r = await pool.query(
        `SELECT
            req.*,
            u.username   AS student_username,
            u.full_name  AS student_full_name,
            u.email      AS student_email,
            u.avatar_url AS student_avatar_url
           FROM batch_enrolment_requests req
           JOIN users u ON u.id = req.student_id
          WHERE req.batch_id = $1
            ${filter === 'all' ? '' : 'AND req.status = $2'}
          ORDER BY req.status = 'pending' DESC, req.requested_at DESC`,
        filter === 'all' ? [batchId] : [batchId, filter]
      );
      res.json(r.rows);
    } catch (err) {
      console.error('GET /batches/:id/enrolment-requests error', err);
      res.status(500).json({ error: 'Failed to list requests' });
    }
  }
);

// PATCH /api/batches/:id/enrolment-requests/:reqId — approve or decline
router.patch(
  '/:id/enrolment-requests/:reqId',
  authMiddleware,
  roleGuard('super_admin', 'teacher'),
  batchMember('id'),
  async (req: AuthRequest, res: Response) => {
    const batchId = parseInt(req.params.id, 10);
    const reqId   = parseInt(req.params.reqId, 10);
    const action  = req.body?.action;
    const note    = typeof req.body?.note === 'string' ? req.body.note.slice(0, 500) : null;
    if (action !== 'approve' && action !== 'decline') {
      return res.status(400).json({ error: 'action must be "approve" or "decline"' });
    }
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const lock = await client.query(
        `SELECT * FROM batch_enrolment_requests
          WHERE id = $1 AND batch_id = $2 AND status = 'pending'
          FOR UPDATE`,
        [reqId, batchId]
      );
      if (lock.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Pending request not found' });
      }
      const reqRow = lock.rows[0];

      if (action === 'approve') {
        // Re-check capacity inside the transaction.
        const batchRes = await client.query(
          `SELECT capacity FROM batches WHERE id = $1`,
          [batchId]
        );
        if (batchRes.rows[0]?.capacity != null) {
          const counted = await client.query(
            `SELECT COUNT(*)::INTEGER AS n FROM batch_students
              WHERE batch_id = $1 AND status = 'active'`,
            [batchId]
          );
          if (counted.rows[0].n >= batchRes.rows[0].capacity) {
            await client.query('ROLLBACK');
            return res.status(409).json({ error: 'Batch is full' });
          }
        }
        await client.query(
          `INSERT INTO batch_students (batch_id, student_id, status)
             VALUES ($1, $2, 'active')
           ON CONFLICT (batch_id, student_id)
             DO UPDATE SET status = 'active'`,
          [batchId, reqRow.student_id]
        );
      }

      await client.query(
        `UPDATE batch_enrolment_requests
            SET status = $1, decided_at = NOW(), decided_by = $2, note = $3
          WHERE id = $4`,
        [action === 'approve' ? 'approved' : 'declined', req.user!.id, note, reqId]
      );
      await client.query('COMMIT');

      const { notifyUser: nu } = await import('../services/notifications');
      await nu({
        userId: reqRow.student_id,
        type: action === 'approve' ? 'enrolment_approved' : 'enrolment_declined',
        title: action === 'approve' ? 'Enrolment approved' : 'Enrolment request declined',
        body: action === 'approve'
          ? 'You have been added to the batch — open My Batches to get started.'
          : (note || 'Your enrolment request was not approved.'),
        linkUrl: action === 'approve'
          ? `/dashboard/student/batches/${batchId}`
          : `/dashboard/student/enrolments`,
      });

      res.status(204).end();
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('PATCH /batches/:id/enrolment-requests/:reqId error', err);
      res.status(500).json({ error: 'Failed to decide request' });
    } finally {
      client.release();
    }
  }
);

// DELETE /api/batches/:id/enrolment-requests/:reqId — student cancels their own pending request
router.delete(
  '/:id/enrolment-requests/:reqId',
  authMiddleware,
  roleGuard('student'),
  async (req: AuthRequest, res: Response) => {
    const batchId = parseInt(req.params.id, 10);
    const reqId   = parseInt(req.params.reqId, 10);
    try {
      const r = await pool.query(
        `UPDATE batch_enrolment_requests
            SET status = 'cancelled', decided_at = NOW()
          WHERE id = $1
            AND batch_id = $2
            AND student_id = $3
            AND status = 'pending'
          RETURNING id`,
        [reqId, batchId, req.user!.id]
      );
      if (r.rowCount === 0) {
        return res.status(404).json({ error: 'No pending request to cancel' });
      }
      res.status(204).end();
    } catch (err) {
      console.error('DELETE /batches/:id/enrolment-requests/:reqId error', err);
      res.status(500).json({ error: 'Failed to cancel request' });
    }
  }
);

export default router;
