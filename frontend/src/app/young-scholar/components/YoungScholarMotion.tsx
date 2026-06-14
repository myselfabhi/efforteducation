'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { useAuthModal } from '@/lib/stores/authModalStore';
import {
  ArrowRight,
  ChevronDown,
  GraduationCap,
  Calendar,
  Clock,
  Trophy,
  Mic,
  Brain,
  Sparkles,
} from 'lucide-react';

const PILLARS = [
  {
    icon: Mic,
    title: 'Public Speaking',
    body: 'Structured speech assignments, debate clubs, and weekly stage time. Confidence is a skill — we teach it.',
    accent: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Brain,
    title: 'Reasoning & Logic',
    body: 'Pattern recognition, analogies, and logical puzzles. The kind of thinking competitive exams reward later.',
    accent: 'text-info',
    bg: 'bg-info/10',
  },
  {
    icon: Trophy,
    title: 'Olympiad Prep',
    body: 'Targeted prep for SOF, NSO, IMO, and IEO. Past papers, mocks, and step-by-step solution walks.',
    accent: 'text-warning',
    bg: 'bg-warning/10',
  },
  {
    icon: Sparkles,
    title: 'Current Affairs',
    body: 'A weekly digest of what’s happening — explained in language a 10-year-old understands.',
    accent: 'text-success',
    bg: 'bg-success/10',
  },
];

const SCHEDULE = [
  { icon: Calendar, label: 'Days', value: 'Saturday & Sunday' },
  { icon: Clock, label: 'Time', value: '6:00 PM – 7:00 PM IST' },
  { icon: Trophy, label: 'Format', value: 'Online live · 2× a week' },
];

const FAQ = [
  {
    q: 'Is the class size small enough for my child to participate?',
    a: 'Yes. Each batch is capped at 25 students so every child gets stage time, doubt time, and individual feedback.',
  },
  {
    q: 'What if my child misses a class?',
    a: 'Recordings are uploaded within 2 hours and pinned to your batch. You can also request a make-up session.',
  },
  {
    q: 'Can I get a free demo class before paying?',
    a: 'Absolutely. The first session is always free — no card, no commitment.',
  },
  {
    q: 'What devices does my child need?',
    a: 'Any laptop or tablet with a webcam works. We recommend a laptop for the stage-speaking exercises.',
  },
];

const AVATAR_GRADIENTS = [
  'from-amber-200 to-orange-300',
  'from-sky-200 to-blue-300',
  'from-emerald-200 to-teal-300',
  'from-pink-200 to-rose-300',
  'from-violet-200 to-purple-300',
];

export function YoungScholarMotion() {
  const pillars = PILLARS;
  const schedule = SCHEDULE;
  const faq = FAQ;
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const openAuth = useAuthModal((s) => s.openModal);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-[480px] bg-gradient-to-b from-primary-soft/60 via-background/0 to-background" />
          <div className="absolute top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-primary/15 blur-[120px]" />
        </div>

        <div className="container mx-auto max-w-6xl px-6 pt-32 md:pt-36 pb-16 md:pb-20">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Left content */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card/80 backdrop-blur border border-border/60 text-xs text-muted-foreground"
              >
                <GraduationCap className="h-3.5 w-3.5 text-primary" />
                Ages 8–14 · Class 4 to 8 · Weekend program
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="mt-5 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05]"
              >
                Young{' '}
                <span className="bg-gradient-to-br from-primary via-primary-strong to-primary bg-clip-text text-transparent">
                  Scholar.
                </span>
                <br />
                Built for curious kids.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="mt-5 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed"
              >
                Beyond school learning, Young Scholar builds communication skills,
                 Vedic Maths, reasoning ability, current affairs awareness, 
                 interview and group discussion skills, and more — building confidence, 
                critical thinking, and leadership qualities for the future.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <button
                  type="button"
                  onClick={() => openAuth('register')}
                  className="group inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Book a free demo
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <Link
                  href="#curriculum"
                  className="inline-flex items-center gap-1.5 h-12 px-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  See the curriculum
                </Link>
              </motion.div>

              {/* Pricing pill */}
              {/* <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-10 inline-flex items-baseline gap-2 rounded-full border border-border bg-card px-4 py-2"
              >
                <span className="text-2xl font-bold tracking-tight">₹999</span>
                <span className="text-xs text-muted-foreground">per month · all-inclusive</span>
              </motion.div> */}
            </div>

            {/* Right — kid-tile grid + floating cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative w-full max-w-sm mx-auto">
                <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-card to-primary-soft/40 border border-border/60 grid grid-cols-3 grid-rows-3 gap-2 p-4">
                  {AVATAR_GRADIENTS.concat(AVATAR_GRADIENTS).slice(0, 9).map((g, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.6 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.05 * i, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className={`rounded-2xl bg-gradient-to-br ${g} relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-0.5 opacity-80">
                          <div className="flex gap-1">
                            <span className="h-1 w-1 rounded-full bg-foreground/70" />
                            <span className="h-1 w-1 rounded-full bg-foreground/70" />
                          </div>
                          <div className="h-0.5 w-2 rounded-full bg-foreground/70" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <span className="flex -space-x-1.5">
                    {AVATAR_GRADIENTS.slice(0, 3).map((g, i) => (
                      <span
                        key={i}
                        className={`h-5 w-5 rounded-full bg-gradient-to-br ${g} border-2 border-background`}
                      />
                    ))}
                  </span>
                  <span>
                    <span className="font-semibold text-foreground">200+ kids</span> currently
                    enrolled
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Curriculum pillars */}
      <section id="curriculum" className="py-20 bg-background">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="max-w-xl mb-10">
            <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">
              Curriculum
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
              Four pillars. One confident young learner.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="rounded-2xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <div className={`h-10 w-10 rounded-xl ${p.bg} ${p.accent} flex items-center justify-center mb-4`}>
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <h3 className="text-base font-bold tracking-tight">{p.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{p.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="max-w-xl mb-10">
            <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">
              Schedule
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
              Twice a week. Always weekends.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {schedule.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="rounded-2xl border border-border bg-card p-5"
                >
                  <Icon className="h-5 w-5 text-primary mb-3" strokeWidth={2} />
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
                    {s.label}
                  </div>
                  <div className="mt-1 text-base font-bold tracking-tight">{s.value}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto max-w-3xl px-6">
          <div className="mb-10">
            <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">
              FAQ
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
              Quick answers.
            </h2>
          </div>

          <div className="space-y-3">
            {faq.map((f, i) => {
              const open = openIdx === i;
              return (
                <motion.div
                  key={f.q}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="rounded-2xl border border-border bg-card overflow-hidden"
                >
                  <button
                    onClick={() => setOpenIdx(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-secondary/30 transition-colors"
                  >
                    <span className="text-sm md:text-base font-semibold">{f.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-muted-foreground transition-transform shrink-0 ${
                        open ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {f.a}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
