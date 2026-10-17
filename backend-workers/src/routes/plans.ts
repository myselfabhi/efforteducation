import { Hono } from 'hono';
import type { AppContext } from '../types';
import { requireAuth, roleGuard } from '../middleware/auth';
import { CreatePlanSchema, validateBody, getValid } from '../lib/validation';

const plans = new Hono<AppContext>();

// All plan management is super_admin only (the "counsellor"/admin actor).
plans.use('*', requireAuth, roleGuard('super_admin'));

// GET /api/plans — every plan (active + archived), newest first.
plans.get('/', async (c) => {
  try {
    const r = await c.get('db').query(
      `SELECT p.*, co.title AS course_title
         FROM payment_plans p
         LEFT JOIN courses co ON co.id = p.course_id
        ORDER BY p.active DESC, p.created_at DESC`,
    );
    return c.json(r.rows);
  } catch (err) {
    console.error('GET /plans error', err);
    return c.json({ error: 'Failed to list plans' }, 500);
  }
});

// POST /api/plans — create a plan.
plans.post('/', validateBody(CreatePlanSchema), async (c) => {
  try {
    const { name, description, amount_paise, interval_label, course_id, active } =
      getValid<Record<string, unknown>>(c);
    const r = await c.get('db').query(
      `INSERT INTO payment_plans (name, description, amount_paise, interval_label, course_id, active, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, description ?? null, amount_paise, interval_label ?? null, course_id ?? null, active ?? true, c.get('user')!.id],
    );
    return c.json(r.rows[0], 201);
  } catch (err) {
    console.error('POST /plans error', err);
    return c.json({ error: 'Failed to create plan' }, 500);
  }
});

// PATCH /api/plans/:id — update selected fields.
plans.patch('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
    const fields = ['name', 'description', 'amount_paise', 'interval_label', 'course_id', 'active'];
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
      `UPDATE payment_plans SET ${set.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
      values,
    );
    if (r.rows.length === 0) return c.json({ error: 'Not found' }, 404);
    return c.json(r.rows[0]);
  } catch (err) {
    console.error('PATCH /plans/:id error', err);
    return c.json({ error: 'Failed to update plan' }, 500);
  }
});

// DELETE /api/plans/:id — remove an unused plan; archive instead if it's in use.
plans.delete('/:id', async (c) => {
  try {
    await c.get('db').query('DELETE FROM payment_plans WHERE id = $1', [parseInt(c.req.param('id'), 10)]);
    return c.body(null, 204);
  } catch (err) {
    if ((err as { code?: string }).code === '23503') {
      return c.json({ error: 'Plan is in use — set it inactive instead.' }, 409);
    }
    console.error('DELETE /plans/:id error', err);
    return c.json({ error: 'Failed to delete plan' }, 500);
  }
});

export default plans;
