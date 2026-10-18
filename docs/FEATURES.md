# Effort Education — Developer Guide

A feature-by-feature reference for the platform: what each feature is, its data
model, the backend and frontend that power it, and the end-to-end flow. Read the
**Architecture** and **Cross-cutting patterns** sections first — every feature
reuses them, so the per-feature sections stay short.

> Paths are relative to the repo root. Line numbers drift; file + function names
> are the stable anchors. When in doubt, grep the function name.

---

## 1. Architecture

### Two backends (this trips people up)
- **`backend/`** — the legacy Express app. It is **not deployed**. Its one living
  job is to own the **canonical SQL schema + migrations** (`backend/src/migrations/*.sql`)
  and the migration runner (`backend/scripts/migrate.js`).
- **`backend-workers/`** — the **live API**, a Cloudflare Worker using
  [Hono](https://hono.dev). This is what the frontend actually talks to. It has
  **no migrations of its own**; it reuses `backend/`'s Postgres.

### The stack
| Layer | Tech | Notes |
|---|---|---|
| Frontend | Next.js (App Router) on **Vercel** | `frontend/`, prod alias `efforteducation.in` |
| API | Cloudflare **Worker** (Hono) | `backend-workers/`, `quiz-backend.<acct>.workers.dev` |
| DB | **Postgres (Neon)** via Cloudflare **Hyperdrive** | per-request `pg` Pool |
| Media/files | Cloudflare **R2** | signed uploads; `R2_PUBLIC_URL` serves objects |
| Live classes | Cloudflare **RealtimeKit** | `@cloudflare/realtimekit-react` on the client |
| Realtime state | **Durable Objects** | `QuizRoom` (live quiz), `ClassRoom` (dormant), `UserHub` (notifications push) |
| Auth | **JWT** (`jose`, HS256) | email-only login |

### Request path
Browser → Worker (`backend-workers/src/index.ts`). Global middleware:
- **CORS** — `STATIC_ORIGINS` allowlist (includes `localhost:3100` for dev), falls back to `efforteducation.in`.
- **`withDb`** (`src/db.ts`) — on every `/api/*` request, opens a per-request `pg` Pool through the Hyperdrive binding (or `DATABASE_URL` under `wrangler dev`), attaches it as `c.get('db')`, and tears it down via `waitUntil(pool.end())` after the response.

Each route module is a `new Hono()` default-exported from `src/routes/*.ts` and mounted in `index.ts` under `/api/...`.

### The frontend shape
- `frontend/src/app/(dashboard)/dashboard/<role>/…` — role-scoped dashboard pages (student, parent, teacher, admin), plus shared `profile`.
- `frontend/src/components/dashboard/` — shared dashboard components (Sidebar, Topbar, cards, forms).
- `frontend/src/lib/api.ts` — the **single typed API client** (`api.<namespace>.<method>()`), plus all shared TS types.
- `frontend/src/lib/stores/authStore.ts` — Zustand auth store; token + user persisted in `localStorage` (`quiz_token`, `quiz_user`).

---

## 2. Cross-cutting patterns

### Auth & roles — `backend-workers/src/middleware/auth.ts`
- **Roles** (Postgres enum `user_role`): effective set is `super_admin`, `teacher`, `student`, `parent`. Legacy `admin`→`super_admin`, `user`→`student` are normalized everywhere (`normalizeRole` / `LEGACY_ROLE_MAP`, mirrored in `authStore.ts`).
- **Login is email-only** (`WHERE email=$1`). `signToken(user, secret)` mints an HS256 JWT with claims `{id, username, email, role, full_name}`, 24h expiry.
- `requireAuth` verifies the Bearer token → `c.get('user')`. `roleGuard('a','b')` chains after it. `batchMember('id')` checks per-batch membership (super_admin always passes; teachers via `batch_teachers`, students via active `batch_students`).

### Validation — `backend-workers/src/lib/validation.ts`
- `validateBody(schema)` parses JSON against a **zod** schema, stores it; handlers read it via `getValid<T>(c)`. Unknown keys are stripped (so e.g. the leads honeypot field had to be added to the schema to be read).

### Notifications — `backend-workers/src/services/notifications.ts`
- `notifyUser(env, db, {userId, type, title, body?, linkUrl?})` inserts a `notifications` row and best-effort pushes to the user's `UserHub` DO. `notifyMany(...)` fans out. `NotificationType` is a **closed union** — add a literal before using a new type.

### API client — `frontend/src/lib/api.ts`
- `apiFetch` injects the Bearer token from the auth store, throws `ApiError` on non-2xx, returns `undefined` for 204. Helpers `j`/`patch`/`del`. Everything is grouped into namespaces (`api.points`, `api.guardian`, `api.plans`, …).
- Data fetching uses **TanStack Query** (`useQuery`/`useMutation`); mutations `invalidateQueries` on success; toasts via `sonner`.

### Migrations — `backend/src/migrations/NNN_name.sql`
- Numbered, applied in filename order by `backend/scripts/migrate.js`, tracked in `schema_migrations`. Additive migrations run in a transaction; a file matching `/step1.*enum/i` runs auto-commit (Postgres can't add an enum value inside a txn that then reads it).
- **Run against a DB:** `DATABASE_URL="…" DATABASE_SSL=true node backend/scripts/migrate.js`. Prod uses the Neon pooled URL (not stored in the repo — it lives in Cloudflare Hyperdrive).

### Deploy
- **Worker:** `cd backend-workers && npx wrangler deploy`. (Must be logged into the correct Cloudflare account — the RealtimeKit/Hyperdrive account.)
- **Frontend:** push to `main` → Vercel builds. Confirm via `npx vercel ls efforteducation --scope abhinav-vermas-projects-202c438a` (the GitHub commit-status webhook sometimes lags).
- **Prod schema change:** run `migrate.js` against prod Neon *before* deploying the Worker that depends on it.
- **gh gotcha:** two gh accounts in the keychain; pushes 403 unless `gh auth switch --user myselfabhi` is active.

---

## 3. The Young Scholar portal (Phase 2)

### 3.1 Parent / child accounts — the keystone
**Purpose:** parents own an account and create + link child (student) profiles.

**Data:** `guardian_students(guardian_id, student_id, relationship, created_at)` (migration `009`). A child is a real `users` row with role `student`.

**Backend:** `backend-workers/src/routes/guardian.ts`
- `GET/POST/DELETE /api/guardian/children` — list / create+link / unlink.
- A child is created with a derived, non-routable email: `<username>@child.efforteducation.in` (login is email-only, so the child signs in with that). The create response returns the email so the parent can see it.

**Frontend:** register has a Student/Parent toggle (`account_type`); `/dashboard/parent` "My Children" hub (`AddChildForm` shows the derived sign-in email on creation).

**Flow:** parent registers → adds child (optionally sets a login) → child row + `guardian_students` link created → parent sees the child's card.

### 3.2 Class Hub — the student home
**Purpose:** a "what do I do now" weekly-loop home.

**Frontend only** (reuses existing endpoints): `frontend/src/app/(dashboard)/dashboard/student/page.tsx`. Sections: greeting, **Scholar Points card** (§4.1), **class hero** (lights up live/soon/scheduled with a countdown + Join), the **weekly loop** (Class → Quiz → Report), **quiz spotlight**, **mastery panel** (§5), latest materials, announcements, recent scores.

### 3.3 Weekly Report — the centerpiece
**Purpose:** a child's weekly reflection + teacher/parent feedback.

**Data:** `weekly_reports` (migration `010`, +`012` for parent cheer): `went_well/tricky/next_goal`, `mood (1–5)`, `photo_url`, `teacher_comment`, `cheered_at`, `parent_cheered_at`, `parent_cheered_by`. **`UNIQUE(student_id, week_start)`** where `week_start = date_trunc('week', (NOW() AT TIME ZONE 'Asia/Kolkata'))::date` (Monday, IST).

**Backend:** `backend-workers/src/routes/reports.ts`
- Student: `GET /me/current`, `GET /me`, `POST /` (upsert — detects insert vs update via `xmax=0`).
- Teacher: `GET /batch/:id`, `POST /:id/cheer`, `PATCH /:id/comment`.
- Parent: `GET /child/:id`, `POST /:id/parent-cheer` (toggle).
- Notifies the teacher on submit, the child on feedback/cheer.

**Frontend:** child write page `/dashboard/student/report` (🌟/🧗/🌱 prompts + mood → submitted view with cheers); teacher review `/dashboard/teacher/reports`.

**Flow:** child writes report (upsert for the IST week) → teacher notified → teacher cheers/replies → child notified → parent sees it on their card and can cheer → child sees "Your family cheered this 💛".

---

## 4. Gamification (Phase 3)

### 4.1 Effort points ("Scholar Points")
**Purpose:** a cumulative score that rewards **participation, not performance** (fixes "scores reset every quiz").

**Data:** `effort_points` ledger (migration `011`): one row per award, **`UNIQUE(user_id, source_type, source_id)`**. Values: `weekly_report = 20`, `class_attended = 15`, `quiz_completed = 10`.

**Backend:** `backend-workers/src/services/points.ts`
- **Reconcile-on-read**: `reconcilePoints(db, userId)` runs idempotent `INSERT … SELECT … ON CONFLICT DO NOTHING` over `weekly_reports`, `scores`, and `live_class_attendance`. Safe to call on every read; back-fills retroactively. `getPointsSummary` returns total + per-reason counts.
- Exposed at `GET /api/points/me` (student) and `/child/:id` (parent).

**Why reconcile-on-read:** no hooks are needed inside the quiz/class code — points are derived from the activity tables whenever someone reads them.

### 4.2 Streaks + badges
**Purpose:** a retention layer derived on-read — **no new tables**.

**Backend:** `backend-workers/src/services/progress.ts` (added to the `/api/points/me`, `/child/:id`, and `/api/guardian/week` responses).
- A "week" = the IST Monday a report/quiz/class falls in.
- **Streak** (`streakFrom`): consecutive active weeks, newest first, with a **safety valve** — the current (in-progress) week is never a break, and **one** earlier missed week is forgiven (the "freeze"). So a single skipped week doesn't reset the streak.
- **Badges** (`buildBadges`): a fixed 6-badge catalog computed from counts + points + streak + "perfect week" (class+quiz+report in one week): First reflection, Perfect week, Quiz whiz (5 quizzes), On a roll (3-week streak), Century club (100 pts), Unstoppable (6-week streak).

**Frontend:** `dashboard/student/page.tsx` Scholar Points card shows the 🔥 streak chip + a "Badges X of 6" row (earned lit, locked greyed). Parent card shows a streak chip.

**Flow:** read `/api/points/me` → reconcile points → compute streak + badges from the same weekly activity → render.

### 4.3 Avatar picker
**Purpose:** kids pick a **preset character** (not photo uploads — avoids minor-photo consent entirely).

**Data:** no migration. The preset key is stored in the existing `users.avatar_url`, prefixed `p:` so it never collides with a real URL.
- Backend allow-list: `backend-workers/src/lib/avatars.ts` (`AVATAR_KEYS`, `isValidAvatar`).
- Frontend catalog (emoji + colour): `frontend/src/lib/avatars.ts` (16 presets). **Keep the two key lists in sync.**

**Backend:** `PATCH /api/users/me/avatar` (self) and `PATCH /api/guardian/children/:id/avatar` (parent sets a linked child's). Both validate the key (or `null` to clear).

**Frontend:**
- `components/dashboard/ScholarAvatar.tsx` — the one avatar component everywhere: preset → image URL → initials fallback. Used in Topbar, parent card, teacher report view.
- `components/dashboard/AvatarPicker.tsx` — the grid. On Profile (instant save → updates the auth store so the Topbar changes live) and on the parent card (sets the child's).

**Flow:** pick → `PATCH …/avatar` validates the key → stored in `avatar_url` → `ScholarAvatar` renders it wherever that user appears.

### 4.4 Skill mastery — the second progress axis
**Purpose:** track whether a child is actually **getting better at skills**, so points-farming can't masquerade as learning. **Derived from quiz performance.**

**Data:** migration `014`: `skills` table (seeded 5, admin-editable) + `quizzes.skill_id` (nullable FK — a quiz measures one skill; untagged quizzes don't count).

**Backend:** `backend-workers/src/services/mastery.ts`
- For each active skill, take the student's quizzes tagged with it, compute **each quiz's accuracy** (`correct ÷ answered`, from `responses.is_correct`), **average the per-quiz accuracies** (so one long quiz doesn't dominate), and map to a 0–5 level: thresholds **45 / 60 / 75 / 88 %** → Starting / Building / Confident / Strong / Mastered (0 = Not started). Plus a trend (latest quiz vs overall).
- Routes: `GET /api/mastery/me`, `/child/:id`. Skills CRUD: `GET/POST/PATCH/DELETE /api/skills` (`routes/skills.ts`, management is super_admin).
- Quiz creation now accepts `skill_id` (`routes/quiz.ts` `CreateQuizSchema` + INSERT).

**Frontend:**
- `components/dashboard/MasteryCard.tsx`: `MasteryCard` (full "Your skills" panel on the child hub — per-skill level bar + accuracy + trend) and `CompactMastery` (strip on the parent card).
- Admin `/dashboard/admin/skills` manages the taxonomy; `CreateQuizForm` has a skill dropdown.

**Flow:** teacher tags a quiz with a skill → kids take it → `responses.is_correct` persists (written by the QuizRoom DO at quiz end) → `/api/mastery/me` aggregates accuracy per skill → level + trend render.

> **Day-one note:** mastery shows "Not started" until quizzes are tagged *and* taken — it's quiz-derived, so it fills in over time.

---

## 5. Online checkout (Phase 3)

**Purpose:** parents pay online to confirm a seat, with prices quoted **privately** (never public). v1 is **one-time payment**; "a few private named plans"; **Razorpay**.

**Data:** migration `013` (amounts in **paise**):
- `payment_plans` — admin-managed named plans.
- `enrolment_offers` — a plan assigned to a family for a child's seat (`guardian_id`, `student_id`, `batch_id?`, `plan_id`, `status offered|paid|cancelled`).
- `payments` — one row per Razorpay attempt (`razorpay_order_id UNIQUE`, `status created|paid|failed`).

**Backend:**
- `routes/plans.ts` — plan CRUD (super_admin).
- `routes/offers.ts` — admin creates an offer for a child (derives the payer from `guardian_students`); `GET /mine` for the parent; `GET /candidates` for the admin picker.
- `routes/payments.ts` — `POST /order` (parent; **amount is read from the plan server-side**, never trusted from the client; creates a Razorpay order + a `payments` row) and `POST /verify` (verifies the signature, marks the payment + offer paid, **enrols the child** into the batch).
- `services/razorpay.ts` — **three modes via `paymentsMode(env)`**:
  - `live` — `RAZORPAY_KEY_SECRET` set: real REST API + HMAC-SHA256 signature verify.
  - `stub` — explicit `RAZORPAY_STUB=1` (local dev only): fake orders, a sentinel signature accepted. Lets the whole flow run without charging.
  - `disabled` — neither: **fails closed**, rejects forged signatures. This is what prod is until keys are set, so a forged "stub" payment can never succeed in production.

**Frontend:**
- Admin `/dashboard/admin/plans` ("Billing"): manage plans + assign offers.
- Parent dashboard: `components/dashboard/SeatOffers.tsx` — "Confirm your seat" card. On "Pay now": `POST /order` → in stub mode confirm straight through; in live mode open Razorpay Checkout (`checkout.js`) → `POST /verify`. If payments are `disabled`, it shows **"Coming soon"** instead.

**Flow:** admin creates a plan → assigns it to a child as an offer → parent sees "Confirm your seat" → Razorpay Checkout → `/verify` confirms the signature → offer `paid` + child enrolled + card clears.

**To go live:** `wrangler secret put RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET`. No redeploy needed — mode flips to `live` automatically.

---

## 6. Ops tooling — Admissions (Phase 3)

One admin page (`/dashboard/admin/admissions`) with two queues.

### 6.1 Enrolment requests
**Reuses** the existing per-batch approve/decline (`PATCH /api/batches/:id/enrolment-requests/:reqId` with `{action, note}` — transactional, enrols into `batch_students`, notifies the student). The only new piece is a **cross-batch list**: `GET /api/enrolment-requests?status=` (`routes/enrolments.ts`, mounted at a distinct path to avoid the `/api/batches/:id` route clash; super_admin sees all, a teacher sees their batches). The frontend reuses `api.batches.decideEnrolmentRequest` for the actions.

### 6.2 Leads
**Purpose:** capture every "Book a call" submission (they used to open WhatsApp and store nothing).

**Data:** migration `015` `leads` (name/phone/email/interest/message/source/`status new|contacted|converted|closed`/note/handled_by) + migration `017` `ip_hash` (for rate-limiting).

**Backend:** `routes/leads.ts`
- `POST /api/leads` — **PUBLIC** (it's the marketing form). Hardened:
  - **Honeypot**: a hidden `company` field; if filled, return a fake `201` and store nothing.
  - **Rate limit**: max **5 / IP / 10 min** (6th → `429`). The IP is stored only as a **salted SHA-256 hash** (`hashIp` with `JWT_SECRET` as salt) — never raw.
  - On success, inserts the lead and `notifyMany`s the admins (`lead_received`).
- `GET /api/leads?status=` and `PATCH /api/leads/:id` (status/note) — super_admin.

**Frontend:** `ContactLeadForm.tsx` fires a **fire-and-forget** `POST /api/leads` *before* opening WhatsApp (so the lead is saved even if they never hit send), and includes the hidden honeypot field. The admin Admissions page lists leads with status + note controls.

**Flow:** visitor submits "Book a call" → lead saved (unless honeypot/rate-limited) + admins notified + WhatsApp opens → admin works the lead through its statuses.

---

## 7. Automatic class recordings (Phase 3)

**Purpose:** record each live class and let students watch it back.

**Engine:** live classes run on **Cloudflare RealtimeKit** (`services/realtimekit.ts`). On join, the Worker creates/reuses a RealtimeKit meeting and mints a participant token (`routes/classes.ts`).

**Data:** migration `016` adds `live_classes.recording_id` + `recording_status` (`recording_url` already existed, and the student `ClassCard` already had a "Watch recording" button).

**Backend:**
1. **Start** — in the teacher's go-live transition (`routes/classes.ts`), once the meeting exists and status flips to `LIVE`, call `rtk.startRecording(meetingId)` (`services/realtimekit.ts` → `POST .../recordings {meeting_id, max_seconds}`). An **idempotent claim UPDATE** makes concurrent teacher joins start at most one recording; any failure is **non-fatal** (the class still starts). RealtimeKit auto-stops when the room is empty for a minute or the session ends.
2. **Webhook** — `POST /api/webhooks/realtimekit?token=<secret>` (`routes/webhooks.ts`, **public**, authed by a shared-secret URL token vs `RTK_WEBHOOK_SECRET`). On `recording.statusUpdate` → `UPLOADED`: find the class by `recording_id`, **fetch the `download_url` and stream it into our R2** (RealtimeKit deletes originals after **7 days**, so we copy for persistence), set `recording_url = R2_PUBLIC_URL/recordings/<class>-<rec>.mp4`, mark `UPLOADED`, and `notifyMany` the batch students (`recording_ready`). **Idempotent** (skips if already `UPLOADED`).
3. **Watch** — `GET /api/recordings/mine` (`routes/recordings.ts`) lists the student's recordings; `/dashboard/student/recordings` renders an inline `<video>` player for R2 mp4s (external links open in a new tab).

**Flow:** teacher goes live → `startRecording` → RealtimeKit records → auto-stops → `recording.statusUpdate` UPLOADED webhook → copy to R2 + notify → students watch on the Recordings page.

**To turn on** (RealtimeKit can't be exercised without it): (1) enable recording on the RealtimeKit app/preset; (2) register the webhook URL (`…/api/webhooks/realtimekit?token=<SECRET>`) for `recording.statusUpdate`; (3) `wrangler secret put RTK_WEBHOOK_SECRET`. Until then classes run normally and produce no recordings.

---

## 8. The engines (pre-existing, reused)

### 8.1 Live quiz — `QuizRoom` Durable Object
`backend-workers/src/do/QuizRoom.ts`. A McD-style real-time quiz: an alarm-driven state machine (LOBBY → IN_PROGRESS → SHOWING_ANSWER → SHOWING_LEADERBOARD → COMPLETED) over a WS (`/ws/quiz`). Answer state lives in DO storage until `persistResults()` writes, in one transaction:
- `responses` (per question: `is_correct`, `selected_option_id`, `response_time_ms`, speed-weighted `score`) — **this is what mastery reads.**
- `scores` (speed-weighted `total_score`, `total_time_ms`, then a `rank` UPDATE). **No accuracy column** — accuracy is computed from `responses`.
DO storage is wiped 60s after completion, so **Postgres is the system of record.** Quiz CRUD + results/leaderboard live in `routes/quiz.ts`. Single-answer, 4-option MCQ; correct option = `options.is_correct = TRUE`.

### 8.2 Live class room
RealtimeKit (see §7). A `ClassRoom` DO exists (`do/ClassRoom.ts`) but is **dormant** — the app joins via REST `/join` + the RealtimeKit client, not the DO's WS. Class start (SCHEDULED→LIVE) happens lazily when the teacher joins; end (→ENDED) is a manual `PATCH /api/classes/:id`.

### 8.3 Notifications push — `UserHub` DO
Holds a per-user WS so `notifyUser` can push live (`/ws/user`); it also persists to the `notifications` table, so the bell works without the socket.

### 8.4 R2 uploads — `services/storage.ts`
`createSignedUpload(env, {prefix})` signs an S3 PUT URL (via `aws4fetch`) and returns `{uploadUrl, publicUrl}` where `publicUrl = R2_PUBLIC_URL/<prefix>/<key>`. `POST /api/materials/upload-url` uses it (`prefix: 'materials'`); recordings reuse the same bucket under `recordings/`. The native `BUCKET` binding is used server-side by the recording webhook.

---

## 9. Ops & gotchas (learned the hard way)

- **Two Cloudflare accounts** — `wrangler` must be logged into the account that owns Hyperdrive + RealtimeKit, or `wrangler deploy` targets the wrong place.
- **Prod Neon URL is not in the repo** — it lives in the Hyperdrive config. Supply it at runtime for `migrate.js`. **Order: migrate prod → deploy Worker → push frontend.**
- **gh auth** — `gh auth switch --user myselfabhi` before pushing (the other account has no push access → 403).
- **Vercel** — pinned to Node 22 (`frontend/package.json` `engines`); the GitHub commit-status webhook lags, so confirm a deploy with `npx vercel ls efforteducation --scope abhinav-vermas-projects-202c438a` (look for ● Ready) rather than trusting the status alone. Attack-challenge mode can 403 aggressive `curl` polling — verify in a real browser.
- **Local full-stack dev:** Postgres.app on `:5432` (trust auth) with an `efforteducation_test` DB seeded via `backend/scripts/{init-db,migrate,seed-dev}.js`; Worker via `WRANGLER_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE="postgres://user:dummy@localhost:5432/efforteducation_test" npx wrangler dev --port 4100` (Miniflare Hyperdrive **requires a password in the URL** even though trust auth ignores it); point `frontend/.env.local` `NEXT_PUBLIC_API_URL` at `:4100`. Secrets live in gitignored `backend-workers/.dev.vars` (see `.dev.vars.example`).
- **External turn-on still pending:** Razorpay keys (checkout → live) and RealtimeKit recording + `RTK_WEBHOOK_SECRET` (recordings → live).

---

## 10. Feature → code map (quick index)

| Feature | Migration | Backend | Frontend |
|---|---|---|---|
| Parent/child accounts | 009 | `routes/guardian.ts` | `dashboard/parent`, register toggle |
| Class Hub | — | (reuses endpoints) | `dashboard/student/page.tsx` |
| Weekly Report | 010, 012 | `routes/reports.ts` | `student/report`, `teacher/reports` |
| Effort points | 011 | `services/points.ts`, `routes/points.ts` | Scholar Points card |
| Streaks + badges | — | `services/progress.ts` | hub card, parent card |
| Avatar picker | — | `lib/avatars.ts`, `users.ts`, `guardian.ts` | `ScholarAvatar`, `AvatarPicker` |
| Skill mastery | 014 | `services/mastery.ts`, `routes/{mastery,skills}.ts` | `MasteryCard`, `admin/skills` |
| Checkout | 013 | `routes/{plans,offers,payments}.ts`, `services/razorpay.ts` | `admin/plans`, `SeatOffers` |
| Admissions | 015, 017 | `routes/{leads,enrolments}.ts` | `admin/admissions`, `ContactLeadForm` |
| Recordings | 016 | `routes/{webhooks,recordings}.ts`, `services/realtimekit.ts` | `student/recordings` |
| Live quiz | — | `do/QuizRoom.ts`, `routes/quiz.ts` | quiz lobby/room |
| Live class | 002, 005 | `routes/classes.ts`, `services/realtimekit.ts` | `RealtimekitRoom` |
