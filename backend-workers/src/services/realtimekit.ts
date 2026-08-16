import type { Env } from '../types';

/**
 * Cloudflare RealtimeKit service — thin wrapper over the two REST endpoints we
 * use. Runs unchanged on Workers (native fetch); the only port from the Express
 * version is reading config from `env` instead of process.env.
 */

const base = (env: Env) =>
  `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/realtime/kit/${env.CLOUDFLARE_REALTIMEKIT_APP_ID}`;

function authHeaders(env: Env) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
  };
}

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

async function rtkFetch<T>(env: Env, url: string, opts: RequestInit = {}): Promise<T> {
  if (!isRealtimekitConfigured(env)) {
    throw new Error(
      'RealtimeKit not configured: set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_REALTIMEKIT_APP_ID, CLOUDFLARE_API_TOKEN',
    );
  }
  const res = await fetch(url, {
    ...opts,
    headers: { ...authHeaders(env), ...((opts.headers as Record<string, string>) ?? {}) },
  });
  const body = (await res.json().catch(() => null)) as RtkEnvelope<T> | null;
  if (!res.ok || !body?.success) {
    const reason = body?.errors?.[0]?.message || `HTTP ${res.status}`;
    throw new Error(`RealtimeKit ${opts.method || 'GET'} ${url} failed: ${reason}`);
  }
  return body.data;
}

export async function createMeeting(env: Env, title: string): Promise<RtkMeeting> {
  return rtkFetch<RtkMeeting>(env, `${base(env)}/meetings`, {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
}

export async function addParticipant(
  env: Env,
  meetingId: string,
  args: { customId: string; name: string; picture?: string | null; presetName: string },
): Promise<RtkParticipantAuth> {
  return rtkFetch<RtkParticipantAuth>(env, `${base(env)}/meetings/${meetingId}/participants`, {
    method: 'POST',
    body: JSON.stringify({
      custom_participant_id: args.customId,
      preset_name: args.presetName,
      name: args.name,
      picture: args.picture ?? undefined,
    }),
  });
}

export function presets(env: Env) {
  return {
    host: env.CLOUDFLARE_REALTIMEKIT_HOST_PRESET || 'group_call_host',
    participant: env.CLOUDFLARE_REALTIMEKIT_PARTICIPANT_PRESET || 'group_call_participant',
  };
}

export function isRealtimekitConfigured(env: Env): boolean {
  return Boolean(
    env.CLOUDFLARE_ACCOUNT_ID && env.CLOUDFLARE_REALTIMEKIT_APP_ID && env.CLOUDFLARE_API_TOKEN,
  );
}
