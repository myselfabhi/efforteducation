import fs from 'node:fs';
import pg from 'pg';

const BASE = 'https://quiz-backend.abhinav-00714802720.workers.dev';
const pool = new pg.Pool({ connectionString: fs.readFileSync(process.env.NEON_URL_FILE, 'utf8') });
const stamp = Date.now();
const email = `r2test_${stamp}@example.com`;

const reg = await fetch(`${BASE}/api/auth/register`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: `r2test${stamp % 1000000}`, email, password: 'testpass123', full_name: 'R2 Test' }),
}).then((r) => r.json());
const uid = reg.user.id;
await pool.query(`UPDATE users SET role='super_admin' WHERE id=$1`, [uid]);
const token = await fetch(`${BASE}/api/auth/login`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password: 'testpass123' }),
}).then((r) => r.json()).then((r) => r.token);
console.log('admin user', uid, '| token len', token.length);

const resp = await fetch(`${BASE}/api/materials/upload-url`, {
  method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body: JSON.stringify({ filename: 'r2-smoke-test.txt', content_type: 'text/plain', size_bytes: 24 }),
}).then((r) => r.json());
console.log('=== upload-url response ===');
console.log(JSON.stringify(resp).slice(0, 400));

if (resp.uploadUrl) {
  const putRes = await fetch(resp.uploadUrl, { method: 'PUT', headers: { 'Content-Type': 'text/plain' }, body: 'R2 materials upload OK!' });
  console.log('=== PUT to R2 signed URL →', putRes.status, '===');
  await new Promise((r) => setTimeout(r, 1200));
  const getRes = await fetch(resp.publicUrl);
  const body = await getRes.text();
  console.log('=== GET public URL →', getRes.status, '| body:', JSON.stringify(body), '===');
}

await pool.query(`DELETE FROM users WHERE id=$1`, [uid]);
await pool.end();
console.log('cleaned up test user', uid);
process.exit(0);
