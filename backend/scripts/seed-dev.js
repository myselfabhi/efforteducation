/* eslint-disable */
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
});

const PASSWORD = 'Effort@2025';

async function upsertUser(client, { username, email, role, full_name, phone = null, class_grade = null, bio = null }) {
  const hash = await bcrypt.hash(PASSWORD, 10);
  const r = await client.query(
    `INSERT INTO users (username, email, password_hash, role, full_name, phone, class_grade, bio)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (email) DO UPDATE
       SET role        = EXCLUDED.role,
           full_name   = EXCLUDED.full_name,
           phone       = EXCLUDED.phone,
           class_grade = EXCLUDED.class_grade,
           bio         = EXCLUDED.bio
     RETURNING id, username, email, role`,
    [username, email, hash, role, full_name, phone, class_grade, bio]
  );
  return r.rows[0];
}

async function upsertCourse(client, course) {
  const r = await client.query(
    `INSERT INTO courses (slug, title, category, description, duration_months, price_inr, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, TRUE)
     ON CONFLICT (slug) DO UPDATE
       SET title = EXCLUDED.title, category = EXCLUDED.category, description = EXCLUDED.description
     RETURNING id`,
    [course.slug, course.title, course.category, course.description, course.duration_months, course.price_inr]
  );
  return r.rows[0].id;
}

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Clear mutable seed data (safe for dev resets)
    await client.query('TRUNCATE batch_students, batch_teachers, live_class_attendance, live_classes, materials, batch_announcements, batches RESTART IDENTITY CASCADE');

    // Users — canonical platform accounts
    const superAdmin = await upsertUser(client, {
      username: 'admin',
      email: 'admin@efforteducation.in',
      role: 'super_admin',
      full_name: 'Super Admin',
    });

    const mk = await upsertUser(client, {
      username: 'mk',
      email: 'mk@efforteducation.in',
      role: 'teacher',
      full_name: 'MK',
    });

    const ishika = await upsertUser(client, {
      username: 'ishika',
      email: 'ishika@efforteducation.in',
      role: 'student',
      full_name: 'Ishika',
    });

    const abhinav = await upsertUser(client, {
      username: 'abhinav',
      email: 'abhinav@efforteducation.in',
      role: 'student',
      full_name: 'Abhinav',
    });

    // Courses
    const ibpsId = await upsertCourse(client, {
      slug: 'ibps-po',
      title: 'IBPS PO',
      category: 'banking',
      description: 'Complete preparation for IBPS Probationary Officer exam.',
      duration_months: 6,
      price_inr: 14999,
    });
    const ysId = await upsertCourse(client, {
      slug: 'young-scholar',
      title: 'Young Scholar Program',
      category: 'young-scholar',
      description: 'Weekend skill-building for Class 4–8: Current Affairs, Public Speaking, Quizzes, Fast Calculations, Reasoning.',
      duration_months: 12,
      price_inr: 999,
    });

    // Batches
    const b1 = await client.query(
      `INSERT INTO batches (course_id, name, start_date, schedule_description, status, created_by)
         VALUES ($1, $2, CURRENT_DATE, 'Mon–Fri 8–10 AM', 'active', $3)
       RETURNING id`,
      [ibpsId, 'IBPS PO Morning — May 2026', superAdmin.id]
    );
    const batch1 = b1.rows[0].id;

    const b2 = await client.query(
      `INSERT INTO batches (course_id, name, start_date, schedule_description, status, created_by)
         VALUES ($1, $2, CURRENT_DATE, 'Sat–Sun 10–12 PM', 'active', $3)
       RETURNING id`,
      [ysId, 'Young Scholar Weekend — May 2026', superAdmin.id]
    );
    const batch2 = b2.rows[0].id;

    await client.query(
      `INSERT INTO batch_teachers (batch_id, teacher_id, is_primary)
         VALUES ($1, $2, TRUE), ($3, $2, TRUE)
       ON CONFLICT DO NOTHING`,
      [batch1, mk.id, batch2]
    );

    for (const studentId of [ishika.id, abhinav.id]) {
      await client.query(
        `INSERT INTO batch_students (batch_id, student_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [batch1, studentId]
      );
      await client.query(
        `INSERT INTO batch_students (batch_id, student_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [batch2, studentId]
      );
    }

    await client.query('COMMIT');

    console.log('\n✅ Seed complete. Login with password: ' + PASSWORD);
    console.log('  super_admin: admin@efforteducation.in');
    console.log('  teacher:     mk@efforteducation.in');
    console.log('  students:    ishika@efforteducation.in, abhinav@efforteducation.in');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', e);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
