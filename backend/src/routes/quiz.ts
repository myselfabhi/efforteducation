import { Router, Response } from 'express';
import pool from '../db';
import { authMiddleware, adminOnly, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/quizzes — Create quiz (admin only)
router.post('/', authMiddleware, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, scheduled_at } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });

    const result = await pool.query(
      `INSERT INTO quizzes (title, description, created_by, status, scheduled_at)
       VALUES ($1, $2, $3, 'DRAFT', $4)
       RETURNING *`,
      [title, description || null, req.user!.id, scheduled_at || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error('Create quiz error:', err);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

// GET /api/quizzes — List all quizzes
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT q.*, u.username as creator_name,
        (SELECT COUNT(*) FROM questions WHERE quiz_id = q.id) as question_count
       FROM quizzes q
       JOIN users u ON q.created_by = u.id
       ORDER BY q.created_at DESC`
    );
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

// GET /api/quizzes/:id — Get quiz detail with questions
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const quizId = parseInt(req.params.id);

    const quizResult = await pool.query('SELECT * FROM quizzes WHERE id = $1', [quizId]);
    if (quizResult.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const questionsResult = await pool.query(
      `SELECT q.*, json_agg(
        json_build_object('id', o.id, 'option_text', o.option_text, 'is_correct', o.is_correct, 'option_index', o.option_index)
        ORDER BY o.option_index
       ) as options
       FROM questions q
       LEFT JOIN options o ON o.question_id = q.id
       WHERE q.quiz_id = $1
       GROUP BY q.id
       ORDER BY q.order_index`,
      [quizId]
    );

    const quiz = quizResult.rows[0];
    // Only show correct answers to admin
    const questions = questionsResult.rows.map((q: any) => ({
      ...q,
      options: q.options.map((o: any) => ({
        ...o,
        is_correct: req.user!.role === 'admin' ? o.is_correct : undefined,
      })),
    }));

    res.json({ ...quiz, questions });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

// POST /api/quizzes/:id/questions — Add question with options (admin, pre-launch only)
router.post('/:id/questions', authMiddleware, adminOnly, async (req: AuthRequest, res: Response) => {
  const client = await pool.connect();
  try {
    const quizId = parseInt(req.params.id);

    // Check quiz exists and is not launched
    const quizResult = await client.query('SELECT status FROM quizzes WHERE id = $1', [quizId]);
    if (quizResult.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    if (quizResult.rows[0].status !== 'DRAFT' && quizResult.rows[0].status !== 'UPCOMING') {
      return res.status(403).json({ error: 'Cannot add questions after quiz is launched' });
    }

    const { question_text, time_limit, options } = req.body;
    if (!question_text || !options || options.length !== 4) {
      return res.status(400).json({ error: 'question_text and exactly 4 options required' });
    }

    const correctCount = options.filter((o: any) => o.is_correct).length;
    if (correctCount !== 1) {
      return res.status(400).json({ error: 'Exactly one correct option required' });
    }

    await client.query('BEGIN');

    // Get next order_index
    const orderResult = await client.query(
      'SELECT COALESCE(MAX(order_index), -1) + 1 as next_index FROM questions WHERE quiz_id = $1',
      [quizId]
    );

    const questionResult = await client.query(
      'INSERT INTO questions (quiz_id, question_text, time_limit, order_index) VALUES ($1, $2, $3, $4) RETURNING *',
      [quizId, question_text, time_limit || 30, orderResult.rows[0].next_index]
    );

    const questionId = questionResult.rows[0].id;

    for (let i = 0; i < options.length; i++) {
      await client.query(
        'INSERT INTO options (question_id, option_text, is_correct, option_index) VALUES ($1, $2, $3, $4)',
        [questionId, options[i].option_text, options[i].is_correct || false, i]
      );
    }

    await client.query('COMMIT');

    // Fetch full question with options
    const fullQuestion = await pool.query(
      `SELECT q.*, json_agg(
        json_build_object('id', o.id, 'option_text', o.option_text, 'is_correct', o.is_correct, 'option_index', o.option_index)
        ORDER BY o.option_index
       ) as options
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
});

// POST /api/quizzes/:id/launch — Atomic launch with UPCOMING→LIVE guard
router.post('/:id/launch', authMiddleware, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const quizId = parseInt(req.params.id);

    // First, ensure quiz has questions
    const questionCount = await pool.query(
      'SELECT COUNT(*) as count FROM questions WHERE quiz_id = $1',
      [quizId]
    );
    if (parseInt(questionCount.rows[0].count) === 0) {
      return res.status(400).json({ error: 'Cannot launch quiz with no questions' });
    }

    // Atomic status transition: DRAFT/UPCOMING → LIVE
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
});

// GET /api/quizzes/:id/leaderboard — Final leaderboard
router.get('/:id/leaderboard', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const quizId = parseInt(req.params.id);

    const result = await pool.query(
      `SELECT s.*, u.username
       FROM scores s
       JOIN users u ON s.user_id = u.id
       WHERE s.quiz_id = $1
       ORDER BY s.total_score DESC, s.total_time_ms ASC`,
      [quizId]
    );

    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// GET /api/quizzes/:id/results — User's personal result
router.get('/:id/results', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const quizId = parseInt(req.params.id);
    const userId = req.user!.id;

    const scoreResult = await pool.query(
      'SELECT * FROM scores WHERE quiz_id = $1 AND user_id = $2',
      [quizId, userId]
    );

    const responsesResult = await pool.query(
      `SELECT r.*, q.question_text, o.option_text as selected_option
       FROM responses r
       JOIN questions q ON r.question_id = q.id
       LEFT JOIN options o ON r.selected_option_id = o.id
       WHERE r.quiz_id = $1 AND r.user_id = $2
       ORDER BY q.order_index`,
      [quizId, userId]
    );

    res.json({
      score: scoreResult.rows[0] || null,
      responses: responsesResult.rows,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

export default router;
