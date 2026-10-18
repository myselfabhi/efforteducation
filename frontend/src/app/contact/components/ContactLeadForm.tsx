'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';

const INTERESTS = [
  { value: 'Young Scholar (Class 4–8)', label: 'Young Scholar (Class 4–8)' },
  { value: 'Competitive exams', label: 'Competitive exams (Banking / SSC / CUET …)' },
  { value: 'Not sure yet', label: 'Not sure yet — help me choose' },
];

const base =
  'w-full rounded-xl border border-border bg-background text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition';
const inputCls = `${base} h-11 px-3.5`;

export default function ContactLeadForm({ whatsapp }: { whatsapp: string }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState(INTERESTS[2].value);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  // Prefill interest from ?interest= (e.g. a Young Scholar CTA). Read client-side
  // so we avoid the useSearchParams Suspense requirement.
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search).get('interest');
      if (p && /young|scholar|kid|child/i.test(p)) setInterest(INTERESTS[0].value);
      else if (p && /exam|comp|bank|ssc|cuet/i.test(p)) setInterest(INTERESTS[1].value);
    } catch {
      /* no query params available */
    }
  }, []);

  const waLink = `https://wa.me/${whatsapp.replace(/\D/g, '')}`;

  function submit(e: FormEvent) {
    e.preventDefault();
    const n = name.trim();
    const ph = phone.trim();
    if (n.length < 2) {
      setError('Please enter your name.');
      return;
    }
    if (ph.replace(/\D/g, '').length < 7) {
      setError('Please enter a valid phone number.');
      return;
    }
    setError('');
    // Capture the lead so it's saved for the team even if they never hit send in
    // WhatsApp. Fire-and-forget — must not block (or delay) the popup below.
    api.leads
      .submit({ name: n, phone: ph, interest, message: message.trim() || undefined, source: 'contact_form' })
      .catch(() => {});
    const lines = [
      'Hi Effort Education! I’d like to book a call.',
      `Name: ${n}`,
      `Phone: ${ph}`,
      `Interested in: ${interest}`,
    ];
    if (message.trim()) lines.push(`Note: ${message.trim()}`);
    window.open(`${waLink}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener,noreferrer');
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 md:p-10 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-success/10 text-success flex items-center justify-center mb-4">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold tracking-tight">
          We’re on it, {name.trim().split(' ')[0] || 'there'}.
        </h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
          WhatsApp should have opened with your details — just hit send and a counsellor replies
          within 30 minutes. If it didn’t open, tap below.
        </p>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-success text-success-foreground text-sm font-semibold hover:opacity-90 transition"
        >
          Open WhatsApp
        </a>
      </div>
    );
  }

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm"
    >
      <div className="text-[11px] uppercase tracking-widest text-primary font-semibold">Book a call</div>
      <h2 className="mt-1 text-2xl font-bold tracking-tight">Leave your number — we’ll call you.</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Tell us a little and a senior counsellor reaches out. Takes 20 seconds.
      </p>

      <div className="mt-6 grid gap-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5" htmlFor="lf-name">
              Name
            </label>
            <input
              id="lf-name"
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Parent or student name"
              autoComplete="name"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5" htmlFor="lf-phone">
              Phone
            </label>
            <input
              id="lf-phone"
              type="tel"
              inputMode="tel"
              className={inputCls}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="WhatsApp number"
              autoComplete="tel"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5" htmlFor="lf-interest">
            I’m interested in
          </label>
          <select
            id="lf-interest"
            className={inputCls}
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
          >
            {INTERESTS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5" htmlFor="lf-msg">
            Anything else? <span className="text-muted-foreground/60">(optional)</span>
          </label>
          <textarea
            id="lf-msg"
            rows={2}
            className={`${base} px-3.5 py-2.5 resize-none`}
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 300))}
            placeholder="Child’s class, preferred timing, a question…"
          />
        </div>
      </div>

      {error && <p className="mt-3 text-xs text-destructive">{error}</p>}

      <button
        type="submit"
        className="mt-5 w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
      >
        <Send className="h-4 w-4" />
        Request a call on WhatsApp
      </button>
      <p className="mt-2.5 text-center text-[11px] text-muted-foreground">
        Opens WhatsApp with your details pre-filled. No spam — we reply within 30 minutes during
        working hours.
      </p>
    </motion.form>
  );
}
