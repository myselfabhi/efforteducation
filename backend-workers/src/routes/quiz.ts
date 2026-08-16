import { Hono } from 'hono';
import { z } from 'zod';
import type { Pool } from 'pg';
import type { AppContext } from '../types';
import { requireAuth, roleGuard } from '../middleware/auth';
import { validateBody, getValid, NonEmptyText } from '../lib/validation';

const quiz = new Hono<AppContext>();

const CreateQuizSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(4000).optional().nullable(),
  scheduled_at: z.string().optional().nullable(),
  batch_id: z.number().int().positive().optional().nullable(),
  is_practice: z.boolean().optional(),
  answer_grace_period_ms: z.number().int().min(0).max(10_000).optional(),
});

const AddQuestionSchema = z.object({
  question_text: NonEmptyText,
  time_limit: z.number().int().min(5).max(600).optional(),
  explanation: z.string().max(2000).optional().nullable(),
  options: z
    .array(z.object({ option_text: z.string().min(1).max(500), is_correct: z.boolean().optional() }))
    .length(4),
});

async function userCanWriteToBatch(db: Pool, userId: number, role: string, batchId: number): Promise<boolean> {
  if (role === 'super_admin') return true;
  if (role !== 'teacher') return false;
  const r = await db.query('SELECT 1 FROM batch_teachers WHERE batch_id = $1 AND teacher_id = $2', [batchId, userId]);
  return r.rows.length > 0;
}

async function userCanReadQuiz(db: Pool, userId: number, role: string, quizId: number): Promise<boolean> {
  if (role === 'super_admin') return true;
  const q = await db.query('SELECT batch_id, is_practice, created_by FROM quizzes WHERE id = $1', [quizId]);
  if (q.rows.length === 0) return false;
  const { batch_id, is_practice, created_by } = q.rows[0];
  if (is_practice) return true;
  if (created_by === userId) return true;
  if (!batch_id) return true; // legacy free-floating quiz
  if (role === 'teacher') {
    const r = await db.query('SELECT 1 FROM batch_teachers WHERE batch_id = $1 AND teacher_id = $2', [batch_id, userId]);
    return r.rows.length > 0;
  }
  if (role === 'student') {
    const r = await db.query(
      `SELECT 1 FROM batch_students WHERE batch_id = $1 AND student_id = $2 AND status = 'active'`,
      [batch_id, userId],
    );
    return r.rows.length > 0;
  }
  return false;
}

// POST /api/quizzes — Create quiz (super_admin or teacher of batch)
quiz.post('/', requireAuth, roleGuard('super_admin', 'teacher'), validateBody(CreateQuizSchema), async (c) => {
  try {
    const { title, description, scheduled_at, batch_id, is_practice, answer_grace_period_ms } = getValid<{
      title: string;
      description?: string | null;
      scheduled_at?: string | null;
      batch_id?: number | null;
      is_practice?: boolean;
      answer_grace_period_ms?: number;
    }>(c);
    const db = c.get('db');
    const user = c.get('user')!;

    if (batch_id) {
      const ok = await userCanWriteToBatch(db, user.id, user.role, batch_id);
      if (!ok) return c.json({ error: 'Not a teacher of this batch' }, 403);
    } else if (!is_practice && user.role !== 'super_admin') {
      return c.json({ error: 'batch_id is required (or set is_practice=true)' }, 400);
    }

    const grace = Math.max(0, Math.min(10_000, Number(answer_grace_period_ms ?? 3000)));

    const result = await db.query(
      `INSERT INTO quizzes (title, description, created_by, status, scheduled_at, batch_id, is_practice, answer_grace_period_ms)
       VALUES ($1, $2, $3, 'DRAFT', $4, $5, $6, $7)
       RETURNING *`,
      [title, description || null, user.id, scheduled_at || null, batch_id || null, !!is_practice, grace],
    );
    return c.json(result.rows[0], 201);
  } catch (err) {
    console.error('Create quiz error:', err);
    return c.json({ error: 'Failed to create quiz' }, 500);
  }
});

// GET /api/quizzes — List quizzes scoped by role/batch
quiz.get('/', requireAuth, async (c) => {
  try {
    const db = c.get('db');
    const { role, id: userId } = c.get('user')!;
    const batchFilter = c.req.query('batch_id') ? parseInt(c.req.query('batch_id')!, 10) : null;

    let query: string;
    let params: unknown[];

    if (role === 'super_admin') {
      query = `SELECT q.*, COALESCE(u.full_name, u.username) AS creator_name,
          (SELECT COUNT(*) FROM questions WHERE quiz_id = q.id) AS question_count
        FROM quizzes q
        JOIN users u ON q.created_by = u.id
        ${batchFilter ? 'WHERE q.batch_id = $1' : ''}
        ORDER BY q.created_at DESC`;
      params = batchFilter ? [batchFilter] : [];
    } else if (role === 'teacher') {
      query = `SELECT q.*, COALESCE(u.full_name, u.username) AS creator_name,
          (SELECT COUNT(*) FROM questions WHERE quiz_id = q.id) AS question_count
        FROM quizzes q
        JOIN users u ON q.created_by = u.id
        WHERE q.is_practice = TRUE
           OR q.created_by = $1
           OR q.batch_id IN (SELECT batch_id FROM batch_teachers WHERE teacher_id = $1)
        ORDER BY q.created_at DESC`;
      params = [userId];
    } else {
      query = `SELECT q.*, COALESCE(u.full_name, u.username) AS creator_name,
          (SELECT COUNT(*) FROM questions WHERE quiz_id = q.id) AS question_count
        FROM quizzes q
        JOIN users u ON q.created_by = u.id
        WHERE q.is_practice = TRUE
           OR q.batch_id IN (
              SELECT batch_id FROM batch_students WHERE student_id = $1 AND status = 'active'
           )
        ORDER BY q.created_at DESC`;
      params = [userId];
    }

    const result = await db.query(query, params);
    return c.json(result.rows);
  } catch (err) {
    console.error('List quizzes error:', err);
    return c.json({ error: 'Failed to fetch quizzes' }, 500);
  }
});

// GET /api/quizzes/:id — Get quiz detail with questions
quiz.get('/:id', requireAuth, async (c) => {
  try {
    const db = c.get('db');
    const user = c.get('user')!;
    const quizId = parseInt(c.req.param('id'), 10);

    const ok = await userCanReadQuiz(db, user.id, user.role, quizId);
    if (!ok) return c.json({ error: 'Not authorized for this quiz' }, 403);

    const quizResult = await db.query(
      `SELECT q.*, COALESCE(u.full_name, u.username) AS creator_name,
       (SELECT COUNT(*) FROM questions WHERE quiz_id = q.id)::int AS question_count
       FROM quizzes q
       LEFT JOIN users u ON u.id = q.created_by
       WHERE q.id = $1`,
      [quizId],
    );
    if (quizResult.rows.length === 0) return c.json({ error: 'Quiz not found' }, 404);

    const questionsResult = await db.query(
      `SELECT q.*, json_agg(
        json_build_object('id', o.id, 'option_text', o.option_text, 'is_correct', o.is_correct, 'option_index', o.option_index)
        ORDER BY o.option_index
       ) AS options
       FROM questions q
       LEFT JOIN options o ON o.question_id = q.id
       WHERE q.quiz_id = $1
       GROUP BY q.id
       ORDER BY q.order_index`,
      [quizId],
    );

    const quizRow = quizResult.rows[0];
    const isPrivileged =
      ['admin', 'super_admin', 'teacher'].includes(user.role) || quizRow.created_by === user.id;
    const questions = questionsResult.rows.map((q: { options: { is_correct?: boolean }[] }) => ({
      ...q,
      options: q.options.map((o) => ({ ...o, is_correct: isPrivileged ? o.is_correct : undefined })),
    }));

    return c.json({ ...quizRow, questions });
  } catch (err) {
    console.error('Get quiz error:', err);
    return c.json({ error: 'Failed to fetch quiz' }, 500);
  }
});

// POST /api/quizzes/:id/questions — Add question (creator/super_admin, pre-launch)
quiz.post('/:id/questions', requireAuth, roleGuard('super_admin', 'teacher'), validateBody(AddQuestionSchema), async (c) => {
  const db = c.get('db');
  const user = c.get('user')!;
  const client = await db.connect();
  try {
    const quizId = parseInt(c.req.param('id'), 10);

    const quizResult = await client.query('SELECT status, created_by FROM quizzes WHERE id = $1', [quizId]);
    if (quizResult.rows.length === 0) return c.json({ error: 'Quiz not found' }, 404);
    const { status, created_by } = quizResult.rows[0];
    if (user.role !== 'super_admin' && created_by !== user.id) {
      return c.json({ error: 'Only the quiz creator can add questions' }, 403);
    }
    if (status !== 'DRAFT' && status !== 'UPCOMING') {
      return c.json({ error: 'Cannot add questions after quiz is launched' }, 403);
    }

    const { question_text, time_limit, explanation, options } = getValid<{
      question_text: string;
      time_limit?: number;
      explanation?: string | null;
      options: { option_text: string; is_correct?: boolean }[];
    }>(c);
    const correctCount = options.filter((o) => o.is_correct).length;
    if (correctCount !== 1) return c.json({ error: 'Exactly one correct option required' }, 400);

    await client.query('BEGIN');

    const orderResult = await client.query(
      'SELECT COALESCE(MAX(order_index), -1) + 1 AS next_index FROM questions WHERE quiz_id = $1',
      [quizId],
    );

    const questionResult = await client.query(
      'INSERT INTO questions (quiz_id, question_text, time_limit, order_index, explanation) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [quizId, question_text, time_limit || 30, orderResult.rows[0].next_index, explanation || null],
    );

    const questionId = questionResult.rows[0].id;
    for (let i = 0; i < options.length; i++) {
      await client.query(
        'INSERT INTO options (question_id, option_text, is_correct, option_index) VALUES ($1, $2, $3, $4)',
        [questionId, options[i].option_text, options[i].is_correct || false, i],
      );
    }

    await client.query('COMMIT');

    const fullQuestion = await db.query(
      `SELECT q.*, json_agg(
        json_build_object('id', o.id, 'option_text', o.option_text, 'is_correct', o.is_correct, 'option_index', o.option_index)
        ORDER BY o.option_index
       ) AS options
       FROM questions q
       LEFT JOIN options o ON o.question_id = q.id
       WHERE q.id = $1
       GROUP BY q.id`,
      [questionId],
    );

    return c.json(fullQuestion.rows[0], 201);
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Add question error:', err);
    return c.json({ error: 'Failed to add question' }, 500);
  } finally {
    client.release();
  }
});

// POST /api/quizzes/:id/launch — Atomic launch
quiz.post('/:id/launch', requireAuth, roleGuard('super_admin', 'teacher'), async (c) => {
  try {
    const db = c.get('db');
    const user = c.get('user')!;
    const quizId = parseInt(c.req.param('id'), 10);

    const quizResult = await db.query('SELECT created_by FROM quizzes WHERE id = $1', [quizId]);
    if (quizResult.rows.length === 0) return c.json({ error: 'Quiz not found' }, 404);
    if (user.role !== 'super_admin' && quizResult.rows[0].created_by !== user.id) {
      return c.json({ error: 'Only the quiz creator can launch' }, 403);
    }

    const questionCount = await db.query('SELECT COUNT(*) AS count FROM questions WHERE quiz_id = $1', [quizId]);
    if (parseInt(questionCount.rows[0].count, 10) === 0) {
      return c.json({ error: 'Cannot launch quiz with no questions' }, 400);
    }

    const result = await db.query(
      `UPDATE quizzes
         SET status = 'LIVE', launched_at = NOW(), updated_at = NOW()
       WHERE id = $1 AND status IN ('DRAFT', 'UPCOMING')
       RETURNING *`,
      [quizId],
    );

    if (result.rows.length === 0) return c.json({ error: 'Quiz already launched or completed' }, 409);

    return c.json({ message: 'Quiz launched', quiz: result.rows[0] });
  } catch (err) {
    console.error('Launch error:', err);
    return c.json({ error: 'Failed to launch quiz' }, 500);
  }
});

// GET /api/quizzes/:id/leaderboard
quiz.get('/:id/leaderboard', requireAuth, async (c) => {
  try {
    const db = c.get('db');
    const user = c.get('user')!;
    const quizId = parseInt(c.req.param('id'), 10);

    const ok = await userCanReadQuiz(db, user.id, user.role, quizId);
    if (!ok) return c.json({ error: 'Not authorized for this quiz' }, 403);

    const result = await db.query(
      `SELECT s.*, u.username, u.full_name
         FROM scores s
         JOIN users u ON s.user_id = u.id
        WHERE s.quiz_id = $1
        ORDER BY s.total_score DESC, s.total_time_ms ASC`,
      [quizId],
    );
    return c.json(result.rows);
  } catch (err) {
    console.error('Leaderboard error:', err);
    return c.json({ error: 'Failed to fetch leaderboard' }, 500);
  }
});

// GET /api/quizzes/:id/results — current user's personal result
quiz.get('/:id/results', requireAuth, async (c) => {
  try {
    const db = c.get('db');
    const user = c.get('user')!;
    const quizId = parseInt(c.req.param('id'), 10);

    const ok = await userCanReadQuiz(db, user.id, user.role, quizId);
    if (!ok) return c.json({ error: 'Not authorized for this quiz' }, 403);

    const scoreResult = await db.query('SELECT * FROM scores WHERE quiz_id = $1 AND user_id = $2', [quizId, user.id]);

    const responsesResult = await db.query(
      `SELECT r.*,
              q.question_text,
              q.explanation,
              o.option_text       AS selected_option,
              correct_o.option_text AS correct_option
         FROM responses r
         JOIN questions q ON r.question_id = q.id
         LEFT JOIN options o ON r.selected_option_id = o.id
         LEFT JOIN options correct_o
                ON correct_o.question_id = q.id
               AND correct_o.is_correct = TRUE
        WHERE r.quiz_id = $1 AND r.user_id = $2
        ORDER BY q.order_index`,
      [quizId, user.id],
    );

    const totalQResult = await db.query('SELECT COUNT(*)::int AS total FROM questions WHERE quiz_id = $1', [quizId]);
    return c.json({
      score: scoreResult.rows[0] || null,
      responses: responsesResult.rows,
      total_questions: totalQResult.rows[0].total,
    });
  } catch (err) {
    console.error('Results error:', err);
    return c.json({ error: 'Failed to fetch results' }, 500);
  }
});

export default quiz;
