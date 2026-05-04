'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { GraduationCap, Video, FileText, ClipboardList } from 'lucide-react';
import { api } from '@/lib/api';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/app/components/ui/button';

interface TeacherDash {
  batches: Array<{ id: number; name: string; course_title: string; student_count: number }>;
  upcoming_classes: Array<{ id: number; title: string; scheduled_start: string; status: string; batch_name: string }>;
  recent_materials: Array<{ id: number; title: string; type: string; created_at: string; batch_name: string }>;
  recent_quizzes: Array<{ id: number; title: string; status: string; created_at: string; batch_name: string | null }>;
}

export default function TeacherDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard', 'teacher'],
    queryFn: () => api.dashboard.teacher() as Promise<TeacherDash>,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your teaching dashboard</h1>
        <p className="text-muted-foreground">Today&rsquo;s classes, your batches, and recent activity.</p>
      </div>

      {error && <p className="text-sm text-destructive">Failed to load.</p>}
      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

      {data && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Active batches" value={data.batches.length} icon={<GraduationCap className="h-5 w-5" />} />
            <StatCard label="Upcoming classes" value={data.upcoming_classes.length} icon={<Video className="h-5 w-5" />} accent="blue" />
            <StatCard label="Recent materials" value={data.recent_materials.length} icon={<FileText className="h-5 w-5" />} accent="amber" />
            <StatCard label="Recent quizzes" value={data.recent_quizzes.length} icon={<ClipboardList className="h-5 w-5" />} accent="emerald" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <section className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Upcoming classes</h2>
                <Link href="/dashboard/teacher/classes" className="text-sm text-primary hover:underline">View all</Link>
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
                          {c.status === 'LIVE' ? 'Resume' : 'Open'}
                        </Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Your batches</h2>
                <Link href="/dashboard/teacher/batches" className="text-sm text-primary hover:underline">View all</Link>
              </div>
              {data.batches.length === 0 ? (
                <p className="text-sm text-muted-foreground">You&rsquo;re not assigned to any batches yet.</p>
              ) : (
                <ul className="space-y-3">
                  {data.batches.map((b) => (
                    <li key={b.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="font-medium truncate">{b.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{b.course_title}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{b.student_count} students</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
