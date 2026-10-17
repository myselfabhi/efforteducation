import { Hono } from 'hono';
import type { AppContext } from '../types';
import { requireAuth, roleGuard } from '../middleware/auth';
import { CreateOfferSchema, validateBody, getValid } from '../lib/validation';
import { paymentsEnabled } from '../services/razorpay';

const offers = new Hono<AppContext>();

offers.use('*', requireAuth);

// ── Parent: my open offers (what I'm asked to pay) ────────────────────────────
offers.get('/mine', roleGuard('parent', 'super_admin'), async (c) => {
  try {
    const r = await c.get('db').query(
      `SELECT o.id, o.status, o.note, o.created_at,
              o.student_id, s.full_name AS student_name, s.username AS student_username,
              o.batch_id, b.name AS batch_name,
              o.plan_id, p.name AS plan_name, p.description AS plan_description,
              p.amount_paise, p.currency, p.interval_label
         FROM enrolment_offers o
         JOIN payment_plans p ON p.id = o.plan_id
         JOIN users s ON s.id = o.student_id
         LEFT JOIN batches b ON b.id = o.batch_id
        WHERE o.guardian_id = $1 AND o.status = 'offered'
        ORDER BY o.created_at DESC`,
      [c.get('user')!.id],
    );
    return c.json({ offers: r.rows, payments_enabled: paymentsEnabled(c.env) });
  } catch (err) {
    console.error('GET /offers/mine error', err);
    return c.json({ error: 'Failed to load offers' }, 500);
  }
});

// Everything below is admin-only.
offers.use('*', roleGuard('super_admin'));

// GET /api/offers/candidates — children (with a linked parent) to offer a plan to.
offers.get('/candidates', async (c) => {
  try {
    const r = await c.get('db').query(
      `SELECT DISTINCT ON (s.id)
              s.id AS student_id, s.full_name AS student_name, s.username AS student_username,
              s.class_grade, g.id AS guardian_id, g.full_name AS guardian_name, g.email AS guardian_email
         FROM guardian_students gs
         JOIN users s ON s.id = gs.student_id AND s.deleted_at IS NULL
         JOIN users g ON g.id = gs.guardian_id
        ORDER BY s.id, gs.created_at ASC`,
    );
    return c.json({ candidates: r.rows });
  } catch (err) {
    console.error('GET /offers/candidates error', err);
    return c.json({ error: 'Failed to load candidates' }, 500);
  }
});

// GET /api/offers — all offers (admin overview).
offers.get('/', async (c) => {
  try {
    const r = await c.get('db').query(
      `SELECT o.id, o.status, o.note, o.created_at, o.paid_at,
              s.full_name AS student_name, s.username AS student_username,
              g.full_name AS guardian_name,
              b.name AS batch_name,
              p.name AS plan_name, p.amount_paise, p.currency
         FROM enrolment_offers o
         JOIN payment_plans p ON p.id = o.plan_id
         JOIN users s ON s.id = o.student_id
         JOIN users g ON g.id = o.guardian_id
         LEFT JOIN batches b ON b.id = o.batch_id
        ORDER BY o.created_at DESC
        LIMIT 200`,
    );
    return c.json({ offers: r.rows });
  } catch (err) {
    console.error('GET /offers error', err);
    return c.json({ error: 'Failed to list offers' }, 500);
  }
});

// POST /api/offers — assign a plan to a family for a child's seat.
offers.post('/', validateBody(CreateOfferSchema), async (c) => {
  const db = c.get('db');
  const { student_id, plan_id, batch_id, note } = getValid<{
    student_id: number;
    plan_id: number;
    batch_id?: number | null;
    note?: string | null;
  }>(c);
  try {
    const plan = await db.query('SELECT id, active FROM payment_plans WHERE id = $1', [plan_id]);
    if (plan.rows.length === 0) return c.json({ error: 'Plan not found' }, 404);
    if (!plan.rows[0].active) return c.json({ error: 'That plan is inactive' }, 400);

    // The payer is the child's linked guardian (earliest link if several).
    const g = await db.query(
      `SELECT guardian_id FROM guardian_students WHERE student_id = $1 ORDER BY created_at ASC LIMIT 1`,
      [student_id],
    );
    if (g.rows.length === 0) return c.json({ error: 'That child has no linked parent to pay.' }, 400);
    const guardianId = g.rows[0].guardian_id;

    const r = await db.query(
      `INSERT INTO enrolment_offers (guardian_id, student_id, batch_id, plan_id, note, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [guardianId, student_id, batch_id ?? null, plan_id, note ?? null, c.get('user')!.id],
    );
    return c.json(r.rows[0], 201);
  } catch (err) {
    console.error('POST /offers error', err);
    return c.json({ error: 'Failed to create offer' }, 500);
  }
});

// DELETE /api/offers/:id — cancel an unpaid offer.
offers.delete('/:id', async (c) => {
  try {
    const r = await c.get('db').query(
      `UPDATE enrolment_offers SET status = 'cancelled'
        WHERE id = $1 AND status = 'offered' RETURNING id`,
      [parseInt(c.req.param('id'), 10)],
    );
    if (r.rows.length === 0) return c.json({ error: 'Not found or already paid' }, 404);
    return c.json({ ok: true });
  } catch (err) {
    console.error('DELETE /offers/:id error', err);
    return c.json({ error: 'Failed to cancel offer' }, 500);
  }
});

export default offers;
