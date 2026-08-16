import { Hono } from 'hono';
import type { AppContext } from '../types';
import { requireAuth, roleGuard } from '../middleware/auth';
import { CreateCourseSchema, validateBody, getValid } from '../lib/validation';

const courses = new Hono<AppContext>();

// GET /api/courses — public list (only published)
courses.get('/', async (c) => {
  try {
    const r = await c.get('db').query(`SELECT * FROM courses WHERE is_published = TRUE ORDER BY created_at DESC`);
    return c.json(r.rows);
  } catch (err) {
    console.error('GET /courses error', err);
    return c.json({ error: 'Failed to list courses' }, 500);
  }
});

// GET /api/courses/admin — super_admin sees all (drafts included)
courses.get('/admin', requireAuth, roleGuard('super_admin'), async (c) => {
  try {
    const r = await c.get('db').query(`SELECT * FROM courses ORDER BY created_at DESC`);
    return c.json(r.rows);
  } catch {
    return c.json({ error: 'Failed to list courses' }, 500);
  }
});

// GET /api/courses/:slug — public
courses.get('/:slug', async (c) => {
  try {
    const r = await c.get('db').query(`SELECT * FROM courses WHERE slug = $1`, [c.req.param('slug')]);
    if (r.rows.length === 0) return c.json({ error: 'Not found' }, 404);
    return c.json(r.rows[0]);
  } catch {
    return c.json({ error: 'Failed to load course' }, 500);
  }
});

// GET /api/courses/:slug/batches — public batch catalog for "request to join"
courses.get('/:slug/batches', async (c) => {
  try {
    const r = await c.get('db').query(
      `SELECT
          b.id, b.name, b.start_date, b.end_date, b.schedule_description,
          b.capacity, b.status,
          (SELECT COUNT(*)::INTEGER FROM batch_students bs
             WHERE bs.batch_id = b.id AND bs.status = 'active') AS enrolled_count,
          (SELECT json_agg(json_build_object(
             'id', u.id, 'full_name', u.full_name, 'username', u.username,
             'avatar_url', u.avatar_url, 'is_primary', bt.is_primary))
             FROM batch_teachers bt JOIN users u ON u.id = bt.teacher_id
            WHERE bt.batch_id = b.id) AS teachers
         FROM batches b
         JOIN courses c ON c.id = b.course_id
        WHERE c.slug = $1 AND b.status IN ('upcoming', 'active')
        ORDER BY b.start_date ASC`,
      [c.req.param('slug')],
    );
    return c.json(r.rows);
  } catch (err) {
    console.error('GET /courses/:slug/batches error', err);
    return c.json({ error: 'Failed to load batches' }, 500);
  }
});

// POST /api/courses
courses.post('/', requireAuth, roleGuard('super_admin'), validateBody(CreateCourseSchema), async (c) => {
  try {
    const { slug, title, category, description, duration_months, price_inr, hero_image_url, highlights, is_published } =
      getValid<Record<string, unknown>>(c);
    const r = await c.get('db').query(
      `INSERT INTO courses (slug, title, category, description, duration_months, price_inr, hero_image_url, highlights, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [slug, title, category, description ?? null, duration_months ?? null, price_inr ?? null, hero_image_url ?? null, highlights ?? null, is_published ?? false],
    );
    return c.json(r.rows[0], 201);
  } catch (err) {
    if ((err as { code?: string }).code === '23505') return c.json({ error: 'Slug already exists' }, 409);
    console.error('POST /courses error', err);
    return c.json({ error: 'Failed to create course' }, 500);
  }
});

// PATCH /api/courses/:id
courses.patch('/:id', requireAuth, roleGuard('super_admin'), async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
    const fields = ['title', 'category', 'description', 'duration_months', 'price_inr', 'hero_image_url', 'highlights', 'is_published', 'slug'];
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
    const r = await c.get('db').query(
      `UPDATE courses SET ${set.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
      values,
    );
    if (r.rows.length === 0) return c.json({ error: 'Not found' }, 404);
    return c.json(r.rows[0]);
  } catch {
    return c.json({ error: 'Failed to update course' }, 500);
  }
});

// DELETE /api/courses/:id
courses.delete('/:id', requireAuth, roleGuard('super_admin'), async (c) => {
  try {
    await c.get('db').query('DELETE FROM courses WHERE id = $1', [parseInt(c.req.param('id'), 10)]);
    return c.body(null, 204);
  } catch (err) {
    if ((err as { code?: string }).code === '23503') return c.json({ error: 'Course is in use by batches' }, 409);
    return c.json({ error: 'Failed to delete course' }, 500);
  }
});

export default courses;
