/**
 * Cloudflare RealtimeKit service
 *
 * Wraps the two REST endpoints we need to wire a `<RtkMeeting>` UI Kit
 * component on the frontend:
 *
 *   1. POST /accounts/:account/realtime/kit/:app/meetings              → createMeeting()
 *   2. POST /accounts/:account/realtime/kit/:app/meetings/:id/participants
 *                                                                     → addParticipant()
 *
 * Auth: a single Cloudflare API token (with "Realtime Admin" permission)
 * stored in CLOUDFLARE_API_TOKEN.
 */

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const APP_ID     = process.env.CLOUDFLARE_REALTIMEKIT_APP_ID;
const API_TOKEN  = process.env.CLOUDFLARE_API_TOKEN;

const HOST_PRESET        = process.env.CLOUDFLARE_REALTIMEKIT_HOST_PRESET        || 'group_call_host';
const PARTICIPANT_PRESET = process.env.CLOUDFLARE_REALTIMEKIT_PARTICIPANT_PRESET || 'group_call_participant';

const BASE = () =>
  `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/realtime/kit/${APP_ID}`;

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_TOKEN}`,
  };
}

function ensureConfigured() {
  if (!ACCOUNT_ID || !APP_ID || !API_TOKEN) {
    throw new Error(
      'RealtimeKit not configured: set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_REALTIMEKIT_APP_ID, CLOUDFLARE_API_TOKEN',
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Types (slim — we only surface the fields we actually use downstream)
// ─────────────────────────────────────────────────────────────────────────────

interface RtkEnvelope<T> {
  success: boolean;
  data: T;
  errors?: { code: number; message: string }[];
}

export interface RtkMeeting {
  id: string;
  title?: string;
  status?: string;
}

export interface RtkParticipantAuth {
  token: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// API helpers
// ─────────────────────────────────────────────────────────────────────────────

async function rtkFetch<T>(url: string, opts: RequestInit = {}): Promise<T> {
  ensureConfigured();
  const res = await fetch(url, {
    ...opts,
    headers: { ...authHeaders(), ...(opts.headers as Record<string, string> ?? {}) },
  });
  const body = (await res.json().catch(() => null)) as RtkEnvelope<T> | null;
  if (!res.ok || !body?.success) {
    const reason = body?.errors?.[0]?.message || `HTTP ${res.status}`;
    throw new Error(`RealtimeKit ${opts.method || 'GET'} ${url} failed: ${reason}`);
  }
  return body.data;
}

/**
 * Create a new RealtimeKit meeting. Idempotency is the caller's job — we
 * persist the returned `id` on the live_class row so subsequent /join
 * requests reuse it instead of calling this again.
 */
export async function createMeeting(title: string): Promise<RtkMeeting> {
  return rtkFetch<RtkMeeting>(`${BASE()}/meetings`, {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
}

/**
 * Mint a per-participant auth token. The token is short-lived and scoped to
 * a single meeting + a single human; ship it straight to the browser, do not
 * cache it on the server.
 */
export async function addParticipant(
  meetingId: string,
  args: { customId: string; name: string; picture?: string | null; presetName: string },
): Promise<RtkParticipantAuth> {
  return rtkFetch<RtkParticipantAuth>(`${BASE()}/meetings/${meetingId}/participants`, {
    method: 'POST',
    body: JSON.stringify({
      custom_participant_id: args.customId,
      preset_name: args.presetName,
      name: args.name,
      picture: args.picture ?? undefined,
    }),
  });
}

export const presets = {
  host: HOST_PRESET,
  participant: PARTICIPANT_PRESET,
};

export function isRealtimekitConfigured(): boolean {
  return Boolean(ACCOUNT_ID && APP_ID && API_TOKEN);
}
