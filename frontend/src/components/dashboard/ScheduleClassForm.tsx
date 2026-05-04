'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api, ApiError } from '@/lib/api';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';

interface Props {
  batchId: number;
  backHref: string;
}

export function ScheduleClassForm({ batchId, backHref }: Props) {
  const router = useRouter();
  const qc = useQueryClient();
  const [form, setForm] = useState({
    title: '',
    description: '',
    scheduled_start: '',
    duration_minutes: '60',
  });

  const create = useMutation({
    mutationFn: () => {
      const start = new Date(form.scheduled_start);
      const end = new Date(start.getTime() + parseInt(form.duration_minutes, 10) * 60_000);
      return api.classes.schedule(batchId, {
        title: form.title,
        description: form.description || undefined,
        scheduled_start: start.toISOString(),
        scheduled_end: end.toISOString(),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['batch', batchId, 'classes'] });
      qc.invalidateQueries({ queryKey: ['classes', 'upcoming'] });
      toast.success('Class scheduled');
      router.push(backHref);
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : 'Failed to schedule'),
  });

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.scheduled_start) {
      toast.error('Title and start time are required.');
      return;
    }
    create.mutate();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" required value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Quantitative Aptitude — Profit & Loss" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea id="description" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start">Start time</Label>
          <Input id="start" type="datetime-local" required value={form.scheduled_start} onChange={(e) => set('scheduled_start', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input id="duration" type="number" min={15} max={480} value={form.duration_minutes} onChange={(e) => set('duration_minutes', e.target.value)} />
        </div>
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={create.isPending}>
          {create.isPending ? 'Scheduling…' : 'Schedule class'}
        </Button>
      </div>
    </form>
  );
}
