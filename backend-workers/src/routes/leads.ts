import { Hono } from 'hono';
import type { AppContext } from '../types';
import { requireAuth, roleGuard } from '../middleware/auth';
import { CreateLeadSchema, validateBody, getValid } from '../lib/validation';
import { notifyMany } from '../services/notifications';

const leads = new Hono<AppContext>();

// POST /api/leads — PUBLIC capture from the "Book a call" form. No auth: this is
// the marketing site. Kept lightweight; the form also opens WhatsApp client-side.
leads.post('/', validateBody(CreateLeadSchema), async (c) => {
  const db = c.get('db');
  const { name, phone, email, interest, message, source } = getValid<{
    name: string; phone: string; email?: string | null;
    interest?: string | null; message?: string | null; source?: string | null;
  }>(c);
  try {
    const r = await db.query(
      `INSERT INTO leads (name, phone, email, interest, message, source)
       VALUES ($1, $2, $3, $4, $5, COALESCE($6, 'contact_form')) RETURNING id`,
      [name.trim(), phone.trim(), email ?? null, interest ?? null, message ?? null, source ?? null],
    );
    // Ping the team so a lead never sits unseen.
    const admins = await db.query(`SELECT id FROM users WHERE role IN ('super_admin', 'admin')`);
    await notifyMany(
      c.env, db, admins.rows.map((x) => x.id),
      {
        type: 'lead_received',
        title: 'New lead — Book a call',
        body: `${name.trim()}${interest ? ` · ${interest}` : ''}`,
        linkUrl: '/dashboard/admin/admissions',
      },
    );
    return c.json({ ok: true, id: r.rows[0].id }, 201);
  } catch (err) {
    console.error('POST /leads error', err);
    return c.json({ error: 'Could not submit. Please try again.' }, 500);
  }
});

// Everything below is staff-only.
leads.use('*', requireAuth, roleGuard('super_admin'));

// GET /api/leads?status=new|contacted|converted|closed|all
leads.get('/', async (c) => {
  const status = c.req.query('status') || 'all';
  const params: unknown[] = [];
  let where = '';
  if (status !== 'all') {
    params.push(status);
    where = `WHERE l.status = $${params.length}`;
  }
  const r = await c.get('db').query(
    `SELECT l.*, u.full_name AS handler_name
       FROM leads l
       LEFT JOIN users u ON u.id = l.handled_by
       ${where}
      ORDER BY l.status = 'new' DESC, l.created_at DESC
      LIMIT 300`,
    params,
  );
  return c.json({ leads: r.rows });
});

// PATCH /api/leads/:id — update status and/or note; records who handled it.
leads.patch('/:id', async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const body = (await c.req.json().catch(() => ({}))) as { status?: string; note?: string };
  const sets: string[] = [];
  const values: unknown[] = [];
  if (body.status !== undefined) {
    if (!['new', 'contacted', 'converted', 'closed'].includes(body.status)) {
      return c.json({ error: 'Invalid status' }, 400);
    }
    values.push(body.status);
    sets.push(`status = $${values.length}`);
  }
  if (body.note !== undefined) {
    values.push(body.note);
    sets.push(`note = $${values.length}`);
  }
  if (sets.length === 0) return c.json({ error: 'Nothing to update' }, 400);
  values.push(c.get('user')!.id);
  sets.push(`handled_by = $${values.length}`);
  values.push(id);
  const r = await c.get('db').query(
    `UPDATE leads SET ${sets.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
    values,
  );
  if (r.rows.length === 0) return c.json({ error: 'Not found' }, 404);
  return c.json(r.rows[0]);
});

export default leads;
