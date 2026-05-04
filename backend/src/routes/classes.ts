import { Router, Response } from 'express';
import pool from '../db';
import { authMiddleware, roleGuard, batchMember, AuthRequest } from '../middleware/auth';
import { CreateLiveClassSchema, validateBody } from '../lib/validation';
import { generateRoomId, generateRoomPassword, buildCredentials } from '../services/jitsi';
import { notifyMany } from '../services/notifications';

const router = Router();

// GET /api/batches/:id/classes — list scheduled+past for a batch
router.get(
  '/batches/:id/classes',
  authMiddleware,
  batchMember('id'),
  async (req: AuthRequest, res: Response) => {
    try {
      const r = await pool.query(
        `SELECT lc.*, u.username AS teacher_username, u.full_name AS teacher_name
           FROM live_classes lc
           JOIN users u ON u.id = lc.teacher_id
          WHERE lc.batch_id = $1
          ORDER BY lc.scheduled_start DESC`,
        [parseInt(req.params.id, 10)]
      );
      res.json(r.rows);
    } catch (err) {
      res.status(500).json({ error: 'Failed to load classes' });
    }
  }
);

// POST /api/batches/:id/classes — schedule a class (teacher of batch)
router.post(
  '/batches/:id/classes',
  authMiddleware,
  roleGuard('super_admin', 'teacher'),
  batchMember('id'),
  validateBody(CreateLiveClassSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const batchId = parseInt(req.params.id, 10);
      const { title, description, scheduled_start, scheduled_end, teacher_id } = req.body;

      const teacherId = teacher_id ?? req.user!.id;
      // Pre-create with placeholder room_id, then update with id-derived value.
      const placeholder = `eduplat-${batchId}-pending-${Date.now()}`;
      const created = await pool.query(
        `INSERT INTO live_classes (batch_id, teacher_id, title, description, scheduled_start, scheduled_end, room_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [batchId, teacherId, title, description ?? null, scheduled_start, scheduled_end, placeholder]
      );
      const cls = created.rows[0];
      const roomId = generateRoomId(batchId, cls.id);
      const updated = await pool.query(
        `UPDATE live_classes SET room_id = $1 WHERE id = $2 RETURNING *`,
        [roomId, cls.id]
      );

      const students = await pool.query(
        `SELECT student_id FROM batch_students WHERE batch_id = $1 AND status = 'active'`,
        [batchId]
      );
      notifyMany(students.rows.map((s) => s.student_id), {
        type: 'class_starting',
        title: `New live class scheduled: ${title}`,
        body: new Date(scheduled_start).toLocaleString(),
        linkUrl: `/dashboard/classes/${cls.id}`,
      }).catch(() => {});

      res.status(201).json(updated.rows[0]);
    } catch (err) {
      console.error('POST class error', err);
      res.status(500).json({ error: 'Failed to schedule class' });
    }
  }
);

// PATCH /api/classes/:id
router.patch('/classes/:id', authMiddleware, roleGuard('super_admin', 'teacher'), async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const ck = await pool.query('SELECT teacher_id FROM live_classes WHERE id = $1', [id]);
    if (ck.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    if (req.user!.role !== 'super_admin' && ck.rows[0].teacher_id !== req.user!.id) {
      return res.status(403).json({ error: 'Not your class' });
    }
    const fields = ['title', 'description', 'scheduled_start', 'scheduled_end', 'status'];
    const set: string[] = [];
    const values: any[] = [];
    for (const f of fields) {
      if (f in req.body) { values.push(req.body[f]); set.push(`${f} = $${values.length}`); }
    }
    if (set.length === 0) return res.status(400).json({ error: 'No fields to update' });
    values.push(id);
    const r = await pool.query(`UPDATE live_classes SET ${set.join(', ')} WHERE id = $${values.length} RETURNING *`, values);
    res.json(r.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update class' });
  }
});

// DELETE /api/classes/:id
router.delete('/classes/:id', authMiddleware, roleGuard('super_admin', 'teacher'), async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const ck = await pool.query('SELECT teacher_id FROM live_classes WHERE id = $1', [id]);
    if (ck.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    if (req.user!.role !== 'super_admin' && ck.rows[0].teacher_id !== req.user!.id) {
      return res.status(403).json({ error: 'Not your class' });
    }
    await pool.query(`UPDATE live_classes SET status = 'CANCELLED' WHERE id = $1`, [id]);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel class' });
  }
});

// POST /api/classes/:id/join — returns Jitsi credentials
// Teacher's first call flips status to LIVE; students get 425 until LIVE.
router.post('/classes/:id/join', authMiddleware, async (req: AuthRequest, res: Response) => {
  const client = await pool.connect();
  try {
    const id = parseInt(req.params.id, 10);
    await client.query('BEGIN');

    const lock = await client.query(
      `SELECT lc.*, b.id AS batch_id_check
         FROM live_classes lc
         JOIN batches b ON b.id = lc.batch_id
        WHERE lc.id = $1
        FOR UPDATE`,
      [id]
    );
    if (lock.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Class not found' });
    }
    const cls = lock.rows[0];

    // Time window: scheduled_start - 10min .. scheduled_end + 30min
    const now = new Date();
    const windowStart = new Date(new Date(cls.scheduled_start).getTime() - 10 * 60_000);
    const windowEnd = new Date(new Date(cls.scheduled_end).getTime() + 30 * 60_000);
    if (now < windowStart) {
      await client.query('ROLLBACK');
      return res.status(425).json({ error: 'Class has not started yet', willStartAt: cls.scheduled_start });
    }
    if (now > windowEnd || cls.status === 'ENDED' || cls.status === 'CANCELLED') {
      await client.query('ROLLBACK');
      return res.status(410).json({ error: 'Class is over' });
    }

    // Membership check
    const role = req.user!.role;
    let isMember = role === 'super_admin';
    let isTeacher = role === 'super_admin' || cls.teacher_id === req.user!.id;
    if (!isMember && role === 'teacher') {
      const t = await client.query(
        'SELECT 1 FROM batch_teachers WHERE batch_id = $1 AND teacher_id = $2',
        [cls.batch_id, req.user!.id]
      );
      isMember = t.rows.length > 0;
      isTeacher = isTeacher || t.rows.length > 0;
    } else if (!isMember && role === 'student') {
      const s = await client.query(
        `SELECT 1 FROM batch_students WHERE batch_id = $1 AND student_id = $2 AND status = 'active'`,
        [cls.batch_id, req.user!.id]
      );
      isMember = s.rows.length > 0;
    }
    if (!isMember) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: 'Not a member of this batch' });
    }

    let password: string | null = cls.room_password;
    let status = cls.status;

    if (isTeacher && status === 'SCHEDULED') {
      password = generateRoomPassword();
      const upd = await client.query(
        `UPDATE live_classes
            SET status = 'LIVE', started_at = NOW(), room_password = $1
          WHERE id = $2 AND status = 'SCHEDULED'
          RETURNING status, room_password`,
        [password, id]
      );
      if (upd.rows.length > 0) {
        status = upd.rows[0].status;
        password = upd.rows[0].room_password;
      }
    }

    if (!isTeacher && status !== 'LIVE') {
      await client.query('ROLLBACK');
      return res.status(425).json({ error: 'Waiting for teacher to start the class' });
    }

    await client.query('COMMIT');

    const credentials = buildCredentials({
      room: cls.room_id,
      password,
      isModerator: isTeacher,
      user: {
        id: req.user!.id,
        name: req.user!.full_name || req.user!.username,
        email: req.user!.email,
      },
    });

    res.json({ class: { id: cls.id, title: cls.title, status }, credentials });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('class join error', err);
    res.status(500).json({ error: 'Failed to join class' });
  } finally {
    client.release();
  }
});

// POST /api/classes/:id/leave — explicit leave (Socket disconnect also covers this)
router.post('/classes/:id/leave', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await pool.query(
      `UPDATE live_class_attendance
          SET left_at = NOW(),
              duration_seconds = EXTRACT(EPOCH FROM (NOW() - joined_at))::INT
        WHERE live_class_id = $1 AND user_id = $2 AND left_at IS NULL`,
      [parseInt(req.params.id, 10), req.user!.id]
    );
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to leave class' });
  }
});

// GET /api/classes/upcoming — current user's next 7 days
router.get('/classes/upcoming', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { role, id } = req.user!;
    const baseSelect = `SELECT lc.*, b.name AS batch_name, u.full_name AS teacher_name
                          FROM live_classes lc
                          JOIN batches b ON b.id = lc.batch_id
                          JOIN users u ON u.id = lc.teacher_id`;
    let q: string;
    let params: any[];
    if (role === 'super_admin') {
      q = `${baseSelect} WHERE lc.status IN ('SCHEDULED','LIVE') AND lc.scheduled_start < NOW() + INTERVAL '7 days' ORDER BY lc.scheduled_start`;
      params = [];
    } else if (role === 'teacher') {
      q = `${baseSelect}
            WHERE lc.status IN ('SCHEDULED','LIVE')
              AND lc.scheduled_start < NOW() + INTERVAL '7 days'
              AND (lc.teacher_id = $1 OR lc.batch_id IN (SELECT batch_id FROM batch_teachers WHERE teacher_id = $1))
            ORDER BY lc.scheduled_start`;
      params = [id];
    } else {
      q = `${baseSelect}
            WHERE lc.status IN ('SCHEDULED','LIVE')
              AND lc.scheduled_start < NOW() + INTERVAL '7 days'
              AND lc.batch_id IN (SELECT batch_id FROM batch_students WHERE student_id = $1 AND status = 'active')
            ORDER BY lc.scheduled_start`;
      params = [id];
    }
    const r = await pool.query(q, params);
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load upcoming' });
  }
});

export default router;
