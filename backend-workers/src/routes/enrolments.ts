import { Hono } from 'hono';
import type { AppContext } from '../types';
import { requireAuth, roleGuard } from '../middleware/auth';

const enrolments = new Hono<AppContext>();

// GET /api/enrolment-requests?status=pending|approved|declined|cancelled|all
// A cross-batch queue (the per-batch list + approve/decline already live under
// /api/batches/:id/enrolment-requests). super_admin sees all; a teacher sees
// requests for batches they teach. Act on a row with the existing per-batch
// PATCH /api/batches/:batchId/enrolment-requests/:id.
enrolments.get('/', requireAuth, roleGuard('super_admin', 'teacher'), async (c) => {
  const db = c.get('db');
  const user = c.get('user')!;
  const status = c.req.query('status') || 'pending';

  const params: unknown[] = [];
  const conds: string[] = [];
  if (status !== 'all') {
    params.push(status);
    conds.push(`req.status = $${params.length}`);
  }
  if (user.role !== 'super_admin') {
    params.push(user.id);
    conds.push(`b.id IN (SELECT batch_id FROM batch_teachers WHERE teacher_id = $${params.length})`);
  }
  const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';

  const r = await db.query(
    `SELECT req.id, req.batch_id, req.student_id, req.status, req.message,
            req.requested_at, req.note,
            u.full_name AS student_full_name, u.username AS student_username,
            u.email AS student_email, u.avatar_url AS student_avatar_url,
            b.name AS batch_name, b.capacity,
            (SELECT COUNT(*)::int FROM batch_students bs
              WHERE bs.batch_id = b.id AND bs.status = 'active') AS enrolled_count,
            c.title AS course_title
       FROM batch_enrolment_requests req
       JOIN users u   ON u.id = req.student_id
       JOIN batches b ON b.id = req.batch_id
       JOIN courses c ON c.id = b.course_id
       ${where}
      ORDER BY req.status = 'pending' DESC, req.requested_at DESC
      LIMIT 300`,
    params,
  );
  return c.json({ requests: r.rows });
});

export default enrolments;
