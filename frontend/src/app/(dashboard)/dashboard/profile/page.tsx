'use client';

import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api, ApiError, type AuthUser } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/authStore';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [form, setForm] = useState({
    full_name: user?.full_name ?? '',
    phone: user?.phone ?? '',
    avatar_url: user?.avatar_url ?? '',
    class_grade: user?.class_grade ?? '',
    bio: '',
  });

  // Hydrate the bio (and any field not in the cached user) from /me.
  useEffect(() => {
    let cancelled = false;
    api.users
      .me()
      .then((u) => {
        if (cancelled) return;
        const me = u as AuthUser & { bio?: string };
        setForm((s) => ({
          ...s,
          full_name: me.full_name ?? s.full_name,
          phone: me.phone ?? s.phone,
          avatar_url: me.avatar_url ?? s.avatar_url,
          class_grade: me.class_grade ?? s.class_grade,
          bio: me.bio ?? '',
        }));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const save = useMutation({
    mutationFn: () =>
      api.users.updateMe({
        full_name: form.full_name || undefined,
        phone: form.phone || undefined,
        avatar_url: form.avatar_url || undefined,
        class_grade: form.class_grade || undefined,
        bio: form.bio || undefined,
      }),
    onSuccess: (u) => {
      const updated = u as AuthUser;
      if (user) setUser({ ...user, ...updated });
      toast.success('Profile saved');
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : 'Failed to save'),
  });

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  if (!user) return null;

  return (
    <div className="max-w-xl">
      <PageHeader title="Profile" description={`Signed in as ${user.email}`} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="full_name">Full name</Label>
          <Input id="full_name" value={form.full_name} onChange={(e) => set('full_name', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="avatar_url">Avatar URL</Label>
          <Input id="avatar_url" type="url" value={form.avatar_url} onChange={(e) => set('avatar_url', e.target.value)} />
        </div>

        {(user.role === 'student' || user.role === 'user') && (
          <div className="space-y-2">
            <Label htmlFor="class_grade">Class / level</Label>
            <Input id="class_grade" value={form.class_grade} onChange={(e) => set('class_grade', e.target.value)} />
          </div>
        )}

        {(user.role === 'teacher' || user.role === 'super_admin' || user.role === 'admin') && (
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" rows={4} value={form.bio} onChange={(e) => set('bio', e.target.value)} />
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
