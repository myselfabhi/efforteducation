import { PageHeader } from '@/components/dashboard/PageHeader';
import { QuizzesList } from '@/components/dashboard/QuizzesList';

export default function AdminQuizzesPage() {
  return (
    <div>
      <PageHeader title="All quizzes" description="Every quiz across the platform." />
      <QuizzesList role="admin" />
    </div>
  );
}
