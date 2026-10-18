'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Check, X, Loader2, Phone, UserCheck, Inbox } from 'lucide-react';
import { api, ApiError, type EnrolmentRequest, type Lead } from '@/lib/api';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { ScholarAvatar } from '@/components/dashboard/ScholarAvatar';
import { Button } from '@/app/components/ui/button';

const ago = (iso: string) => {
  try { return formatDistanceToNow(new Date(iso), { addSuffix: true }); } catch { return ''; }
};

export default function AdmissionsPage() {
  return (
    <div className="space-y-10">
      <PageHeader title="Admissions" description="Enrolment requests to approve and leads to follow up." />
      <EnrolmentQueue />
      <LeadsQueue />
    </div>
  );
}

// ── Enrolment requests ────────────────────────────────────────────────────────
function EnrolmentQueue() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'enrolment-queue'],
    queryFn: () => api.enrolments.queue('pending'),
  });
  const requests = data?.requests ?? [];

  const decide = useMutation({
    mutationFn: ({ r, action }: { r: EnrolmentRequest; action: 'approve' | 'decline' }) =>
      api.batches.decideEnrolmentRequest(r.batch_id, r.id, action),
    onSuccess: (_d, { action }) => {
      qc.invalidateQueries({ queryKey: ['admin', 'enrolment-queue'] });
      toast.success(action === 'approve' ? 'Enrolled 🎉' : 'Request declined');
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Action failed'),
  });

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <UserCheck className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Enrolment requests</h2>
        {requests.length > 0 && (
          <span className="rounded-full bg-warning/15 px-2 py-0.5 text-xs font-semibold text-warning">{requests.length} pending</span>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : requests.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No pending requests. New ones land here for approval.
        </p>
      ) : (
        <ul className="space-y-3">
          {requests.map((r) => {
            const full = r.capacity != null && (r.enrolled_count ?? 0) >= r.capacity;
            return (
              <li key={r.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <ScholarAvatar value={r.student_avatar_url} name={r.student_full_name} username={r.student_username} size={40} />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{r.student_full_name || r.student_username}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      wants {r.batch_name}
                      {r.capacity != null && <> · {r.enrolled_count}/{r.capacity}{full && <span className="text-destructive"> (full)</span>}</>}
                      {' · '}{ago(r.requested_at)}
                    </p>
                    {r.message && <p className="mt-0.5 truncate text-xs text-muted-foreground">“{r.message}”</p>}
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button size="sm" variant="outline" onClick={() => decide.mutate({ r, action: 'decline' })} disabled={decide.isPending}>
                    <X className="h-4 w-4" /> Decline
                  </Button>
                  <Button size="sm" onClick={() => decide.mutate({ r, action: 'approve' })} disabled={decide.isPending}>
                    {decide.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Approve
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

// ── Leads ─────────────────────────────────────────────────────────────────────
const LEAD_FILTERS = ['new', 'contacted', 'converted', 'closed', 'all'] as const;
const STATUS_STYLE: Record<string, string> = {
  new: 'bg-warning/10 text-warning',
  contacted: 'bg-info/10 text-info',
  converted: 'bg-success/10 text-success',
  closed: 'bg-muted text-muted-foreground',
};

function LeadsQueue() {
  const [filter, setFilter] = useState<(typeof LEAD_FILTERS)[number]>('new');
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'leads', filter],
    queryFn: () => api.leads.list(filter),
  });
  const leads = data?.leads ?? [];

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Inbox className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Leads</h2>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {LEAD_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
              filter === f ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : leads.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No {filter === 'all' ? '' : filter} leads. &ldquo;Book a call&rdquo; submissions appear here.
        </p>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {leads.map((l) => <LeadCard key={l.id} lead={l} />)}
        </div>
      )}
    </section>
  );
}

function LeadCard({ lead }: { lead: Lead }) {
  const qc = useQueryClient();
  const [note, setNote] = useState(lead.note ?? '');
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'leads'] });

  const update = useMutation({
    mutationFn: (body: { status?: Lead['status']; note?: string }) => api.leads.update(lead.id, body),
    onSuccess: () => invalidate(),
    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Update failed'),
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold">{lead.name}</p>
          <a href={`tel:${lead.phone.replace(/\s/g, '')}`} className="mt-0.5 inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
            <Phone className="h-3.5 w-3.5" /> {lead.phone}
          </a>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${STATUS_STYLE[lead.status]}`}>{lead.status}</span>
      </div>

      {lead.interest && <p className="mt-2 text-xs text-muted-foreground">Interested in: <span className="text-foreground">{lead.interest}</span></p>}
      {lead.message && <p className="mt-1.5 rounded-lg bg-secondary/40 p-2.5 text-sm">{lead.message}</p>}
      <p className="mt-1.5 text-[11px] text-muted-foreground">{ago(lead.created_at)}{lead.handler_name ? ` · ${lead.handler_name}` : ''}</p>

      <div className="mt-3 flex items-center gap-2">
        <select
          value={lead.status}
          onChange={(e) => update.mutate({ status: e.target.value as Lead['status'] })}
          disabled={update.isPending}
          className="h-9 flex-1 rounded-lg border border-border bg-background px-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="mt-2 flex gap-2">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note…"
          className="h-9 flex-1 rounded-lg border border-border bg-background px-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <Button size="sm" variant="outline" onClick={() => update.mutate({ note })} disabled={update.isPending || note === (lead.note ?? '')}>
          Save
        </Button>
      </div>
    </div>
  );
}
