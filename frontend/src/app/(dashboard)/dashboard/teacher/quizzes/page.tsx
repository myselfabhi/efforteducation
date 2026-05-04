import { PageHeader } from '@/components/dashboard/PageHeader';
import { QuizzesList } from '@/components/dashboard/QuizzesList';

export default function TeacherQuizzesPage() {
  return (
    <div>
      <PageHeader title="Quizzes" description="Quizzes you've created across your batches." />
      <QuizzesList role="teacher" />
    </div>
  );
}
