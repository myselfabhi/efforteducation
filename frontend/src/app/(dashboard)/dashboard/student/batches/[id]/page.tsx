'use client';

import { use } from 'react';
import { BatchDetail } from '@/components/dashboard/BatchDetail';

export default function StudentBatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const batchId = parseInt(id, 10);
  return (
    <BatchDetail batchId={batchId} canManage={false} basePath={`/dashboard/student/batches/${batchId}`} />
  );
}
