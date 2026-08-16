import { Hono } from 'hono';
import type { AppContext } from '../types';
import { requireAuth, roleGuard, batchMember } from '../middleware/auth';
import { CreateBatchSchema, validateBody, getValid } from '../lib/validation';
import { notifyUser, notifyMany } from '../services/notifications';

const batches = new Hono<AppContext>();

// GET /api/batches — scoped by role
batches.get('/', requireAuth, async (c) => {
  try {
    const db = c.get('db');
    const { role, id: userId } = c.get('user')!;
    let query: string;
    let params: unknown[];

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

    const r = await db.query(query, params);
    return c.json(r.rows);
  } catch (err) {
    console.error('GET /batches error', err);
    return c.json({ error: 'Failed to list batches' }, 500);
  }
});

// GET /api/batches/:id — full detail (members only)
batches.get('/:id', requireAuth, batchMember('id'), async (c) => {
  try {
    const db = c.get('db');
    const id = parseInt(c.req.param('id'), 10);
    const [batch, teachers, students] = await Promise.all([
      db.query(
        `SELECT b.*, c.title AS course_title, c.slug AS course_slug
           FROM batches b JOIN courses c ON b.course_id = c.id WHERE b.id = $1`,
        [id],
      ),
      db.query(
        `SELECT u.id, u.username, u.full_name, u.avatar_url, bt.is_primary
           FROM batch_teachers bt JOIN users u ON u.id = bt.teacher_id
          WHERE bt.batch_id = $1`,
        [id],
      ),
      db.query(
        `SELECT u.id, u.username, u.full_name, u.avatar_url, bs.enrolled_at, bs.status
           FROM batch_students bs JOIN users u ON u.id = bs.student_id
          WHERE bs.batch_id = $1
          ORDER BY bs.enrolled_at`,
        [id],
      ),
    ]);
    if (batch.rows.length === 0) return c.json({ error: 'Not found' }, 404);
    return c.json({ ...batch.rows[0], teachers: teachers.rows, students: students.rows });
  } catch (err) {
    console.error('GET /batches/:id error', err);
    return c.json({ error: 'Failed to load batch' }, 500);
  }
});

// GET /api/batches/:id/my-attendance — caller's attendance over past classes
batches.get('/:id/my-attendance', requireAuth, batchMember('id'), async (c) => {
  try {
    const db = c.get('db');
    const batchId = parseInt(c.req.param('id'), 10);
    const userId = c.get('user')!.id;
    const r = await db.query(
      `SELECT
          COUNT(*) FILTER (WHERE lc.status = 'ENDED')                                         AS total_past,
          COUNT(*) FILTER (WHERE lc.status = 'ENDED' AND att.id IS NOT NULL)                  AS attended,
          COALESCE(SUM(att.duration_seconds) FILTER (WHERE lc.status = 'ENDED'), 0)::INTEGER  AS total_seconds
         FROM live_classes lc
         LEFT JOIN live_class_attendance att
           ON att.live_class_id = lc.id AND att.user_id = $2
        WHERE lc.batch_id = $1`,
      [batchId, userId],
    );
    const row = r.rows[0];
    return c.json({
      total_past: Number(row.total_past),
      attended: Number(row.attended),
      total_seconds: Number(row.total_seconds),
    });
  } catch (err) {
    console.error('GET /batches/:id/my-attendance error', err);
    return c.json({ error: 'Failed to load attendance' }, 500);
  }
});

// POST /api/batches — super_admin
batches.post('/', requireAuth, roleGuard('super_admin'), validateBody(CreateBatchSchema), async (c) => {
  const db = c.get('db');
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const { course_id, name, start_date, end_date, schedule_description, capacity, status, teacher_ids = [], student_ids = [] } =
      getValid<{
        course_id: number;
        name: string;
        start_date: string;
        end_date?: string | null;
        schedule_description?: string | null;
        capacity?: number | null;
        status?: string;
        teacher_ids?: number[];
        student_ids?: number[];
      }>(c);

    const r = await client.query(
      `INSERT INTO batches (course_id, name, start_date, end_date, schedule_description, capacity, status, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 'upcoming'), $8) RETURNING *`,
      [course_id, name, start_date, end_date ?? null, schedule_description ?? null, capacity ?? null, status ?? null, c.get('user')!.id],
    );
    const batch = r.rows[0];

    for (const tid of teacher_ids) {
      await client.query(
        `INSERT INTO batch_teachers (batch_id, teacher_id, is_primary)
           VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
        [batch.id, tid, tid === teacher_ids[0]],
      );
    }
    for (const sid of student_ids) {
      await client.query(
        `INSERT INTO batch_students (batch_id, student_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [batch.id, sid],
      );
    }

    await client.query('COMMIT');

    if (teacher_ids.length || student_ids.length) {
      await notifyMany(c.env, db, [...teacher_ids, ...student_ids], {
        type: 'enrolled',
        title: `Added to batch: ${batch.name}`,
        linkUrl: `/dashboard/batches/${batch.id}`,
      }).catch(() => {});
    }

    return c.json(batch, 201);
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('POST /batches error', err);
    return c.json({ error: 'Failed to create batch' }, 500);
  } finally {
    client.release();
  }
});

// PATCH /api/batches/:id — super_admin
batches.patch('/:id', requireAuth, roleGuard('super_admin'), async (c) => {
  try {
    const db = c.get('db');
    const id = parseInt(c.req.param('id'), 10);
    const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
    const fields = ['name', 'start_date', 'end_date', 'schedule_description', 'capacity', 'status'];
    const set: string[] = [];
    const values: unknown[] = [];
    for (const f of fields) {
      if (f in body) {
        values.push(body[f]);
        set.push(`${f} = $${values.length}`);
      }
    }
    if (set.length === 0) return c.json({ error: 'No fields to update' }, 400);
    values.push(id);
    const r = await db.query(
      `UPDATE batches SET ${set.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
      values,
    );
    if (r.rows.length === 0) return c.json({ error: 'Not found' }, 404);
    return c.json(r.rows[0]);
  } catch {
    return c.json({ error: 'Failed to update batch' }, 500);
  }
});

// POST /api/batches/:id/teachers — assign teacher
batches.post('/:id/teachers', requireAuth, roleGuard('super_admin'), async (c) => {
  try {
    const db = c.get('db');
    const id = parseInt(c.req.param('id'), 10);
    const { teacher_id, is_primary = false } = await c.req
      .json<{ teacher_id?: number; is_primary?: boolean }>()
      .catch(() => ({ teacher_id: undefined, is_primary: false }));
    if (!teacher_id) return c.json({ error: 'teacher_id required' }, 400);
    await db.query(
      `INSERT INTO batch_teachers (batch_id, teacher_id, is_primary) VALUES ($1, $2, $3)
       ON CONFLICT (batch_id, teacher_id) DO UPDATE SET is_primary = EXCLUDED.is_primary`,
      [id, teacher_id, is_primary],
    );
    await notifyUser(c.env, db, {
      userId: teacher_id,
      type: 'enrolled',
      title: 'Assigned to batch',
      linkUrl: `/dashboard/batches/${id}`,
    }).catch(() => {});
    return c.body(null, 204);
  } catch {
    return c.json({ error: 'Failed to assign teacher' }, 500);
  }
});

batches.delete('/:id/teachers/:teacherId', requireAuth, roleGuard('super_admin'), async (c) => {
  try {
    await c.get('db').query(
      'DELETE FROM batch_teachers WHERE batch_id = $1 AND teacher_id = $2',
      [parseInt(c.req.param('id'), 10), parseInt(c.req.param('teacherId'), 10)],
    );
    return c.body(null, 204);
  } catch {
    return c.json({ error: 'Failed to remove teacher' }, 500);
  }
});

// PATCH /api/batches/:id/teachers/:teacherId/primary — flip primary flag (single-primary invariant)
batches.patch('/:id/teachers/:teacherId/primary', requireAuth, roleGuard('super_admin'), async (c) => {
  const db = c.get('db');
  const batchId = parseInt(c.req.param('id'), 10);
  const teacherId = parseInt(c.req.param('teacherId'), 10);
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    await client.query('UPDATE batch_teachers SET is_primary = FALSE WHERE batch_id = $1', [batchId]);
    const r = await client.query(
      'UPDATE batch_teachers SET is_primary = TRUE WHERE batch_id = $1 AND teacher_id = $2',
      [batchId, teacherId],
    );
    if (r.rowCount === 0) {
      await client.query('ROLLBACK');
      return c.json({ error: 'Teacher is not assigned to this batch' }, 404);
    }
    await client.query('COMMIT');
    return c.body(null, 204);
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('set primary teacher error', err);
    return c.json({ error: 'Failed to set primary teacher' }, 500);
  } finally {
    client.release();
  }
});

// POST /api/batches/:id/students — enroll students (super_admin or teacher of batch)
batches.post('/:id/students', requireAuth, roleGuard('super_admin', 'teacher'), batchMember('id'), async (c) => {
  try {
    const db = c.get('db');
    const id = parseInt(c.req.param('id'), 10);
    const body = (await c.req.json().catch(() => ({}))) as { student_ids?: number[]; student_id?: number };
    const ids: number[] = Array.isArray(body.student_ids) ? body.student_ids : body.student_id ? [body.student_id] : [];
    if (ids.length === 0) return c.json({ error: 'student_id(s) required' }, 400);

    for (const sid of ids) {
      await db.query(
        `INSERT INTO batch_students (batch_id, student_id) VALUES ($1, $2)
         ON CONFLICT (batch_id, student_id) DO UPDATE SET status = 'active'`,
        [id, sid],
      );
    }
    await notifyMany(c.env, db, ids, {
      type: 'enrolled',
      title: 'You were enrolled in a new batch',
      linkUrl: `/dashboard/batches/${id}`,
    }).catch(() => {});
    return c.body(null, 204);
  } catch (err) {
    console.error('POST /batches/:id/students error', err);
    return c.json({ error: 'Failed to enroll students' }, 500);
  }
});

batches.delete('/:id/students/:studentId', requireAuth, roleGuard('super_admin', 'teacher'), batchMember('id'), async (c) => {
  try {
    await c.get('db').query(
      'DELETE FROM batch_students WHERE batch_id = $1 AND student_id = $2',
      [parseInt(c.req.param('id'), 10), parseInt(c.req.param('studentId'), 10)],
    );
    return c.body(null, 204);
  } catch {
    return c.json({ error: 'Failed to remove student' }, 500);
  }
});

// =============================================================================
// HYBRID REQUEST-TO-JOIN ENROLMENT (migration 006)
// =============================================================================

// POST /api/batches/:id/enrolment-requests — student asks to join
batches.post('/:id/enrolment-requests', requireAuth, roleGuard('student'), async (c) => {
  const db = c.get('db');
  const user = c.get('user')!;
  const batchId = parseInt(c.req.param('id'), 10);
  const reqBody = (await c.req.json().catch(() => ({}))) as { message?: unknown };
  const message = typeof reqBody?.message === 'string' ? reqBody.message.slice(0, 500) : null;
  try {
    const batchRes = await db.query(`SELECT id, status, capacity FROM batches WHERE id = $1`, [batchId]);
    if (batchRes.rows.length === 0) return c.json({ error: 'Batch not found' }, 404);
    const batch = batchRes.rows[0];
    if (batch.status === 'completed' || batch.status === 'archived') {
      return c.json({ error: 'Batch is closed' }, 410);
    }
    const enrolled = await db.query(
      `SELECT 1 FROM batch_students WHERE batch_id = $1 AND student_id = $2 AND status = 'active'`,
      [batchId, user.id],
    );
    if (enrolled.rowCount && enrolled.rowCount > 0) {
      return c.json({ error: 'Already enrolled in this batch' }, 409);
    }
    if (batch.capacity != null) {
      const counted = await db.query(
        `SELECT COUNT(*)::INTEGER AS n FROM batch_students WHERE batch_id = $1 AND status = 'active'`,
        [batchId],
      );
      if (counted.rows[0].n >= batch.capacity) return c.json({ error: 'Batch is full' }, 409);
    }
    try {
      const inserted = await db.query(
        `INSERT INTO batch_enrolment_requests (batch_id, student_id, message)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [batchId, user.id, message],
      );
      const recipients = await db.query<{ id: number }>(
        `SELECT bt.teacher_id AS id FROM batch_teachers bt WHERE bt.batch_id = $1
         UNION
         SELECT u.id FROM users u WHERE u.role IN ('super_admin', 'admin')`,
        [batchId],
      );
      await notifyMany(c.env, db, recipients.rows.map((r) => r.id), {
        type: 'enrolment_requested',
        title: 'New join request',
        body: `${user.full_name || user.username} asked to join the batch.`,
        linkUrl: `/dashboard/teacher/batches/${batchId}?tab=requests`,
      });
      return c.json(inserted.rows[0], 201);
    } catch (e) {
      if ((e as { code?: string }).code === '23505') {
        return c.json({ error: 'You already have a pending request for this batch' }, 409);
      }
      throw e;
    }
  } catch (err) {
    console.error('POST /batches/:id/enrolment-requests error', err);
    return c.json({ error: 'Failed to create enrolment request' }, 500);
  }
});

// GET /api/batches/:id/enrolment-requests — admin/teacher lists requests
batches.get('/:id/enrolment-requests', requireAuth, roleGuard('super_admin', 'teacher'), batchMember('id'), async (c) => {
  const db = c.get('db');
  const batchId = parseInt(c.req.param('id'), 10);
  const filter = (c.req.query('status') || 'pending').toLowerCase();
  const validStatuses = new Set(['pending', 'approved', 'declined', 'cancelled', 'all']);
  if (!validStatuses.has(filter)) return c.json({ error: 'invalid status filter' }, 400);
  try {
    const r = await db.query(
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
      filter === 'all' ? [batchId] : [batchId, filter],
    );
    return c.json(r.rows);
  } catch (err) {
    console.error('GET /batches/:id/enrolment-requests error', err);
    return c.json({ error: 'Failed to list requests' }, 500);
  }
});

// PATCH /api/batches/:id/enrolment-requests/:reqId — approve or decline
batches.patch('/:id/enrolment-requests/:reqId', requireAuth, roleGuard('super_admin', 'teacher'), batchMember('id'), async (c) => {
  const db = c.get('db');
  const batchId = parseInt(c.req.param('id'), 10);
  const reqId = parseInt(c.req.param('reqId'), 10);
  const patchBody = (await c.req.json().catch(() => ({}))) as { action?: string; note?: unknown };
  const action = patchBody?.action;
  const note = typeof patchBody?.note === 'string' ? patchBody.note.slice(0, 500) : null;
  if (action !== 'approve' && action !== 'decline') {
    return c.json({ error: 'action must be "approve" or "decline"' }, 400);
  }
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const lock = await client.query(
      `SELECT * FROM batch_enrolment_requests
        WHERE id = $1 AND batch_id = $2 AND status = 'pending'
        FOR UPDATE`,
      [reqId, batchId],
    );
    if (lock.rows.length === 0) {
      await client.query('ROLLBACK');
      return c.json({ error: 'Pending request not found' }, 404);
    }
    const reqRow = lock.rows[0];

    if (action === 'approve') {
      const batchRes = await client.query(`SELECT capacity FROM batches WHERE id = $1`, [batchId]);
      if (batchRes.rows[0]?.capacity != null) {
        const counted = await client.query(
          `SELECT COUNT(*)::INTEGER AS n FROM batch_students WHERE batch_id = $1 AND status = 'active'`,
          [batchId],
        );
        if (counted.rows[0].n >= batchRes.rows[0].capacity) {
          await client.query('ROLLBACK');
          return c.json({ error: 'Batch is full' }, 409);
        }
      }
      await client.query(
        `INSERT INTO batch_students (batch_id, student_id, status)
           VALUES ($1, $2, 'active')
         ON CONFLICT (batch_id, student_id)
           DO UPDATE SET status = 'active'`,
        [batchId, reqRow.student_id],
      );
    }

    await client.query(
      `UPDATE batch_enrolment_requests
          SET status = $1, decided_at = NOW(), decided_by = $2, note = $3
        WHERE id = $4`,
      [action === 'approve' ? 'approved' : 'declined', c.get('user')!.id, note, reqId],
    );
    await client.query('COMMIT');

    await notifyUser(c.env, db, {
      userId: reqRow.student_id,
      type: action === 'approve' ? 'enrolment_approved' : 'enrolment_declined',
      title: action === 'approve' ? 'Enrolment approved' : 'Enrolment request declined',
      body:
        action === 'approve'
          ? 'You have been added to the batch — open My Batches to get started.'
          : note || 'Your enrolment request was not approved.',
      linkUrl: action === 'approve' ? `/dashboard/student/batches/${batchId}` : `/dashboard/student/enrolments`,
    });

    return c.body(null, 204);
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('PATCH /batches/:id/enrolment-requests/:reqId error', err);
    return c.json({ error: 'Failed to decide request' }, 500);
  } finally {
    client.release();
  }
});

// DELETE /api/batches/:id/enrolment-requests/:reqId — student cancels their own pending request
batches.delete('/:id/enrolment-requests/:reqId', requireAuth, roleGuard('student'), async (c) => {
  const db = c.get('db');
  const batchId = parseInt(c.req.param('id'), 10);
  const reqId = parseInt(c.req.param('reqId'), 10);
  try {
    const r = await db.query(
      `UPDATE batch_enrolment_requests
          SET status = 'cancelled', decided_at = NOW()
        WHERE id = $1
          AND batch_id = $2
          AND student_id = $3
          AND status = 'pending'
        RETURNING id`,
      [reqId, batchId, c.get('user')!.id],
    );
    if (r.rowCount === 0) return c.json({ error: 'No pending request to cancel' }, 404);
    return c.body(null, 204);
  } catch (err) {
    console.error('DELETE /batches/:id/enrolment-requests/:reqId error', err);
    return c.json({ error: 'Failed to cancel request' }, 500);
  }
});

export default batches;
