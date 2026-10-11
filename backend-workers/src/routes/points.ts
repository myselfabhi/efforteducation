import { Hono } from 'hono';
import type { AppContext } from '../types';
import { requireAuth, roleGuard } from '../middleware/auth';
import { reconcileAndSummarize } from '../services/points';

const points = new Hono<AppContext>();

// ── Student: my Scholar Points ────────────────────────────────────────────────
points.get('/me', requireAuth, roleGuard('student', 'super_admin'), async (c) => {
  const db = c.get('db');
  const user = c.get('user')!;
  const summary = await reconcileAndSummarize(db, user.id);
  return c.json(summary);
});

// ── Parent: a linked child's Scholar Points ───────────────────────────────────
points.get('/child/:childId', requireAuth, roleGuard('parent', 'super_admin'), async (c) => {
  const db = c.get('db');
  const user = c.get('user')!;
  const childId = parseInt(c.req.param('childId') ?? '', 10);
  if (Number.isNaN(childId)) return c.json({ error: 'invalid childId' }, 400);

  if (user.role !== 'super_admin') {
    const link = await db.query(
      'SELECT 1 FROM guardian_students WHERE guardian_id = $1 AND student_id = $2',
      [user.id, childId],
    );
    if (link.rows.length === 0) return c.json({ error: 'Not your child' }, 403);
  }

  const summary = await reconcileAndSummarize(db, childId);
  return c.json(summary);
});

export default points;
