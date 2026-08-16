import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { AppContext } from './types';
import { withDb } from './db';
import { verifyToken } from './middleware/auth';
import authRoutes from './routes/auth';
import quizRoutes from './routes/quiz';
import userRoutes from './routes/users';
import courseRoutes from './routes/courses';
import batchRoutes from './routes/batches';
import materialsRoutes from './routes/materials';
import classRoutes from './routes/classes';
import announcementsRoutes from './routes/announcements';
import notificationsRoutes from './routes/notifications';
import dashboardRoutes from './routes/dashboard';

const app = new Hono<AppContext>();

// ── CORS ──────────────────────────────────────────────────────────────────────
const STATIC_ORIGINS = [
  'https://efforteducation.in', // prod (canonical; also the CORS fallback)
  'https://www.efforteducation.in',
  'https://efforteducation.vercel.app', // staging
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
];

// CORS on API routes only — the WebSocket route (/ws/*) upgrades to a 101 and
// must not have CORS headers layered onto it.
app.use('/api/*', (c, next) =>
  cors({
    origin: (origin) => {
      const allowed = [...STATIC_ORIGINS, ...(c.env.FRONTEND_URL ? [c.env.FRONTEND_URL] : [])];
      return origin && allowed.includes(origin) ? origin : STATIC_ORIGINS[0];
    },
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })(c, next),
);

// Per-request DB pool (Hyperdrive → Neon) on every /api route.
app.use('/api/*', withDb);

// ── WebSocket → QuizRoom Durable Object ───────────────────────────────────────
// Auth is via ?token= (browsers can't set headers on a WebSocket). The Worker
// verifies the JWT, then forwards the upgrade to the per-quiz DO with the user
// attached in headers.
app.get('/ws/quiz/:quizId', async (c) => {
  if (c.req.header('Upgrade') !== 'websocket') return c.text('expected websocket', 426);
  const token = c.req.query('token');
  const user = token ? await verifyToken(token, c.env.JWT_SECRET) : null;
  if (!user) return c.text('unauthorized', 401);

  const quizId = c.req.param('quizId');
  const stub = c.env.QUIZ_ROOM.get(c.env.QUIZ_ROOM.idFromName(`quiz:${quizId}`));

  const headers = new Headers(c.req.raw.headers);
  headers.set(
    'x-quiz-user',
    JSON.stringify({ id: user.id, username: user.username, email: user.email, role: user.role, full_name: user.full_name ?? null }),
  );
  headers.set('x-quiz-id', String(quizId));
  return stub.fetch(new Request(c.req.raw.url, { method: 'GET', headers }));
});

// ── WebSocket → UserHub Durable Object (per-user notification channel) ─────────
app.get('/ws/user', async (c) => {
  if (c.req.header('Upgrade') !== 'websocket') return c.text('expected websocket', 426);
  const token = c.req.query('token');
  const user = token ? await verifyToken(token, c.env.JWT_SECRET) : null;
  if (!user) return c.text('unauthorized', 401);
  const stub = c.env.USER_HUB.get(c.env.USER_HUB.idFromName(`user:${user.id}`));
  return stub.fetch(new Request(c.req.raw.url, { method: 'GET', headers: c.req.raw.headers }));
});

// ── WebSocket → ClassRoom Durable Object (per-class presence) ──────────────────
app.get('/ws/class/:classId', async (c) => {
  if (c.req.header('Upgrade') !== 'websocket') return c.text('expected websocket', 426);
  const token = c.req.query('token');
  const user = token ? await verifyToken(token, c.env.JWT_SECRET) : null;
  if (!user) return c.text('unauthorized', 401);
  const classId = c.req.param('classId');
  const stub = c.env.CLASS_ROOM.get(c.env.CLASS_ROOM.idFromName(`class:${classId}`));
  const headers = new Headers(c.req.raw.headers);
  headers.set(
    'x-class-user',
    JSON.stringify({ id: user.id, username: user.username, role: user.role, full_name: user.full_name ?? null }),
  );
  headers.set('x-class-id', String(classId));
  return stub.fetch(new Request(c.req.raw.url, { method: 'GET', headers }));
});

// ── Routes (same mount points as the Express app) ─────────────────────────────
app.route('/api/auth', authRoutes);
app.route('/api/quizzes', quizRoutes);
app.route('/api/users', userRoutes);
app.route('/api/courses', courseRoutes);
app.route('/api/batches', batchRoutes);
// materials/classes/announcements mount at /api because their paths are a mix
// of nested (/batches/:id/...) and flat (/materials/..., /classes/...).
app.route('/api', materialsRoutes);
app.route('/api', classRoutes);
app.route('/api', announcementsRoutes);
app.route('/api/notifications', notificationsRoutes);
app.route('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

export { QuizRoom } from './do/QuizRoom';
export { ClassRoom } from './do/ClassRoom';
export { UserHub } from './do/UserHub';
export default app;
