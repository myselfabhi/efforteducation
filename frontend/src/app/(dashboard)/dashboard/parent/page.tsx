'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  UserPlus, Trash2, GraduationCap, Loader2, KeyRound, ChevronDown, X, User,
} from 'lucide-react';
import { api, ApiError, type Child } from '@/lib/api';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/lib/utils';

const CHILD_CLASS_OPTIONS = [
  'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Other',
];

function initialsOf(name: string | null, username: string) {
  const base = (name || username).trim();
  const parts = base.split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || base.slice(0, 2).toUpperCase();
}

// Parent hub — add, list and unlink child profiles.
export default function ParentDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['guardian', 'children'],
    queryFn: () => api.guardian.listChildren(),
  });
  const children = data?.children ?? [];

  const [adding, setAdding] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My children</h1>
          <p className="text-muted-foreground">
            Add a profile for each child, then enrol them in a batch.
          </p>
        </div>
        {!adding && children.length > 0 && (
          <Button onClick={() => setAdding(true)} className="self-start sm:self-auto">
            <UserPlus className="h-4 w-4" /> Add a child
          </Button>
        )}
      </div>

      {adding && <AddChildForm onDone={() => setAdding(false)} />}

      {error && (
        <p className="text-sm text-destructive">
          Couldn&rsquo;t load your children. Please refresh and try again.
        </p>
      )}
      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

      {!isLoading && !error && children.length === 0 && !adding && (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserPlus className="h-6 w-6" />
          </div>
          <h2 className="font-semibold">No children added yet</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            Add your first child to start enrolling them in Young Scholar batches and track their progress.
          </p>
          <Button onClick={() => setAdding(true)} className="mt-5">
            <UserPlus className="h-4 w-4" /> Add your first child
          </Button>
        </div>
      )}

      {children.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {children.map((child) => (
            <ChildCard key={child.id} child={child} />
          ))}
        </div>
      )}
    </div>
  );
}

function AddChildForm({ onDone }: { onDone: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ full_name: '', class_grade: '', username: '', password: '' });
  const [showLogin, setShowLogin] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const mutation = useMutation({
    mutationFn: () =>
      api.guardian.addChild({
        full_name: form.full_name.trim(),
        class_grade: form.class_grade || undefined,
        username: showLogin && form.username ? form.username.trim() : undefined,
        password: showLogin && form.password ? form.password : undefined,
      }),
    onSuccess: ({ child }) => {
      qc.invalidateQueries({ queryKey: ['guardian', 'children'] });
      toast.success(
        showLogin && form.username
          ? `${child.full_name || 'Child'} added — they can sign in as "${child.username}".`
          : `${child.full_name || 'Child'} added to your account.`
      );
      onDone();
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : 'Could not add child. Please try again.');
    },
  });

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.full_name.trim().length < 2) {
      toast.error("Please enter the child's name.");
      return;
    }
    mutation.mutate();
  }

  const inputCls =
    'w-full h-10 px-3 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all';

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-border bg-card p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Add a child</h2>
        <button
          type="button"
          onClick={onDone}
          className="p-1.5 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
          aria-label="Cancel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="child_name" className="block text-xs font-semibold mb-1.5">
            Child&rsquo;s full name
          </label>
          <input
            id="child_name"
            type="text"
            required
            autoFocus
            value={form.full_name}
            onChange={(e) => set('full_name', e.target.value)}
            placeholder="e.g. Aarav Sharma"
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="child_class" className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span>Class</span>
            <span className="font-normal text-muted-foreground">Optional</span>
          </label>
          <div className="relative">
            <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" strokeWidth={2} />
            <select
              id="child_class"
              value={form.class_grade}
              onChange={(e) => set('class_grade', e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none cursor-pointer"
            >
              <option value="">Select…</option>
              {CHILD_CLASS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Optional: give the child their own login */}
      <div>
        <button
          type="button"
          onClick={() => setShowLogin((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <KeyRound className="h-3.5 w-3.5" />
          Let this child sign in on their own device
          <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', showLogin && 'rotate-180')} />
        </button>

        {showLogin && (
          <div className="mt-3 grid gap-4 sm:grid-cols-2 rounded-xl border border-border bg-secondary/30 p-4">
            <p className="sm:col-span-2 text-xs text-muted-foreground">
              Set a username and password you&rsquo;ll share with your child. Leave blank and you&rsquo;ll
              manage everything from your own account.
            </p>
            <div>
              <label htmlFor="child_username" className="block text-xs font-semibold mb-1.5">
                Login username
              </label>
              <input
                id="child_username"
                type="text"
                minLength={3}
                value={form.username}
                onChange={(e) => set('username', e.target.value)}
                placeholder="aarav_s"
                className={inputCls}
                autoComplete="off"
              />
            </div>
            <div>
              <label htmlFor="child_password" className="block text-xs font-semibold mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="child_password"
                  type={showPw ? 'text' : 'password'}
                  minLength={8}
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  placeholder="Min. 8 characters"
                  className={inputCls}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <Button type="button" variant="ghost" onClick={onDone} disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Adding…
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" /> Add child
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function ChildCard({ child }: { child: Child }) {
  const qc = useQueryClient();
  const [confirming, setConfirming] = useState(false);

  const remove = useMutation({
    mutationFn: () => api.guardian.removeChild(child.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['guardian', 'children'] });
      toast.success(`${child.full_name || 'Child'} removed from your account.`);
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : 'Could not remove. Please try again.');
      setConfirming(false);
    },
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {child.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={child.avatar_url} alt="" className="h-11 w-11 rounded-full object-cover" />
          ) : (
            initialsOf(child.full_name, child.username)
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold truncate">{child.full_name || child.username}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {child.class_grade && (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                <GraduationCap className="h-3 w-3" /> {child.class_grade}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <User className="h-3 w-3" /> {child.username}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end border-t border-border pt-3">
        {confirming ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Remove from your account?</span>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => remove.mutate()}
              disabled={remove.isPending}
            >
              {remove.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Remove'}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setConfirming(false)} disabled={remove.isPending}>
              Cancel
            </Button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" /> Remove
          </button>
        )}
      </div>
    </div>
  );
}
