import { Hono } from 'hono';
import type { AppContext } from '../types';
import { requireAuth, roleGuard } from '../middleware/auth';
import { getMastery } from '../services/mastery';

const mastery = new Hono<AppContext>();

// GET /api/mastery/me — the signed-in student's skill mastery.
mastery.get('/me', requireAuth, roleGuard('student', 'super_admin'), async (c) => {
  const skills = await getMastery(c.get('db'), c.get('user')!.id);
  return c.json({ skills });
});

// GET /api/mastery/child/:childId — a linked child's mastery (parent).
mastery.get('/child/:childId', requireAuth, roleGuard('parent', 'super_admin'), async (c) => {
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

  const skills = await getMastery(db, childId);
  return c.json({ skills });
});

export default mastery;
