'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api, ApiError, type Course, type AuthUser } from '@/lib/api';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Checkbox } from '@/app/components/ui/checkbox';

export default function NewBatchPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [form, setForm] = useState({
    course_id: '',
    name: '',
    start_date: '',
    end_date: '',
    schedule_description: '',
    capacity: '',
  });
  const [teacherIds, setTeacherIds] = useState<Set<number>>(new Set());
  const [studentIds, setStudentIds] = useState<Set<number>>(new Set());

  const coursesQ = useQuery({
    queryKey: ['admin', 'courses'],
    queryFn: () => api.courses.listAdmin() as Promise<Course[]>,
  });
  const teachersQ = useQuery({
    queryKey: ['users', 'teacher'],
    queryFn: () => api.users.list('teacher') as Promise<AuthUser[]>,
  });
  const studentsQ = useQuery({
    queryKey: ['users', 'student'],
    queryFn: () => api.users.list('student') as Promise<AuthUser[]>,
  });

  const create = useMutation({
    mutationFn: () =>
      api.batches.create({
        course_id: parseInt(form.course_id, 10),
        name: form.name,
        start_date: form.start_date,
        end_date: form.end_date || undefined,
        schedule_description: form.schedule_description || undefined,
        capacity: form.capacity ? parseInt(form.capacity, 10) : undefined,
        teacher_ids: Array.from(teacherIds),
        student_ids: Array.from(studentIds),
      }),
    onSuccess: (b) => {
      qc.invalidateQueries({ queryKey: ['batches'] });
      toast.success('Batch created');
      router.push(`/dashboard/admin/batches/${b.id}`);
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : 'Failed to create batch'),
  });

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  function toggle(setS: React.Dispatch<React.SetStateAction<Set<number>>>, id: number) {
    setS((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.course_id || !form.name || !form.start_date) {
      toast.error('Course, name, and start date are required.');
      return;
    }
    create.mutate();
  }

  return (
    <div className="max-w-3xl">
      <PageHeader title="Create a batch" description="Set up the batch, then assign teachers and students." />

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Course</Label>
            <Select value={form.course_id} onValueChange={(v) => set('course_id', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Pick a course" />
              </SelectTrigger>
              <SelectContent>
                {(coursesQ.data ?? []).map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Batch name</Label>
            <Input id="name" required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. IBPS PO Morning — Aug 2026" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="start_date">Start date</Label>
            <Input id="start_date" type="date" required value={form.start_date} onChange={(e) => set('start_date', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">End date (optional)</Label>
            <Input id="end_date" type="date" value={form.end_date} onChange={(e) => set('end_date', e.target.value)} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="schedule">Schedule description</Label>
            <Textarea id="schedule" value={form.schedule_description} onChange={(e) => set('schedule_description', e.target.value)} placeholder="e.g. Mon–Fri 8–10 AM" rows={2} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity (optional)</Label>
            <Input id="capacity" type="number" min={1} value={form.capacity} onChange={(e) => set('capacity', e.target.value)} />
          </div>
        </div>

        <section className="space-y-2">
          <Label>Assign teachers</Label>
          <div className="rounded-xl border border-border bg-card p-3 max-h-48 overflow-y-auto space-y-1.5">
            {(teachersQ.data ?? []).map((t) => (
              <label key={t.id} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox checked={teacherIds.has(t.id)} onCheckedChange={() => toggle(setTeacherIds, t.id)} />
                <span>{t.full_name || t.username}</span>
                <span className="text-xs text-muted-foreground ml-auto">{t.email}</span>
              </label>
            ))}
            {(!teachersQ.data || teachersQ.data.length === 0) && (
              <p className="text-xs text-muted-foreground">No teachers yet — invite from the Users page.</p>
            )}
          </div>
        </section>

        <section className="space-y-2">
          <Label>Enroll students</Label>
          <div className="rounded-xl border border-border bg-card p-3 max-h-72 overflow-y-auto space-y-1.5">
            {(studentsQ.data ?? []).map((s) => (
              <label key={s.id} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox checked={studentIds.has(s.id)} onCheckedChange={() => toggle(setStudentIds, s.id)} />
                <span>{s.full_name || s.username}</span>
                <span className="text-xs text-muted-foreground ml-auto">{s.email}</span>
              </label>
            ))}
            {(!studentsQ.data || studentsQ.data.length === 0) && (
              <p className="text-xs text-muted-foreground">No students yet.</p>
            )}
          </div>
        </section>

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? 'Creating…' : 'Create batch'}
          </Button>
        </div>
      </form>
    </div>
  );
}
