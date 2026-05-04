import { PageHeader } from '@/components/dashboard/PageHeader';
import { BatchesList } from '@/components/dashboard/BatchesList';

export default function TeacherMaterialsPage() {
  return (
    <div>
      <PageHeader title="Materials" description="Pick a batch to upload or browse its notes." />
      <BatchesList
        hrefBase="/dashboard/teacher/batches"
        emptyTitle="No batches yet"
        emptyDescription="An admin will assign you to a batch shortly."
      />
    </div>
  );
}
