import { PageHeader } from '@/components/dashboard/PageHeader';
import { UpcomingClassesList } from '@/components/dashboard/UpcomingClassesList';

export default function StudentClassesPage() {
  return (
    <div>
      <PageHeader title="Live classes" description="Your upcoming and live classes." />
      <UpcomingClassesList />
    </div>
  );
}
