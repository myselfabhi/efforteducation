'use client';

import { use } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { ScheduleClassForm } from '@/components/dashboard/ScheduleClassForm';

export default function NewClassPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const batchId = parseInt(id, 10);
  return (
    <div>
      <PageHeader title="Schedule a class" />
      <ScheduleClassForm batchId={batchId} backHref={`/dashboard/admin/batches/${batchId}`} />
    </div>
  );
}
