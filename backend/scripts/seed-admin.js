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
    // Check if user exists already — if so, only ensure role is super_admin
    // and don't touch the password (in case it was rotated).
    const existing = await client.query(
      'SELECT id, role FROM users WHERE email = $1',
      [EMAIL]
    );

    if (existing.rows.length > 0) {
      const cur = existing.rows[0];
      if (cur.role === 'super_admin') {
        console.log('✓ Super admin already exists with correct role; nothing to do.');
        return;
      }
      await client.query(
        `UPDATE users SET role = 'super_admin' WHERE email = $1`,
        [EMAIL]
      );
      console.log('✓ Promoted existing user to super_admin (password unchanged): ' + EMAIL);
      return;
    }

    // User doesn't exist — create with the configured password
    const hash = await bcrypt.hash(PASSWORD, 10);
    const r = await client.query(
      `INSERT INTO users (username, email, password_hash, role, full_name)
         VALUES ($1, $2, $3, 'super_admin', $4)
       RETURNING id, username, email, role`,
      [USERNAME, EMAIL, hash, NAME]
    );
    const user = r.rows[0];
    console.log('✅ Super admin created:');
    console.log('   email:    ' + user.email);
    console.log('   username: ' + user.username);
    console.log('   role:     ' + user.role);
    console.log('   password: (the value of SUPER_ADMIN_PASSWORD env var, or default)');
    console.log('');
    console.log('🔐 Rotate this password after first login.');
  } catch (err) {
    console.error('❌ Failed to seed super admin:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
