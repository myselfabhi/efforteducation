import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import type { AppContext } from '../types';
import { signToken } from '../middleware/auth';
import {
  LoginSchema,
  RegisterStudentSchema,
  validateBody,
  getValid,
} from '../lib/validation';

const auth = new Hono<AppContext>();

type RegisterBody = {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  phone?: string | null;
  class_grade?: string | null;
};

type LoginBody = { email: string; password: string };

// POST /api/auth/register — student self-signup only
auth.post('/register', validateBody(RegisterStudentSchema), async (c) => {
  try {
    const { username, email, password, full_name, phone, class_grade } =
      getValid<RegisterBody>(c);
    const db = c.get('db');

    const existing = await db.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username],
    );
    if (existing.rows.length > 0) {
      return c.json({ error: 'User already exists' }, 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await db.query(
      `INSERT INTO users (username, email, password_hash, role, full_name, phone, class_grade)
       VALUES ($1, $2, $3, 'student', $4, $5, $6)
       RETURNING id, username, email, role, full_name, phone, class_grade, avatar_url, created_at`,
      [username, email, passwordHash, full_name ?? null, phone ?? null, class_grade ?? null],
    );

    const user = result.rows[0];
    const token = await signToken(user, c.env.JWT_SECRET);

    return c.json({ user, token }, 201);
  } catch (err) {
    console.error('Register error:', err);
    return c.json({ error: 'Registration failed' }, 500);
  }
});

// POST /api/auth/login
auth.post('/login', validateBody(LoginSchema), async (c) => {
  try {
    const { email, password } = getValid<LoginBody>(c);
    const db = c.get('db');

    const result = await db.query(
      `SELECT id, username, email, password_hash, role, full_name, phone, class_grade, avatar_url, deleted_at
       FROM users WHERE email = $1`,
      [email],
    );

    if (result.rows.length === 0) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const user = result.rows[0];
    if (user.deleted_at) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const token = await signToken(user, c.env.JWT_SECRET);

    return c.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        phone: user.phone,
        class_grade: user.class_grade,
        avatar_url: user.avatar_url,
      },
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    return c.json({ error: 'Login failed' }, 500);
  }
});

export default auth;
