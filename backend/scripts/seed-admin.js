/* eslint-disable */
/**
 * Non-destructive seeder — upserts a single super_admin user.
 * Safe to run against production. Does NOT truncate or modify any other data.
 *
 * Usage (from backend/):
 *   node scripts/seed-admin.js
 *
 * Env it reads:
 *   DATABASE_URL          — required
 *   DATABASE_SSL          — set to "false" to disable SSL (default: SSL on, no cert verify)
 *   SUPER_ADMIN_EMAIL     — default: admin@efforteducation.in
 *   SUPER_ADMIN_USERNAME  — default: admin
 *   SUPER_ADMIN_PASSWORD  — default: Password123!  (rotate after first login)
 *   SUPER_ADMIN_NAME      — default: Super Admin
 */
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const EMAIL = process.env.SUPER_ADMIN_EMAIL || 'admin@efforteducation.in';
const USERNAME = process.env.SUPER_ADMIN_USERNAME || 'admin';
const PASSWORD = process.env.SUPER_ADMIN_PASSWORD || 'Password123!';
const NAME = process.env.SUPER_ADMIN_NAME || 'Super Admin';

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
});

async function main() {
  const client = await pool.connect();
  try {
    const hash = await bcrypt.hash(PASSWORD, 10);

    // Upsert by email — preserves existing rows, only updates role + password if needed
    const r = await client.query(
      `INSERT INTO users (username, email, password_hash, role, full_name)
         VALUES ($1, $2, $3, 'super_admin', $4)
       ON CONFLICT (email) DO UPDATE
         SET role          = 'super_admin',
             password_hash = EXCLUDED.password_hash,
             username      = COALESCE(users.username, EXCLUDED.username),
             full_name     = COALESCE(users.full_name, EXCLUDED.full_name)
       RETURNING id, username, email, role`,
      [USERNAME, EMAIL, hash, NAME]
    );

    const user = r.rows[0];
    console.log('✅ Super admin ready:');
    console.log('   email:    ' + user.email);
    console.log('   username: ' + user.username);
    console.log('   role:     ' + user.role);
    console.log('   password: (the value of SUPER_ADMIN_PASSWORD or default)');
    console.log('');
    console.log('🔐 Rotate this password from the dashboard after first login.');
  } catch (err) {
    console.error('❌ Failed to seed super admin:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
