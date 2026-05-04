import { Router, Response, Request } from 'express';
import pool from '../db';
import { authMiddleware, roleGuard, AuthRequest } from '../middleware/auth';
import { CreateCourseSchema, validateBody } from '../lib/validation';

const router = Router();

// GET /api/courses — public list (only published)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const r = await pool.query(
      `SELECT * FROM courses WHERE is_published = TRUE ORDER BY created_at DESC`
    );
    res.json(r.rows);
  } catch (err) {
    console.error('GET /courses error', err);
    res.status(500).json({ error: 'Failed to list courses' });
  }
});

// GET /api/courses/admin — super_admin sees all (drafts included)
router.get('/admin', authMiddleware, roleGuard('super_admin'), async (_req: AuthRequest, res: Response) => {
  try {
    const r = await pool.query(`SELECT * FROM courses ORDER BY created_at DESC`);
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list courses' });
  }
});

// GET /api/courses/:slug — public
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const r = await pool.query(`SELECT * FROM courses WHERE slug = $1`, [req.params.slug]);
    if (r.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(r.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load course' });
  }
});

// POST /api/courses
router.post(
  '/',
  authMiddleware,
  roleGuard('super_admin'),
  validateBody(CreateCourseSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const { slug, title, category, description, duration_months, price_inr, hero_image_url, highlights, is_published } = req.body;
      const r = await pool.query(
        `INSERT INTO courses (slug, title, category, description, duration_months, price_inr, hero_image_url, highlights, is_published)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [slug, title, category, description ?? null, duration_months ?? null, price_inr ?? null, hero_image_url ?? null, highlights ?? null, is_published ?? false]
      );
      res.status(201).json(r.rows[0]);
    } catch (err: any) {
      if (err.code === '23505') return res.status(409).json({ error: 'Slug already exists' });
      console.error('POST /courses error', err);
      res.status(500).json({ error: 'Failed to create course' });
    }
  }
);

// PATCH /api/courses/:id
router.patch(
  '/:id',
  authMiddleware,
  roleGuard('super_admin'),
  async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const fields = ['title', 'category', 'description', 'duration_months', 'price_inr', 'hero_image_url', 'highlights', 'is_published', 'slug'];
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
        `UPDATE courses SET ${set.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
        values
      );
      if (r.rows.length === 0) return res.status(404).json({ error: 'Not found' });
      res.json(r.rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update course' });
    }
  }
);

// DELETE /api/courses/:id
router.delete('/:id', authMiddleware, roleGuard('super_admin'), async (req: AuthRequest, res: Response) => {
  try {
    await pool.query('DELETE FROM courses WHERE id = $1', [parseInt(req.params.id, 10)]);
    res.status(204).end();
  } catch (err: any) {
    if (err.code === '23503') return res.status(409).json({ error: 'Course is in use by batches' });
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

export default router;
