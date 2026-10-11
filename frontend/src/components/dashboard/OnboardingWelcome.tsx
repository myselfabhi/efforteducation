'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { Button } from '@/app/components/ui/button';
import { Video, Zap, PenLine, Star, Check, X } from 'lucide-react';

const STUDENT_STEPS = [
  { icon: Video, title: 'Join your class', text: 'One tap from your home when it’s class time.' },
  { icon: Zap, title: 'Play the McD Quiz', text: 'A fun quiz after class — try to beat your best!' },
  { icon: PenLine, title: 'Write your report', text: 'A few lines about your week. There are no wrong answers.' },
  { icon: Star, title: 'Earn Scholar Points', text: 'For showing up and joining in — they add up every week.' },
];

const PARENT_POINTS = [
  'Whether they joined class and played the quiz',
  'What they wrote in their weekly report — in their own words',
  'The Scholar Points they’ve earned for showing up',
];

/**
 * First-run welcome for a new child or parent — replaces the dead-end empty
 * dashboard with a quick explanation of the weekly rhythm. Shown once per user
 * (remembered per-device); teachers/admins never see it.
 */
export function OnboardingWelcome() {
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user || (user.role !== 'student' && user.role !== 'parent')) return;
    try {
      if (!localStorage.getItem(`ee_welcome_seen_${user.id}`)) setOpen(true);
    } catch {
      // storage blocked — just skip the welcome rather than nagging every load
    }
  }, [user]);

  if (!open || !user) return null;

  const isParent = user.role === 'parent';
  const firstName = (user.full_name || user.username || '').split(/\s+/)[0] || 'there';

  function dismiss() {
    try {
      if (user) localStorage.setItem(`ee_welcome_seen_${user.id}`, '1');
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
              {isParent ? 'Welcome, parent' : 'Welcome, scholar'}
            </p>
            <h2 id="welcome-title" className="mt-1 text-2xl font-bold tracking-tight">
              Hi {firstName}! <span className="inline-block">👋</span>
            </h2>
          </div>
          <button
            onClick={dismiss}
            aria-label="Close"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {isParent ? (
          <>
            <p className="text-sm text-muted-foreground">
              Each week, right here, you’ll see how your child is doing at a glance:
            </p>
            <ul className="mt-4 space-y-3">
              {PARENT_POINTS.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-lg bg-secondary/40 px-3 py-2.5 text-sm text-muted-foreground">
              To get started, add your child below — then enrol them in a batch.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">Here’s how your week works:</p>
            <ol className="mt-4 space-y-3">
              {STUDENT_STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <li key={s.title} className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-tight">
                        <span className="text-muted-foreground">{i + 1}.</span> {s.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{s.text}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </>
        )}

        <Button onClick={dismiss} size="lg" className="mt-6 w-full">
          {isParent ? 'Got it' : "Let’s go!"}
        </Button>
      </div>
    </div>
  );
}
