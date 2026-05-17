import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db';
import { authMiddleware, roleGuard, AuthRequest } from '../middleware/auth';
import { ChangePasswordSchema, InviteUserSchema, UpdateProfileSchema, validateBody } from '../lib/validation';

const router = Router();

const PUBLIC_FIELDS = `id, username, email, role, full_name, phone, class_grade, bio, avatar_url, created_at`;

// GET /api/users/me
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const r = await pool.query(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = $1`, [req.user!.id]);
    if (r.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(r.rows[0]);
  } catch (err) {
    console.error('GET /me error', err);
    res.status(500).json({ error: 'Failed to load profile' });
  }
});

// GET /api/users/me/enrolment-requests — student's own request history
// (migration 006). Joins the batch row so the UI can render the badge name
// without a second round-trip.
router.get(
  '/me/enrolment-requests',
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const r = await pool.query(
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
        [req.user!.id]
      );
      res.json(r.rows);
    } catch (err) {
      console.error('GET /me/enrolment-requests error', err);
      res.status(500).json({ error: 'Failed to load requests' });
    }
  }
);

// PATCH /api/users/me
router.patch(
  '/me',
  authMiddleware,
  validateBody(UpdateProfileSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const { full_name, phone, avatar_url, bio, class_grade } = req.body;
      const r = await pool.query(
        `UPDATE users SET
            full_name   = COALESCE($1, full_name),
            phone       = COALESCE($2, phone),
            avatar_url  = COALESCE($3, avatar_url),
            bio         = COALESCE($4, bio),
            class_grade = COALESCE($5, class_grade)
          WHERE id = $6
          RETURNING ${PUBLIC_FIELDS}`,
        [full_name ?? null, phone ?? null, avatar_url ?? null, bio ?? null, class_grade ?? null, req.user!.id]
      );
      res.json(r.rows[0]);
    } catch (err) {
      console.error('PATCH /me error', err);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }
);

// PATCH /api/users/me/password — change own password (any role)
router.patch(
  '/me/password',
  authMiddleware,
  validateBody(ChangePasswordSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const { current_password, new_password } = req.body;
      const r = await pool.query(
        'SELECT password_hash FROM users WHERE id = $1',
        [req.user!.id]
      );
      if (r.rows.length === 0) return res.status(404).json({ error: 'Not found' });

      const ok = await bcrypt.compare(current_password, r.rows[0].password_hash);
      if (!ok) return res.status(400).json({ error: 'Current password is incorrect' });

      const newHash = await bcrypt.hash(new_password, 10);
      await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, req.user!.id]);
      res.status(204).end();
    } catch (err) {
      console.error('PATCH /me/password error', err);
      res.status(500).json({ error: 'Failed to change password' });
    }
  }
);

// GET /api/users — super_admin lists users (filter by role)
router.get('/', authMiddleware, roleGuard('super_admin'), async (req: AuthRequest, res: Response) => {
  try {
    const role = (req.query.role as string) || null;
    const params: any[] = [];
    let where = 'WHERE deleted_at IS NULL';
    if (role) {
      params.push(role);
      where += ` AND role = $${params.length}`;
    }
    const r = await pool.query(
      `SELECT ${PUBLIC_FIELDS} FROM users ${where} ORDER BY created_at DESC LIMIT 500`,
      params
    );
    res.json(r.rows);
  } catch (err) {
    console.error('GET /users error', err);
    res.status(500).json({ error: 'Failed to list users' });
  }
});

// POST /api/users — super_admin invites a teacher or student
router.post(
  '/',
  authMiddleware,
  roleGuard('super_admin'),
  validateBody(InviteUserSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const { username, email, password, role, full_name, phone, bio, class_grade } = req.body;

      const existing = await pool.query(
        'SELECT id FROM users WHERE email = $1 OR username = $2',
        [email, username]
      );
      if (existing.rows.length > 0) return res.status(409).json({ error: 'User already exists' });

      const passwordHash = await bcrypt.hash(password, 12);
      const r = await pool.query(
        `INSERT INTO users (username, email, password_hash, role, full_name, phone, bio, class_grade, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING ${PUBLIC_FIELDS}`,
        [username, email, passwordHash, role, full_name, phone ?? null, bio ?? null, class_grade ?? null, req.user!.id]
      );
      res.status(201).json(r.rows[0]);
    } catch (err) {
      console.error('POST /users error', err);
      res.status(500).json({ error: 'Failed to invite user' });
    }
  }
);

// PATCH /api/users/:id/role — super_admin
router.patch(
  '/:id/role',
  authMiddleware,
  roleGuard('super_admin'),
  async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { role } = req.body;
      if (!['super_admin', 'teacher', 'student'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }
      if (id === req.user!.id) {
        return res.status(400).json({ error: 'Cannot change own role' });
      }
      const r = await pool.query(
        `UPDATE users SET role = $1 WHERE id = $2 RETURNING ${PUBLIC_FIELDS}`,
        [role, id]
      );
      if (r.rows.length === 0) return res.status(404).json({ error: 'Not found' });
      res.json(r.rows[0]);
    } catch (err) {
      console.error('PATCH /users/:id/role error', err);
      res.status(500).json({ error: 'Failed to update role' });
    }
  }
);

// DELETE /api/users/:id — super_admin (soft delete)
router.delete('/:id', authMiddleware, roleGuard('super_admin'), async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (id === req.user!.id) return res.status(400).json({ error: 'Cannot delete self' });
    await pool.query('UPDATE users SET deleted_at = NOW() WHERE id = $1', [id]);
    res.status(204).end();
  } catch (err) {
    console.error('DELETE /users/:id error', err);
    res.status(500).json({ error: 'Failed to delete' });
  }
});

export default router;
