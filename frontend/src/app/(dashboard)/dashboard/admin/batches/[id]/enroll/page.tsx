'use client';

import { use } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { EnrollStudentsForm } from '@/components/dashboard/EnrollStudentsForm';

export default function EnrollPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const batchId = parseInt(id, 10);
  return (
    <div>
      <PageHeader title="Add students to batch" />
      <EnrollStudentsForm batchId={batchId} backHref={`/dashboard/admin/batches/${batchId}`} />
    </div>
  );
}
