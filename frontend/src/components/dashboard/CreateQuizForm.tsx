'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api, ApiError, type QuizSummary } from '@/lib/api';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Checkbox } from '@/app/components/ui/checkbox';

interface Props {
  batchId?: number;
  /** Where to send user after the quiz is created (path takes a `:id` placeholder for the new quiz id). */
  successPathTemplate?: string;
  backHref: string;
  /** Allow toggling "practice" mode (open to all). Defaults to false. */
  allowPractice?: boolean;
}

export function CreateQuizForm({
  batchId,
  successPathTemplate = '/quiz/admin/:id/questions',
  backHref,
  allowPractice = false,
}: Props) {
  const router = useRouter();
  const qc = useQueryClient();
  const [form, setForm] = useState({
    title: '',
    description: '',
    scheduled_at: '',
  });
  const [isPractice, setIsPractice] = useState(false);

  const create = useMutation({
    mutationFn: () =>
      api.quizzes.create({
        title: form.title,
        description: form.description || undefined,
        scheduled_at: form.scheduled_at || undefined,
        batch_id: isPractice ? undefined : batchId,
        is_practice: isPractice ? true : undefined,
      }) as Promise<QuizSummary>,
    onSuccess: (q) => {
      qc.invalidateQueries({ queryKey: ['quizzes'] });
      if (batchId) qc.invalidateQueries({ queryKey: ['batch', batchId] });
      toast.success('Quiz created — add questions next.');
      router.push(successPathTemplate.replace(':id', String(q.id)));
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : 'Failed to create quiz'),
  });

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    create.mutate();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
      <div className="space-y-2">
        <Label htmlFor="title">Quiz title</Label>
        <Input id="title" required value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Quant — Profit & Loss · Weekly Test" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea id="description" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="What does this quiz cover?" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="scheduled_at">Schedule (optional)</Label>
        <Input id="scheduled_at" type="datetime-local" value={form.scheduled_at} onChange={(e) => set('scheduled_at', e.target.value)} />
        <p className="text-xs text-muted-foreground">Leave empty to launch on demand.</p>
      </div>

      {allowPractice && (
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <Checkbox checked={isPractice} onCheckedChange={(v) => setIsPractice(!!v)} />
          Practice quiz (open to all logged-in users — not scoped to a batch)
        </label>
      )}

      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="outline" onClick={() => router.push(backHref)}>
          Cancel
        </Button>
        <Button type="submit" disabled={create.isPending}>
          {create.isPending ? 'Creating…' : 'Next: add questions →'}
        </Button>
      </div>
    </form>
  );
}
