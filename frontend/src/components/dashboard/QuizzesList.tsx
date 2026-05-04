'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ClipboardList, Trophy, Play, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { api, type QuizSummary } from '@/lib/api';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { EmptyState } from './EmptyState';

interface Props {
  /** 'student' shows Join/Results CTAs; 'teacher'/'admin' show Edit/Live CTAs. */
  role: 'student' | 'teacher' | 'admin';
}

const STATUS_TONE: Record<string, string> = {
  DRAFT: 'bg-muted text-muted-foreground',
  UPCOMING: 'bg-info/10 text-info',
  LIVE: 'bg-success/10 text-success',
  COMPLETED: 'bg-muted text-muted-foreground',
};

function ctaFor(role: Props['role'], q: QuizSummary): { label: string; href: string; icon: React.ReactNode; primary: boolean } {
  if (role === 'student') {
    if (q.status === 'LIVE') return { label: 'Join now', href: `/quiz/${q.id}/lobby`, icon: <Play className="h-3.5 w-3.5" />, primary: true };
    if (q.status === 'COMPLETED') return { label: 'View results', href: `/quiz/${q.id}/results`, icon: <Trophy className="h-3.5 w-3.5" />, primary: false };
    return { label: 'Open', href: `/quiz/${q.id}/lobby`, icon: <Play className="h-3.5 w-3.5" />, primary: false };
  }
  // teacher / admin
  if (q.status === 'LIVE') return { label: 'Live console', href: `/quiz/admin/${q.id}/live`, icon: <Play className="h-3.5 w-3.5" />, primary: true };
  if (q.status === 'COMPLETED') return { label: 'View results', href: `/quiz/admin/${q.id}/preview`, icon: <Trophy className="h-3.5 w-3.5" />, primary: false };
  return { label: q.question_count && Number(q.question_count) > 0 ? 'Preview & launch' : 'Add questions', href: q.question_count && Number(q.question_count) > 0 ? `/quiz/admin/${q.id}/preview` : `/quiz/admin/${q.id}/questions`, icon: <Pencil className="h-3.5 w-3.5" />, primary: true };
}

export function QuizzesList({ role }: Props) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['quizzes', role],
    queryFn: () => api.quizzes.list() as Promise<QuizSummary[]>,
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (error) return <p className="text-sm text-destructive">Failed to load quizzes.</p>;
  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={<ClipboardList className="h-6 w-6" />}
        title="No quizzes yet"
        description={
          role === 'student'
            ? "When your teacher launches a quiz, you'll see it here."
            : 'Create a quiz from a batch and launch it when ready.'
        }
      />
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
      {data.map((q) => {
        const cta = ctaFor(role, q);
        return (
          <div key={q.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold truncate">{q.title}</h3>
                <Badge className={`text-[10px] ${STATUS_TONE[q.status] ?? ''}`} variant="secondary">
                  {q.status}
                </Badge>
                {q.is_practice && (
                  <Badge variant="outline" className="text-[10px]">
                    Practice
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {q.question_count != null && `${q.question_count} questions · `}
                {q.creator_name && `by ${q.creator_name} · `}
                {format(new Date(q.created_at), 'PP')}
              </p>
            </div>
            <Button asChild size="sm" variant={cta.primary ? 'default' : 'outline'} className="shrink-0">
              <Link href={cta.href}>
                {cta.icon}
                <span className="ml-1.5">{cta.label}</span>
              </Link>
            </Button>
          </div>
        );
      })}
    </div>
  );
}
