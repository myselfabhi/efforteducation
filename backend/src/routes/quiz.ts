import { Router, Response } from 'express';
import { z } from 'zod';
import pool from '../db';
import { authMiddleware, roleGuard, AuthRequest } from '../middleware/auth';
import { validateBody, NonEmptyText } from '../lib/validation';

const router = Router();

const CreateQuizSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(4000).optional().nullable(),
  scheduled_at: z.string().optional().nullable(),
  batch_id: z.number().int().positive().optional().nullable(),
  is_practice: z.boolean().optional(),
});

const AddQuestionSchema = z.object({
  question_text: NonEmptyText,
  time_limit: z.number().int().min(5).max(600).optional(),
  explanation: z.string().max(2000).optional().nullable(),
  options: z
    .array(
      z.object({
        option_text: z.string().min(1).max(500),
        is_correct: z.boolean().optional(),
      })
    )
    .length(4),
});

async function userCanWriteToBatch(userId: number, role: string, batchId: number): Promise<boolean> {
  if (role === 'super_admin') return true;
  if (role !== 'teacher') return false;
  const r = await pool.query(
    'SELECT 1 FROM batch_teachers WHERE batch_id = $1 AND teacher_id = $2',
    [batchId, userId]
  );
  return r.rows.length > 0;
}

async function userCanReadQuiz(userId: number, role: string, quizId: number): Promise<boolean> {
  if (role === 'super_admin') return true;
  const q = await pool.query('SELECT batch_id, is_practice, created_by FROM quizzes WHERE id = $1', [quizId]);
  if (q.rows.length === 0) return false;
  const { batch_id, is_practice, created_by } = q.rows[0];
  if (is_practice) return true;
  if (created_by === userId) return true;
  if (!batch_id) return true; // legacy free-floating quiz
  if (role === 'teacher') {
    const r = await pool.query(
      'SELECT 1 FROM batch_teachers WHERE batch_id = $1 AND teacher_id = $2',
      [batch_id, userId]
    );
    return r.rows.length > 0;
  }
  if (role === 'student') {
    const r = await pool.query(
      `SELECT 1 FROM batch_students WHERE batch_id = $1 AND student_id = $2 AND status = 'active'`,
      [batch_id, userId]
    );
    return r.rows.length > 0;
  }
  return false;
}

// POST /api/quizzes — Create quiz (super_admin or teacher of batch)
router.post(
  '/',
  authMiddleware,
  roleGuard('super_admin', 'teacher'),
  validateBody(CreateQuizSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const { title, description, scheduled_at, batch_id, is_practice } = req.body;

      if (batch_id) {
        const ok = await userCanWriteToBatch(req.user!.id, req.user!.role, batch_id);
        if (!ok) return res.status(403).json({ error: 'Not a teacher of this batch' });
      } else if (!is_practice && req.user!.role !== 'super_admin') {
        return res.status(400).json({ error: 'batch_id is required (or set is_practice=true)' });
      }

      const result = await pool.query(
        `INSERT INTO quizzes (title, description, created_by, status, scheduled_at, batch_id, is_practice)
         VALUES ($1, $2, $3, 'DRAFT', $4, $5, $6)
         RETURNING *`,
        [
          title,
          description || null,
          req.user!.id,
          scheduled_at || null,
          batch_id || null,
          !!is_practice,
        ]
      );

      res.status(201).json(result.rows[0]);
    } catch (err: any) {
      console.error('Create quiz error:', err);
      res.status(500).json({ error: 'Failed to create quiz' });
    }
  }
);

// GET /api/quizzes — List quizzes scoped by role/batch
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { role, id: userId } = req.user!;
    const batchFilter = req.query.batch_id ? parseInt(req.query.batch_id as string, 10) : null;

    let query: string;
    let params: any[];

    if (role === 'super_admin') {
      query = `SELECT q.*, u.username AS creator_name,
          (SELECT COUNT(*) FROM questions WHERE quiz_id = q.id) AS question_count
        FROM quizzes q
        JOIN users u ON q.created_by = u.id
        ${batchFilter ? 'WHERE q.batch_id = $1' : ''}
        ORDER BY q.created_at DESC`;
      params = batchFilter ? [batchFilter] : [];
    } else if (role === 'teacher') {
      query = `SELECT q.*, u.username AS creator_name,
          (SELECT COUNT(*) FROM questions WHERE quiz_id = q.id) AS question_count
        FROM quizzes q
        JOIN users u ON q.created_by = u.id
        WHERE q.is_practice = TRUE
           OR q.created_by = $1
           OR q.batch_id IN (SELECT batch_id FROM batch_teachers WHERE teacher_id = $1)
        ORDER BY q.created_at DESC`;
      params = [userId];
    } else {
      query = `SELECT q.*, u.username AS creator_name,
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

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err: any) {
    console.error('List quizzes error:', err);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

// GET /api/quizzes/:id — Get quiz detail with questions
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const quizId = parseInt(req.params.id, 10);

    const ok = await userCanReadQuiz(req.user!.id, req.user!.role, quizId);
    if (!ok) return res.status(403).json({ error: 'Not authorized for this quiz' });

    const quizResult = await pool.query(
      `SELECT q.*, u.username AS creator_name,
       (SELECT COUNT(*) FROM questions WHERE quiz_id = q.id)::int AS question_count
       FROM quizzes q
       LEFT JOIN users u ON u.id = q.created_by
       WHERE q.id = $1`,
      [quizId]
    );
    if (quizResult.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const questionsResult = await pool.query(
      `SELECT q.*, json_agg(
        json_build_object('id', o.id, 'option_text', o.option_text, 'is_correct', o.is_correct, 'option_index', o.option_index)
        ORDER BY o.option_index
       ) AS options
       FROM questions q
       LEFT JOIN options o ON o.question_id = q.id
       WHERE q.quiz_id = $1
       GROUP BY q.id
       ORDER BY q.order_index`,
      [quizId]
    );

    const quiz = quizResult.rows[0];
    const isPrivileged = ['admin', 'super_admin', 'teacher'].includes(req.user!.role) || quiz.created_by === req.user!.id;
    const questions = questionsResult.rows.map((q: any) => ({
      ...q,
      options: q.options.map((o: any) => ({
        ...o,
        is_correct: isPrivileged ? o.is_correct : undefined,
      })),
    }));

    res.json({ ...quiz, questions });
  } catch (err: any) {
    console.error('Get quiz error:', err);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

// POST /api/quizzes/:id/questions — Add question (creator/super_admin, pre-launch)
router.post(
  '/:id/questions',
  authMiddleware,
  roleGuard('super_admin', 'teacher'),
  validateBody(AddQuestionSchema),
  async (req: AuthRequest, res: Response) => {
    const client = await pool.connect();
    try {
      const quizId = parseInt(req.params.id, 10);

      const quizResult = await client.query('SELECT status, created_by FROM quizzes WHERE id = $1', [quizId]);
      if (quizResult.rows.length === 0) {
        return res.status(404).json({ error: 'Quiz not found' });
      }
      const { status, created_by } = quizResult.rows[0];
      if (req.user!.role !== 'super_admin' && created_by !== req.user!.id) {
        return res.status(403).json({ error: 'Only the quiz creator can add questions' });
      }
      if (status !== 'DRAFT' && status !== 'UPCOMING') {
        return res.status(403).json({ error: 'Cannot add questions after quiz is launched' });
      }

      const { question_text, time_limit, explanation, options } = req.body;
      const correctCount = options.filter((o: any) => o.is_correct).length;
      if (correctCount !== 1) {
        return res.status(400).json({ error: 'Exactly one correct option required' });
      }

      await client.query('BEGIN');

      const orderResult = await client.query(
        'SELECT COALESCE(MAX(order_index), -1) + 1 AS next_index FROM questions WHERE quiz_id = $1',
        [quizId]
      );

      const questionResult = await client.query(
        'INSERT INTO questions (quiz_id, question_text, time_limit, order_index, explanation) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [quizId, question_text, time_limit || 30, orderResult.rows[0].next_index, explanation || null]
      );

      const questionId = questionResult.rows[0].id;
      for (let i = 0; i < options.length; i++) {
        await client.query(
          'INSERT INTO options (question_id, option_text, is_correct, option_index) VALUES ($1, $2, $3, $4)',
          [questionId, options[i].option_text, options[i].is_correct || false, i]
        );
      }

      await client.query('COMMIT');

      const fullQuestion = await pool.query(
        `SELECT q.*, json_agg(
          json_build_object('id', o.id, 'option_text', o.option_text, 'is_correct', o.is_correct, 'option_index', o.option_index)
          ORDER BY o.option_index
         ) AS options
         FROM questions q
         LEFT JOIN options o ON o.question_id = q.id
         WHERE q.id = $1
         GROUP BY q.id`,
        [questionId]
      );

      res.status(201).json(fullQuestion.rows[0]);
    } catch (err: any) {
      await client.query('ROLLBACK');
      console.error('Add question error:', err);
      res.status(500).json({ error: 'Failed to add question' });
    } finally {
      client.release();
    }
  }
);

// POST /api/quizzes/:id/launch — Atomic launch
router.post(
  '/:id/launch',
  authMiddleware,
  roleGuard('super_admin', 'teacher'),
  async (req: AuthRequest, res: Response) => {
    try {
      const quizId = parseInt(req.params.id, 10);

      const quizResult = await pool.query('SELECT created_by FROM quizzes WHERE id = $1', [quizId]);
      if (quizResult.rows.length === 0) {
        return res.status(404).json({ error: 'Quiz not found' });
      }
      if (req.user!.role !== 'super_admin' && quizResult.rows[0].created_by !== req.user!.id) {
        return res.status(403).json({ error: 'Only the quiz creator can launch' });
      }

      const questionCount = await pool.query(
        'SELECT COUNT(*) AS count FROM questions WHERE quiz_id = $1',
        [quizId]
      );
      if (parseInt(questionCount.rows[0].count, 10) === 0) {
        return res.status(400).json({ error: 'Cannot launch quiz with no questions' });
      }

      const result = await pool.query(
        `UPDATE quizzes
           SET status = 'LIVE', launched_at = NOW(), updated_at = NOW()
         WHERE id = $1 AND status IN ('DRAFT', 'UPCOMING')
         RETURNING *`,
        [quizId]
      );

      if (result.rows.length === 0) {
        return res.status(409).json({ error: 'Quiz already launched or completed' });
      }

      res.json({ message: 'Quiz launched', quiz: result.rows[0] });
    } catch (err: any) {
      console.error('Launch error:', err);
      res.status(500).json({ error: 'Failed to launch quiz' });
    }
  }
);

// GET /api/quizzes/:id/leaderboard
router.get('/:id/leaderboard', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const quizId = parseInt(req.params.id, 10);

    const ok = await userCanReadQuiz(req.user!.id, req.user!.role, quizId);
    if (!ok) return res.status(403).json({ error: 'Not authorized for this quiz' });

    const result = await pool.query(
      `SELECT s.*, u.username, u.full_name
         FROM scores s
         JOIN users u ON s.user_id = u.id
        WHERE s.quiz_id = $1
        ORDER BY s.total_score DESC, s.total_time_ms ASC`,
      [quizId]
    );

    res.json(result.rows);
  } catch (err: any) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// GET /api/quizzes/:id/results — current user's personal result
router.get('/:id/results', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const quizId = parseInt(req.params.id, 10);
    const userId = req.user!.id;

    const ok = await userCanReadQuiz(userId, req.user!.role, quizId);
    if (!ok) return res.status(403).json({ error: 'Not authorized for this quiz' });

    const scoreResult = await pool.query(
      'SELECT * FROM scores WHERE quiz_id = $1 AND user_id = $2',
      [quizId, userId]
    );

    const responsesResult = await pool.query(
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
      [quizId, userId]
    );

    const totalQResult = await pool.query(
      'SELECT COUNT(*)::int AS total FROM questions WHERE quiz_id = $1',
      [quizId]
    );
    res.json({
      score: scoreResult.rows[0] || null,
      responses: responsesResult.rows,
      total_questions: totalQResult.rows[0].total,
    });
  } catch (err: any) {
    console.error('Results error:', err);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

export default router;
