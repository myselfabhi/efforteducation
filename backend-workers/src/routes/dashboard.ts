import { Hono } from 'hono';
import type { AppContext } from '../types';
import { requireAuth, roleGuard } from '../middleware/auth';

const dashboard = new Hono<AppContext>();

// GET /api/dashboard/super-admin
dashboard.get('/super-admin', requireAuth, roleGuard('super_admin'), async (c) => {
  try {
    const db = c.get('db');
    const [users, batches, courses, classesToday, quizzesLive, attendance] = await Promise.all([
      db.query(`SELECT role, COUNT(*)::INT AS count FROM users WHERE deleted_at IS NULL GROUP BY role`),
      db.query(`SELECT status, COUNT(*)::INT AS count FROM batches GROUP BY status`),
      db.query(`SELECT COUNT(*)::INT AS count FROM courses`),
      db.query(`SELECT COUNT(*)::INT AS count FROM live_classes WHERE scheduled_start::date = CURRENT_DATE`),
      db.query(`SELECT COUNT(*)::INT AS count FROM quizzes WHERE status = 'LIVE'`),
      db.query(
        `SELECT COUNT(DISTINCT user_id)::INT AS count
           FROM live_class_attendance
          WHERE joined_at > NOW() - INTERVAL '7 days'`,
      ),
    ]);
    return c.json({
      users_by_role: users.rows,
      batches_by_status: batches.rows,
      total_courses: courses.rows[0].count,
      classes_today: classesToday.rows[0].count,
      live_quizzes: quizzesLive.rows[0].count,
      active_users_7d: attendance.rows[0].count,
    });
  } catch (err) {
    console.error('super-admin dash err', err);
    return c.json({ error: 'Failed to load dashboard' }, 500);
  }
});

// GET /api/dashboard/teacher
dashboard.get('/teacher', requireAuth, roleGuard('super_admin', 'teacher'), async (c) => {
  try {
    const db = c.get('db');
    const userId = c.get('user')!.id;
    const [batches, upcoming, recentMaterials, recentQuizzes] = await Promise.all([
      db.query(
        `SELECT b.id, b.name, c.title AS course_title,
                (SELECT COUNT(*) FROM batch_students WHERE batch_id = b.id AND status = 'active')::INT AS student_count
           FROM batches b
           JOIN courses c ON c.id = b.course_id
          WHERE b.id IN (SELECT batch_id FROM batch_teachers WHERE teacher_id = $1)
          ORDER BY b.start_date DESC LIMIT 8`,
        [userId],
      ),
      db.query(
        `SELECT lc.id, lc.title, lc.scheduled_start, lc.status, b.name AS batch_name
           FROM live_classes lc JOIN batches b ON b.id = lc.batch_id
          WHERE lc.scheduled_start > NOW() - INTERVAL '1 day'
            AND (lc.teacher_id = $1 OR lc.batch_id IN (SELECT batch_id FROM batch_teachers WHERE teacher_id = $1))
          ORDER BY lc.scheduled_start LIMIT 8`,
        [userId],
      ),
      db.query(
        `SELECT m.id, m.title, m.type, m.created_at, b.name AS batch_name
           FROM materials m JOIN batches b ON b.id = m.batch_id
          WHERE m.uploaded_by = $1 ORDER BY m.created_at DESC LIMIT 5`,
        [userId],
      ),
      db.query(
        `SELECT q.id, q.title, q.status, q.created_at, b.name AS batch_name
           FROM quizzes q LEFT JOIN batches b ON b.id = q.batch_id
          WHERE q.created_by = $1 ORDER BY q.created_at DESC LIMIT 5`,
        [userId],
      ),
    ]);
    return c.json({
      batches: batches.rows,
      upcoming_classes: upcoming.rows,
      recent_materials: recentMaterials.rows,
      recent_quizzes: recentQuizzes.rows,
    });
  } catch (err) {
    console.error('teacher dash err', err);
    return c.json({ error: 'Failed to load dashboard' }, 500);
  }
});

// GET /api/dashboard/student
dashboard.get('/student', requireAuth, roleGuard('super_admin', 'student'), async (c) => {
  try {
    const db = c.get('db');
    const userId = c.get('user')!.id;
    const [batches, upcoming, recentMaterials, scores] = await Promise.all([
      db.query(
        `SELECT b.id, b.name, c.title AS course_title, b.schedule_description
           FROM batches b
           JOIN courses c ON c.id = b.course_id
          WHERE b.id IN (SELECT batch_id FROM batch_students WHERE student_id = $1 AND status = 'active')
          ORDER BY b.start_date DESC LIMIT 8`,
        [userId],
      ),
      db.query(
        `SELECT lc.id, lc.title, lc.scheduled_start, lc.status, b.name AS batch_name
           FROM live_classes lc JOIN batches b ON b.id = lc.batch_id
          WHERE lc.status IN ('SCHEDULED','LIVE')
            AND lc.scheduled_start > NOW() - INTERVAL '1 day'
            AND lc.batch_id IN (SELECT batch_id FROM batch_students WHERE student_id = $1 AND status = 'active')
          ORDER BY lc.scheduled_start LIMIT 8`,
        [userId],
      ),
      db.query(
        `SELECT m.id, m.title, m.type, m.created_at, b.name AS batch_name
           FROM materials m JOIN batches b ON b.id = m.batch_id
          WHERE m.batch_id IN (SELECT batch_id FROM batch_students WHERE student_id = $1 AND status = 'active')
          ORDER BY m.created_at DESC LIMIT 5`,
        [userId],
      ),
      db.query(
        `SELECT s.quiz_id, s.total_score, s.rank, q.title
           FROM scores s JOIN quizzes q ON q.id = s.quiz_id
          WHERE s.user_id = $1 ORDER BY s.created_at DESC LIMIT 5`,
        [userId],
      ),
    ]);
    return c.json({
      batches: batches.rows,
      upcoming_classes: upcoming.rows,
      recent_materials: recentMaterials.rows,
      recent_scores: scores.rows,
    });
  } catch (err) {
    console.error('student dash err', err);
    return c.json({ error: 'Failed to load dashboard' }, 500);
  }
});

export default dashboard;
