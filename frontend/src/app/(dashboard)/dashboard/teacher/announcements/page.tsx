import { PageHeader } from '@/components/dashboard/PageHeader';
import { BatchesList } from '@/components/dashboard/BatchesList';

export default function TeacherAnnouncementsPage() {
  return (
    <div>
      <PageHeader title="Announcements" description="Pick a batch to post or browse its announcements." />
      <BatchesList
        hrefBase="/dashboard/teacher/batches"
        emptyTitle="No batches yet"
        emptyDescription="An admin will assign you to a batch shortly."
      />
    </div>
  );
}
