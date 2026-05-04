import { Router, Response } from 'express';
import pool from '../db';
import { authMiddleware, roleGuard, batchMember, AuthRequest } from '../middleware/auth';
import { CreateMaterialSchema, SignedUploadSchema, validateBody } from '../lib/validation';
import { createSignedUpload } from '../services/storage';
import { notifyMany } from '../services/notifications';

const router = Router();

// GET /api/batches/:id/materials — members
router.get('/batches/:id/materials', authMiddleware, batchMember('id'), async (req: AuthRequest, res: Response) => {
  try {
    const r = await pool.query(
      `SELECT m.*, u.username AS uploader_username, u.full_name AS uploader_name
         FROM materials m JOIN users u ON u.id = m.uploaded_by
        WHERE m.batch_id = $1
        ORDER BY m.is_pinned DESC, m.created_at DESC`,
      [parseInt(req.params.id, 10)]
    );
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load materials' });
  }
});

// POST /api/batches/:id/materials — teacher of batch / super_admin
router.post(
  '/batches/:id/materials',
  authMiddleware,
  roleGuard('super_admin', 'teacher'),
  batchMember('id'),
  validateBody(CreateMaterialSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const batchId = parseInt(req.params.id, 10);
      const { title, description, type, url, text_body, size_bytes, is_pinned } = req.body;

      if (type === 'text_note' && !text_body) {
        return res.status(400).json({ error: 'text_body required for text_note' });
      }
      if (type !== 'text_note' && !url) {
        return res.status(400).json({ error: 'url required for non-text materials' });
      }

      const r = await pool.query(
        `INSERT INTO materials (batch_id, uploaded_by, title, description, type, url, text_body, size_bytes, is_pinned)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [batchId, req.user!.id, title, description ?? null, type, url ?? null, text_body ?? null, size_bytes ?? null, !!is_pinned]
      );

      const students = await pool.query(
        `SELECT student_id FROM batch_students WHERE batch_id = $1 AND status = 'active'`,
        [batchId]
      );
      notifyMany(students.rows.map((s) => s.student_id), {
        type: 'material_added',
        title: `New material: ${title}`,
        linkUrl: `/dashboard/batches/${batchId}`,
      }).catch(() => {});

      res.status(201).json(r.rows[0]);
    } catch (err) {
      console.error('POST materials error', err);
      res.status(500).json({ error: 'Failed to add material' });
    }
  }
);

// PATCH /api/materials/:id — uploader or super_admin
router.patch('/materials/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const ck = await pool.query('SELECT uploaded_by FROM materials WHERE id = $1', [id]);
    if (ck.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    if (req.user!.role !== 'super_admin' && ck.rows[0].uploaded_by !== req.user!.id) {
      return res.status(403).json({ error: 'Not your material' });
    }

    const fields = ['title', 'description', 'url', 'text_body', 'is_pinned'];
    const set: string[] = [];
    const values: any[] = [];
    for (const f of fields) {
      if (f in req.body) { values.push(req.body[f]); set.push(`${f} = $${values.length}`); }
    }
    if (set.length === 0) return res.status(400).json({ error: 'No fields to update' });
    values.push(id);
    const r = await pool.query(`UPDATE materials SET ${set.join(', ')} WHERE id = $${values.length} RETURNING *`, values);
    res.json(r.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update material' });
  }
});

// DELETE /api/materials/:id
router.delete('/materials/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const ck = await pool.query('SELECT uploaded_by FROM materials WHERE id = $1', [id]);
    if (ck.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    if (req.user!.role !== 'super_admin' && ck.rows[0].uploaded_by !== req.user!.id) {
      return res.status(403).json({ error: 'Not your material' });
    }
    await pool.query('DELETE FROM materials WHERE id = $1', [id]);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// POST /api/materials/upload-url — get signed PUT URL for direct R2 upload
router.post(
  '/materials/upload-url',
  authMiddleware,
  roleGuard('super_admin', 'teacher'),
  validateBody(SignedUploadSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const { filename, content_type } = req.body;
      const result = await createSignedUpload({ filename, contentType: content_type, prefix: 'materials' });
      res.json(result);
    } catch (err: any) {
      console.error('upload-url error', err);
      res.status(500).json({ error: err.message || 'Failed to mint upload URL' });
    }
  }
);

export default router;
