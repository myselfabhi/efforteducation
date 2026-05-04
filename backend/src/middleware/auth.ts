import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db';

export type UserRole = 'super_admin' | 'teacher' | 'student' | 'admin' | 'user';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  full_name?: string | null;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

const LEGACY_ROLE_MAP: Record<string, UserRole> = {
  admin: 'super_admin',
  user: 'student',
};

function normalizeRole(role: UserRole): UserRole {
  return LEGACY_ROLE_MAP[role] ?? role;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
    decoded.role = normalizeRole(decoded.role);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function roleGuard(...allowed: UserRole[]) {
  const expanded = new Set<UserRole>(allowed.map(normalizeRole));
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (!expanded.has(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient role' });
    }
    next();
  };
}

// Backwards compat — existing routes still call adminOnly
export const adminOnly = roleGuard('super_admin');

/**
 * batchMember(idParam) — ensures the current user is a member of the batch
 * referenced by req.params[idParam] (default 'id'). Membership is satisfied by:
 *   - super_admin (always)
 *   - teacher in batch_teachers
 *   - student in batch_students with status='active'
 */
export function batchMember(idParam: string = 'id') {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const batchId = parseInt(req.params[idParam], 10);
    if (Number.isNaN(batchId)) {
      return res.status(400).json({ error: `invalid ${idParam}` });
    }

    if (req.user.role === 'super_admin') return next();

    try {
      if (req.user.role === 'teacher') {
        const r = await pool.query(
          'SELECT 1 FROM batch_teachers WHERE batch_id = $1 AND teacher_id = $2',
          [batchId, req.user.id]
        );
        if (r.rows.length > 0) return next();
      } else if (req.user.role === 'student') {
        const r = await pool.query(
          `SELECT 1 FROM batch_students
            WHERE batch_id = $1 AND student_id = $2 AND status = 'active'`,
          [batchId, req.user.id]
        );
        if (r.rows.length > 0) return next();
      }
      return res.status(403).json({ error: 'Not a member of this batch' });
    } catch (err) {
      console.error('batchMember check failed:', err);
      return res.status(500).json({ error: 'Authorization check failed' });
    }
  };
}
