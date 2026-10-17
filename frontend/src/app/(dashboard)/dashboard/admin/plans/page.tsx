'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Trash2, X, Loader2, Check } from 'lucide-react';
import {
  api, ApiError,
  type Plan, type AdminOffer, type OfferCandidate, type Batch,
} from '@/lib/api';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/app/components/ui/table';

const rupees = (paise: number) => `₹${(paise / 100).toLocaleString('en-IN')}`;

export default function AdminBillingPage() {
  return (
    <div className="space-y-10">
      <PageHeader title="Billing" description="Private plans and the offers parents pay to confirm a seat." />
      <PlansSection />
      <OffersSection />
    </div>
  );
}

// ── Plans ─────────────────────────────────────────────────────────────────────
function PlansSection() {
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const { data: plans, isLoading } = useQuery({
    queryKey: ['admin', 'plans'],
    queryFn: () => api.plans.list(),
  });

  const remove = useMutation({
    mutationFn: (id: number) => api.plans.remove(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'plans'] }); toast.success('Plan removed'); },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Failed to remove'),
  });
  const toggle = useMutation({
    mutationFn: (p: Plan) => api.plans.update(p.id, { active: !p.active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'plans'] }),
    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Failed to update'),
  });

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Plans</h2>
          <p className="text-sm text-muted-foreground">Prices stay private — they&rsquo;re only shown to a family at checkout.</p>
        </div>
        {!adding && (
          <Button onClick={() => setAdding(true)}><Plus className="h-4 w-4" /> New plan</Button>
        )}
      </div>

      {adding && <PlanForm onDone={() => setAdding(false)} />}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : !plans || plans.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No plans yet. Create one to start offering it to families.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Billing</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="font-medium">{p.name}</div>
                    {p.description && <div className="max-w-xs truncate text-xs text-muted-foreground">{p.description}</div>}
                  </TableCell>
                  <TableCell className="font-medium tabular-nums">{rupees(p.amount_paise)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.interval_label || 'one-time'}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => toggle.mutate(p)}
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${p.active ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}
                    >
                      {p.active ? 'Active' : 'Inactive'}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost" size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => { if (confirm(`Delete "${p.name}"?`)) remove.mutate(p.id); }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}

function PlanForm({ onDone }: { onDone: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: '', rupees: '', interval_label: '', description: '' });
  const set = <K extends keyof typeof form>(k: K, v: string) => setForm((s) => ({ ...s, [k]: v }));

  const create = useMutation({
    mutationFn: () =>
      api.plans.create({
        name: form.name.trim(),
        amount_paise: Math.round(parseFloat(form.rupees) * 100),
        interval_label: form.interval_label.trim() || null,
        description: form.description.trim() || null,
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'plans'] }); toast.success('Plan created'); onDone(); },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Failed to create plan'),
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.name.trim().length < 2) return toast.error('Give the plan a name.');
    const amt = parseFloat(form.rupees);
    if (!amt || amt <= 0) return toast.error('Enter a valid amount in ₹.');
    create.mutate();
  }

  return (
    <form onSubmit={submit} className="mb-4 space-y-4 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">New plan</h3>
        <button type="button" onClick={onDone} className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary" aria-label="Cancel"><X className="h-4 w-4" /></button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="plan_name">Name</Label>
          <Input id="plan_name" autoFocus value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Young Scholar — Monthly" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="plan_amount">Amount (₹)</Label>
          <Input id="plan_amount" type="number" min={1} step="0.01" value={form.rupees} onChange={(e) => set('rupees', e.target.value)} placeholder="1500" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="plan_interval">Billing label <span className="font-normal text-muted-foreground">(optional)</span></Label>
          <Input id="plan_interval" value={form.interval_label} onChange={(e) => set('interval_label', e.target.value)} placeholder="per month" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="plan_desc">Description <span className="font-normal text-muted-foreground">(shown at checkout)</span></Label>
        <Textarea id="plan_desc" rows={2} value={form.description} onChange={(e) => set('description', e.target.value)} />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onDone}>Cancel</Button>
        <Button type="submit" disabled={create.isPending}>{create.isPending ? 'Creating…' : 'Create plan'}</Button>
      </div>
    </form>
  );
}

// ── Offers ────────────────────────────────────────────────────────────────────
function OffersSection() {
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'offers'], queryFn: () => api.offers.listAdmin() });

  const cancel = useMutation({
    mutationFn: (id: number) => api.offers.cancel(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'offers'] }); toast.success('Offer cancelled'); },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Failed to cancel'),
  });

  const offers = data?.offers ?? [];
  const statusStyle: Record<string, string> = {
    offered: 'bg-warning/10 text-warning',
    paid: 'bg-success/10 text-success',
    cancelled: 'bg-muted text-muted-foreground',
  };

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Offers</h2>
          <p className="text-sm text-muted-foreground">Assign a plan to a family — the parent sees &ldquo;Confirm your seat&rdquo; and pays.</p>
        </div>
        {!adding && (
          <Button onClick={() => setAdding(true)}><Plus className="h-4 w-4" /> New offer</Button>
        )}
      </div>

      {adding && <OfferForm onDone={() => setAdding(false)} />}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : offers.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No offers yet. Create one to let a parent pay for a seat.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Child</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Seat</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.map((o: AdminOffer) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.student_name || o.student_username}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{o.guardian_name || '—'}</TableCell>
                  <TableCell className="text-sm">{o.plan_name} <span className="text-muted-foreground">· {rupees(o.amount_paise)}</span></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{o.batch_name || '—'}</TableCell>
                  <TableCell>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${statusStyle[o.status] ?? ''}`}>{o.status}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    {o.status === 'offered' ? (
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => { if (confirm('Cancel this offer?')) cancel.mutate(o.id); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : o.status === 'paid' ? (
                      <span className="inline-flex items-center gap-1 text-xs text-success"><Check className="h-3.5 w-3.5" /> Paid</span>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}

function OfferForm({ onDone }: { onDone: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ student_id: '', plan_id: '', batch_id: '', note: '' });
  const set = <K extends keyof typeof form>(k: K, v: string) => setForm((s) => ({ ...s, [k]: v }));

  const { data: cand } = useQuery({ queryKey: ['admin', 'offer-candidates'], queryFn: () => api.offers.candidates() });
  const { data: plans } = useQuery({ queryKey: ['admin', 'plans'], queryFn: () => api.plans.list() });
  const { data: batches } = useQuery({ queryKey: ['admin', 'batches-list'], queryFn: () => api.batches.list() });

  const candidates = cand?.candidates ?? [];
  const activePlans = (plans ?? []).filter((p) => p.active);

  const create = useMutation({
    mutationFn: () =>
      api.offers.create({
        student_id: parseInt(form.student_id, 10),
        plan_id: parseInt(form.plan_id, 10),
        batch_id: form.batch_id ? parseInt(form.batch_id, 10) : null,
        note: form.note.trim() || null,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'offers'] });
      toast.success('Offer sent — the parent can now pay.');
      onDone();
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Failed to create offer'),
  });

  const selectCls = 'h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30';

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.student_id) return toast.error('Pick a child.');
    if (!form.plan_id) return toast.error('Pick a plan.');
    create.mutate();
  }

  return (
    <form onSubmit={submit} className="mb-4 space-y-4 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">New offer</h3>
        <button type="button" onClick={onDone} className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary" aria-label="Cancel"><X className="h-4 w-4" /></button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="offer_child">Child</Label>
          <select id="offer_child" className={selectCls} value={form.student_id} onChange={(e) => set('student_id', e.target.value)}>
            <option value="">Select a child…</option>
            {candidates.map((c: OfferCandidate) => (
              <option key={c.student_id} value={c.student_id}>
                {c.student_name || c.student_username}{c.guardian_name ? ` — ${c.guardian_name}` : ''}
              </option>
            ))}
          </select>
          {candidates.length === 0 && <p className="text-xs text-muted-foreground">No children with a linked parent yet.</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="offer_plan">Plan</Label>
          <select id="offer_plan" className={selectCls} value={form.plan_id} onChange={(e) => set('plan_id', e.target.value)}>
            <option value="">Select a plan…</option>
            {activePlans.map((p) => (
              <option key={p.id} value={p.id}>{p.name} — {rupees(p.amount_paise)}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="offer_batch">Seat / batch <span className="font-normal text-muted-foreground">(optional)</span></Label>
          <select id="offer_batch" className={selectCls} value={form.batch_id} onChange={(e) => set('batch_id', e.target.value)}>
            <option value="">No batch — payment only</option>
            {(batches ?? []).map((b: Batch) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="offer_note">Note <span className="font-normal text-muted-foreground">(shown to parent)</span></Label>
          <Input id="offer_note" value={form.note} onChange={(e) => set('note', e.target.value)} placeholder="Confirmed on call" />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onDone}>Cancel</Button>
        <Button type="submit" disabled={create.isPending}>
          {create.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : 'Send offer'}
        </Button>
      </div>
    </form>
  );
}
