'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Search } from 'lucide-react';
import { api, ApiError, type AuthUser, type Batch } from '@/lib/api';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Checkbox } from '@/app/components/ui/checkbox';

interface Props {
  batchId: number;
  backHref: string;
}

export function EnrollStudentsForm({ batchId, backHref }: Props) {
  const router = useRouter();
  const qc = useQueryClient();
  const [picked, setPicked] = useState<Set<number>>(new Set());
  const [q, setQ] = useState('');

  const studentsQ = useQuery({
    queryKey: ['users', 'student'],
    queryFn: () => api.users.list('student') as Promise<AuthUser[]>,
  });
  const batchQ = useQuery({
    queryKey: ['batch', batchId],
    queryFn: () => api.batches.get(batchId) as Promise<Batch>,
  });

  const enrolled = useMemo(
    () => new Set((batchQ.data?.students ?? []).map((s) => s.id)),
    [batchQ.data]
  );

  const filtered = useMemo(() => {
    const all = studentsQ.data ?? [];
    const needle = q.trim().toLowerCase();
    return all
      .filter((s) => !enrolled.has(s.id))
      .filter((s) =>
        !needle ||
        (s.full_name || '').toLowerCase().includes(needle) ||
        s.username.toLowerCase().includes(needle) ||
        s.email.toLowerCase().includes(needle)
      );
  }, [studentsQ.data, enrolled, q]);

  const submit = useMutation({
    mutationFn: () => api.batches.addStudents(batchId, Array.from(picked)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['batch', batchId] });
      toast.success(`Enrolled ${picked.size} student(s)`);
      router.push(backHref);
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : 'Failed to enroll'),
  });

  function toggle(id: number) {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search by name, username, or email" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="rounded-xl border border-border bg-card max-h-[60vh] overflow-y-auto divide-y divide-border">
        {filtered.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground text-center">
            {studentsQ.isLoading ? 'Loading…' : 'No students to add.'}
          </p>
        ) : (
          filtered.map((s) => (
            <label key={s.id} className="flex items-center gap-3 p-3 cursor-pointer hover:bg-secondary/40">
              <Checkbox checked={picked.has(s.id)} onCheckedChange={() => toggle(s.id)} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{s.full_name || s.username}</p>
                <p className="text-xs text-muted-foreground truncate">{s.email}</p>
              </div>
            </label>
          ))
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{picked.size} selected</p>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={() => submit.mutate()} disabled={picked.size === 0 || submit.isPending}>
            {submit.isPending ? 'Enrolling…' : `Enroll ${picked.size}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
