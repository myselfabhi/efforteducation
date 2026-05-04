'use client';

import { useQuery } from '@tanstack/react-query';
import { GraduationCap } from 'lucide-react';
import { api, type Batch } from '@/lib/api';
import { BatchCard } from './BatchCard';
import { EmptyState } from './EmptyState';

interface Props {
  hrefBase: string; // e.g. /dashboard/student/batches
  emptyTitle: string;
  emptyDescription: string;
}

export function BatchesList({ hrefBase, emptyTitle, emptyDescription }: Props) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['batches'],
    queryFn: () => api.batches.list() as Promise<Batch[]>,
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (error) return <p className="text-sm text-destructive">Failed to load batches.</p>;
  if (!data || data.length === 0) {
    return (
      <EmptyState icon={<GraduationCap className="h-6 w-6" />} title={emptyTitle} description={emptyDescription} />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((b) => (
        <BatchCard key={b.id} batch={b} href={`${hrefBase}/${b.id}`} />
      ))}
    </div>
  );
}
