'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  UserPlus, Trash2, GraduationCap, Loader2, KeyRound, ChevronDown, X,
  Star, Check, Video, Zap, PenLine, MessageCircleHeart, Sparkles, Heart,
  CheckCircle2, Copy, Pencil,
} from 'lucide-react';
import { api, ApiError, type GuardianWeekChild, type Child } from '@/lib/api';
import { Button } from '@/app/components/ui/button';
import { ScholarAvatar } from '@/components/dashboard/ScholarAvatar';
import { AvatarPicker } from '@/components/dashboard/AvatarPicker';
import { cn } from '@/lib/utils';

const CHILD_CLASS_OPTIONS = [
  'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Other',
];
const MOODS = ['😞', '😕', '😐', '🙂', '🤩'];

// Parent dashboard — glanceable weekly card per child, plus add / unlink.
export default function ParentDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['guardian', 'week'],
    queryFn: () => api.guardian.week(),
  });
  const children = data?.children ?? [];
  const [adding, setAdding] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My children</h1>
          <p className="text-muted-foreground">How your children are doing this week.</p>
        </div>
        {!adding && children.length > 0 && (
          <Button onClick={() => setAdding(true)} className="self-start sm:self-auto">
            <UserPlus className="h-4 w-4" /> Add a child
          </Button>
        )}
      </div>

      {adding && <AddChildForm onDone={() => setAdding(false)} />}

      {error && (
        <p className="text-sm text-destructive">Couldn&rsquo;t load this week. Please refresh and try again.</p>
      )}
      {isLoading && <div className="h-48 animate-pulse rounded-2xl border border-border bg-card" />}

      {!isLoading && !error && children.length === 0 && !adding && (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserPlus className="h-6 w-6" />
          </div>
          <h2 className="font-semibold">No children added yet</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            Add your first child to start tracking their classes, quizzes and weekly reports here.
          </p>
          <Button onClick={() => setAdding(true)} className="mt-5">
            <UserPlus className="h-4 w-4" /> Add your first child
          </Button>
        </div>
      )}

      {children.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          {children.map((child) => (
            <WeeklyChildCard key={child.id} child={child} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatusPill({ icon: Icon, label, done }: { icon: React.ComponentType<{ className?: string }>; label: string; done: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
        done ? 'bg-success/10 text-success' : 'bg-secondary text-muted-foreground'
      )}
    >
      {done ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5 opacity-60" />}
      {label}
    </span>
  );
}

function WeeklyChildCard({ child }: { child: GuardianWeekChild }) {
  const qc = useQueryClient();
  const [confirming, setConfirming] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState(false);
  const report = child.report;

  const setAvatar = useMutation({
    mutationFn: (key: string | null) => api.guardian.setChildAvatar(child.id, key),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['guardian', 'week'] });
      setEditingAvatar(false);
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : 'Could not update character'),
  });

  const remove = useMutation({
    mutationFn: () => api.guardian.removeChild(child.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['guardian', 'week'] });
      toast.success(`${child.full_name || 'Child'} removed from your account.`);
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : 'Could not remove. Please try again.');
      setConfirming(false);
    },
  });

  const parentCheered = !!report?.parent_cheered_at;
  const cheer = useMutation({
    mutationFn: () => api.reports.parentCheer(report!.id),
    onSuccess: ({ report: r }) => {
      qc.invalidateQueries({ queryKey: ['guardian', 'week'] });
      if (r.parent_cheered_at) toast.success(`You cheered ${child.full_name || 'your child'}'s report 💛`);
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : 'Could not send. Try again.'),
  });

  return (
    <section className="flex flex-col rounded-2xl border border-border bg-card p-5">
      {/* header */}
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => setEditingAvatar((v) => !v)}
          className="group relative shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-background"
          aria-label="Change character"
          title="Change character"
        >
          <ScholarAvatar value={child.avatar_url} name={child.full_name} username={child.username} size={44} />
          <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-card bg-secondary text-muted-foreground group-hover:text-foreground">
            <Pencil className="h-2.5 w-2.5" />
          </span>
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{child.full_name || child.username}</p>
          {child.class_grade && (
            <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <GraduationCap className="h-3 w-3" /> {child.class_grade}
            </span>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2.5 py-1 text-xs font-semibold text-warning">
            <Star className="h-3.5 w-3.5" /> {child.points_total.toLocaleString()}
          </span>
          {child.streak > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2.5 py-1 text-xs font-semibold text-warning">
              🔥 {child.streak === 1 ? '1 week' : `${child.streak} weeks`}
            </span>
          )}
        </div>
      </div>

      {/* change character */}
      {editingAvatar && (
        <div className="mt-4 rounded-xl border border-border bg-secondary/30 p-4">
          <div className="mb-2.5 flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground">
              Pick a character for {child.full_name || child.username}
            </p>
            {setAvatar.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
          </div>
          <AvatarPicker
            value={child.avatar_url}
            onSelect={(k) => setAvatar.mutate(k)}
            disabled={setAvatar.isPending}
          />
        </div>
      )}

      {/* this week */}
      <p className="mt-4 mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">This week</p>
      <div className="flex flex-wrap gap-2">
        <StatusPill icon={Video} label="Attended" done={child.attended} />
        <StatusPill icon={Zap} label="Quiz" done={child.quiz_done} />
        <StatusPill icon={PenLine} label="Report" done={!!report} />
      </div>

      {/* their own words */}
      <div className="mt-4 flex-1">
        {report ? (
          <>
            <div className="rounded-xl bg-secondary/40 p-4">
              <div className="mb-1.5 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                In their words
                {report.mood != null && <span className="text-base leading-none" aria-label={`Mood ${report.mood} of 5`}>{MOODS[report.mood - 1]}</span>}
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {report.went_well?.trim() || report.next_goal?.trim() || report.tricky?.trim() || 'Report written 🎉'}
              </p>
              {(report.teacher_comment || report.cheered_at) && (
                <p className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                  {report.cheered_at ? <Sparkles className="h-3.5 w-3.5" /> : <MessageCircleHeart className="h-3.5 w-3.5" />}
                  {report.teacher_comment ? 'Teacher replied' : 'Teacher cheered'}
                </p>
              )}
            </div>
            <button
              onClick={() => cheer.mutate()}
              disabled={cheer.isPending}
              className={cn(
                'mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                parentCheered
                  ? 'bg-primary/10 text-primary'
                  : 'border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
              )}
            >
              {cheer.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Heart className={cn('h-3.5 w-3.5', parentCheered && 'fill-current')} />
              )}
              {parentCheered ? 'You cheered this 💛' : 'Cheer this'}
            </button>
          </>
        ) : (
          <p className="rounded-xl bg-secondary/30 p-4 text-sm text-muted-foreground">
            No report yet this week — there&rsquo;s still time. 🌱
          </p>
        )}
      </div>

      {/* footer: unlink */}
      <div className="mt-4 flex items-center justify-end border-t border-border pt-3">
        {confirming ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Remove from your account?</span>
            <Button size="sm" variant="destructive" onClick={() => remove.mutate()} disabled={remove.isPending}>
              {remove.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Remove'}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setConfirming(false)} disabled={remove.isPending}>
              Cancel
            </Button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" /> Remove
          </button>
        )}
      </div>
    </section>
  );
}

function AddChildForm({ onDone }: { onDone: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ full_name: '', class_grade: '', username: '', password: '' });
  const [showLogin, setShowLogin] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [created, setCreated] = useState<Child | null>(null);
  const [copied, setCopied] = useState(false);

  const mutation = useMutation({
    mutationFn: () =>
      api.guardian.addChild({
        full_name: form.full_name.trim(),
        class_grade: form.class_grade || undefined,
        username: showLogin && form.username ? form.username.trim() : undefined,
        password: showLogin && form.password ? form.password : undefined,
      }),
    onSuccess: ({ child }) => {
      qc.invalidateQueries({ queryKey: ['guardian', 'week'] });
      // When the parent gave the child a login, show the sign-in details (login
      // is by email, so they need the derived address — not the username alone).
      if (showLogin && form.username.trim()) {
        setCreated(child);
      } else {
        toast.success(`${child.full_name || 'Child'} added to your account.`);
        onDone();
      }
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : 'Could not add child. Please try again.');
    },
  });

  async function copyEmail() {
    if (!created?.email) return;
    try {
      await navigator.clipboard.writeText(created.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked — the email is on screen to copy manually
    }
  }

  // After adding a child with a login, show how they sign in.
  if (created) {
    return (
      <div className="space-y-4 rounded-2xl border border-success/40 bg-success/5 p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 shrink-0 text-success" />
          <div>
            <p className="font-semibold">{created.full_name || 'Child'} added!</p>
            <p className="text-sm text-muted-foreground">
              Here&rsquo;s how they sign in on their own device. Share these with your child.
            </p>
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-border bg-card p-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Sign-in email</p>
            <div className="mt-1 flex items-center gap-2">
              <code className="min-w-0 flex-1 truncate rounded-md bg-secondary px-2.5 py-1.5 font-mono text-sm">
                {created.email}
              </code>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:text-foreground"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Password: <strong className="text-foreground">the one you just set.</strong> Keep it somewhere safe.
          </p>
        </div>

        <div className="flex justify-end">
          <Button onClick={onDone}>Done</Button>
        </div>
      </div>
    );
  }

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
    <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-5 space-y-4">
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
            <><Loader2 className="h-4 w-4 animate-spin" /> Adding…</>
          ) : (
            <><UserPlus className="h-4 w-4" /> Add child</>
          )}
        </Button>
      </div>
    </form>
  );
}
