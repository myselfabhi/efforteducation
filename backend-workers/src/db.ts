import { Pool } from 'pg';
import type { MiddlewareHandler } from 'hono';
import type { AppContext, Env } from './types';

/**
 * Resolve the Postgres connection string. In production this comes from the
 * Hyperdrive binding (which pools + caches in front of Neon). During
 * `wrangler dev`, Hyperdrive may not have a real backing connection, so we
 * fall back to DATABASE_URL from .dev.vars.
 */
function connectionString(env: Env): string {
  const fromHyperdrive = env.HYPERDRIVE?.connectionString;
  if (fromHyperdrive) return fromHyperdrive;
  if (env.DATABASE_URL) return env.DATABASE_URL;
  throw new Error('No database connection: set the HYPERDRIVE binding or DATABASE_URL');
}

/**
 * Create a short-lived pool for a single request. This is the documented
 * node-postgres + Hyperdrive pattern on Workers: open per request, then close
 * after the response flushes via ctx.waitUntil. Hyperdrive owns the real
 * long-lived pool to Neon, so `max` here is intentionally small.
 */
export function createPool(env: Env): Pool {
  return new Pool({ connectionString: connectionString(env), max: 5 });
}

/**
 * Hono middleware that attaches a per-request pool as `c.get('db')` and tears
 * it down after the handler finishes. Route handlers keep calling
 * `c.get('db').query(sql, params)` with the same raw SQL as the Express app.
 */
export const withDb: MiddlewareHandler<AppContext> = async (c, next) => {
  const pool = createPool(c.env);
  c.set('db', pool);
  try {
    await next();
  } finally {
    c.executionCtx.waitUntil(pool.end());
  }
};
