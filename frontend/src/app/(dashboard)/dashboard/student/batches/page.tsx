import { PageHeader } from '@/components/dashboard/PageHeader';
import { BatchesList } from '@/components/dashboard/BatchesList';

export default function StudentBatchesPage() {
  return (
    <div>
      <PageHeader title="My batches" description="Everything you're enrolled in." />
      <BatchesList
        hrefBase="/dashboard/student/batches"
        emptyTitle="No batches yet"
        emptyDescription="Once you're enrolled, your batches will appear here."
      />
    </div>
  );
}
