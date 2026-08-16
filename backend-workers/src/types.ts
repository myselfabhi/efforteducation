import type { Pool } from 'pg';

export type UserRole = 'super_admin' | 'teacher' | 'student' | 'admin' | 'user';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  full_name?: string | null;
}

/**
 * Worker bindings + secrets. Non-secret vars live in wrangler.toml [vars];
 * secrets are injected via `wrangler secret put` (or .dev.vars locally).
 */
export interface Env {
  // Bindings
  HYPERDRIVE: Hyperdrive;
  BUCKET: R2Bucket;
  QUIZ_ROOM: DurableObjectNamespace;
  CLASS_ROOM: DurableObjectNamespace;
  USER_HUB: DurableObjectNamespace;

  // Secrets
  JWT_SECRET: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  CLOUDFLARE_API_TOKEN: string;

  // Vars
  R2_ACCOUNT_ID: string;
  R2_BUCKET: string;
  R2_PUBLIC_URL: string;
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_REALTIMEKIT_APP_ID: string;
  CLOUDFLARE_REALTIMEKIT_HOST_PRESET?: string;
  CLOUDFLARE_REALTIMEKIT_PARTICIPANT_PRESET?: string;
  JITSI_DOMAIN?: string;
  FRONTEND_URL?: string;

  // Fallback used only by `wrangler dev` when Hyperdrive has no local binding.
  DATABASE_URL?: string;
}

/**
 * Per-request context variables. `db` is a fresh pooled connection created in
 * the db middleware; `user` is populated by requireAuth; `valid` holds the
 * zod-parsed request body from validateBody.
 */
export type Variables = {
  db: Pool;
  user?: AuthUser;
  valid?: unknown;
};

export type AppContext = { Bindings: Env; Variables: Variables };
