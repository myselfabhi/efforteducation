import { Hono } from 'hono';
import type { AppContext } from '../types';
import { requireAuth, roleGuard } from '../middleware/auth';
import { VerifyPaymentSchema, validateBody, getValid } from '../lib/validation';
import { createOrder, verifyPaymentSignature, paymentsEnabled } from '../services/razorpay';

const payments = new Hono<AppContext>();

// Checkout is always done by the paying parent (super_admin allowed for testing).
payments.use('*', requireAuth, roleGuard('parent', 'super_admin'));

// POST /api/payments/order — start checkout for one of my offers.
// The amount comes from the plan on the server; the client only names the offer.
payments.post('/order', async (c) => {
  const db = c.get('db');
  const user = c.get('user')!;
  const body = (await c.req.json().catch(() => ({}))) as { offer_id?: number };
  const offerId = Number(body.offer_id);
  if (!Number.isInteger(offerId)) return c.json({ error: 'offer_id required' }, 400);
  if (!paymentsEnabled(c.env)) return c.json({ error: 'Online payment is not available yet.' }, 503);

  try {
    const o = await db.query(
      `SELECT o.id, o.student_id, o.plan_id, o.batch_id,
              p.amount_paise, p.currency, p.name AS plan_name,
              s.full_name AS student_name
         FROM enrolment_offers o
         JOIN payment_plans p ON p.id = o.plan_id
         JOIN users s ON s.id = o.student_id
        WHERE o.id = $1 AND o.guardian_id = $2 AND o.status = 'offered'`,
      [offerId, user.id],
    );
    if (o.rows.length === 0) return c.json({ error: 'Offer not found' }, 404);
    const offer = o.rows[0];

    const order = await createOrder(c.env, {
      amountPaise: offer.amount_paise,
      currency: offer.currency,
      receipt: `offer_${offer.id}`,
      notes: { offer_id: String(offer.id), student_id: String(offer.student_id) },
    });

    await db.query(
      `INSERT INTO payments (offer_id, guardian_id, student_id, plan_id, amount_paise, currency, razorpay_order_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'created')`,
      [offer.id, user.id, offer.student_id, offer.plan_id, offer.amount_paise, offer.currency, order.id],
    );

    return c.json({
      order_id: order.id,
      amount_paise: offer.amount_paise,
      currency: offer.currency,
      stub: order.stub,
      key_id: c.env.RAZORPAY_KEY_ID ?? null,
      plan_name: offer.plan_name,
      student_name: offer.student_name,
      name: user.full_name,
      email: user.email,
    });
  } catch (err) {
    console.error('POST /payments/order error', err);
    return c.json({ error: 'Could not start checkout. Please try again.' }, 500);
  }
});

// POST /api/payments/verify — confirm a completed payment and enrol the child.
payments.post('/verify', validateBody(VerifyPaymentSchema), async (c) => {
  const db = c.get('db');
  const user = c.get('user')!;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = getValid<{
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }>(c);

  const valid = await verifyPaymentSignature(c.env, {
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
  });
  if (!valid) {
    await db
      .query(
        `UPDATE payments SET status = 'failed'
          WHERE razorpay_order_id = $1 AND guardian_id = $2 AND status = 'created'`,
        [razorpay_order_id, user.id],
      )
      .catch(() => {});
    return c.json({ error: 'Payment could not be verified.' }, 400);
  }

  const client = await db.connect();
  try {
    const pay = await client.query(
      `SELECT pm.id, pm.offer_id, pm.student_id, o.batch_id
         FROM payments pm
         LEFT JOIN enrolment_offers o ON o.id = pm.offer_id
        WHERE pm.razorpay_order_id = $1 AND pm.guardian_id = $2 AND pm.status = 'created'`,
      [razorpay_order_id, user.id],
    );
    if (pay.rows.length === 0) {
      client.release();
      return c.json({ error: 'No matching payment to confirm.' }, 404);
    }
    const { offer_id, student_id, batch_id } = pay.rows[0];

    await client.query('BEGIN');
    await client.query(
      `UPDATE payments SET status = 'paid', razorpay_payment_id = $1, razorpay_signature = $2, paid_at = NOW()
        WHERE razorpay_order_id = $3`,
      [razorpay_payment_id, razorpay_signature, razorpay_order_id],
    );
    if (offer_id) {
      await client.query(
        `UPDATE enrolment_offers SET status = 'paid', paid_at = NOW() WHERE id = $1`,
        [offer_id],
      );
    }
    if (batch_id && student_id) {
      await client.query(
        `INSERT INTO batch_students (batch_id, student_id, status)
         VALUES ($1, $2, 'active')
         ON CONFLICT (batch_id, student_id) DO UPDATE SET status = 'active'`,
        [batch_id, student_id],
      );
    }
    await client.query('COMMIT');
    return c.json({ ok: true, enrolled: !!batch_id });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('POST /payments/verify error', err);
    return c.json({ error: 'Could not confirm payment.' }, 500);
  } finally {
    client.release();
  }
});

export default payments;
