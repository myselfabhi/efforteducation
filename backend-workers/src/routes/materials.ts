import { Hono } from 'hono';
import type { AppContext } from '../types';
import { requireAuth, roleGuard, batchMember } from '../middleware/auth';
import { CreateMaterialSchema, SignedUploadSchema, validateBody, getValid } from '../lib/validation';
import { createSignedUpload } from '../services/storage';
import { notifyMany } from '../services/notifications';

// Mounted at /api (paths are a mix of /batches/:id/... and flat /materials/...).
const materials = new Hono<AppContext>();

// GET /api/batches/:id/materials — members
materials.get('/batches/:id/materials', requireAuth, batchMember('id'), async (c) => {
  try {
    const r = await c.get('db').query(
      `SELECT m.*, u.username AS uploader_username, u.full_name AS uploader_name
         FROM materials m JOIN users u ON u.id = m.uploaded_by
        WHERE m.batch_id = $1
        ORDER BY m.is_pinned DESC, m.created_at DESC`,
      [parseInt(c.req.param('id'), 10)],
    );
    return c.json(r.rows);
  } catch {
    return c.json({ error: 'Failed to load materials' }, 500);
  }
});

// POST /api/batches/:id/materials — teacher of batch / super_admin
materials.post(
  '/batches/:id/materials',
  requireAuth,
  roleGuard('super_admin', 'teacher'),
  batchMember('id'),
  validateBody(CreateMaterialSchema),
  async (c) => {
    try {
      const batchId = parseInt(c.req.param('id'), 10);
      const { title, description, type, url, text_body, size_bytes, is_pinned } = getValid<{
        title: string;
        description?: string | null;
        type: string;
        url?: string | null;
        text_body?: string | null;
        size_bytes?: number | null;
        is_pinned?: boolean;
      }>(c);

      if (type === 'text_note' && !text_body) {
        return c.json({ error: 'text_body required for text_note' }, 400);
      }
      if (type !== 'text_note' && !url) {
        return c.json({ error: 'url required for non-text materials' }, 400);
      }

      const db = c.get('db');
      const r = await db.query(
        `INSERT INTO materials (batch_id, uploaded_by, title, description, type, url, text_body, size_bytes, is_pinned)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [batchId, c.get('user')!.id, title, description ?? null, type, url ?? null, text_body ?? null, size_bytes ?? null, !!is_pinned],
      );

      const students = await db.query(
        `SELECT student_id FROM batch_students WHERE batch_id = $1 AND status = 'active'`,
        [batchId],
      );
      await notifyMany(c.env, db, students.rows.map((s) => s.student_id), {
        type: 'material_added',
        title: `New material: ${title}`,
        linkUrl: `/dashboard/batches/${batchId}`,
      }).catch(() => {});

      return c.json(r.rows[0], 201);
    } catch (err) {
      console.error('POST materials error', err);
      return c.json({ error: 'Failed to add material' }, 500);
    }
  },
);

// PATCH /api/materials/:id — uploader or super_admin
materials.patch('/materials/:id', requireAuth, async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    const db = c.get('db');
    const ck = await db.query('SELECT uploaded_by FROM materials WHERE id = $1', [id]);
    if (ck.rows.length === 0) return c.json({ error: 'Not found' }, 404);
    if (c.get('user')!.role !== 'super_admin' && ck.rows[0].uploaded_by !== c.get('user')!.id) {
      return c.json({ error: 'Not your material' }, 403);
    }

    const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
    const fields = ['title', 'description', 'url', 'text_body', 'is_pinned'];
    const set: string[] = [];
    const values: unknown[] = [];
    for (const f of fields) {
      if (f in body) {
        values.push(body[f]);
        set.push(`${f} = $${values.length}`);
      }
    }
    if (set.length === 0) return c.json({ error: 'No fields to update' }, 400);
    values.push(id);
    const r = await db.query(`UPDATE materials SET ${set.join(', ')} WHERE id = $${values.length} RETURNING *`, values);
    return c.json(r.rows[0]);
  } catch {
    return c.json({ error: 'Failed to update material' }, 500);
  }
});

// DELETE /api/materials/:id
materials.delete('/materials/:id', requireAuth, async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    const db = c.get('db');
    const ck = await db.query('SELECT uploaded_by FROM materials WHERE id = $1', [id]);
    if (ck.rows.length === 0) return c.json({ error: 'Not found' }, 404);
    if (c.get('user')!.role !== 'super_admin' && ck.rows[0].uploaded_by !== c.get('user')!.id) {
      return c.json({ error: 'Not your material' }, 403);
    }
    await db.query('DELETE FROM materials WHERE id = $1', [id]);
    return c.body(null, 204);
  } catch {
    return c.json({ error: 'Failed to delete' }, 500);
  }
});

// POST /api/materials/upload-url — get signed PUT URL for direct R2 upload
materials.post(
  '/materials/upload-url',
  requireAuth,
  roleGuard('super_admin', 'teacher'),
  validateBody(SignedUploadSchema),
  async (c) => {
    try {
      const { filename, content_type } = getValid<{ filename: string; content_type: string }>(c);
      const result = await createSignedUpload(c.env, { filename, contentType: content_type, prefix: 'materials' });
      return c.json(result);
    } catch (err) {
      console.error('upload-url error', err);
      return c.json({ error: (err as Error).message || 'Failed to mint upload URL' }, 500);
    }
  },
);

export default materials;
