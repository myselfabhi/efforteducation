import { PageHeader } from '@/components/dashboard/PageHeader';
import { UpcomingClassesList } from '@/components/dashboard/UpcomingClassesList';

export default function AdminClassesPage() {
  return (
    <div>
      <PageHeader title="Live classes" description="Every upcoming class on the platform." />
      <UpcomingClassesList />
    </div>
  );
}
