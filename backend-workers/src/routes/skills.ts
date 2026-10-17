import { Hono } from 'hono';
import type { AppContext } from '../types';
import { requireAuth, roleGuard } from '../middleware/auth';
import { CreateSkillSchema, validateBody, getValid } from '../lib/validation';

const skills = new Hono<AppContext>();

skills.use('*', requireAuth);

// Derive a stable slug key from a name, e.g. "World & GK" → "world_gk".
function keyFromName(name: string): string {
  return (
    name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 40) ||
    'skill_' + Math.random().toString(36).slice(2, 8)
  );
}

// GET /api/skills — active skills (any role: quiz form + mastery display).
// ?all=1 (admin) includes inactive ones for management.
skills.get('/', async (c) => {
  const all = c.req.query('all') === '1' && c.get('user')!.role === 'super_admin';
  const r = await c.get('db').query(
    `SELECT id, key, name, emoji, description, sort_order, active
       FROM skills ${all ? '' : 'WHERE active = TRUE'}
      ORDER BY sort_order, id`,
  );
  return c.json(r.rows);
});

// Management is super_admin only.
skills.post('/', roleGuard('super_admin'), validateBody(CreateSkillSchema), async (c) => {
  try {
    const { name, emoji, description, sort_order, active } = getValid<Record<string, unknown>>(c);
    const r = await c.get('db').query(
      `INSERT INTO skills (key, name, emoji, description, sort_order, active)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [keyFromName(name as string), name, emoji ?? null, description ?? null, sort_order ?? 0, active ?? true],
    );
    return c.json(r.rows[0], 201);
  } catch (err) {
    if ((err as { code?: string }).code === '23505') return c.json({ error: 'A skill with that name already exists' }, 409);
    console.error('POST /skills error', err);
    return c.json({ error: 'Failed to create skill' }, 500);
  }
});

skills.patch('/:id', roleGuard('super_admin'), async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
    const fields = ['name', 'emoji', 'description', 'sort_order', 'active'];
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
      `UPDATE skills SET ${set.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
      values,
    );
    if (r.rows.length === 0) return c.json({ error: 'Not found' }, 404);
    return c.json(r.rows[0]);
  } catch (err) {
    console.error('PATCH /skills/:id error', err);
    return c.json({ error: 'Failed to update skill' }, 500);
  }
});

skills.delete('/:id', roleGuard('super_admin'), async (c) => {
  try {
    await c.get('db').query('DELETE FROM skills WHERE id = $1', [parseInt(c.req.param('id'), 10)]);
    return c.body(null, 204);
  } catch (err) {
    console.error('DELETE /skills/:id error', err);
    return c.json({ error: 'Failed to delete skill' }, 500);
  }
});

export default skills;
