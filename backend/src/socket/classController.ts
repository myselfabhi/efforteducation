import { Server, Socket } from 'socket.io';
import pool from '../db';

interface SocketUser {
  id: number;
  username: string;
  email: string;
  role: 'super_admin' | 'teacher' | 'student' | 'admin' | 'user';
  full_name?: string | null;
}

function userOf(socket: Socket): SocketUser {
  return (socket as any).user as SocketUser;
}

function roomKey(classId: number): string {
  return `class:${classId}`;
}

async function ensureMember(userId: number, role: string, classId: number): Promise<boolean> {
  if (role === 'super_admin' || role === 'admin') return true;
  const r = await pool.query('SELECT batch_id, teacher_id FROM live_classes WHERE id = $1', [classId]);
  if (r.rows.length === 0) return false;
  const { batch_id, teacher_id } = r.rows[0];
  if (role === 'teacher') {
    if (teacher_id === userId) return true;
    const t = await pool.query(
      'SELECT 1 FROM batch_teachers WHERE batch_id = $1 AND teacher_id = $2',
      [batch_id, userId]
    );
    return t.rows.length > 0;
  }
  if (role === 'student' || role === 'user') {
    const s = await pool.query(
      `SELECT 1 FROM batch_students WHERE batch_id = $1 AND student_id = $2 AND status = 'active'`,
      [batch_id, userId]
    );
    return s.rows.length > 0;
  }
  return false;
}

export function setupClassSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    const user = userOf(socket);
    if (!user) return;

    socket.on('class:join', async ({ classId }: { classId: number }) => {
      try {
        if (!Number.isInteger(classId)) return;
        const ok = await ensureMember(user.id, user.role, classId);
        if (!ok) {
          socket.emit('class:error', { message: 'Not a member of this class' });
          return;
        }

        socket.join(roomKey(classId));

        await pool.query(
          `INSERT INTO live_class_attendance (live_class_id, user_id, joined_at, last_heartbeat_at)
           VALUES ($1, $2, NOW(), NOW())
           ON CONFLICT (live_class_id, user_id) DO UPDATE
             SET last_heartbeat_at = NOW(),
                 left_at = NULL`,
          [classId, user.id]
        );

        io.to(roomKey(classId)).emit('class:participant-joined', {
          userId: user.id,
          username: user.username,
          fullName: user.full_name ?? null,
        });
      } catch (err) {
        console.error('class:join error', err);
      }
    });

    socket.on('class:heartbeat', async ({ classId }: { classId: number }) => {
      try {
        if (!Number.isInteger(classId)) return;
        await pool.query(
          `UPDATE live_class_attendance
              SET last_heartbeat_at = NOW(),
                  duration_seconds  = EXTRACT(EPOCH FROM (NOW() - joined_at))::INT
            WHERE live_class_id = $1 AND user_id = $2`,
          [classId, user.id]
        );
      } catch (err) {
        console.error('class:heartbeat error', err);
      }
    });

    socket.on('class:leave', async ({ classId }: { classId: number }) => {
      await markLeft(classId, user.id);
      socket.leave(roomKey(classId));
      io.to(roomKey(classId)).emit('class:participant-left', { userId: user.id });
    });

    // class:chat-message and class:hand-raise used to be relayed here when
    // the room was hand-rolled; RealtimeKit now owns both UX flows in-band,
    // so the legacy events were removed in commit cba2e7d's follow-up.

    socket.on('class:end', async ({ classId }: { classId: number }) => {
      try {
        if (!Number.isInteger(classId)) return;
        if (user.role !== 'super_admin' && user.role !== 'teacher' && user.role !== 'admin') return;

        const r = await pool.query(
          `UPDATE live_classes
              SET status = 'ENDED', ended_at = NOW()
            WHERE id = $1 AND status = 'LIVE'
              AND ($2 = 'super_admin' OR $2 = 'admin' OR teacher_id = $3)
            RETURNING id`,
          [classId, user.role, user.id]
        );
        if (r.rows.length === 0) return;

        io.to(roomKey(classId)).emit('class:ended', { classId });
      } catch (err) {
        console.error('class:end error', err);
      }
    });

    socket.on('disconnect', async () => {
      // Best-effort: mark attendance left on any rooms this socket was in.
      for (const room of socket.rooms) {
        if (room.startsWith('class:')) {
          const classId = parseInt(room.slice('class:'.length), 10);
          if (Number.isInteger(classId)) await markLeft(classId, user.id);
        }
      }
    });
  });
}

async function markLeft(classId: number, userId: number) {
  try {
    await pool.query(
      `UPDATE live_class_attendance
          SET left_at = NOW(),
              duration_seconds = EXTRACT(EPOCH FROM (NOW() - joined_at))::INT
        WHERE live_class_id = $1 AND user_id = $2 AND left_at IS NULL`,
      [classId, userId]
    );
  } catch (err) {
    console.error('markLeft error', err);
  }
}
