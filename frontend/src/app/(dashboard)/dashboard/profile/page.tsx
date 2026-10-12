'use client';

import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api, ApiError, type AuthUser } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/authStore';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { ScholarAvatar } from '@/components/dashboard/ScholarAvatar';
import { AvatarPicker } from '@/components/dashboard/AvatarPicker';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [avatar, setAvatar] = useState<string | null>(user?.avatar_url ?? null);
  const [form, setForm] = useState({
    full_name: user?.full_name ?? '',
    phone: user?.phone ?? '',
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
        setAvatar(me.avatar_url ?? null);
        setForm((s) => ({
          ...s,
          full_name: me.full_name ?? s.full_name,
          phone: me.phone ?? s.phone,
          class_grade: me.class_grade ?? s.class_grade,
          bio: me.bio ?? '',
        }));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Picking a character saves immediately so it shows up everywhere at once.
  const saveAvatar = useMutation({
    mutationFn: (key: string | null) => api.users.setAvatar(key),
    onSuccess: (u, key) => {
      setAvatar(key);
      if (user) setUser({ ...user, avatar_url: key });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : 'Could not update character'),
  });

  const save = useMutation({
    mutationFn: () =>
      api.users.updateMe({
        full_name: form.full_name || undefined,
        phone: form.phone || undefined,
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

  const isYoungScholar = user.role === 'student' || user.role === 'user';

  return (
    <div className="max-w-xl">
      <PageHeader title="Profile" description={`Signed in as ${user.email}`} />

      {/* Character picker */}
      <section className="mb-8 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-4">
          <ScholarAvatar value={avatar} name={form.full_name} username={user.username} size={56} />
          <div className="min-w-0">
            <h2 className="font-semibold">{isYoungScholar ? 'Your character' : 'Your avatar'}</h2>
            <p className="text-sm text-muted-foreground">
              {isYoungScholar ? 'Pick a character to show across your hub.' : 'Pick an avatar shown across the app.'}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <AvatarPicker value={avatar} onSelect={(k) => saveAvatar.mutate(k)} disabled={saveAvatar.isPending} />
        </div>
      </section>

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

        {isYoungScholar && (
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
