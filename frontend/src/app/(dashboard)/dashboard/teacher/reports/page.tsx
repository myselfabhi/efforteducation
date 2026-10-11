'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Loader2, Sparkles, Send, NotebookPen } from 'lucide-react';
import { api, ApiError, type BatchReportRow } from '@/lib/api';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/lib/utils';

interface TeacherDash {
  batches: Array<{ id: number; name: string; course_title: string; student_count: number }>;
}

const MOODS = ['😞', '😕', '😐', '🙂', '🤩'];
const PROMPTS = [
  { key: 'went_well', emoji: '🌟', label: 'Went great' },
  { key: 'tricky', emoji: '🧗', label: 'Tricky' },
  { key: 'next_goal', emoji: '🌱', label: 'To try next' },
] as const;

export default function TeacherReportsPage() {
  const { data: dash } = useQuery({
    queryKey: ['dashboard', 'teacher'],
    queryFn: () => api.dashboard.teacher() as Promise<TeacherDash>,
  });
  const batches = dash?.batches ?? [];
  const firstBatchId = batches[0]?.id;
  const [batchId, setBatchId] = useState<number | null>(null);

  useEffect(() => {
    if (batchId == null && firstBatchId != null) setBatchId(firstBatchId);
  }, [firstBatchId, batchId]);

  const { data, isLoading } = useQuery({
    queryKey: ['reports', 'batch', batchId],
    queryFn: () => api.reports.forBatch(batchId!),
    enabled: batchId != null,
  });
  const rows = data?.students ?? [];
  const submitted = rows.filter((r) => r.report_id != null);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
          <NotebookPen className="h-7 w-7 text-primary" /> Weekly reports
        </h1>
        <p className="text-muted-foreground">
          See what your scholars reflected on this week — send a cheer or a short note back.
        </p>
      </header>

      {batches.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {batches.map((b) => (
            <button
              key={b.id}
              onClick={() => setBatchId(b.id)}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                b.id === batchId
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:bg-secondary'
              )}
            >
              {b.name}
            </button>
          ))}
        </div>
      )}

      {batchId != null && (
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{submitted.length}</span> of {rows.length} submitted this week
        </p>
      )}

      {isLoading && <div className="h-40 animate-pulse rounded-2xl border border-border bg-card" />}

      {!isLoading && batches.length === 0 && (
        <p className="text-sm text-muted-foreground">You don&rsquo;t have any batches yet.</p>
      )}

      {!isLoading && rows.length > 0 && (
        <div className="space-y-4">
          {rows.map((row) => (
            <ReportReviewCard key={row.student_id} row={row} batchId={batchId!} />
          ))}
        </div>
      )}
    </div>
  );
}

function initialsOf(name: string | null, username: string) {
  const base = (name || username).trim();
  const parts = base.split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || base.slice(0, 2).toUpperCase();
}

function ReportReviewCard({ row, batchId }: { row: BatchReportRow; batchId: number }) {
  const qc = useQueryClient();
  const [comment, setComment] = useState(row.teacher_comment ?? '');
  const invalidate = () => qc.invalidateQueries({ queryKey: ['reports', 'batch', batchId] });

  const cheer = useMutation({
    mutationFn: () => api.reports.cheer(row.report_id!),
    onSuccess: invalidate,
    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Something went wrong. Try again.'),
  });
  const saveComment = useMutation({
    mutationFn: () => api.reports.comment(row.report_id!, comment.trim()),
    onSuccess: () => { invalidate(); toast.success('Reply sent 🌟'); },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Something went wrong. Try again.'),
  });

  const submitted = row.report_id != null;
  const cheered = !!row.cheered_at;

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {initialsOf(row.student_name, row.student_username)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold truncate">{row.student_name || row.student_username}</p>
            {submitted && row.mood != null && <span className="text-lg" aria-label={`Mood ${row.mood}/5`}>{MOODS[row.mood - 1]}</span>}
          </div>
          {submitted ? (
            row.submitted_at && (
              <p className="text-xs text-muted-foreground">Submitted {format(new Date(row.submitted_at), 'MMM d, p')}</p>
            )
          ) : (
            <p className="text-xs text-muted-foreground">Hasn&rsquo;t written this week yet</p>
          )}
        </div>
      </div>

      {submitted && (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {PROMPTS.map((p) => {
              const val = row[p.key];
              return (
                <div key={p.key} className="rounded-xl bg-secondary/40 p-3">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {p.emoji} {p.label}
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {val?.trim() ? val : <span className="text-muted-foreground/60">—</span>}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-start">
            <Button
              type="button"
              size="sm"
              variant={cheered ? 'secondary' : 'outline'}
              onClick={() => cheer.mutate()}
              disabled={cheer.isPending}
              className={cn('shrink-0', cheered && 'text-success')}
            >
              {cheer.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {cheered ? 'Cheered' : 'Cheer'}
            </Button>
            <div className="flex-1">
              <textarea
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a short reply…"
                className="w-full resize-y rounded-lg border border-border bg-background p-2.5 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {row.teacher_comment ? 'Replied' : ''}
                </span>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => saveComment.mutate()}
                  disabled={saveComment.isPending || comment.trim().length === 0}
                >
                  {saveComment.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {row.teacher_comment ? 'Update reply' : 'Send reply'}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
