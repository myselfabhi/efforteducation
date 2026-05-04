'use client';

import { useQuery } from '@tanstack/react-query';
import { Users, GraduationCap, BookOpen, Video, ClipboardList, Activity } from 'lucide-react';
import { api } from '@/lib/api';
import { StatCard } from '@/components/dashboard/StatCard';

interface AdminStats {
  users_by_role: Array<{ role: string; count: number }>;
  batches_by_status: Array<{ status: string; count: number }>;
  total_courses: number;
  classes_today: number;
  live_quizzes: number;
  active_users_7d: number;
}

export default function SuperAdminDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard', 'super-admin'],
    queryFn: () => api.dashboard.superAdmin() as Promise<AdminStats>,
  });

  const usersByRole = (role: string) =>
    data?.users_by_role.find((u) => u.role === role)?.count ?? 0;
  const batchesByStatus = (s: string) =>
    data?.batches_by_status.find((b) => b.status === s)?.count ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform overview</h1>
        <p className="text-muted-foreground">Everything happening across Effort Education today.</p>
      </div>

      {error && <p className="text-sm text-destructive">Failed to load dashboard.</p>}
      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

      {data && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard label="Students" value={usersByRole('student')} icon={<Users className="h-5 w-5" />} accent="primary" />
            <StatCard label="Teachers" value={usersByRole('teacher')} icon={<GraduationCap className="h-5 w-5" />} accent="blue" />
            <StatCard label="Courses" value={data.total_courses} icon={<BookOpen className="h-5 w-5" />} accent="amber" />
            <StatCard label="Active batches" value={batchesByStatus('active')} icon={<GraduationCap className="h-5 w-5" />} accent="emerald" />
            <StatCard label="Classes today" value={data.classes_today} icon={<Video className="h-5 w-5" />} accent="blue" />
            <StatCard label="Live quizzes now" value={data.live_quizzes} icon={<ClipboardList className="h-5 w-5" />} accent="primary" />
            <StatCard label="Active users (7d)" value={data.active_users_7d} icon={<Activity className="h-5 w-5" />} accent="emerald" />
          </div>
        </>
      )}
    </div>
  );
}
