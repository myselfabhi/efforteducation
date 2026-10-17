import type { Env } from '../types';

// Razorpay integration for one-time checkout.
//
// Three modes, chosen in paymentsMode():
//   live     — RAZORPAY_KEY_SECRET is set: real Razorpay API + HMAC signatures.
//   stub     — RAZORPAY_STUB is explicitly on: fake orders, one sentinel
//              signature accepted. For local dev; nothing is charged.
//   disabled — neither: checkout is turned off and fails closed.
//
// Stub is an EXPLICIT opt-in (not merely "keys absent") so production, which has
// no stub flag, can never be tricked into accepting a free stub payment.

export type PaymentsMode = 'live' | 'stub' | 'disabled';

export interface RazorpayOrder {
  id: string;
  amount: number; // paise
  currency: string;
  stub: boolean;
}

const STUB_SIGNATURE = 'stub_signature';

export function paymentsMode(env: Env): PaymentsMode {
  if (env.RAZORPAY_KEY_SECRET) return 'live';
  if (env.RAZORPAY_STUB === '1' || env.RAZORPAY_STUB === 'true') return 'stub';
  return 'disabled';
}

export function paymentsEnabled(env: Env): boolean {
  return paymentsMode(env) !== 'disabled';
}

export async function createOrder(
  env: Env,
  opts: { amountPaise: number; currency: string; receipt: string; notes?: Record<string, string> },
): Promise<RazorpayOrder> {
  const mode = paymentsMode(env);
  if (mode === 'disabled') {
    throw new Error('Payments are not configured');
  }
  if (mode === 'stub') {
    return {
      id: 'order_stub_' + crypto.randomUUID().replace(/-/g, '').slice(0, 14),
      amount: opts.amountPaise,
      currency: opts.currency,
      stub: true,
    };
  }

  const auth = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`);
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      amount: opts.amountPaise,
      currency: opts.currency,
      receipt: opts.receipt,
      notes: opts.notes,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Razorpay order failed (${res.status}): ${text.slice(0, 300)}`);
  }
  const order = (await res.json()) as { id: string; amount: number; currency: string };
  return { id: order.id, amount: order.amount, currency: order.currency, stub: false };
}

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Verify the signature Razorpay returns to the checkout handler. */
export async function verifyPaymentSignature(
  env: Env,
  p: { orderId: string; paymentId: string; signature: string },
): Promise<boolean> {
  const mode = paymentsMode(env);
  if (mode === 'disabled') return false;
  if (mode === 'stub') {
    return p.signature === STUB_SIGNATURE && p.paymentId.startsWith('pay_stub_');
  }
  const expected = await hmacHex(env.RAZORPAY_KEY_SECRET as string, `${p.orderId}|${p.paymentId}`);
  return timingSafeEqual(expected, p.signature);
}
