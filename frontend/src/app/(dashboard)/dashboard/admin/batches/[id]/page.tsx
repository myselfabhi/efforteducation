'use client';

import { use } from 'react';
import { BatchDetail } from '@/components/dashboard/BatchDetail';

export default function AdminBatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const batchId = parseInt(id, 10);
  return (
    <BatchDetail batchId={batchId} canManage={true} basePath={`/dashboard/admin/batches/${batchId}`} />
  );
}
