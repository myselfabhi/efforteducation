import { Hono } from 'hono';
import type { AppContext } from '../types';
import { requireAuth, roleGuard, batchMember } from '../middleware/auth';
import { CreateLiveClassSchema, validateBody, getValid } from '../lib/validation';
import { generateRoomId, generateRoomPassword, buildCredentials, jitsiDomain } from '../services/jitsi';
import * as rtk from '../services/realtimekit';
import { notifyMany } from '../services/notifications';

// Mounted at /api (mix of /batches/:id/classes and flat /classes/...).
const classes = new Hono<AppContext>();

// GET /api/batches/:id/classes — list scheduled+past for a batch
classes.get('/batches/:id/classes', requireAuth, batchMember('id'), async (c) => {
  try {
    const r = await c.get('db').query(
      `SELECT lc.*, u.username AS teacher_username, u.full_name AS teacher_name
         FROM live_classes lc
         JOIN users u ON u.id = lc.teacher_id
        WHERE lc.batch_id = $1
        ORDER BY lc.scheduled_start DESC`,
      [parseInt(c.req.param('id'), 10)],
    );
    return c.json(r.rows);
  } catch {
    return c.json({ error: 'Failed to load classes' }, 500);
  }
});

// POST /api/batches/:id/classes — schedule a class (teacher of batch)
classes.post(
  '/batches/:id/classes',
  requireAuth,
  roleGuard('super_admin', 'teacher'),
  batchMember('id'),
  validateBody(CreateLiveClassSchema),
  async (c) => {
    try {
      const db = c.get('db');
      const batchId = parseInt(c.req.param('id'), 10);
      const { title, description, scheduled_start, scheduled_end, teacher_id } = getValid<{
        title: string;
        description?: string | null;
        scheduled_start: string;
        scheduled_end: string;
        teacher_id?: number;
      }>(c);

      const teacherId = teacher_id ?? c.get('user')!.id;
      const placeholder = `eduplat-${batchId}-pending-${Date.now()}`;
      const created = await db.query(
        `INSERT INTO live_classes (batch_id, teacher_id, title, description, scheduled_start, scheduled_end, room_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [batchId, teacherId, title, description ?? null, scheduled_start, scheduled_end, placeholder],
      );
      const cls = created.rows[0];
      const roomId = generateRoomId(batchId, cls.id);
      const updated = await db.query(`UPDATE live_classes SET room_id = $1 WHERE id = $2 RETURNING *`, [roomId, cls.id]);

      const students = await db.query(
        `SELECT student_id FROM batch_students WHERE batch_id = $1 AND status = 'active'`,
        [batchId],
      );
      await notifyMany(c.env, db, students.rows.map((s) => s.student_id), {
        type: 'class_starting',
        title: `New live class scheduled: ${title}`,
        body: new Date(scheduled_start).toLocaleString(),
        linkUrl: `/dashboard/classes/${cls.id}`,
      }).catch(() => {});

      return c.json(updated.rows[0], 201);
    } catch (err) {
      console.error('POST class error', err);
      return c.json({ error: 'Failed to schedule class' }, 500);
    }
  },
);

// PATCH /api/classes/:id
classes.patch('/classes/:id', requireAuth, roleGuard('super_admin', 'teacher'), async (c) => {
  try {
    const db = c.get('db');
    const id = parseInt(c.req.param('id'), 10);
    const ck = await db.query('SELECT teacher_id FROM live_classes WHERE id = $1', [id]);
    if (ck.rows.length === 0) return c.json({ error: 'Not found' }, 404);
    if (c.get('user')!.role !== 'super_admin' && ck.rows[0].teacher_id !== c.get('user')!.id) {
      return c.json({ error: 'Not your class' }, 403);
    }
    const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
    const fields = ['title', 'description', 'scheduled_start', 'scheduled_end', 'status'];
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
    const r = await db.query(`UPDATE live_classes SET ${set.join(', ')} WHERE id = $${values.length} RETURNING *`, values);
    return c.json(r.rows[0]);
  } catch {
    return c.json({ error: 'Failed to update class' }, 500);
  }
});

// DELETE /api/classes/:id
classes.delete('/classes/:id', requireAuth, roleGuard('super_admin', 'teacher'), async (c) => {
  try {
    const db = c.get('db');
    const id = parseInt(c.req.param('id'), 10);
    const ck = await db.query('SELECT teacher_id FROM live_classes WHERE id = $1', [id]);
    if (ck.rows.length === 0) return c.json({ error: 'Not found' }, 404);
    if (c.get('user')!.role !== 'super_admin' && ck.rows[0].teacher_id !== c.get('user')!.id) {
      return c.json({ error: 'Not your class' }, 403);
    }
    await db.query(`UPDATE live_classes SET status = 'CANCELLED' WHERE id = $1`, [id]);
    return c.body(null, 204);
  } catch {
    return c.json({ error: 'Failed to cancel class' }, 500);
  }
});

// POST /api/classes/:id/join — returns Jitsi + RealtimeKit credentials
classes.post('/classes/:id/join', requireAuth, async (c) => {
  const db = c.get('db');
  const user = c.get('user')!;
  const client = await db.connect();
  try {
    const id = parseInt(c.req.param('id'), 10);
    await client.query('BEGIN');

    const lock = await client.query(
      `SELECT lc.*, b.id AS batch_id_check
         FROM live_classes lc
         JOIN batches b ON b.id = lc.batch_id
        WHERE lc.id = $1
        FOR UPDATE`,
      [id],
    );
    if (lock.rows.length === 0) {
      await client.query('ROLLBACK');
      return c.json({ error: 'Class not found' }, 404);
    }
    const cls = lock.rows[0];

    const now = new Date();
    const windowStart = new Date(new Date(cls.scheduled_start).getTime() - 10 * 60_000);
    const windowEnd = new Date(new Date(cls.scheduled_end).getTime() + 30 * 60_000);
    if (now < windowStart) {
      await client.query('ROLLBACK');
      return c.json({ error: 'Class has not started yet', willStartAt: cls.scheduled_start }, 425);
    }
    if (now > windowEnd || cls.status === 'ENDED' || cls.status === 'CANCELLED') {
      await client.query('ROLLBACK');
      return c.json({ error: 'Class is over' }, 410);
    }

    const role = user.role;
    let isMember = role === 'super_admin';
    let isTeacher = role === 'super_admin' || cls.teacher_id === user.id;
    if (!isMember && role === 'teacher') {
      const t = await client.query(
        'SELECT 1 FROM batch_teachers WHERE batch_id = $1 AND teacher_id = $2',
        [cls.batch_id, user.id],
      );
      isMember = t.rows.length > 0;
      isTeacher = isTeacher || t.rows.length > 0;
    } else if (!isMember && role === 'student') {
      const s = await client.query(
        `SELECT 1 FROM batch_students WHERE batch_id = $1 AND student_id = $2 AND status = 'active'`,
        [cls.batch_id, user.id],
      );
      isMember = s.rows.length > 0;
    }
    if (!isMember) {
      await client.query('ROLLBACK');
      return c.json({ error: 'Not a member of this batch' }, 403);
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
        [password, id],
      );
      if (upd.rows.length > 0) {
        status = upd.rows[0].status;
        password = upd.rows[0].room_password;
      }
    }

    if (!isTeacher && status !== 'LIVE') {
      await client.query('ROLLBACK');
      return c.json({ error: 'Waiting for teacher to start the class' }, 425);
    }

    await client.query('COMMIT');

    const credentials = buildCredentials({
      domain: jitsiDomain(c.env),
      room: cls.room_id,
      password,
      isModerator: isTeacher,
      user: { id: user.id, name: user.full_name || user.username, email: user.email },
    });

    // ─── Cloudflare RealtimeKit ────────────────────────────────────────────
    if (rtk.isRealtimekitConfigured(c.env)) {
      try {
        let meetingId: string | null = cls.realtimekit_meeting_id;
        if (!meetingId) {
          const meeting = await rtk.createMeeting(c.env, cls.title);
          const w = await db.query(
            `UPDATE live_classes
                SET realtimekit_meeting_id = $1
              WHERE id = $2 AND realtimekit_meeting_id IS NULL
              RETURNING realtimekit_meeting_id`,
            [meeting.id, id],
          );
          if (w.rows.length > 0) {
            meetingId = w.rows[0].realtimekit_meeting_id;
          } else {
            const r2 = await db.query('SELECT realtimekit_meeting_id FROM live_classes WHERE id = $1', [id]);
            meetingId = r2.rows[0]?.realtimekit_meeting_id ?? null;
          }
        }
        if (meetingId) {
          const auth = await rtk.addParticipant(c.env, meetingId, {
            customId: String(user.id),
            name: user.full_name || user.username,
            picture: (user as { avatar_url?: string }).avatar_url ?? null,
            presetName: isTeacher ? rtk.presets(c.env).host : rtk.presets(c.env).participant,
          });
          credentials.realtimekit = { authToken: auth.token, meetingId };
        }
      } catch (rtkErr) {
        console.error('[realtimekit] failed to mint token, falling back to CF Calls path', rtkErr);
      }
    }

    return c.json({ class: { id: cls.id, title: cls.title, status }, credentials });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('class join error', err);
    return c.json({ error: 'Failed to join class' }, 500);
  } finally {
    client.release();
  }
});

// POST /api/classes/:id/leave — explicit leave
classes.post('/classes/:id/leave', requireAuth, async (c) => {
  try {
    await c.get('db').query(
      `UPDATE live_class_attendance
          SET left_at = NOW(),
              duration_seconds = EXTRACT(EPOCH FROM (NOW() - joined_at))::INT
        WHERE live_class_id = $1 AND user_id = $2 AND left_at IS NULL`,
      [parseInt(c.req.param('id'), 10), c.get('user')!.id],
    );
    return c.body(null, 204);
  } catch {
    return c.json({ error: 'Failed to leave class' }, 500);
  }
});

// GET /api/classes/upcoming — current user's next 7 days
classes.get('/classes/upcoming', requireAuth, async (c) => {
  try {
    const db = c.get('db');
    const { role, id } = c.get('user')!;
    const baseSelect = `SELECT lc.*, b.name AS batch_name, u.full_name AS teacher_name
                          FROM live_classes lc
                          JOIN batches b ON b.id = lc.batch_id
                          JOIN users u ON u.id = lc.teacher_id`;
    let q: string;
    let params: unknown[];
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
    const r = await db.query(q, params);
    return c.json(r.rows);
  } catch {
    return c.json({ error: 'Failed to load upcoming' }, 500);
  }
});

export default classes;
