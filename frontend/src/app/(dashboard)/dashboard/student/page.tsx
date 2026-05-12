'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { GraduationCap, Video, FileText, Trophy, Zap, Clock, Play, Crown } from 'lucide-react';
import { api, type QuizSummary, type QuizLeaderboardRow } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/authStore';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/app/components/ui/button';

interface StudentDash {
  batches: Array<{ id: number; name: string; course_title: string; schedule_description: string | null }>;
  upcoming_classes: Array<{ id: number; title: string; scheduled_start: string; status: string; batch_name: string }>;
  recent_materials: Array<{ id: number; title: string; type: string; created_at: string; batch_name: string }>;
  recent_scores: Array<{ quiz_id: number; total_score: number; rank: number | null; title: string }>;
}

function LiveCountdown({ scheduledAt }: { scheduledAt: string | null }) {
  const [label, setLabel] = useState('');
  useEffect(() => {
    if (!scheduledAt) return;
    const tick = () => {
      const diff = new Date(scheduledAt).getTime() - Date.now();
      if (diff <= 0) { setLabel('Starting now'); return; }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setLabel(h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m ${s}s` : `${s}s`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [scheduledAt]);
  return <span className="tabular-nums">{label || '—'}</span>;
}

function NextQuizCard() {
  const { data } = useQuery({
    queryKey: ['quizzes', 'student', 'next'],
    queryFn: () => api.quizzes.list() as Promise<QuizSummary[]>,
  });
  const live = data?.find((q) => q.status === 'LIVE');
  const upcoming = !live && data?.find((q) => q.status === 'UPCOMING' && q.scheduled_at);
  const featured = live || upcoming;
  if (!featured) return null;
  const isLive = featured.status === 'LIVE';
  return (
    <Link
      href={`/quiz/${featured.id}/lobby`}
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl border transition-colors ${
        isLive
          ? 'border-success/40 bg-success/5 hover:bg-success/10'
          : 'border-info/30 bg-info/5 hover:bg-info/10'
      }`}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {isLive ? (
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-semibold text-success">
              <Zap className="h-3 w-3" /> Live now
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-semibold text-info">
              <Clock className="h-3 w-3" /> Starts in <LiveCountdown scheduledAt={featured.scheduled_at} />
            </span>
          )}
        </div>
        <h2 className="text-base font-bold truncate">{featured.title}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {featured.question_count != null && `${featured.question_count} questions`}
          {featured.creator_name && ` · By ${featured.creator_name}`}
        </p>
      </div>
      <span
        className={`shrink-0 inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-semibold ${
          isLive
            ? 'bg-success text-success-foreground'
            : 'bg-info/10 text-info border border-info/30'
        }`}
      >
        <Play className="h-3.5 w-3.5" />
        {isLive ? 'Join now' : 'Open lobby'}
      </span>
    </Link>
  );
}

export default function StudentDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard', 'student'],
    queryFn: () => api.dashboard.student() as Promise<StudentDash>,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hi 👋</h1>
        <p className="text-muted-foreground">Here&rsquo;s what&rsquo;s coming up for you.</p>
      </div>

      <NextQuizCard />

      {error && <p className="text-sm text-destructive">Failed to load.</p>}
      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

      {data && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="My batches" value={data.batches.length} icon={<GraduationCap className="h-5 w-5" />} />
            <StatCard label="Upcoming classes" value={data.upcoming_classes.length} icon={<Video className="h-5 w-5" />} accent="blue" />
            <StatCard label="New materials" value={data.recent_materials.length} icon={<FileText className="h-5 w-5" />} accent="amber" />
            <StatCard label="Recent quizzes" value={data.recent_scores.length} icon={<Trophy className="h-5 w-5" />} accent="emerald" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <section className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Next classes</h2>
                <Link href="/dashboard/student/classes" className="text-sm text-primary hover:underline">All classes</Link>
              </div>
              {data.upcoming_classes.length === 0 ? (
                <p className="text-sm text-muted-foreground">No classes scheduled.</p>
              ) : (
                <ul className="space-y-3">
                  {data.upcoming_classes.map((c) => (
                    <li key={c.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="font-medium truncate">{c.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {c.batch_name} · {format(new Date(c.scheduled_start), 'PP p')}
                        </p>
                      </div>
                      <Button asChild size="sm" variant={c.status === 'LIVE' ? 'default' : 'outline'}>
                        <Link href={`/dashboard/classes/${c.id}`}>
                          {c.status === 'LIVE' ? 'Join' : 'Open'}
                        </Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">My batches</h2>
                <Link href="/dashboard/student/batches" className="text-sm text-primary hover:underline">All batches</Link>
              </div>
              {data.batches.length === 0 ? (
                <p className="text-sm text-muted-foreground">You&rsquo;re not enrolled in any batches yet.</p>
              ) : (
                <ul className="space-y-3">
                  {data.batches.map((b) => (
                    <li key={b.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                      <Link href={`/dashboard/student/batches/${b.id}`} className="block hover:underline">
                        <p className="font-medium truncate">{b.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {b.course_title}{b.schedule_description ? ` · ${b.schedule_description}` : ''}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {data.recent_scores.length > 0 && (
            <div className="grid lg:grid-cols-2 gap-6">
              <section className="rounded-2xl border border-border bg-card p-5">
                <h2 className="font-semibold mb-4">Recent quiz scores</h2>
                <ul className="divide-y divide-border">
                  {data.recent_scores.map((s) => (
                    <li key={s.quiz_id} className="flex items-center justify-between py-2">
                      <Link
                        href={`/quiz/${s.quiz_id}/results`}
                        className="truncate hover:underline"
                      >
                        {s.title}
                      </Link>
                      <span className="text-sm shrink-0 ml-3">
                        <span className="font-semibold">{s.total_score}</span>
                        {s.rank && <span className="text-muted-foreground"> · rank #{s.rank}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <TopOfClassWidget mostRecentQuizId={data.recent_scores[0].quiz_id} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TopOfClassWidget({ mostRecentQuizId }: { mostRecentQuizId: number }) {
  const me = useAuthStore((s) => s.user);
  const { data, isLoading } = useQuery({
    queryKey: ['quiz', mostRecentQuizId, 'leaderboard'],
    queryFn: () => api.quizzes.leaderboard(mostRecentQuizId) as Promise<QuizLeaderboardRow[]>,
    staleTime: 60_000,
  });

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-warning" />
          <h2 className="font-semibold">Top of the class</h2>
        </div>
        <Link
          href={`/quiz/${mostRecentQuizId}/results`}
          className="text-sm text-primary hover:underline"
        >
          See full
        </Link>
      </div>
      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {data && data.length === 0 && (
        <p className="text-sm text-muted-foreground">No scores yet.</p>
      )}
      {data && data.length > 0 && (
        <ul className="space-y-2">
          {data.slice(0, 5).map((row, i) => {
            const isMe = row.user_id === me?.id;
            return (
              <li
                key={row.user_id}
                className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                  isMe ? 'bg-primary/5 border border-primary/20' : 'bg-secondary/30'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold ${
                      i === 0
                        ? 'bg-warning/15 text-warning'
                        : i === 1
                          ? 'bg-muted text-foreground'
                          : i === 2
                            ? 'bg-info/10 text-info'
                            : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="truncate text-sm">
                    {row.full_name || row.username}
                    {isMe && (
                      <span className="ml-2 text-[10px] uppercase tracking-widest text-primary font-semibold">
                        You
                      </span>
                    )}
                  </span>
                </div>
                <span className="text-sm font-semibold tabular-nums shrink-0">
                  {row.total_score.toLocaleString()}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
