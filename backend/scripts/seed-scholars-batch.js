/* eslint-disable */
/**
 * seed-scholars-batch.js — Creates the Scholars/Elites Batch with 22 students and MK as teacher.
 *
 * Safe to run multiple times (upserts users, upserts batch, upserts enrolments).
 *
 * Usage:
 *   Local:  node scripts/seed-scholars-batch.js
 *   Prod:   DATABASE_URL=<prod-url> node scripts/seed-scholars-batch.js
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

const STUDENTS = [
  { username: 'amayrana',           email: 'amay.rana@scholar.ee',           full_name: 'Amay Singh Rana' },
  { username: 'ananyaambhrit',      email: 'ananya.ambhrit@scholar.ee',      full_name: 'Ananya Ambhrit' },
  { username: 'anveshikasahay',     email: 'anveshika.sahay@scholar.ee',     full_name: 'Anveshika Sahay' },
  { username: 'shauryahiwase',      email: 'shaurya.hiwase@scholar.ee',      full_name: 'Shaurya Hiwase' },
  { username: 'ananyabipin',        email: 'ananya.bipin@scholar.ee',        full_name: 'Ananya Bipin' },
  { username: 'prishahiwase',       email: 'prisha.hiwase@scholar.ee',       full_name: 'Prisha Hiwase' },
  { username: 'adrijamitra',        email: 'adrija.mitra@scholar.ee',        full_name: 'Adrija Mitra' },
  { username: 'adhritpanda',        email: 'adhrit.panda@scholar.ee',        full_name: 'Adhrit Panda' },
  { username: 'avneeshlondhe',      email: 'avneesh.londhe@scholar.ee',      full_name: 'Avneesh Londhe' },
  { username: 'aaryashjain',        email: 'aaryash.jain@scholar.ee',        full_name: 'Aaryash Jain' },
  { username: 'nirvaansrivastava',  email: 'nirvaan.srivastava@scholar.ee',  full_name: 'Nirvaan Srivastava' },
  { username: 'nilaychandra',       email: 'nilay.chandra@scholar.ee',       full_name: 'Nilay Chandra' },
  { username: 'adhisthitsachin',    email: 'adhisthit.sachin@scholar.ee',    full_name: 'Adhisthit Sachin' },
  { username: 'khayakunileisan',    email: 'khayakuni.leisan@scholar.ee',    full_name: 'Khayakuni Leisan' },
  { username: 'prateekrana',        email: 'prateek.rana@scholar.ee',        full_name: 'Prateek Rana' },
  { username: 'vivanshacharya',     email: 'vivansh.acharya@scholar.ee',     full_name: 'Vivansh Acharya' },
  { username: 'jimitchauhan',       email: 'jimit.chauhan@scholar.ee',       full_name: 'Jimit Chauhan' },
  { username: 'samarthjha',         email: 'samarth.jha@scholar.ee',         full_name: 'Samarth Jha' },
  { username: 'adrikajha',          email: 'adrika.jha@scholar.ee',          full_name: 'Adrika Jha' },
  { username: 'viaansingh',         email: 'viaan.singh@scholar.ee',         full_name: 'Viaan Singh' },
  { username: 'akshajmalhotra',     email: 'akshaj.malhotra@scholar.ee',     full_name: 'Akshaj Malhotra' },
  { username: 'ruhanali',           email: 'ruhan.ali@scholar.ee',           full_name: 'Ruhan Ali' },
];

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Resolve admin (created_by) and MK (teacher)
    const adminRes = await client.query(`SELECT id FROM users WHERE email = 'admin@efforteducation.in'`);
    if (!adminRes.rows.length) throw new Error('admin@efforteducation.in not found — run setup-users first');
    const adminId = adminRes.rows[0].id;

    const mkRes = await client.query(`SELECT id FROM users WHERE email = 'mk@efforteducation.in'`);
    if (!mkRes.rows.length) throw new Error('mk@efforteducation.in not found — run setup-users first');
    const mkId = mkRes.rows[0].id;

    // Ensure the Young Scholar Program course exists
    const courseRes = await client.query(
      `INSERT INTO courses (slug, title, category, description, duration_months, price_inr, is_published)
         VALUES ('young-scholar', 'Young Scholar Program', 'young-scholar',
                 'Weekend skill-building: Current Affairs, Public Speaking, Quizzes, Fast Calculations, Reasoning.',
                 12, 999, TRUE)
       ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title
       RETURNING id`
    );
    const courseId = courseRes.rows[0].id;

    // Create the Scholars/Elites Batch
    const batchRes = await client.query(
      `INSERT INTO batches (course_id, name, start_date, schedule_description, status, created_by)
         VALUES ($1, 'Scholars/Elites Batch', CURRENT_DATE, 'Weekend sessions', 'active', $2)
       ON CONFLICT DO NOTHING
       RETURNING id`,
      [courseId, adminId]
    );

    let batchId;
    if (batchRes.rows.length > 0) {
      batchId = batchRes.rows[0].id;
      console.log(`✓ Created batch "Scholars/Elites Batch" (id=${batchId})`);
    } else {
      const existing = await client.query(
        `SELECT id FROM batches WHERE name = 'Scholars/Elites Batch' AND course_id = $1`, [courseId]
      );
      batchId = existing.rows[0].id;
      console.log(`✓ Batch already exists (id=${batchId})`);
    }

    // Assign MK as primary teacher
    await client.query(
      `INSERT INTO batch_teachers (batch_id, teacher_id, is_primary)
         VALUES ($1, $2, TRUE)
       ON CONFLICT DO NOTHING`,
      [batchId, mkId]
    );
    console.log(`✓ MK assigned as teacher`);

    // Upsert all 22 students and enrol them
    const hash = await bcrypt.hash(PASSWORD, 10);
    let created = 0, existing = 0;

    for (const s of STUDENTS) {
      const userRes = await client.query(
        `INSERT INTO users (username, email, password_hash, role, full_name)
           VALUES ($1, $2, $3, 'student', $4)
         ON CONFLICT (email) DO UPDATE
           SET full_name = EXCLUDED.full_name
         RETURNING id, (xmax = 0) AS inserted`,
        [s.username, s.email, hash, s.full_name]
      );
      const userId = userRes.rows[0].id;
      const isNew = userRes.rows[0].inserted;
      if (isNew) created++; else existing++;

      await client.query(
        `INSERT INTO batch_students (batch_id, student_id)
           VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [batchId, userId]
      );
    }

    await client.query('COMMIT');

    console.log(`✓ Students: ${created} created, ${existing} already existed`);
    console.log(`\n✅ Scholars/Elites Batch is live with ${STUDENTS.length} students.`);
    console.log(`   Password for all new accounts: ${PASSWORD}`);
    console.log('\n   Roster:');
    STUDENTS.forEach((s, i) => console.log(`   ${String(i + 1).padStart(2)}. ${s.full_name.padEnd(22)} ${s.email}`));
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Failed:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
