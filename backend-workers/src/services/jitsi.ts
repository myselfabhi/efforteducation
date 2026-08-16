import { customAlphabet } from 'nanoid';

const ROOM_SUFFIX = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 8);
const PASSWORD = customAlphabet('ABCDEFGHJKMNPQRSTUVWXYZ23456789', 10);

export function jitsiDomain(env: { JITSI_DOMAIN?: string }): string {
  return env.JITSI_DOMAIN || 'meet.jit.si';
}

/** Generate an unguessable room id, scoped to batch + class. */
export function generateRoomId(batchId: number, classId: number): string {
  return `eduplat-${batchId}-${classId}-${ROOM_SUFFIX()}`;
}

export function generateRoomPassword(): string {
  return PASSWORD();
}

export interface JitsiCredentials {
  domain: string;
  room: string;
  password: string | null;
  isModerator: boolean;
  user: { id: number; name: string; email: string };
  // Populated at runtime after the RealtimeKit REST round-trip; the frontend
  // shows an "unavailable" screen if it comes back undefined.
  realtimekit?: { authToken: string; meetingId: string };
}

export function buildCredentials(opts: {
  domain: string;
  room: string;
  password: string | null;
  isModerator: boolean;
  user: { id: number; name: string; email: string };
}): JitsiCredentials {
  return {
    domain: opts.domain,
    room: opts.room,
    password: opts.password,
    isModerator: opts.isModerator,
    user: opts.user,
  };
}
