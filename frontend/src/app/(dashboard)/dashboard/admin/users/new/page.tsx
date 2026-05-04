'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api, ApiError } from '@/lib/api';
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

export default function InviteUserPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [form, setForm] = useState({
    role: 'teacher' as 'teacher' | 'student',
    full_name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    bio: '',
    class_grade: '',
  });

  const create = useMutation({
    mutationFn: () =>
      api.users.invite({
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
        full_name: form.full_name,
        phone: form.phone || undefined,
        bio: form.role === 'teacher' ? (form.bio || undefined) : undefined,
        class_grade: form.role === 'student' ? (form.class_grade || undefined) : undefined,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('User invited');
      router.push('/dashboard/admin/users');
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : 'Failed to invite'),
  });

  function set<K extends keyof typeof form>(k: K, v: typeof form[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    create.mutate();
  }

  return (
    <div className="max-w-xl">
      <PageHeader title="Invite a user" description="They'll get the credentials below to sign in." />

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Role</Label>
          <Select value={form.role} onValueChange={(v) => set('role', v as 'teacher' | 'student')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="student">Student</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="full_name">Full name</Label>
          <Input id="full_name" required value={form.full_name} onChange={(e) => set('full_name', e.target.value)} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" required value={form.username} onChange={(e) => set('username', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input id="phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Temporary password</Label>
            <Input id="password" type="text" minLength={8} required value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="≥ 8 chars" />
          </div>
        </div>

        {form.role === 'teacher' ? (
          <div className="space-y-2">
            <Label htmlFor="bio">Bio (optional)</Label>
            <Textarea id="bio" rows={3} value={form.bio} onChange={(e) => set('bio', e.target.value)} placeholder="Subjects taught, experience, etc." />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="class_grade">Class / level</Label>
            <Input id="class_grade" value={form.class_grade} onChange={(e) => set('class_grade', e.target.value)} placeholder="e.g. Class 8 or Adult" />
          </div>
        )}

        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? 'Creating…' : 'Invite user'}
          </Button>
        </div>
      </form>
    </div>
  );
}
