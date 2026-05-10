import { customAlphabet } from 'nanoid';

const ROOM_SUFFIX = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 8);
const PASSWORD = customAlphabet('ABCDEFGHJKMNPQRSTUVWXYZ23456789', 10);

export const JITSI_DOMAIN = process.env.JITSI_DOMAIN || 'meet.jit.si';

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
  // Cloudflare RealtimeKit credentials. Optional during the migration window
  // — when present, the frontend renders <RtkMeeting>; when absent, it falls
  // back to the manual <CloudflareRoom> path against the Calls SFU REST API.
  realtimekit?: { authToken: string; meetingId: string };
}

export function buildCredentials(opts: {
  room: string;
  password: string | null;
  isModerator: boolean;
  user: { id: number; name: string; email: string };
}): JitsiCredentials {
  return {
    domain: JITSI_DOMAIN,
    room: opts.room,
    password: opts.password,
    isModerator: opts.isModerator,
    user: opts.user,
  };
}
