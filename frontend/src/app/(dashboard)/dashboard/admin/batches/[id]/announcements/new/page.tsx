'use client';

import { use } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { AnnouncementForm } from '@/components/dashboard/AnnouncementForm';

export default function NewAnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const batchId = parseInt(id, 10);
  return (
    <div>
      <PageHeader title="Post an announcement" />
      <AnnouncementForm batchId={batchId} backHref={`/dashboard/admin/batches/${batchId}`} />
    </div>
  );
}
