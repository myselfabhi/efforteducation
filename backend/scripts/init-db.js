const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function init() {
  const schema = fs.readFileSync(path.join(__dirname, '../schema.sql'), 'utf8');
  console.log('⏳ Initializing database...');
  
  try {
    const client = await pool.connect();
    // Use a transaction
    try {
      await client.query('BEGIN');
      await client.query(schema);
      await client.query('COMMIT');
      console.log('✅ Database initialized successfully!');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('❌ Failed to initialize database:', err);
  } finally {
    await pool.end();
  }
}

init();
