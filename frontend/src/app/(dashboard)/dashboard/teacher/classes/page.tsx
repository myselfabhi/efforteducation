import { PageHeader } from '@/components/dashboard/PageHeader';
import { UpcomingClassesList } from '@/components/dashboard/UpcomingClassesList';

export default function TeacherClassesPage() {
  return (
    <div>
      <PageHeader title="Live classes" description="Classes you're teaching this week." />
      <UpcomingClassesList />
    </div>
  );
}
