# Effort Education — LMS v2

Online coaching platform for a 34-year-old institute (est. 1990).
Two product surfaces in one repo:

1. **Marketing site** — landing, courses, programs, contact, Young Scholar Program.
2. **LMS dashboard** — three roles (super_admin / teacher / student), batches, materials,
   real-time quizzes, and live video classes via Jitsi Meet.

```
backend/    Express + Socket.IO + Postgres + Redis  (TypeScript)
frontend/   Next.js 15 + React 19 + Tailwind v4    (TypeScript)
```

---

## Quick start (local)

You need **Postgres** and **Redis** running locally (or pointed to via env vars).

### 1. Backend

```bash
cd backend
npm install

# .env (or export):
#   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/effortedu
#   REDIS_URL=redis://localhost:6379
#   JWT_SECRET=<a long random string>
#   PORT=4000
#   FRONTEND_URL=http://localhost:3000
#   JITSI_DOMAIN=meet.jit.si              # default; later: meet.yourdomain.com
#
#   # Materials uploads (optional locally — needed for the upload form)
#   R2_ACCOUNT_ID=<cloudflare account>
#   R2_ACCESS_KEY_ID=<r2 key>
#   R2_SECRET_ACCESS_KEY=<r2 secret>
#   R2_BUCKET=<bucket name>
#   R2_PUBLIC_URL=https://<bucket>.r2.dev
#
#   DATABASE_SSL=false                    # set when running against local Postgres without SSL

# One-time setup: initial schema + LMS-v2 migrations + dev seed
node scripts/init-db.js   # creates the original tables
npm run migrate           # runs src/migrations/*.sql with a ledger
npm run seed:dev          # 1 super_admin, 2 teachers, 5 students, 2 batches

npm run dev               # ts-node-dev on http://localhost:4000
```

Seeded login (password: **`Password123!`**):

| Role        | Email                              |
| ----------- | ---------------------------------- |
| super_admin | admin@efforteducation.in           |
| teacher     | neha.teacher@efforteducation.in    |
| teacher     | arjun.teacher@efforteducation.in   |
| student     | student1@example.com … student5@example.com |

### 2. Frontend

```bash
cd frontend
npm install

# .env.local:
#   NEXT_PUBLIC_API_URL=http://localhost:4000
#   NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
#
#   # EmailJS for the marketing contact form (optional locally)
#   NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
#   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=...
#   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...

npm run dev               # Next on http://localhost:3000
```

Visit:

- `/` — redesigned landing
- `/login` — unified login (legacy `/quiz/login` 301-redirects here)
- `/dashboard` — role-aware redirect to `/dashboard/{admin,teacher,student}`

---

## Architecture

### Roles

```
super_admin  full access: users, courses, batches, classes, quizzes, materials
teacher      own batches: schedule classes, upload materials, post announcements,
             create quizzes, run live classes, enroll students
student      enrolled batches: read materials, attend classes, take quizzes,
             see leaderboard + own results
```

Existing legacy `admin` and `user` rows are auto-migrated to `super_admin` and
`student` (see `backend/src/migrations/002_lms_v2_step2_schema.sql`). The auth
middleware also normalises legacy values in old JWTs so existing tokens keep
working.

### Live classes (Jitsi Meet)

- v1 uses public `meet.jit.si` server — no infra needed.
- Backend mints unguessable room IDs (`eduplat-<batch>-<class>-<nanoid8>`),
  generates a room password, and uses **teacher-first gating**: students get
  `425 Too Early` from `POST /api/classes/:id/join` until the teacher has flipped
  status to `LIVE`. Frontend auto-polls.
- Side rail (chat / participants / hand-raise / leave) is our own Socket.IO
  layer, not Jitsi's — so it's authenticated and persistable.
- Attendance: Socket.IO is ground truth; `class:join` on Jitsi
  `videoConferenceJoined`, heartbeat every 30 s, `class:leave` on
  `videoConferenceLeft` / `beforeunload`.
- Auto-end window: 30 min after `scheduled_end`.
- Self-host upgrade path (Hetzner + `jitsi/docker-jitsi-meet` + JWT) outlined in
  `services/jitsi.ts` — drop the lobby/password dance once we mint JWTs.

### Materials (Cloudflare R2)

- Backend issues presigned PUT URLs from `POST /api/materials/upload-url`.
- Frontend uploads direct to R2 via XHR (with progress bar), then POSTs metadata.
- Set the `R2_*` env vars before testing the upload flow.

### Real-time quizzes

The pre-existing engine — Socket.IO room per quiz, Redis ZSET leaderboard,
PostgreSQL persistence on `quiz:end` — is unchanged. v2 just scopes a quiz to a
batch (`batch_id` column) so only that batch's students see/join. The dashboard
deep-links into the existing engine pages (`/quiz/admin/[id]/{questions,preview,live}`
and `/quiz/[id]/{lobby,play,results}`).

---

## Day-to-day commands

### Backend

```bash
npm run dev          # ts-node-dev (hot reload) on :4000
npm run migrate      # apply any new migration files
npm run seed:dev     # reset/refresh dev data
npm run build        # tsc → dist/
npm start            # node dist/index.js (production)
```

### Frontend

```bash
npm run dev          # next dev (turbopack) on :3000
npm run build        # next build (also runs type-check + lint)
npm run start        # next start (production)
npm run lint         # eslint
```

A passing `next build` is the canonical "everything is type-safe and lint-clean"
signal. Always run it after substantial frontend changes.

---

## Deployment

- **Frontend** deploys to Vercel; pulls `.env.production` (already committed)
  pointing at the Railway backend.
- **Backend** deploys to Railway; the `0.0.0.0` listener fix in
  `backend/src/index.ts` is required.
- No Dockerfile is checked in — Nixpacks defaults are fine for both apps.

### Big-bang launch checklist

1. Provision Cloudflare R2 bucket + CORS for the production domain; set the
   `R2_*` env vars on Railway.
2. Deploy backend with **migration step 1** only
   (`001_lms_v2_step1_enum.sql`) — old code can still read it.
3. Run `npm run migrate` on Railway (idempotent — it ledgers each filename).
4. Deploy backend code v2 (new routes + role guards).
5. Deploy frontend v2.
6. Internal dogfooding ≥ 2 weeks: super_admin invites real teachers, real
   batches, real classes.
7. Public flip: marketing site goes live; old `/quiz/login` → `/login` etc.
   redirects already in place via `next.config.ts`.

---

## Common gotchas

- **Postgres `ALTER TYPE ADD VALUE`** can't share a transaction with code that
  reads the new value — that's why `001_lms_v2_step1_enum.sql` is detected by
  the migration runner and run outside a transaction.
- **`@jitsi/react-sdk`** loads `external_api.js` from `meet.jit.si` at runtime
  — it must be in a client component (we use `next/dynamic` with `ssr: false`).
- **`quiz_token`** in `localStorage` is the storage key the API client and
  Socket.IO auth both read; don't rename without updating both.
- **EmailJS** keys are required only for the marketing contact form. The LMS
  works fine without them.
