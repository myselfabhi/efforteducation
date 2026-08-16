import type { MiddlewareHandler } from 'hono';
import { SignJWT, jwtVerify } from 'jose';
import type { AppContext, AuthUser, UserRole } from '../types';

const LEGACY_ROLE_MAP: Record<string, UserRole> = {
  admin: 'super_admin',
  user: 'student',
};

export function normalizeRole(role: UserRole): UserRole {
  return LEGACY_ROLE_MAP[role] ?? role;
}

function secretKey(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

/** Mint a 24h HS256 token — same claims/shape the Express app issued. */
export async function signToken(
  user: { id: number; username: string; email: string; role: string; full_name: string | null },
  secret: string,
): Promise<string> {
  return new SignJWT({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    full_name: user.full_name,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secretKey(secret));
}

/**
 * requireAuth — verifies the Bearer token and sets `c.get('user')`.
 * Mirrors backend/src/middleware/auth.ts authMiddleware.
 */
export const requireAuth: MiddlewareHandler<AppContext> = async (c, next) => {
  const header = c.req.header('authorization');
  if (!header || !header.startsWith('Bearer ')) {
    return c.json({ error: 'No token provided' }, 401);
  }
  const token = header.slice('Bearer '.length);
  try {
    const { payload } = await jwtVerify(token, secretKey(c.env.JWT_SECRET));
    const user = payload as unknown as AuthUser;
    user.role = normalizeRole(user.role);
    c.set('user', user);
    await next();
  } catch {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }
};

/**
 * verifyToken — validate a JWT and return the user (or null). Used by the
 * WebSocket handshake, where the token arrives as a query param (browsers can't
 * set headers on a WebSocket) — same as the old Socket.IO handshake.query.token.
 */
export async function verifyToken(token: string, secret: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(secret));
    const user = payload as unknown as AuthUser;
    user.role = normalizeRole(user.role);
    return user;
  } catch {
    return null;
  }
}

/** roleGuard(...roles) — 403 unless the authed user has an allowed role. */
export function roleGuard(...allowed: UserRole[]): MiddlewareHandler<AppContext> {
  const expanded = new Set<UserRole>(allowed.map(normalizeRole));
  return async (c, next) => {
    const user = c.get('user');
    if (!user) return c.json({ error: 'Not authenticated' }, 401);
    if (!expanded.has(user.role)) return c.json({ error: 'Insufficient role' }, 403);
    await next();
  };
}

export const adminOnly = roleGuard('super_admin');

/**
 * batchMember(idParam) — ensures the user belongs to the batch named by the
 * given route param. Ports backend/src/middleware/auth.ts batchMember.
 */
export function batchMember(idParam = 'id'): MiddlewareHandler<AppContext> {
  return async (c, next) => {
    const user = c.get('user');
    if (!user) return c.json({ error: 'Not authenticated' }, 401);

    const batchId = parseInt(c.req.param(idParam) ?? '', 10);
    if (Number.isNaN(batchId)) return c.json({ error: `invalid ${idParam}` }, 400);

    if (user.role === 'super_admin') return next();

    try {
      const db = c.get('db');
      if (user.role === 'teacher') {
        const r = await db.query(
          'SELECT 1 FROM batch_teachers WHERE batch_id = $1 AND teacher_id = $2',
          [batchId, user.id],
        );
        if (r.rows.length > 0) return next();
      } else if (user.role === 'student') {
        const r = await db.query(
          `SELECT 1 FROM batch_students
            WHERE batch_id = $1 AND student_id = $2 AND status = 'active'`,
          [batchId, user.id],
        );
        if (r.rows.length > 0) return next();
      }
      return c.json({ error: 'Not a member of this batch' }, 403);
    } catch (err) {
      console.error('batchMember check failed:', err);
      return c.json({ error: 'Authorization check failed' }, 500);
    }
  };
}
