'use client';

/**
 * BatchesPicker — public batch catalog for a course.
 *
 * Lists active + upcoming batches of the course, shows seat availability,
 * and exposes a "Request to join" CTA. Logged-out users see "Sign in to
 * request"; logged-in students get a confirmation modal; users with an
 * outstanding request see "Pending" instead of a button (re-fetched from
 * /api/users/me/enrolment-requests).
 */

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Users, Calendar, GraduationCap, Loader2, Check, X } from 'lucide-react';
import { api, ApiError, type PublicBatch, type EnrolmentRequest } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/authStore';

interface Props {
  slug: string;
}

export function BatchesPicker({ slug }: Props) {
  const hasHydrated   = useAuthStore((s) => s.hasHydrated);
  const isAuthed      = useAuthStore((s) => s.isAuthenticated);
  const user          = useAuthStore((s) => s.user);
  const isStudent     = user?.role === 'student';

  const batchesQ = useQuery({
    queryKey: ['courses', slug, 'batches'],
    queryFn: () => api.courses.batches(slug),
  });

  const myRequestsQ = useQuery({
    queryKey: ['me', 'enrolment-requests'],
    queryFn: () => api.users.myEnrolmentRequests(),
    enabled: hasHydrated && isAuthed && isStudent,
  });

  if (batchesQ.isLoading) {
    return (
      <section className="container mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Loading batches…
        </div>
      </section>
    );
  }
  if (!batchesQ.data || batchesQ.data.length === 0) {
    return null; // hide section if no public batches yet
  }

  return (
    <section className="container mx-auto max-w-5xl px-6 py-12">
      <div className="mb-6">
        <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">
          Available batches
        </p>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mt-1">Pick a batch and request to join.</h2>
        <p className="text-sm text-muted-foreground mt-1">
          A teacher will review your request and confirm enrolment.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {batchesQ.data.map((b) => (
          <BatchCard
            key={b.id}
            batch={b}
            slug={slug}
            myRequest={myRequestsQ.data?.find((r) => r.batch_id === b.id && r.status === 'pending')}
            isAuthed={hasHydrated && isAuthed}
            isStudent={isStudent}
          />
        ))}
      </div>
    </section>
  );
}

function BatchCard({
  batch, slug, myRequest, isAuthed, isStudent,
}: {
  batch: PublicBatch;
  slug: string;
  myRequest: EnrolmentRequest | undefined;
  isAuthed: boolean;
  isStudent: boolean;
}) {
  const qc = useQueryClient();
  const [message, setMessage] = useState('');
  const [open, setOpen]       = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const seats = batch.capacity != null
    ? Math.max(0, batch.capacity - batch.enrolled_count)
    : null;
  const isFull = seats != null && seats <= 0;

  const m = useMutation({
    mutationFn: () => api.batches.requestEnrolment(batch.id, message.trim() || undefined),
    onSuccess: () => {
      setOpen(false);
      setError(null);
      qc.invalidateQueries({ queryKey: ['me', 'enrolment-requests'] });
    },
    onError: (e) => {
      setError(e instanceof ApiError ? e.message : 'Could not send request');
    },
  });

  const primary = batch.teachers?.find((t) => t.is_primary) ?? batch.teachers?.[0];

  return (
    <div className="rounded-2xl border border-border bg-card p-5 flex flex-col">
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{batch.name}</h3>
        <div className="mt-2 space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>
              {format(new Date(batch.start_date), 'PP')}
              {batch.end_date && ` – ${format(new Date(batch.end_date), 'PP')}`}
            </span>
          </div>
          {batch.schedule_description && (
            <div className="flex items-start gap-2">
              <GraduationCap className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span>{batch.schedule_description}</span>
            </div>
          )}
          {primary && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest font-semibold">Teacher</span>
              <span className="text-foreground">{primary.full_name || primary.username}</span>
            </div>
          )}
          {batch.capacity != null && (
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 shrink-0" />
              <span className={isFull ? 'text-destructive font-medium' : ''}>
                {isFull ? 'Full' : `${batch.enrolled_count} / ${batch.capacity} students`}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5">
        {!isAuthed ? (
          <Link
            href={`/login?redirect=${encodeURIComponent(`/courses/${slug}`)}`}
            className="block w-full text-center h-11 leading-[44px] rounded-xl border border-border bg-card text-sm font-semibold hover:bg-secondary/40 transition"
          >
            Sign in to request
          </Link>
        ) : !isStudent ? (
          <button
            disabled
            className="w-full h-11 rounded-xl border border-border bg-secondary/40 text-sm font-medium text-muted-foreground cursor-not-allowed"
          >
            Only students can request
          </button>
        ) : myRequest ? (
          <div className="flex items-center justify-between rounded-xl border border-warning/40 bg-warning/5 px-3 h-11">
            <span className="text-xs font-semibold text-warning">Request pending</span>
            <button
              onClick={() => {
                if (confirm('Cancel your pending request?')) {
                  api.batches.cancelEnrolmentRequest(batch.id, myRequest.id)
                    .then(() => qc.invalidateQueries({ queryKey: ['me', 'enrolment-requests'] }))
                    .catch(() => {});
                }
              }}
              className="text-xs text-muted-foreground hover:text-destructive"
            >
              Cancel
            </button>
          </div>
        ) : isFull ? (
          <button
            disabled
            className="w-full h-11 rounded-xl bg-secondary/40 border border-border text-sm font-medium text-muted-foreground cursor-not-allowed"
          >
            Batch is full
          </button>
        ) : !open ? (
          <button
            onClick={() => setOpen(true)}
            className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition"
          >
            Request to join
          </button>
        ) : (
          <div className="space-y-2 rounded-xl border border-border bg-secondary/20 p-3">
            <label className="text-xs font-medium text-muted-foreground block">
              Message to the teacher (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 500))}
              placeholder="Why do you want to join?"
              rows={2}
              className="w-full text-base sm:text-sm bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
            <div className="flex items-center gap-2">
              <button
                onClick={() => m.mutate()}
                disabled={m.isPending}
                className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-60"
              >
                {m.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                {m.isPending ? 'Sending…' : 'Send request'}
              </button>
              <button
                onClick={() => { setOpen(false); setError(null); }}
                className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-border hover:bg-secondary"
                aria-label="Cancel"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
