import { PageHeader } from '@/components/dashboard/PageHeader';
import { QuizzesList } from '@/components/dashboard/QuizzesList';

export default function StudentQuizzesPage() {
  return (
    <div>
      <PageHeader title="Quizzes" description="Live, upcoming and past quizzes from your batches." />
      <QuizzesList role="student" />
    </div>
  );
}
