'use client';

import { use } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { CreateQuizForm } from '@/components/dashboard/CreateQuizForm';

export default function NewQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const batchId = parseInt(id, 10);
  return (
    <div>
      <PageHeader title="Create a quiz" description="Set the basics. You'll add questions on the next screen." />
      <CreateQuizForm batchId={batchId} backHref={`/dashboard/teacher/batches/${batchId}`} />
    </div>
  );
}
