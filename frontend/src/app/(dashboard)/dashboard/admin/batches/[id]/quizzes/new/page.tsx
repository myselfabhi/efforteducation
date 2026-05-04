'use client';

import { use } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { CreateQuizForm } from '@/components/dashboard/CreateQuizForm';

export default function NewQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const batchId = parseInt(id, 10);
  return (
    <div>
      <PageHeader title="Create a quiz" description="Scoped to this batch. Toggle 'practice' to open it to all users." />
      <CreateQuizForm batchId={batchId} backHref={`/dashboard/admin/batches/${batchId}`} allowPractice />
    </div>
  );
}
