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
import { Checkbox } from '@/app/components/ui/checkbox';

interface Props {
  batchId: number;
  backHref: string;
}

export function AnnouncementForm({ batchId, backHref }: Props) {
  const router = useRouter();
  const qc = useQueryClient();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [pinned, setPinned] = useState(false);

  const create = useMutation({
    mutationFn: () => api.announcements.create(batchId, { title, body, is_pinned: pinned }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['batch', batchId, 'announcements'] });
      toast.success('Announcement posted');
      router.push(backHref);
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : 'Failed to post'),
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !body) {
      toast.error('Title and body are required.');
      return;
    }
    create.mutate();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="body">Message</Label>
        <Textarea id="body" required rows={6} value={body} onChange={(e) => setBody(e.target.value)} />
      </div>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <Checkbox checked={pinned} onCheckedChange={(v) => setPinned(!!v)} />
        Pin to top
      </label>
      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={create.isPending}>
          {create.isPending ? 'Posting…' : 'Post announcement'}
        </Button>
      </div>
    </form>
  );
}
