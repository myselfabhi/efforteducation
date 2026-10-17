'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { GraduationCap, Loader2, ShieldCheck } from 'lucide-react';
import { api, ApiError, type MyOffer } from '@/lib/api';
import { Button } from '@/app/components/ui/button';

const rupees = (paise: number) => `₹${(paise / 100).toLocaleString('en-IN')}`;

// Razorpay's checkout.js attaches a global constructor when loaded.
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
interface RazorpayInstance { open: () => void; on: (e: string, cb: () => void) => void }
declare global {
  interface Window {
    Razorpay?: new (opts: Record<string, unknown>) => RazorpayInstance;
  }
}

let scriptPromise: Promise<void> | null = null;
function loadRazorpay(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload = () => resolve();
      s.onerror = () => { scriptPromise = null; reject(new Error('Could not load the payment gateway.')); };
      document.body.appendChild(s);
    });
  }
  return scriptPromise;
}

/** The parent's "Confirm your seat" list — offers an admin has assigned to pay. */
export function SeatOffers() {
  const { data } = useQuery({ queryKey: ['offers', 'mine'], queryFn: () => api.offers.mine() });
  const offers = data?.offers ?? [];
  const enabled = data?.payments_enabled ?? false;
  if (offers.length === 0) return null;

  return (
    <section className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
      <div className="mb-4 flex items-center gap-2">
        <GraduationCap className="h-5 w-5 text-primary" />
        <h2 className="font-semibold">Confirm {offers.length > 1 ? 'their seats' : 'your seat'}</h2>
      </div>
      <ul className="space-y-3">
        {offers.map((o) => <OfferRow key={o.id} offer={o} enabled={enabled} />)}
      </ul>
      <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5" />
        {enabled ? 'Payments are processed securely by Razorpay.' : 'Online payment is being set up — we’ll be in touch to confirm the seat.'}
      </p>
    </section>
  );
}

function OfferRow({ offer, enabled }: { offer: MyOffer; enabled: boolean }) {
  const qc = useQueryClient();

  const pay = useMutation({
    mutationFn: async () => {
      const order = await api.payments.order(offer.id);

      // No real keys yet (local/test): confirm straight through the stub.
      if (order.stub || !order.key_id) {
        return api.payments.verify({
          razorpay_order_id: order.order_id,
          razorpay_payment_id: 'pay_stub_' + Date.now(),
          razorpay_signature: 'stub_signature',
        });
      }

      // Real Razorpay checkout.
      await loadRazorpay();
      return new Promise((resolve, reject) => {
        const rzp = new window.Razorpay!({
          key: order.key_id,
          order_id: order.order_id,
          amount: order.amount_paise,
          currency: order.currency,
          name: 'Effort Education',
          description: order.plan_name,
          prefill: { name: order.name ?? undefined, email: order.email },
          theme: { color: '#4f46e5' },
          handler: (resp: RazorpayResponse) => {
            api.payments
              .verify({
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
              })
              .then(resolve, reject);
          },
          modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
        });
        rzp.on('payment.failed', () => reject(new Error('Payment failed. Please try again.')));
        rzp.open();
      });
    },
    onSuccess: (res) => {
      const enrolled = (res as { enrolled?: boolean } | undefined)?.enrolled;
      qc.invalidateQueries({ queryKey: ['offers', 'mine'] });
      qc.invalidateQueries({ queryKey: ['guardian', 'week'] });
      toast.success(enrolled ? "Payment received — seat confirmed! 🎉" : 'Payment received — thank you! 🎉');
    },
    onError: (e) => {
      if (e instanceof Error && e.message === 'Payment cancelled') return; // user closed the sheet
      toast.error(e instanceof ApiError ? e.message : e instanceof Error ? e.message : 'Payment could not be completed.');
    },
  });

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-medium">
          {offer.plan_name}
          {offer.interval_label && <span className="text-sm font-normal text-muted-foreground"> · {offer.interval_label}</span>}
        </p>
        <p className="text-sm text-muted-foreground">
          For {offer.student_name || offer.student_username}
          {offer.batch_name && <> · {offer.batch_name}</>}
        </p>
        {offer.note && <p className="mt-1 text-xs text-muted-foreground">{offer.note}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="text-lg font-bold tabular-nums">{rupees(offer.amount_paise)}</span>
        {enabled ? (
          <Button onClick={() => pay.mutate()} disabled={pay.isPending}>
            {pay.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</> : 'Pay now'}
          </Button>
        ) : (
          <Button variant="outline" disabled>Coming soon</Button>
        )}
      </div>
    </li>
  );
}
