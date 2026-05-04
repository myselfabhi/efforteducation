'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api, ApiError, type Course } from '@/lib/api';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Checkbox } from '@/app/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

const CATEGORIES = ['banking', 'ssc', 'railway', 'cuet', 'hotel-mgmt', 'young-scholar', 'police', 'net', 'pcs', 'other'];

interface Props {
  initial?: Partial<Course>;
  mode: 'create' | 'edit';
  onDone: () => void;
}

export function CourseForm({ initial, mode, onDone }: Props) {
  const router = useRouter();
  const qc = useQueryClient();

  const [form, setForm] = useState({
    slug: initial?.slug ?? '',
    title: initial?.title ?? '',
    category: initial?.category ?? 'banking',
    description: initial?.description ?? '',
    duration_months: initial?.duration_months ? String(initial.duration_months) : '',
    price_inr: initial?.price_inr ? String(initial.price_inr) : '',
    hero_image_url: initial?.hero_image_url ?? '',
    is_published: !!initial?.is_published,
  });

  useEffect(() => {
    if (initial) {
      setForm({
        slug: initial.slug ?? '',
        title: initial.title ?? '',
        category: initial.category ?? 'banking',
        description: initial.description ?? '',
        duration_months: initial.duration_months ? String(initial.duration_months) : '',
        price_inr: initial.price_inr ? String(initial.price_inr) : '',
        hero_image_url: initial.hero_image_url ?? '',
        is_published: !!initial.is_published,
      });
    }
  }, [initial]);

  function set<K extends keyof typeof form>(k: K, v: typeof form[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  const submit = useMutation({
    mutationFn: () => {
      const body = {
        slug: form.slug,
        title: form.title,
        category: form.category,
        description: form.description || null,
        duration_months: form.duration_months ? parseInt(form.duration_months, 10) : null,
        price_inr: form.price_inr ? parseInt(form.price_inr, 10) : null,
        hero_image_url: form.hero_image_url || null,
        is_published: form.is_published,
      };
      return mode === 'create' ? api.courses.create(body) : api.courses.update(initial!.id!, body);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'courses'] });
      toast.success(mode === 'create' ? 'Course created' : 'Course saved');
      onDone();
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : 'Failed to save'),
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[a-z0-9-]+$/.test(form.slug)) {
      toast.error('Slug must be lowercase letters, numbers and dashes only');
      return;
    }
    submit.mutate();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-2xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" required value={form.title} onChange={(e) => set('title', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" required value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="ibps-po" />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={form.category} onValueChange={(v) => set('category', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (months)</Label>
          <Input id="duration" type="number" min={1} max={120} value={form.duration_months} onChange={(e) => set('duration_months', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price (INR)</Label>
          <Input id="price" type="number" min={0} value={form.price_inr} onChange={(e) => set('price_inr', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hero">Hero image URL</Label>
          <Input id="hero" type="url" value={form.hero_image_url} onChange={(e) => set('hero_image_url', e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={5} value={form.description} onChange={(e) => set('description', e.target.value)} />
      </div>

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <Checkbox checked={form.is_published} onCheckedChange={(v) => set('is_published', !!v)} />
        Published (visible on the public site)
      </label>

      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={submit.isPending}>
          {submit.isPending ? 'Saving…' : mode === 'create' ? 'Create course' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}
