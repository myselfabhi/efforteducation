'use client';

import { useQuery } from '@tanstack/react-query';
import { Video } from 'lucide-react';
import { api, type LiveClass } from '@/lib/api';
import { ClassCard } from './ClassCard';
import { EmptyState } from './EmptyState';

export function UpcomingClassesList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['classes', 'upcoming'],
    queryFn: () => api.classes.upcoming() as Promise<LiveClass[]>,
    refetchInterval: 60_000,
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (error) return <p className="text-sm text-destructive">Failed to load.</p>;
  if (!data || data.length === 0) {
    return <EmptyState icon={<Video className="h-6 w-6" />} title="No upcoming classes" description="When a class is scheduled, it'll show up here." />;
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((c) => (
        <ClassCard key={c.id} cls={c} />
      ))}
    </div>
  );
}
