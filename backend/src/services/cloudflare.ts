/**
 * Cloudflare Calls (RealtimeKit) service
 * Wraps the REST API used for WebRTC session management.
 *
 * Every session is per-participant, per-class.
 * Participants push their local tracks and pull remote tracks
 * through the Cloudflare SFU.
 */

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!;
const APP_SECRET  = process.env.CLOUDFLARE_CALLS_APP_SECRET!;
const APP_ID      = process.env.CLOUDFLARE_CALLS_APP_ID!;

const BASE = () =>
  `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/calls/sessions`;

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${APP_SECRET}`,
});

// ─────────────────────────────────────────────────────────────────────────────
// Types (mirrors Cloudflare Calls REST shapes)
// ─────────────────────────────────────────────────────────────────────────────

export interface CFSession {
  sessionId: string;
}

export interface CFSessionDescription {
  type: 'offer' | 'answer';
  sdp: string;
}

export interface CFLocalTrack {
  location: 'local';
  trackName: string;
  mid?: string;
}

export interface CFRemoteTrack {
  location: 'remote';
  sessionId: string;
  trackName: string;
}

export interface CFTracksResponse {
  sessionDescription?: CFSessionDescription;
  tracks: { trackName: string; mid: string }[];
  requiresImmediateRenegotiation?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// API helpers
// ─────────────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function cfFetch(url: string, opts: RequestInit = {}): Promise<any> {
  const res = await fetch(url, { ...opts, headers: { ...authHeaders(), ...(opts.headers as Record<string, string> ?? {}) } });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Cloudflare Calls API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<any>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/** Create a new Cloudflare Calls session for a participant. */
export async function createSession(): Promise<CFSession> {
  const data = await cfFetch(`${BASE()}/new`, { method: 'POST' });
  return { sessionId: data.result.sessionId as string };
}

/**
 * Push local tracks to the SFU.
 * @param sessionId  The participant's session on CF Calls.
 * @param offer      SDP offer from the participant's RTCPeerConnection.
 * @param tracks     Array of local track descriptors (trackName matches transceiver mid).
 */
export async function pushTracks(
  sessionId: string,
  offer: string,
  tracks: CFLocalTrack[]
): Promise<CFTracksResponse> {
  const data = await cfFetch(`${BASE()}/${sessionId}/tracks/new`, {
    method: 'POST',
    body: JSON.stringify({
      sessionDescription: { type: 'offer', sdp: offer },
      tracks,
    }),
  });
  return data.result as CFTracksResponse;
}

/**
 * Pull remote tracks from other participants into this session.
 * If CF Calls requires renegotiation it returns an offer; the client must
 * answer that offer and call renegotiate().
 */
export async function pullTracks(
  sessionId: string,
  remoteTracks: CFRemoteTrack[]
): Promise<CFTracksResponse> {
  const data = await cfFetch(`${BASE()}/${sessionId}/tracks/new`, {
    method: 'POST',
    body: JSON.stringify({ tracks: remoteTracks }),
  });
  return data.result as CFTracksResponse;
}

/**
 * Send the client's SDP answer back to CF Calls after a pull-triggered
 * renegotiation.
 */
export async function renegotiate(sessionId: string, answer: string): Promise<void> {
  await cfFetch(`${BASE()}/${sessionId}/renegotiate`, {
    method: 'PUT',
    body: JSON.stringify({
      sessionDescription: { type: 'answer', sdp: answer },
    }),
  });
}

/** Close specific tracks on a session (called on leave). */
export async function closeTracks(
  sessionId: string,
  tracks: { mid: string }[]
): Promise<void> {
  await cfFetch(`${BASE()}/${sessionId}/tracks/close`, {
    method: 'PUT',
    body: JSON.stringify({ tracks, force: true }),
  });
}

/** Expose app credentials so the backend routes can return them. */
export const cfConfig = () => ({
  appId: APP_ID,
  accountId: ACCOUNT_ID,
});
// env vars required: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_CALLS_APP_ID, CLOUDFLARE_CALLS_APP_SECRET
