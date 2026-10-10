import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import type { AppContext } from '../types';
import { requireAuth, roleGuard } from '../middleware/auth';
import { validateBody, getValid, CreateChildSchema } from '../lib/validation';

const guardian = new Hono<AppContext>();

// All guardian routes are for a signed-in parent (super_admin may manage too).
guardian.use('*', requireAuth, roleGuard('parent', 'super_admin'));

type CreateChildBody = {
  full_name: string;
  class_grade?: string | null;
  username?: string;
  password?: string;
};

// GET /api/guardian/children — the signed-in parent's linked children.
guardian.get('/children', async (c) => {
  const user = c.get('user')!;
  const db = c.get('db');
  const r = await db.query(
    `SELECT u.id, u.username, u.full_name, u.class_grade, u.avatar_url,
            gs.relationship, gs.created_at AS linked_at
       FROM guardian_students gs
       JOIN users u ON u.id = gs.student_id
      WHERE gs.guardian_id = $1 AND u.deleted_at IS NULL
      ORDER BY gs.created_at ASC`,
    [user.id],
  );
  return c.json({ children: r.rows });
});

// POST /api/guardian/children — create a child (student) and link to this parent.
guardian.post('/children', validateBody(CreateChildSchema), async (c) => {
  const user = c.get('user')!;
  const db = c.get('db');
  const { full_name, class_grade, username: usernameInput, password: passwordInput } =
    getValid<CreateChildBody>(c);

  // A child is a real user (so it can enrol, attend, take quizzes). It doesn't
  // need a real inbox, so the email is an internal placeholder; username is a
  // login the parent can share, and the password is random until the parent sets one.
  const slug = full_name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 18) || 'scholar';
  const username = usernameInput || `${slug}_${Math.random().toString(36).slice(2, 8)}`;
  const email = `child.${user.id}.${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}@child.efforteducation.in`;
  const password = passwordInput || Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  const passwordHash = await bcrypt.hash(password, 12);

  const client = await db.connect();
  try {
    const exists = await client.query('SELECT 1 FROM users WHERE username = $1', [username]);
    if (exists.rows.length > 0) {
      return c.json({ error: 'That username is taken — pick another.' }, 409);
    }

    await client.query('BEGIN');
    const ins = await client.query(
      `INSERT INTO users (username, email, password_hash, role, full_name, class_grade)
       VALUES ($1, $2, $3, 'student', $4, $5)
       RETURNING id, username, full_name, class_grade, avatar_url`,
      [username, email, passwordHash, full_name, class_grade ?? null],
    );
    const child = ins.rows[0];
    await client.query(
      `INSERT INTO guardian_students (guardian_id, student_id, relationship)
       VALUES ($1, $2, 'parent')`,
      [user.id, child.id],
    );
    await client.query('COMMIT');
    return c.json({ child }, 201);
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Create child error:', err);
    return c.json({ error: 'Could not add child' }, 500);
  } finally {
    client.release();
  }
});

// DELETE /api/guardian/children/:childId — unlink a child from this parent.
guardian.delete('/children/:childId', async (c) => {
  const user = c.get('user')!;
  const db = c.get('db');
  const childId = parseInt(c.req.param('childId') ?? '', 10);
  if (Number.isNaN(childId)) return c.json({ error: 'invalid childId' }, 400);

  await db.query(
    'DELETE FROM guardian_students WHERE guardian_id = $1 AND student_id = $2',
    [user.id, childId],
  );
  return c.json({ ok: true });
});

export default guardian;
