'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Trash2, X, Pencil } from 'lucide-react';
import { api, ApiError, type Skill } from '@/lib/api';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/app/components/ui/table';

export default function AdminSkillsPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Skill | 'new' | null>(null);

  const { data: skills, isLoading } = useQuery({
    queryKey: ['admin', 'skills'],
    queryFn: () => api.skills.listAdmin(),
  });

  const remove = useMutation({
    mutationFn: (id: number) => api.skills.remove(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'skills'] }); toast.success('Skill removed'); },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Failed to remove'),
  });
  const toggle = useMutation({
    mutationFn: (s: Skill) => api.skills.update(s.id, { active: !s.active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'skills'] }),
    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Failed to update'),
  });

  return (
    <div>
      <PageHeader
        title="Skills"
        description="The skills Young Scholars are measured on. Mastery is computed from quizzes tagged with each skill."
        actions={!editing && <Button onClick={() => setEditing('new')}><Plus className="h-4 w-4" /> New skill</Button>}
      />

      {editing && <SkillForm initial={editing === 'new' ? undefined : editing} onDone={() => setEditing(null)} />}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : !skills || skills.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No skills yet.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Skill</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skills.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">
                    <span className="mr-2 text-lg">{s.emoji}</span>{s.name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{s.sort_order}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => toggle.mutate(s)}
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${s.active ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}
                    >
                      {s.active ? 'Active' : 'Inactive'}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setEditing(s)}><Pencil className="h-4 w-4" /></Button>
                    <Button
                      variant="ghost" size="sm" className="text-destructive hover:text-destructive"
                      onClick={() => { if (confirm(`Delete "${s.name}"? Quizzes tagged with it will be untagged.`)) remove.mutate(s.id); }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function SkillForm({ initial, onDone }: { initial?: Skill; onDone: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    emoji: initial?.emoji ?? '',
    sort_order: initial ? String(initial.sort_order) : '',
  });
  const set = <K extends keyof typeof form>(k: K, v: string) => setForm((s) => ({ ...s, [k]: v }));

  const save = useMutation({
    mutationFn: () => {
      const body = {
        name: form.name.trim(),
        emoji: form.emoji.trim() || null,
        sort_order: form.sort_order ? parseInt(form.sort_order, 10) : 0,
      };
      return initial ? api.skills.update(initial.id, body) : api.skills.create(body);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'skills'] });
      qc.invalidateQueries({ queryKey: ['skills'] });
      toast.success(initial ? 'Skill saved' : 'Skill created');
      onDone();
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Failed to save'),
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.name.trim().length < 2) return toast.error('Give the skill a name.');
    save.mutate();
  }

  return (
    <form onSubmit={submit} className="mb-6 space-y-4 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{initial ? 'Edit skill' : 'New skill'}</h3>
        <button type="button" onClick={onDone} className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary" aria-label="Cancel"><X className="h-4 w-4" /></button>
      </div>
      <div className="grid gap-4 sm:grid-cols-[1fr_6rem_6rem]">
        <div className="space-y-2">
          <Label htmlFor="skill_name">Name</Label>
          <Input id="skill_name" autoFocus value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Fast Maths" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="skill_emoji">Emoji</Label>
          <Input id="skill_emoji" value={form.emoji} onChange={(e) => set('emoji', e.target.value)} placeholder="🔢" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="skill_order">Order</Label>
          <Input id="skill_order" type="number" value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} placeholder="1" />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onDone}>Cancel</Button>
        <Button type="submit" disabled={save.isPending}>{save.isPending ? 'Saving…' : initial ? 'Save' : 'Create skill'}</Button>
      </div>
    </form>
  );
}
