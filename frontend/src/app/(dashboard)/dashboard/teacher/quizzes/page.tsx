import Link from 'next/link';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { QuizzesList } from '@/components/dashboard/QuizzesList';
import { Button } from '@/app/components/ui/button';

export default function TeacherQuizzesPage() {
  return (
    <div>
      <PageHeader
        title="Quizzes"
        description="Quizzes you've created across your batches."
        actions={
          <Button asChild>
            <Link href="/quiz/admin/create">
              <Plus className="h-4 w-4 mr-1.5" />
              Create Quiz
            </Link>
          </Button>
        }
      />
      <QuizzesList role="teacher" />
    </div>
  );
}
