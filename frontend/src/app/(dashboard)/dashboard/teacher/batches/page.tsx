import { PageHeader } from '@/components/dashboard/PageHeader';
import { BatchesList } from '@/components/dashboard/BatchesList';

export default function TeacherBatchesPage() {
  return (
    <div>
      <PageHeader title="My batches" description="Batches you teach." />
      <BatchesList
        hrefBase="/dashboard/teacher/batches"
        emptyTitle="Not assigned to any batches"
        emptyDescription="An admin will assign you to a batch shortly."
      />
    </div>
  );
}
