'use client';

import { use } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { UploadMaterialForm } from '@/components/dashboard/UploadMaterialForm';

export default function NewMaterialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const batchId = parseInt(id, 10);
  return (
    <div>
      <PageHeader title="Add material" description="Upload a PDF/image, paste a video link, or write a quick note." />
      <UploadMaterialForm batchId={batchId} backHref={`/dashboard/teacher/batches/${batchId}`} />
    </div>
  );
}
