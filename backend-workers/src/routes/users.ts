import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import type { AppContext } from '../types';
import { requireAuth, roleGuard } from '../middleware/auth';
import {
  ChangePasswordSchema,
  InviteUserSchema,
  UpdateProfileSchema,
  validateBody,
  getValid,
} from '../lib/validation';

const users = new Hono<AppContext>();

const PUBLIC_FIELDS = `id, username, email, role, full_name, phone, class_grade, bio, avatar_url, created_at`;

// GET /api/users/me
users.get('/me', requireAuth, async (c) => {
  try {
    const db = c.get('db');
    const r = await db.query(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = $1`, [c.get('user')!.id]);
    if (r.rows.length === 0) return c.json({ error: 'Not found' }, 404);
    return c.json(r.rows[0]);
  } catch (err) {
    console.error('GET /me error', err);
    return c.json({ error: 'Failed to load profile' }, 500);
  }
});

// GET /api/users/me/enrolment-requests — student's own request history
users.get('/me/enrolment-requests', requireAuth, async (c) => {
  try {
    const db = c.get('db');
    const r = await db.query(
      `SELECT
          req.id, req.batch_id, req.status, req.message, req.note,
          req.requested_at, req.decided_at,
          b.name        AS batch_name,
          c.title       AS course_title,
          c.slug        AS course_slug
         FROM batch_enrolment_requests req
         JOIN batches  b ON b.id = req.batch_id
         JOIN courses  c ON c.id = b.course_id
        WHERE req.student_id = $1
        ORDER BY req.requested_at DESC`,
      [c.get('user')!.id],
    );
    return c.json(r.rows);
  } catch (err) {
    console.error('GET /me/enrolment-requests error', err);
    return c.json({ error: 'Failed to load requests' }, 500);
  }
});

// PATCH /api/users/me
users.patch('/me', requireAuth, validateBody(UpdateProfileSchema), async (c) => {
  try {
    const { full_name, phone, avatar_url, bio, class_grade } = getValid<{
      full_name?: string;
      phone?: string | null;
      avatar_url?: string | null;
      bio?: string | null;
      class_grade?: string | null;
    }>(c);
    const db = c.get('db');
    const r = await db.query(
      `UPDATE users SET
          full_name   = COALESCE($1, full_name),
          phone       = COALESCE($2, phone),
          avatar_url  = COALESCE($3, avatar_url),
          bio         = COALESCE($4, bio),
          class_grade = COALESCE($5, class_grade)
        WHERE id = $6
        RETURNING ${PUBLIC_FIELDS}`,
      [full_name ?? null, phone ?? null, avatar_url ?? null, bio ?? null, class_grade ?? null, c.get('user')!.id],
    );
    return c.json(r.rows[0]);
  } catch (err) {
    console.error('PATCH /me error', err);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// PATCH /api/users/me/password — change own password (any role)
users.patch('/me/password', requireAuth, validateBody(ChangePasswordSchema), async (c) => {
  try {
    const { current_password, new_password } = getValid<{ current_password: string; new_password: string }>(c);
    const db = c.get('db');
    const r = await db.query('SELECT password_hash FROM users WHERE id = $1', [c.get('user')!.id]);
    if (r.rows.length === 0) return c.json({ error: 'Not found' }, 404);

    const ok = await bcrypt.compare(current_password, r.rows[0].password_hash);
    if (!ok) return c.json({ error: 'Current password is incorrect' }, 400);

    const newHash = await bcrypt.hash(new_password, 10);
    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, c.get('user')!.id]);
    return c.body(null, 204);
  } catch (err) {
    console.error('PATCH /me/password error', err);
    return c.json({ error: 'Failed to change password' }, 500);
  }
});

// GET /api/users — super_admin lists users (filter by role)
users.get('/', requireAuth, roleGuard('super_admin'), async (c) => {
  try {
    const db = c.get('db');
    const role = c.req.query('role') || null;
    const params: unknown[] = [];
    let where = 'WHERE deleted_at IS NULL';
    if (role) {
      params.push(role);
      where += ` AND role = $${params.length}`;
    }
    const r = await db.query(
      `SELECT ${PUBLIC_FIELDS} FROM users ${where} ORDER BY created_at DESC LIMIT 500`,
      params,
    );
    return c.json(r.rows);
  } catch (err) {
    console.error('GET /users error', err);
    return c.json({ error: 'Failed to list users' }, 500);
  }
});

// POST /api/users — super_admin invites a teacher or student
users.post('/', requireAuth, roleGuard('super_admin'), validateBody(InviteUserSchema), async (c) => {
  try {
    const { username, email, password, role, full_name, phone, bio, class_grade } = getValid<{
      username: string;
      email: string;
      password: string;
      role: string;
      full_name: string;
      phone?: string | null;
      bio?: string | null;
      class_grade?: string | null;
    }>(c);
    const db = c.get('db');

    const existing = await db.query('SELECT id FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (existing.rows.length > 0) return c.json({ error: 'User already exists' }, 409);

    const passwordHash = await bcrypt.hash(password, 12);
    const r = await db.query(
      `INSERT INTO users (username, email, password_hash, role, full_name, phone, bio, class_grade, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING ${PUBLIC_FIELDS}`,
      [username, email, passwordHash, role, full_name, phone ?? null, bio ?? null, class_grade ?? null, c.get('user')!.id],
    );
    return c.json(r.rows[0], 201);
  } catch (err) {
    console.error('POST /users error', err);
    return c.json({ error: 'Failed to invite user' }, 500);
  }
});

// PATCH /api/users/:id/role — super_admin
users.patch('/:id/role', requireAuth, roleGuard('super_admin'), async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    const { role } = await c.req.json<{ role: string }>().catch(() => ({ role: '' }));
    if (!['super_admin', 'teacher', 'student'].includes(role)) {
      return c.json({ error: 'Invalid role' }, 400);
    }
    if (id === c.get('user')!.id) return c.json({ error: 'Cannot change own role' }, 400);
    const db = c.get('db');
    const r = await db.query(`UPDATE users SET role = $1 WHERE id = $2 RETURNING ${PUBLIC_FIELDS}`, [role, id]);
    if (r.rows.length === 0) return c.json({ error: 'Not found' }, 404);
    return c.json(r.rows[0]);
  } catch (err) {
    console.error('PATCH /users/:id/role error', err);
    return c.json({ error: 'Failed to update role' }, 500);
  }
});

// DELETE /api/users/:id — super_admin (soft delete)
users.delete('/:id', requireAuth, roleGuard('super_admin'), async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (id === c.get('user')!.id) return c.json({ error: 'Cannot delete self' }, 400);
    const db = c.get('db');
    await db.query('UPDATE users SET deleted_at = NOW() WHERE id = $1', [id]);
    return c.body(null, 204);
  } catch (err) {
    console.error('DELETE /users/:id error', err);
    return c.json({ error: 'Failed to delete' }, 500);
  }
});

export default users;
