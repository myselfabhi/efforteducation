import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db';
import { LoginSchema, RegisterStudentSchema, validateBody } from '../lib/validation';

const router = Router();

function signToken(user: { id: number; username: string; email: string; role: string; full_name: string | null }) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
    },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );
}

// POST /api/auth/register — student self-signup only
router.post('/register', validateBody(RegisterStudentSchema), async (req, res: Response) => {
  try {
    const { username, email, password, full_name, phone, class_grade } = req.body;

    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash, role, full_name, phone, class_grade)
       VALUES ($1, $2, $3, 'student', $4, $5, $6)
       RETURNING id, username, email, role, full_name, phone, class_grade, avatar_url, created_at`,
      [username, email, passwordHash, full_name ?? null, phone ?? null, class_grade ?? null]
    );

    const user = result.rows[0];
    const token = signToken(user);

    res.status(201).json({ user, token });
  } catch (err: any) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', validateBody(LoginSchema), async (req, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      `SELECT id, username, email, password_hash, role, full_name, phone, class_grade, avatar_url, deleted_at
       FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    if (user.deleted_at) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken(user);

    res.json({
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
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
