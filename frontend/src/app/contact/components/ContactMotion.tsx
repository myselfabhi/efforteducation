'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Phone, MessageCircle, Mail, MapPin, Clock, ArrowRight } from 'lucide-react';

const WHATSAPP = '+919910335093';
const PHONE = '+919910335093';

const CHANNELS = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: 'Chat with a counsellor',
    href: `https://wa.me/${WHATSAPP.replace(/\D/g, '')}`,
    accent: 'text-success',
    bg: 'bg-success/10',
    cta: 'Start chat',
    external: true,
  },
  {
    icon: Phone,
    label: 'Call us',
    value: '+91 99103 35093',
    href: `tel:${PHONE}`,
    accent: 'text-primary',
    bg: 'bg-primary/10',
    cta: 'Place a call',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'admissions@efforteducation.com',
    href: 'mailto:admissions@efforteducation.com',
    accent: 'text-info',
    bg: 'bg-info/10',
    cta: 'Send a message',
  },
];

const META = [
  { icon: Clock, label: 'Hours', value: 'Mon – Sat · 9 AM – 8 PM IST' },
  { icon: MapPin, label: 'Format', value: 'Online live interactive classes · across India & abroad' },
];

export function ContactMotion() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-primary-soft/60 via-background/0 to-background" />
          <div className="absolute top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-primary/15 blur-[120px]" />
        </div>

        <div className="container mx-auto max-w-5xl px-6 pt-32 md:pt-36 pb-12">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card/80 backdrop-blur border border-border/60 text-xs text-muted-foreground"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-success/40 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            Counsellors online · reply in 30 minutes
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05]"
          >
            Talk to a{' '}
            <span className="bg-gradient-to-br from-primary via-primary-strong to-primary bg-clip-text text-transparent">
              counsellor.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-5 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed"
          >
            Pick the channel that suits you. A 20-minute call with a senior counsellor will
            clarify your options — courses, schedule, fees, and demo classes.
          </motion.p>
        </div>
      </section>

      {/* Channels */}
      <section className="pb-20">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CHANNELS.map((c, i) => {
              const Icon = c.icon;
              const externalProps = c.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {};
              return (
                <motion.a
                  key={c.label}
                  href={c.href}
                  {...externalProps}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/30 hover:shadow-md transition-all flex flex-col"
                >
                  <div className={`h-10 w-10 rounded-xl ${c.bg} ${c.accent} flex items-center justify-center mb-4`}>
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
                    {c.label}
                  </div>
                  <div className="mt-1 text-base font-bold tracking-tight">{c.value}</div>
                  <div className="mt-auto pt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                    {c.cta}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </motion.a>
              );
            })}
          </div>

          {/* Meta strip */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {META.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.label}
                  className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/60 p-4"
                >
                  <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
                      {m.label}
                    </div>
                    <div className="text-sm font-semibold">{m.value}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-10">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="rounded-3xl border border-border bg-gradient-to-br from-primary-soft/60 via-card to-card p-10 md:p-14 text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Not sure which course fits you?
            </h2>
            <p className="mt-3 max-w-xl mx-auto text-muted-foreground">
              Browse the catalog or book a free counselling call — whichever you prefer.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/courses"
                className="group inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Browse all courses
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 h-11 px-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Or chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
