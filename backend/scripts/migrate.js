/* eslint-disable */
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const MIGRATIONS_DIR = path.join(__dirname, '..', 'src', 'migrations');

// Step-1 enum migrations cannot run inside a transaction with code that
// reads the new value, so we identify them by name and run them
// auto-commit. Step-2+ run in a single transaction each.
const NON_TRANSACTIONAL_PATTERN = /step1.*enum/i;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
});

async function ensureLedger(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename   TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

async function appliedSet(client) {
  const r = await client.query('SELECT filename FROM schema_migrations');
  return new Set(r.rows.map((row) => row.filename));
}

async function runMigration(client, file, sql, transactional) {
  console.log(`▶ applying ${file}${transactional ? '' : ' (no transaction)'}`);
  if (transactional) {
    await client.query('BEGIN');
    try {
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file]);
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    }
  } else {
    await client.query(sql);
    await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file]);
  }
}

async function main() {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    console.log('No migrations directory; nothing to do.');
    return;
  }

  const files = fs.readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith('.sql')).sort();
  if (files.length === 0) {
    console.log('No migration files found.');
    return;
  }

  const client = await pool.connect();
  try {
    await ensureLedger(client);
    const applied = await appliedSet(client);

    for (const file of files) {
      if (applied.has(file)) {
        console.log(`✓ skip ${file} (already applied)`);
        continue;
      }
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
      const transactional = !NON_TRANSACTIONAL_PATTERN.test(file);
      await runMigration(client, file, sql, transactional);
      console.log(`✓ done   ${file}`);
    }

    console.log('All migrations up to date.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
