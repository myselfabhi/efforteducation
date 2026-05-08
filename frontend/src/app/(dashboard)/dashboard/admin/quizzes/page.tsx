import Link from 'next/link';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { QuizzesList } from '@/components/dashboard/QuizzesList';
import { Button } from '@/app/components/ui/button';

export default function AdminQuizzesPage() {
  return (
    <div>
      <PageHeader
        title="All quizzes"
        description="Every quiz across the platform."
        actions={
          <Button asChild>
            <Link href="/quiz/admin/create">
              <Plus className="h-4 w-4 mr-1.5" />
              Create Quiz
            </Link>
          </Button>
        }
      />
      <QuizzesList role="admin" />
    </div>
  );
}
