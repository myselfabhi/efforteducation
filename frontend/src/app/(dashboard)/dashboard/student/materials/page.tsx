import { PageHeader } from '@/components/dashboard/PageHeader';
import { BatchesList } from '@/components/dashboard/BatchesList';

export default function StudentMaterialsPage() {
  return (
    <div>
      <PageHeader title="Materials" description="Pick a batch to browse its notes." />
      <BatchesList
        hrefBase="/dashboard/student/batches"
        emptyTitle="No batches yet"
        emptyDescription="Once you're enrolled, your batch materials will appear here."
      />
    </div>
  );
}
