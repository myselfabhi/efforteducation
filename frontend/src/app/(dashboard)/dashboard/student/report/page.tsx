'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Send, Sparkles, PartyPopper, Pencil, MessageCircleHeart } from 'lucide-react';
import { api, ApiError, type WeeklyReport } from '@/lib/api';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/lib/utils';

const PROMPTS = [
  { key: 'went_well', emoji: '🌟', label: 'Something that went great', stem: "This week I'm proud that…" },
  { key: 'tricky', emoji: '🧗', label: 'Something that was tricky', stem: 'I found it tricky when…' },
  { key: 'next_goal', emoji: '🌱', label: 'Something to try next', stem: 'Next week I want to…' },
] as const;

const MOODS = ['😞', '😕', '😐', '🙂', '🤩'];

// The child's weekly reflection — scaffolded write + submitted view.
export default function WeeklyReportPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['reports', 'current'],
    queryFn: () => api.reports.current(),
  });
  const report = data?.report ?? null;
  const [editing, setEditing] = useState(false);

  const showForm = editing || !report;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">This week&rsquo;s report</h1>
        <p className="text-muted-foreground">
          A few lines about your week — your teacher reads every one. There are no wrong answers.
        </p>
      </header>

      {isLoading && <div className="h-64 animate-pulse rounded-2xl border border-border bg-card" />}

      {!isLoading && showForm && (
        <ReportForm
          existing={report}
          onSaved={() => {
            setEditing(false);
            qc.invalidateQueries({ queryKey: ['reports', 'current'] });
            qc.invalidateQueries({ queryKey: ['reports', 'mine'] });
          }}
          onCancel={report ? () => setEditing(false) : undefined}
        />
      )}

      {!isLoading && report && !editing && (
        <SubmittedView report={report} onEdit={() => setEditing(true)} />
      )}
    </div>
  );
}

function ReportForm({
  existing,
  onSaved,
  onCancel,
}: {
  existing: WeeklyReport | null;
  onSaved: () => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState({
    went_well: existing?.went_well ?? '',
    tricky: existing?.tricky ?? '',
    next_goal: existing?.next_goal ?? '',
  });
  const [mood, setMood] = useState<number | null>(existing?.mood ?? null);

  const mutation = useMutation({
    mutationFn: () =>
      api.reports.submit({
        went_well: form.went_well.trim() || undefined,
        tricky: form.tricky.trim() || undefined,
        next_goal: form.next_goal.trim() || undefined,
        mood: mood ?? undefined,
      }),
    onSuccess: () => {
      toast.success(existing ? 'Report updated 🌟' : 'Report sent to your teacher! 🌟');
      onSaved();
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : 'Could not send. Please try again.'),
  });

  const hasContent = [form.went_well, form.tricky, form.next_goal].some((v) => v.trim().length > 0);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasContent) {
      toast.error('Write at least one line before sending.');
      return;
    }
    mutation.mutate();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {PROMPTS.map((p) => (
        <div key={p.key} className="rounded-2xl border border-border bg-card p-5">
          <label htmlFor={p.key} className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <span className="text-lg leading-none" aria-hidden>{p.emoji}</span>
            {p.label}
          </label>
          <textarea
            id={p.key}
            rows={3}
            value={form[p.key]}
            onChange={(e) => setForm((s) => ({ ...s, [p.key]: e.target.value }))}
            placeholder={p.stem}
            className="w-full resize-y rounded-lg border border-border bg-background p-3 text-sm leading-relaxed placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
      ))}

      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="mb-3 text-sm font-semibold">How did this week feel?</p>
        <div className="flex gap-2">
          {MOODS.map((emoji, i) => {
            const value = i + 1;
            const selected = mood === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setMood(selected ? null : value)}
                aria-pressed={selected}
                aria-label={`Mood ${value} of 5`}
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-xl border text-2xl transition-all',
                  selected
                    ? 'border-primary bg-primary/10 scale-110'
                    : 'border-border bg-background hover:bg-secondary opacity-70 hover:opacity-100'
                )}
              >
                {emoji}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={mutation.isPending}>
            Cancel
          </Button>
        )}
        <Button type="submit" size="lg" disabled={mutation.isPending || !hasContent}>
          {mutation.isPending ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
          ) : (
            <><Send className="h-4 w-4" /> {existing ? 'Save changes' : 'Send to my teacher'}</>
          )}
        </Button>
      </div>
    </form>
  );
}

function SubmittedView({ report, onEdit }: { report: WeeklyReport; onEdit: () => void }) {
  const answered = PROMPTS.filter((p) => (report[p.key] ?? '').trim().length > 0);
  const hasFeedback = !!report.cheered_at || !!report.teacher_comment;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 rounded-2xl border border-success/40 bg-success/5 p-5">
        <PartyPopper className="h-6 w-6 shrink-0 text-success" />
        <div>
          <p className="font-semibold">You&rsquo;ve done this week&rsquo;s report!</p>
          <p className="text-sm text-muted-foreground">Nice reflecting. You can tweak it any time this week.</p>
        </div>
      </div>

      {answered.map((p) => (
        <div key={p.key} className="rounded-2xl border border-border bg-card p-5">
          <p className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
            <span className="text-lg leading-none" aria-hidden>{p.emoji}</span>
            {p.label}
          </p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{report[p.key]}</p>
        </div>
      ))}

      {report.mood != null && (
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-5">
          <span className="text-sm font-semibold">How the week felt:</span>
          <span className="text-2xl" aria-label={`Mood ${report.mood} of 5`}>{MOODS[report.mood - 1]}</span>
        </div>
      )}

      {/* Teacher feedback */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <MessageCircleHeart className="h-4 w-4 text-primary" /> From your teacher
        </p>
        {!hasFeedback ? (
          <p className="text-sm text-muted-foreground">
            Your teacher hasn&rsquo;t replied yet — check back soon! 🌟
          </p>
        ) : (
          <div className="space-y-3">
            {report.cheered_at && (
              <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1.5 text-sm font-medium text-success">
                <Sparkles className="h-4 w-4" /> Your teacher cheered this! 🎉
              </div>
            )}
            {report.teacher_comment && (
              <div className="rounded-xl bg-secondary/50 p-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{report.teacher_comment}</p>
                {report.teacher_name && (
                  <p className="mt-2 text-xs text-muted-foreground">— {report.teacher_name}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={onEdit}>
          <Pencil className="h-4 w-4" /> Edit my report
        </Button>
      </div>
    </div>
  );
}
