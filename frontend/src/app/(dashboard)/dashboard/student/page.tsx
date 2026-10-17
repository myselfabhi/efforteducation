'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { format, isToday, isTomorrow } from 'date-fns';
import {
  Video, FileText, Megaphone, Play, Zap, Clock, Calendar, ArrowRight,
  PenLine, Image as ImageIcon, Trophy, PartyPopper, CheckCircle2, Star,
} from 'lucide-react';
import { api, type QuizSummary, type Announcement, type Material, type PointsSummary } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/authStore';
import { Button } from '@/app/components/ui/button';
import { MasteryCard } from '@/components/dashboard/MasteryCard';
import { cn } from '@/lib/utils';

interface StudentDash {
  batches: Array<{ id: number; name: string; course_title: string; schedule_description: string | null }>;
  upcoming_classes: Array<{ id: number; title: string; scheduled_start: string; status: string; batch_name: string }>;
  recent_materials: Array<{ id: number; title: string; type: Material['type']; created_at: string; batch_name: string }>;
  recent_scores: Array<{ quiz_id: number; total_score: number; rank: number | null; title: string }>;
}

type NextClass = StudentDash['upcoming_classes'][number];
type ClassState = 'live' | 'soon' | 'scheduled' | 'none';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function firstNameOf(full?: string | null, username?: string) {
  const n = (full || username || '').trim();
  return n.split(/\s+/)[0] || 'there';
}

function classState(nextClass?: NextClass): ClassState {
  if (!nextClass) return 'none';
  if (nextClass.status === 'LIVE') return 'live';
  const mins = (new Date(nextClass.scheduled_start).getTime() - Date.now()) / 60_000;
  return mins <= 20 ? 'soon' : 'scheduled';
}

function whenLabel(iso: string) {
  const d = new Date(iso);
  if (isToday(d)) return `Today, ${format(d, 'p')}`;
  if (isTomorrow(d)) return `Tomorrow, ${format(d, 'p')}`;
  return format(d, 'EEE, MMM d · p');
}

const MATERIAL_ICON: Record<Material['type'], React.ComponentType<{ className?: string }>> = {
  pdf: FileText, video_link: Video, image: ImageIcon, doc: FileText, text_note: PenLine,
};

// ── Live countdown ("12m 03s" / "2h 14m") ─────────────────────────────────────
function Countdown({ to }: { to: string }) {
  const [label, setLabel] = useState('');
  useEffect(() => {
    const tick = () => {
      const diff = new Date(to).getTime() - Date.now();
      if (diff <= 0) { setLabel('now'); return; }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setLabel(h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m ${String(s).padStart(2, '0')}s` : `${s}s`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [to]);
  return <span className="tabular-nums">{label || '—'}</span>;
}

// Class Hub — the student/child home: what to do now this week (loop).
export default function StudentClassHub() {
  const user = useAuthStore((s) => s.user);
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard', 'student'],
    queryFn: () => api.dashboard.student() as Promise<StudentDash>,
  });
  const { data: reportData } = useQuery({
    queryKey: ['reports', 'current'],
    queryFn: () => api.reports.current(),
  });
  const reportDone = !!reportData?.report;
  const { data: pointsData } = useQuery({
    queryKey: ['points', 'me'],
    queryFn: () => api.points.me(),
  });
  const { data: masteryData } = useQuery({
    queryKey: ['mastery', 'me'],
    queryFn: () => api.mastery.me(),
  });

  const name = firstNameOf(user?.full_name, user?.username);
  const batches = data?.batches ?? [];
  const primaryBatch = batches[0];
  const nextClass = data?.upcoming_classes?.[0];
  const state = classState(nextClass);

  const subline =
    state === 'live' ? 'Your class is live — jump in.'
    : state === 'soon' ? 'Your class is about to start.'
    : state === 'scheduled' ? "Here's what's coming up this week."
    : "Here's your week at a glance.";

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          {greeting()}, {name} <span className="inline-block">👋</span>
        </h1>
        <p className="text-muted-foreground">{subline}</p>
      </header>

      {pointsData && <ScholarPointsCard summary={pointsData} />}

      {error && <p className="text-sm text-destructive">Couldn&rsquo;t load your hub. Please refresh.</p>}
      {isLoading && <HubSkeleton />}

      {data && (
        <>
          {batches.length === 0 ? (
            <NotEnrolled />
          ) : (
            <>
              <ClassHero nextClass={nextClass} state={state} />
              <WeeklyLoop state={state} reportDone={reportDone} />
              <QuizSpotlight batchId={primaryBatch?.id} />
              {masteryData && <MasteryCard skills={masteryData.skills} />}
              <div className="grid gap-6 lg:grid-cols-2">
                <MaterialsCard materials={data.recent_materials} />
                <AnnouncementsCard batch={primaryBatch} />
              </div>
              {data.recent_scores.length > 0 && <RecentScores scores={data.recent_scores} />}
            </>
          )}
        </>
      )}
    </div>
  );
}

// ── Scholar Points + streak + badges — the gamification layer ─────────────────
function StreakChip({ streak }: { streak: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2.5 py-1 text-xs font-semibold text-warning">
      🔥 {streak === 1 ? '1 week' : `${streak}-week streak`}
    </span>
  );
}

function ScholarPointsCard({ summary }: { summary: PointsSummary }) {
  const count = (reason: string) => summary.by_reason.find((r) => r.reason === reason)?.count ?? 0;
  const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
  const parts = [
    count('class_attended') && plural(count('class_attended'), 'class', 'classes'),
    count('weekly_report') && plural(count('weekly_report'), 'report', 'reports'),
    count('quiz_completed') && plural(count('quiz_completed'), 'quiz', 'quizzes'),
  ].filter(Boolean) as string[];

  const badges = summary.badges ?? [];
  const earned = badges.filter((b) => b.earned).length;

  return (
    <section className="rounded-2xl border border-warning/30 bg-warning/5 p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-warning/15 text-warning">
          <Star className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <p className="text-2xl font-bold leading-none">
              {summary.total.toLocaleString()}{' '}
              <span className="text-base font-semibold text-muted-foreground">Scholar Points</span>
            </p>
            {summary.streak > 0 && <StreakChip streak={summary.streak} />}
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {parts.length
              ? `Earned from ${parts.join(' · ')}`
              : 'Join a class, play a quiz or write your report to start earning.'}
          </p>
        </div>
      </div>

      {badges.length > 0 && (
        <div className="mt-4 border-t border-warning/20 pt-4">
          <div className="mb-2.5 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Badges</h3>
            <span className="text-xs text-muted-foreground">{earned} of {badges.length}</span>
          </div>
          <ul className="flex flex-wrap gap-2">
            {badges.map((b) => (
              <li
                key={b.key}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  b.earned
                    ? 'border-warning/40 bg-warning/10 text-foreground'
                    : 'border-dashed border-border text-muted-foreground/60'
                )}
                title={b.earned ? `Earned: ${b.label}` : `Locked: ${b.label}`}
              >
                <span className={cn(!b.earned && 'opacity-40 grayscale')}>{b.emoji}</span>
                {b.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

// ── This week's class — the hero ──────────────────────────────────────────────
function ClassHero({ nextClass, state }: { nextClass?: NextClass; state: ClassState }) {
  if (state === 'none' || !nextClass) {
    return (
      <section className="rounded-2xl border border-dashed border-border bg-card p-6">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Calendar className="h-5 w-5" />
          <div>
            <p className="font-semibold text-foreground">No class scheduled yet</p>
            <p className="text-sm">Your next session will show up here as soon as your teacher sets it.</p>
          </div>
        </div>
      </section>
    );
  }

  const isLive = state === 'live';
  const isSoon = state === 'soon';
  const accent = isLive
    ? 'border-success/40 bg-success/5'
    : isSoon
      ? 'border-warning/40 bg-warning/5'
      : 'border-info/30 bg-info/5';

  return (
    <section className={cn('rounded-2xl border p-6', accent)}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest">
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 text-success">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                </span>
                Live now
              </span>
            ) : isSoon ? (
              <span className="inline-flex items-center gap-1.5 text-warning">
                <Zap className="h-3.5 w-3.5" /> Starting in <Countdown to={nextClass.scheduled_start} />
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-info">
                <Clock className="h-3.5 w-3.5" /> This week&rsquo;s class
              </span>
            )}
          </div>
          <h2 className="truncate text-xl font-bold">{nextClass.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {nextClass.batch_name}
            {!isLive && <> · {whenLabel(nextClass.scheduled_start)}</>}
          </p>
        </div>

        <Button
          asChild
          size="lg"
          variant={isLive || isSoon ? 'default' : 'outline'}
          className={cn('shrink-0', isLive && 'bg-success text-success-foreground hover:bg-success/90')}
        >
          <Link href={`/dashboard/classes/${nextClass.id}`}>
            <Play className="h-4 w-4" />
            {isLive ? 'Join live class' : isSoon ? 'Join class' : 'Open classroom'}
          </Link>
        </Button>
      </div>
    </section>
  );
}

// ── The weekly loop: Class → Quiz → Report ────────────────────────────────────
function WeeklyLoop({ state, reportDone }: { state: ClassState; reportDone: boolean }) {
  const steps = [
    {
      icon: Video,
      label: 'Live class',
      status: state === 'live' ? 'Live now' : state === 'soon' ? 'Starting soon' : state === 'scheduled' ? 'Coming up' : 'This week',
      active: state === 'live' || state === 'soon',
      href: undefined as string | undefined,
    },
    {
      icon: Zap,
      label: 'McD Quiz',
      status: 'Beat your best',
      active: false,
      href: undefined,
    },
    {
      icon: reportDone ? CheckCircle2 : PenLine,
      label: 'Weekly report',
      status: reportDone ? 'Done 🎉' : 'Write it',
      active: reportDone,
      href: '/dashboard/student/report',
    },
  ];

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Your weekly loop</h3>
      <ol className="grid gap-3 sm:grid-cols-3">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const inner = (
            <>
              <span
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold',
                  s.active ? 'bg-primary/15 text-primary' : 'bg-background text-muted-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.status}</p>
              </div>
              <span className="absolute right-3 top-3 text-[10px] font-bold text-muted-foreground/50">{i + 1}</span>
            </>
          );
          const cls = cn(
            'relative flex items-center gap-3 rounded-xl border p-3.5 transition-colors',
            s.active ? 'border-primary/30 bg-primary/5' : 'border-border bg-secondary/30',
            s.href && 'hover:border-primary/40 hover:bg-primary/5'
          );
          return (
            <li key={s.label}>
              {s.href ? (
                <Link href={s.href} className={cls}>{inner}</Link>
              ) : (
                <div className={cls}>{inner}</div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

// ── Play the McD Quiz ─────────────────────────────────────────────────────────
function QuizSpotlight({ batchId }: { batchId?: number }) {
  const { data } = useQuery({
    queryKey: ['quizzes', 'student', 'hub', batchId ?? 'all'],
    queryFn: () => api.quizzes.list(batchId) as Promise<QuizSummary[]>,
  });
  const live = data?.find((q) => q.status === 'LIVE');
  const upcoming = !live && data?.find((q) => q.status === 'UPCOMING' && q.scheduled_at);
  const featured = live || upcoming;
  if (!featured) return null;
  const isLive = featured.status === 'LIVE';

  return (
    <Link
      href={`/quiz/${featured.id}/lobby`}
      className={cn(
        'flex items-center justify-between gap-3 rounded-2xl border p-5 transition-colors',
        isLive ? 'border-success/40 bg-success/5 hover:bg-success/10' : 'border-info/30 bg-info/5 hover:bg-info/10'
      )}
    >
      <div className="min-w-0">
        <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest">
          {isLive ? <span className="text-success">Quiz live now</span> : <span className="text-info">Quiz ready</span>}
        </div>
        <h3 className="truncate text-base font-bold">{featured.title}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {featured.question_count != null && `${featured.question_count} questions · `}Try to beat your best score
        </p>
      </div>
      <span
        className={cn(
          'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-4 text-sm font-semibold',
          isLive ? 'bg-success text-success-foreground' : 'border border-info/30 bg-info/10 text-info'
        )}
      >
        <Play className="h-3.5 w-3.5" /> {isLive ? 'Play now' : 'Open lobby'}
      </span>
    </Link>
  );
}

// ── This week's materials ─────────────────────────────────────────────────────
function MaterialsCard({ materials }: { materials: StudentDash['recent_materials'] }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Latest materials</h3>
        <Link href="/dashboard/student/materials" className="text-sm text-primary hover:underline">View all</Link>
      </div>
      {materials.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing new yet — notes and worksheets land here after class.</p>
      ) : (
        <ul className="space-y-3">
          {materials.map((m) => {
            const Icon = MATERIAL_ICON[m.type] ?? FileText;
            return (
              <li key={m.id}>
                <Link
                  href="/dashboard/student/materials"
                  className="flex items-center gap-3 rounded-lg -mx-2 px-2 py-1.5 hover:bg-secondary/50"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{m.title}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {m.batch_name} · {format(new Date(m.created_at), 'MMM d')}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

// ── From your teacher (announcements) ─────────────────────────────────────────
function AnnouncementsCard({ batch }: { batch?: StudentDash['batches'][number] }) {
  const { data } = useQuery({
    queryKey: ['announcements', 'batch', batch?.id],
    queryFn: () => api.announcements.listForBatch(batch!.id) as Promise<Announcement[]>,
    enabled: !!batch,
  });
  const items = (data ?? []).slice(0, 3);

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold">
          <Megaphone className="h-4 w-4 text-primary" /> From your teacher
        </h3>
        {batch && (
          <Link href={`/dashboard/student/batches/${batch.id}`} className="text-sm text-primary hover:underline">
            Open batch
          </Link>
        )}
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No announcements yet.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((a) => (
            <li key={a.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
              <p className="truncate text-sm font-medium">{a.title}</p>
              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{a.body}</p>
              <p className="mt-1 text-[11px] text-muted-foreground/70">
                {a.poster_name ? `${a.poster_name} · ` : ''}{format(new Date(a.created_at), 'MMM d')}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// ── Recent quiz scores (compact) ──────────────────────────────────────────────
function RecentScores({ scores }: { scores: StudentDash['recent_scores'] }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Trophy className="h-4 w-4 text-warning" />
        <h3 className="font-semibold">Recent quiz scores</h3>
      </div>
      <ul className="divide-y divide-border">
        {scores.map((s) => (
          <li key={s.quiz_id} className="flex items-center justify-between py-2">
            <Link href={`/quiz/${s.quiz_id}/results`} className="truncate hover:underline">{s.title}</Link>
            <span className="ml-3 shrink-0 text-sm">
              <span className="font-semibold">{s.total_score.toLocaleString()}</span>
              {s.rank && <span className="text-muted-foreground"> · rank #{s.rank}</span>}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── Empty / loading states ────────────────────────────────────────────────────
function NotEnrolled() {
  return (
    <section className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <PartyPopper className="h-6 w-6" />
      </div>
      <h2 className="font-semibold">You&rsquo;re all set up!</h2>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
        You&rsquo;re not in a batch yet. Once your counsellor adds you, your class, quizzes and materials will appear right here.
      </p>
      <Button asChild variant="outline" className="mt-5">
        <Link href="/dashboard/student/batches">Browse batches <ArrowRight className="h-4 w-4" /></Link>
      </Button>
    </section>
  );
}

function HubSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-28 animate-pulse rounded-2xl border border-border bg-card" />
      <div className="h-24 animate-pulse rounded-2xl border border-border bg-card" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-40 animate-pulse rounded-2xl border border-border bg-card" />
        <div className="h-40 animate-pulse rounded-2xl border border-border bg-card" />
      </div>
    </div>
  );
}
