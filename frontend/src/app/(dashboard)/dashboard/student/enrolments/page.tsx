'use client';

/**
 * Student request history — shows all batch-enrolment-requests the current
 * student has submitted (pending / approved / declined / cancelled), with
 * the ability to cancel any pending one.
 */

import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CheckCircle2, XCircle, Clock, X as XIcon, ChevronRight } from 'lucide-react';
import { api, type EnrolmentRequest } from '@/lib/api';
import { EmptyState } from '@/components/dashboard/EmptyState';

const STATUS_META: Record<EnrolmentRequest['status'], { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  pending:   { label: 'Pending review', icon: Clock,         color: 'text-warning bg-warning/10 border-warning/30' },
  approved:  { label: 'Approved',       icon: CheckCircle2,  color: 'text-success bg-success/10 border-success/30' },
  declined:  { label: 'Declined',       icon: XCircle,       color: 'text-destructive bg-destructive/10 border-destructive/30' },
  cancelled: { label: 'Cancelled',      icon: XIcon,         color: 'text-muted-foreground bg-secondary/40 border-border' },
};

export default function StudentEnrolmentsPage() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['me', 'enrolment-requests'],
    queryFn: () => api.users.myEnrolmentRequests(),
  });

  const cancelM = useMutation({
    mutationFn: ({ batchId, reqId }: { batchId: number; reqId: number }) =>
      api.batches.cancelEnrolmentRequest(batchId, reqId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['me', 'enrolment-requests'] }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My enrolment requests</h1>
        <p className="text-muted-foreground">Track which batches you&apos;ve asked to join.</p>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {error && <p className="text-sm text-destructive">Failed to load.</p>}

      {data && data.length === 0 && (
        <EmptyState
          icon={<ChevronRight className="h-6 w-6" />}
          title="No requests yet"
          description="Browse the courses page and click 'Request to join' on a batch you'd like to enrol in."
          action={(
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition"
            >
              Browse courses
            </Link>
          )}
        />
      )}

      {data && data.length > 0 && (
        <ul className="space-y-3">
          {data.map((r) => {
            const meta = STATUS_META[r.status];
            const Icon = meta.icon;
            return (
              <li
                key={r.id}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                      {r.course_title}
                    </p>
                    <h3 className="font-semibold text-lg truncate">{r.batch_name}</h3>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-semibold ${meta.color}`}>
                    <Icon className="h-3 w-3" />
                    {meta.label}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground">
                  Sent {format(new Date(r.requested_at), 'PP p')}
                  {r.decided_at && ` · Decided ${format(new Date(r.decided_at), 'PP p')}`}
                </p>

                {r.message && (
                  <blockquote className="mt-3 text-sm border-l-2 border-border pl-3 text-muted-foreground italic">
                    &ldquo;{r.message}&rdquo;
                  </blockquote>
                )}
                {r.note && (
                  <div className={`mt-3 text-sm rounded-lg px-3 py-2 ${r.status === 'declined' ? 'bg-destructive/5 text-destructive/90' : 'bg-secondary/40'}`}>
                    <span className="text-[10px] uppercase tracking-widest font-semibold mr-2">Note</span>
                    {r.note}
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2">
                  {r.status === 'pending' && (
                    <button
                      onClick={() => {
                        if (confirm('Cancel this request?')) {
                          cancelM.mutate({ batchId: r.batch_id, reqId: r.id });
                        }
                      }}
                      disabled={cancelM.isPending}
                      className="h-9 px-3 rounded-lg border border-border text-sm hover:bg-secondary/40 transition"
                    >
                      Cancel request
                    </button>
                  )}
                  {r.status === 'approved' && (
                    <Link
                      href={`/dashboard/student/batches/${r.batch_id}`}
                      className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition"
                    >
                      Open batch
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                  {r.course_slug && (
                    <Link
                      href={`/courses/${r.course_slug}`}
                      className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border text-sm hover:bg-secondary/40 transition"
                    >
                      View course
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
