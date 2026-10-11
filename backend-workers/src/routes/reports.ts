import { Hono } from 'hono';
import type { Context } from 'hono';
import type { AppContext } from '../types';
import { requireAuth, roleGuard, batchMember } from '../middleware/auth';
import { WeeklyReportSchema, ReportCommentSchema, validateBody, getValid } from '../lib/validation';
import { notifyUser, notifyMany } from '../services/notifications';

const reports = new Hono<AppContext>();

// The week a report belongs to: Monday of the current ISO week, in IST
// (Young Scholar runs in India). Shared verbatim by reads and the upsert so
// "this week" means the same thing everywhere.
const WEEK_START = `date_trunc('week', (NOW() AT TIME ZONE 'Asia/Kolkata'))::date`;

type ReportBody = {
  went_well?: string | null;
  tricky?: string | null;
  next_goal?: string | null;
  mood?: number | null;
  photo_url?: string | null;
};

// ── Student: this week's report (or null) ─────────────────────────────────────
reports.get('/me/current', requireAuth, roleGuard('student', 'super_admin'), async (c) => {
  const db = c.get('db');
  const user = c.get('user')!;
  const r = await db.query(
    `SELECT wr.*, tu.full_name AS teacher_name
       FROM weekly_reports wr
       LEFT JOIN users tu ON tu.id = COALESCE(wr.commented_by, wr.cheered_by)
      WHERE wr.student_id = $1 AND wr.week_start = ${WEEK_START}`,
    [user.id],
  );
  return c.json({ report: r.rows[0] ?? null });
});

// ── Student: my reports, most recent first ────────────────────────────────────
reports.get('/me', requireAuth, roleGuard('student', 'super_admin'), async (c) => {
  const db = c.get('db');
  const user = c.get('user')!;
  const r = await db.query(
    `SELECT wr.*, tu.full_name AS teacher_name, b.name AS batch_name
       FROM weekly_reports wr
       LEFT JOIN users tu ON tu.id = COALESCE(wr.commented_by, wr.cheered_by)
       LEFT JOIN batches b ON b.id = wr.batch_id
      WHERE wr.student_id = $1
      ORDER BY wr.week_start DESC`,
    [user.id],
  );
  return c.json({ reports: r.rows });
});

// ── Student: submit / update this week's report (upsert) ──────────────────────
reports.post('/', requireAuth, roleGuard('student', 'super_admin'), validateBody(WeeklyReportSchema), async (c) => {
  const db = c.get('db');
  const user = c.get('user')!;
  const { went_well, tricky, next_goal, mood, photo_url } = getValid<ReportBody>(c);

  const hasContent = [went_well, tricky, next_goal].some((v) => (v ?? '').trim().length > 0);
  if (!hasContent) {
    return c.json({ error: 'Add at least one reflection before sending.' }, 400);
  }

  // The batch this report belongs to — the student's most recent active batch.
  const batchRow = await db.query(
    `SELECT batch_id FROM batch_students
      WHERE student_id = $1 AND status = 'active'
      ORDER BY enrolled_at DESC LIMIT 1`,
    [user.id],
  );
  const batchId: number | null = batchRow.rows[0]?.batch_id ?? null;

  const r = await db.query(
    `INSERT INTO weekly_reports (student_id, batch_id, week_start, went_well, tricky, next_goal, mood, photo_url)
     VALUES ($1, $2, ${WEEK_START}, $3, $4, $5, $6, $7)
     ON CONFLICT (student_id, week_start) DO UPDATE SET
       went_well = EXCLUDED.went_well,
       tricky    = EXCLUDED.tricky,
       next_goal = EXCLUDED.next_goal,
       mood      = EXCLUDED.mood,
       photo_url = EXCLUDED.photo_url,
       batch_id  = COALESCE(weekly_reports.batch_id, EXCLUDED.batch_id),
       updated_at = NOW()
     RETURNING *, (xmax = 0) AS is_insert`,
    [user.id, batchId, went_well ?? null, tricky ?? null, next_goal ?? null, mood ?? null, photo_url ?? null],
  );
  const report = r.rows[0];

  // First submission this week → let the batch's teachers know. (An edit doesn't re-notify.)
  if (report.is_insert && batchId) {
    const teachers = await db.query('SELECT teacher_id FROM batch_teachers WHERE batch_id = $1', [batchId]);
    await notifyMany(c.env, db, teachers.rows.map((t) => t.teacher_id), {
      type: 'weekly_report',
      title: `${user.full_name || user.username} shared their weekly report`,
      body: (went_well || next_goal || tricky || '').slice(0, 160),
      linkUrl: '/dashboard/teacher/reports',
    }).catch(() => {});
  }

  delete report.is_insert;
  return c.json({ report }, report ? 201 : 200);
});

// ── Teacher/admin: this week's reports for a batch (every active student) ──────
reports.get('/batch/:batchId', requireAuth, roleGuard('super_admin', 'teacher'), batchMember('batchId'), async (c) => {
  const db = c.get('db');
  const batchId = parseInt(c.req.param('batchId'), 10);
  const r = await db.query(
    `SELECT bs.student_id,
            u.full_name AS student_name, u.username AS student_username, u.avatar_url,
            wr.id AS report_id, wr.went_well, wr.tricky, wr.next_goal, wr.mood, wr.photo_url,
            wr.teacher_comment, wr.cheered_at, wr.commented_at, wr.created_at AS submitted_at
       FROM batch_students bs
       JOIN users u ON u.id = bs.student_id
       LEFT JOIN weekly_reports wr
         ON wr.student_id = bs.student_id AND wr.week_start = ${WEEK_START}
      WHERE bs.batch_id = $1 AND bs.status = 'active' AND u.deleted_at IS NULL
      ORDER BY (wr.id IS NULL), u.full_name NULLS LAST, u.username`,
    [batchId],
  );
  return c.json({ students: r.rows });
});

// Load a report and confirm the caller may give feedback on it (super_admin, or
// a teacher of the report's batch). Returns the report row, or null if not allowed.
async function loadReportForFeedback(c: Context<AppContext>) {
  const db = c.get('db');
  const user = c.get('user')!;
  const id = parseInt(c.req.param('id') ?? '', 10);
  if (Number.isNaN(id)) return { error: 'invalid id' as const };
  const r = await db.query('SELECT * FROM weekly_reports WHERE id = $1', [id]);
  const report = r.rows[0];
  if (!report) return { error: 'not_found' as const };
  if (user.role !== 'super_admin') {
    const owns = await db.query(
      'SELECT 1 FROM batch_teachers WHERE batch_id = $1 AND teacher_id = $2',
      [report.batch_id, user.id],
    );
    if (owns.rows.length === 0) return { error: 'forbidden' as const };
  }
  return { report };
}

// ── Teacher/admin: toggle a cheer on a report ─────────────────────────────────
reports.post('/:id/cheer', requireAuth, roleGuard('super_admin', 'teacher'), async (c) => {
  const db = c.get('db');
  const user = c.get('user')!;
  const found = await loadReportForFeedback(c);
  if ('error' in found) {
    const code = found.error === 'not_found' ? 404 : found.error === 'forbidden' ? 403 : 400;
    return c.json({ error: found.error }, code);
  }
  const existing = found.report;
  const clearing = !!existing.cheered_at;
  const r = await db.query(
    `UPDATE weekly_reports
        SET cheered_at = ${clearing ? 'NULL' : 'NOW()'},
            cheered_by = ${clearing ? 'NULL' : '$2'}
      WHERE id = $1 RETURNING *`,
    clearing ? [existing.id] : [existing.id, user.id],
  );
  if (!clearing) {
    await notifyUser(c.env, db, {
      userId: existing.student_id,
      type: 'weekly_report_feedback',
      title: `${user.full_name || user.username} cheered your weekly report 🎉`,
      linkUrl: '/dashboard/student/report',
    }).catch(() => {});
  }
  return c.json({ report: r.rows[0] });
});

// ── Teacher/admin: add / edit a comment on a report ───────────────────────────
reports.patch('/:id/comment', requireAuth, roleGuard('super_admin', 'teacher'), validateBody(ReportCommentSchema), async (c) => {
  const db = c.get('db');
  const user = c.get('user')!;
  const found = await loadReportForFeedback(c);
  if ('error' in found) {
    const code = found.error === 'not_found' ? 404 : found.error === 'forbidden' ? 403 : 400;
    return c.json({ error: found.error }, code);
  }
  const { comment } = getValid<{ comment: string }>(c);
  const r = await db.query(
    `UPDATE weekly_reports
        SET teacher_comment = $2, commented_by = $3, commented_at = NOW()
      WHERE id = $1 RETURNING *`,
    [found.report.id, comment, user.id],
  );
  await notifyUser(c.env, db, {
    userId: found.report.student_id,
    type: 'weekly_report_feedback',
    title: `${user.full_name || user.username} replied to your weekly report 🌟`,
    body: comment.slice(0, 160),
    linkUrl: '/dashboard/student/report',
  }).catch(() => {});
  return c.json({ report: r.rows[0] });
});

// ── Parent: a linked child's reports ──────────────────────────────────────────
reports.get('/child/:childId', requireAuth, roleGuard('parent', 'super_admin'), async (c) => {
  const db = c.get('db');
  const user = c.get('user')!;
  const childId = parseInt(c.req.param('childId'), 10);
  if (Number.isNaN(childId)) return c.json({ error: 'invalid childId' }, 400);

  if (user.role !== 'super_admin') {
    const link = await db.query(
      'SELECT 1 FROM guardian_students WHERE guardian_id = $1 AND student_id = $2',
      [user.id, childId],
    );
    if (link.rows.length === 0) return c.json({ error: 'Not your child' }, 403);
  }

  const r = await db.query(
    `SELECT wr.*, tu.full_name AS teacher_name, b.name AS batch_name
       FROM weekly_reports wr
       LEFT JOIN users tu ON tu.id = COALESCE(wr.commented_by, wr.cheered_by)
       LEFT JOIN batches b ON b.id = wr.batch_id
      WHERE wr.student_id = $1
      ORDER BY wr.week_start DESC`,
    [childId],
  );
  return c.json({ reports: r.rows });
});

export default reports;
