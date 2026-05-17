/* eslint-disable */
/**
 * setup-users.js — Reset all user-related data and create the canonical platform users.
 *
 * Clears:    users + every table that depends on users (batches, quizzes, attendance, etc.)
 * Preserves: courses, schema_migrations
 *
 * Usage:
 *   Local:  node scripts/setup-users.js
 *   Prod:   DATABASE_URL=<prod-url> DATABASE_SSL=true node scripts/setup-users.js
 */
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
});

const PASSWORD = 'Effort@2025';

const USERS = [
  { username: 'admin',   email: 'admin@efforteducation.in',   role: 'super_admin', full_name: 'Super Admin' },
  { username: 'mk',      email: 'mk@efforteducation.in',      role: 'teacher',     full_name: 'MK' },
  { username: 'ishika',  email: 'ishika@efforteducation.in',  role: 'student',     full_name: 'Ishika' },
  { username: 'abhinav', email: 'abhinav@efforteducation.in', role: 'student',     full_name: 'Abhinav' },
];

async function main() {
  const client = await pool.connect();
  try {
    console.log('⚠️  This will DELETE all existing users and all dependent data (batches, quizzes, etc.)');
    console.log('   Courses are preserved.\n');

    await client.query('BEGIN');

    // CASCADE clears batch_teachers, batch_students, batches, live_classes, materials,
    // batch_announcements, batch_enrolment_requests, quizzes, questions, options,
    // responses, scores, quiz_violations, notifications automatically.
    await client.query('TRUNCATE users RESTART IDENTITY CASCADE');
    console.log('✓ Cleared all users and dependent data');

    const hash = await bcrypt.hash(PASSWORD, 10);

    for (const u of USERS) {
      const r = await client.query(
        `INSERT INTO users (username, email, password_hash, role, full_name)
           VALUES ($1, $2, $3, $4, $5)
         RETURNING id, email, role`,
        [u.username, u.email, hash, u.role, u.full_name]
      );
      const row = r.rows[0];
      console.log(`✓ [${row.role.padEnd(11)}] ${row.email}  (id=${row.id})`);
    }

    await client.query('COMMIT');

    console.log('\n✅ Done. Password for all users: ' + PASSWORD);
    console.log('   🔐 Change passwords after first login.\n');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Setup failed:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
