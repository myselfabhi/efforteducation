'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { GraduationCap, Video, FileText, Trophy } from 'lucide-react';
import { api } from '@/lib/api';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/app/components/ui/button';

interface StudentDash {
  batches: Array<{ id: number; name: string; course_title: string; schedule_description: string | null }>;
  upcoming_classes: Array<{ id: number; title: string; scheduled_start: string; status: string; batch_name: string }>;
  recent_materials: Array<{ id: number; title: string; type: string; created_at: string; batch_name: string }>;
  recent_scores: Array<{ quiz_id: number; total_score: number; rank: number | null; title: string }>;
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
            <section className="rounded-2xl border border-border bg-card p-5">
              <h2 className="font-semibold mb-4">Recent quiz scores</h2>
              <ul className="divide-y divide-border">
                {data.recent_scores.map((s) => (
                  <li key={s.quiz_id} className="flex items-center justify-between py-2">
                    <span className="truncate">{s.title}</span>
                    <span className="text-sm">
                      <span className="font-semibold">{s.total_score}</span>
                      {s.rank && <span className="text-muted-foreground"> · rank #{s.rank}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
