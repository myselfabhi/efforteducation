import { Hono } from 'hono';
import type { AppContext } from '../types';
import { notifyMany } from '../services/notifications';

const webhooks = new Hono<AppContext>();

// POST /api/webhooks/realtimekit?token=<secret>
// RealtimeKit calls this on recording.statusUpdate. The URL carries a shared
// secret (set RTK_WEBHOOK_SECRET and register the URL with ?token=that). When a
// recording reaches UPLOADED we copy the file into our R2 (RealtimeKit deletes
// originals after 7 days), store the permanent URL, and notify the class.
webhooks.post('/realtimekit', async (c) => {
  if (c.env.RTK_WEBHOOK_SECRET && c.req.query('token') !== c.env.RTK_WEBHOOK_SECRET) {
    return c.json({ error: 'forbidden' }, 403);
  }

  const body = (await c.req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return c.json({ ok: true }); // ack malformed bodies, nothing to do

  // Be liberal about where the recording object lives in the payload.
  const rec = (body.recording ?? body.data ?? body.payload ?? body) as Record<string, unknown>;
  const recordingId = String(rec.id ?? rec.recording_id ?? '');
  const statusRaw = String(rec.status ?? body.event ?? '').toUpperCase();
  const downloadUrl = (rec.download_url ?? rec.output_file_name ?? rec.url) as string | undefined;
  const meetingId = (rec.meeting_id ?? rec.meetingId) as string | undefined;

  const db = c.get('db');

  // Locate the class this recording belongs to.
  const found = await db.query(
    `SELECT id, batch_id, title, recording_status FROM live_classes
      WHERE ($1 <> '' AND recording_id = $1) OR ($2 <> '' AND realtimekit_meeting_id = $2)
      ORDER BY id DESC LIMIT 1`,
    [recordingId, meetingId ?? ''],
  );
  if (found.rows.length === 0) return c.json({ ok: true }); // unknown recording — ack
  const cls = found.rows[0];

  if (statusRaw.includes('ERROR')) {
    await db.query(`UPDATE live_classes SET recording_status = 'ERRORED' WHERE id = $1`, [cls.id]);
    return c.json({ ok: true });
  }

  // Only act on the terminal UPLOADED state, and only once.
  if (!statusRaw.includes('UPLOADED') || cls.recording_status === 'UPLOADED') {
    return c.json({ ok: true });
  }
  if (!downloadUrl) return c.json({ ok: true });

  try {
    const key = `recordings/${cls.id}-${recordingId || Date.now()}.mp4`;
    const src = await fetch(downloadUrl);
    if (!src.ok || !src.body) throw new Error(`fetch recording failed: HTTP ${src.status}`);
    await c.env.BUCKET.put(key, src.body, { httpMetadata: { contentType: 'video/mp4' } });
    const publicUrl = `${(c.env.R2_PUBLIC_URL || '').replace(/\/$/, '')}/${key}`;

    await db.query(
      `UPDATE live_classes SET recording_url = $1, recording_status = 'UPLOADED' WHERE id = $2`,
      [publicUrl, cls.id],
    );

    const students = await db.query(
      `SELECT student_id FROM batch_students WHERE batch_id = $1 AND status = 'active'`,
      [cls.batch_id],
    );
    await notifyMany(
      c.env, db, students.rows.map((r) => r.student_id),
      { type: 'recording_ready', title: 'Recording ready', body: cls.title, linkUrl: '/dashboard/student/recordings' },
    );
  } catch (err) {
    console.error('[webhook] recording store failed', err);
    await db.query(`UPDATE live_classes SET recording_status = 'ERRORED' WHERE id = $1`, [cls.id]).catch(() => {});
  }

  return c.json({ ok: true });
});

export default webhooks;
