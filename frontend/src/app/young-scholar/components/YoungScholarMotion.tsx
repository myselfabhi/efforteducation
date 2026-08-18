'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  GraduationCap,
  CheckCircle2,
  Target,
  Star,
  Trophy,
  Calculator,
  Globe2,
  Newspaper,
  Puzzle,
  Medal,
  Presentation,
  Video,
  ClipboardList,
  Repeat,
  Quote,
  Users,
  PlayCircle,
} from 'lucide-react';

// Quick format facts — the reassurance a parent scans for before anything else.
const FORMAT = [
  { icon: PlayCircle, label: 'Live & online' },
  { icon: Users, label: 'Small batches' },
  { icon: Video, label: 'Recordings shared' },
  { icon: GraduationCap, label: 'Ages 8–14' },
];

// The real weekly loop these kids run — a true sequence, so it earns numbering.
const LOOP = [
  { icon: Video, title: 'Live class', body: 'A new skill every session — maths tricks, world maps, current affairs, a sport, a science idea.' },
  { icon: Trophy, title: 'McD Quiz', body: 'They compete, score points, and chase prizes. The part kids beg not to miss.' },
  { icon: ClipboardList, title: 'Weekly report', body: 'Each child writes what they did and sets next week’s targets — in their own words.' },
  { icon: Medal, title: 'Level up', body: 'Scholars graduate to Elites through bridge classes as their skills grow.' },
];

// The real breadth — pulled from what these kids actually study week to week.
const SKILLS = [
  { icon: Calculator, title: 'Fast & Vedic Maths', body: 'From Level Zero — number systems, quick calculation, mental maths made fun.', tint: 'bg-primary/10 text-primary' },
  { icon: Globe2, title: 'World Mapping & GK', body: 'Countries, capitals, Indian states, and world bodies like QUAD, NATO, and OPEC.', tint: 'bg-sky-500/10 text-sky-600 dark:text-sky-400' },
  { icon: Newspaper, title: 'Current Affairs', body: 'A weekly digest of the world, explained in language a 10-year-old actually gets.', tint: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  { icon: Puzzle, title: 'Reasoning & Olympiads', body: 'Verbal and non-verbal logic with targeted prep for IMO, IEO, and NSO.', tint: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' },
  { icon: Medal, title: 'Sports & the World', body: 'From F1 and squash to the Grand Slams — the general knowledge that makes kids curious.', tint: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  { icon: Presentation, title: 'Speaking & Interviews', body: 'News presentations, mock interviews, and group discussions that build real confidence.', tint: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
];

// A real progression, not decoration — Scholars become Elites.
const LADDER = [
  { stage: 'Scholar', body: 'Where every child starts. Builds the habit — weekly reports, the basics of maths, GK, and speaking up.' },
  { stage: 'Bridge', body: 'Short catch-up classes that fill the gaps, so no child is left behind before the jump.' },
  { stage: 'Elite', body: 'The advanced track — harder quizzes, deeper topics, and the confidence to lead a room.' },
];

// PLACEHOLDERS — near-verbatim from the +Ve Traits parent chat. Attributed
// generically for now; get parent consent + real attribution before publishing.
const TESTIMONIALS = [
  { quote: 'My daughter treats the McD Quiz like an Oscar — she counts down to it all week.', who: 'Parent of a Class 6 Scholar' },
  { quote: 'It wouldn’t have been possible without your mentorship and guidance. The support throughout the journey meant a lot.', who: 'Parent of a Class 8 Elite' },
  { quote: 'Thank you, sir — I truly appreciate your constant support and encouragement.', who: 'Parent of a Class 7 Scholar' },
];

const FAQ = [
  {
    q: 'What makes this different from tuition?',
    a: 'Tuition drills the syllabus. Young Scholar builds the habit of learning — a weekly report your child writes themselves, quizzes they compete in, and skills like speaking and reasoning that school rarely teaches.',
  },
  {
    q: 'Is the class small enough for my child to take part?',
    a: 'Yes. Batches are capped so every child gets quiz time, speaking time, and individual feedback — not a lecture they watch in silence.',
  },
  {
    q: 'How do we get started?',
    a: 'Book a call with a counsellor. We’ll explain how the week works, share the schedule, and get your child set up for the next batch.',
  },
  {
    q: 'What if my child misses a class?',
    a: 'Recordings are shared to your batch, and you can request a make-up. The weekly report keeps them on track either way.',
  },
  {
    q: 'What devices does my child need?',
    a: 'Any laptop or tablet with a webcam. A laptop is best for the speaking and presentation exercises.',
  },
];

function WeeklyReportCard() {
  const done = [
    '10 maths questions, every day',
    'Mapped all of Africa',
    'Current affairs — this month',
    'Imaginary interview practised',
  ];
  const next = ['Start Coordinate Geometry', 'Revise QUAD & NATO', 'Prep for Sunday’s McD Quiz'];
  return (
    <div className="relative">
      {/* Floating quiz badge — ties the report to the quiz loop */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: -8 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="absolute -top-4 -right-3 z-20 rounded-2xl bg-primary text-primary-foreground px-3 py-2 shadow-lg shadow-primary/25"
      >
        <div className="flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span className="text-xs font-bold">McD Quiz: 5/5</span>
        </div>
      </motion.div>

      <div className="rounded-3xl border border-border bg-card shadow-xl shadow-foreground/[0.04] overflow-hidden rotate-[1.5deg]">
        {/* Report header */}
        <div className="bg-gradient-to-br from-primary-soft/80 to-card px-5 py-4 border-b border-border/70 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center text-sm font-bold text-orange-900">
            A
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-tight">Aarav’s week</div>
            <div className="text-[11px] text-muted-foreground">Class 6 · Week 12</div>
          </div>
          <span className="ml-auto text-[10px] font-semibold uppercase tracking-widest text-primary bg-card border border-primary/20 rounded-full px-2 py-0.5">
            Report
          </span>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Done this week
            </div>
            <ul className="space-y-1.5">
              {done.map((d) => (
                <li key={d} className="flex items-start gap-2 text-[13px] text-foreground/90">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" strokeWidth={2} />
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="h-px bg-border" />
          <div>
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">
              <Target className="h-3.5 w-3.5 text-primary" /> Next week
            </div>
            <ul className="space-y-1.5">
              {next.map((n) => (
                <li key={n} className="flex items-start gap-2 text-[13px] text-foreground/90">
                  <Target className="h-4 w-4 text-primary shrink-0 mt-0.5" strokeWidth={2} />
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        A real weekly report — written by the child, every single week.
      </p>
    </div>
  );
}

export function YoungScholarMotion() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-[480px] bg-gradient-to-b from-primary-soft/60 via-background/0 to-background" />
          <div className="absolute top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-primary/15 blur-[120px]" />
        </div>

        <div className="container mx-auto max-w-6xl px-6 pt-32 md:pt-36 pb-16 md:pb-20">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left content */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card/80 backdrop-blur border border-border/60 text-xs text-muted-foreground"
              >
                <GraduationCap className="h-3.5 w-3.5 text-primary" />
                Class 4–8 · Ages 8–14 · Live online
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="mt-5 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05]"
              >
                Kids who can’t{' '}
                <span className="bg-gradient-to-br from-primary via-primary-strong to-primary bg-clip-text text-transparent">
                  wait for class.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="mt-5 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed"
              >
                Live classes, quizzes they beg to win, and a weekly report they write
                themselves. Young Scholar turns Class 4–8 kids into confident, self-driven
                learners — far beyond the textbook.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Book a call
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center gap-1.5 h-12 px-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  See how a week works
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8 flex items-center gap-2 text-xs text-muted-foreground"
              >
                <span className="flex -space-x-1.5">
                  {['from-amber-200 to-orange-300', 'from-sky-200 to-blue-300', 'from-emerald-200 to-teal-300'].map((g, i) => (
                    <span key={i} className={`h-5 w-5 rounded-full bg-gradient-to-br ${g} border-2 border-background`} />
                  ))}
                </span>
                <span>
                  <span className="font-semibold text-foreground">200+ young scholars</span> learning
                  every week
                </span>
              </motion.div>
            </div>

            {/* Right — the signature: a real weekly report */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5"
            >
              <div className="max-w-sm mx-auto lg:mr-0">
                <WeeklyReportCard />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Format trust strip ──────────────────────────────────────────── */}
      <section className="border-y border-border bg-card/60">
        <div className="container mx-auto max-w-5xl px-6 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3">
            {FORMAT.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.label} className="flex items-center gap-2.5 justify-center sm:justify-start">
                  <Icon className="h-4 w-4 text-primary shrink-0" strokeWidth={2} />
                  <span className="text-sm font-medium text-foreground/80">{f.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── The weekly loop ──────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 bg-secondary/30">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="max-w-xl mb-10">
            <p className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-primary font-semibold">
              <Repeat className="h-3.5 w-3.5" /> The rhythm
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
              One week, on repeat — until it becomes who they are.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Every week runs the same loop. That’s what turns a spark of interest into a lasting habit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {LOOP.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="relative rounded-2xl border border-border bg-card p-5"
                >
                  <span className="absolute top-4 right-4 text-[11px] font-bold text-muted-foreground/50 tabular-nums">
                    0{i + 1}
                  </span>
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <h3 className="text-base font-bold tracking-tight">{step.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── What they master ─────────────────────────────────────────────── */}
      <section id="curriculum" className="py-20 bg-background">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="max-w-xl mb-10">
            <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">Curriculum</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
              Six skills school rarely teaches.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Not more of the syllabus — the thinking, speaking, and general knowledge that set a child apart.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SKILLS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
                  className="rounded-2xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <div className={`h-10 w-10 rounded-xl ${s.tint} flex items-center justify-center mb-4`}>
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <h3 className="text-base font-bold tracking-tight">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why it sticks — the two differentiators ──────────────────────── */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="max-w-xl mb-10">
            <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">Why it sticks</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
              Two ideas that do the heavy lifting.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-border bg-card p-7"
            >
              <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <ClipboardList className="h-5 w-5" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold tracking-tight">The Weekly Report</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Every child writes down what they did and what they’ll do next — in their own words,
                every week. It’s a small ritual that builds a big thing: a kid who owns their own
                learning, and a parent who can watch it happen.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="rounded-2xl border border-border bg-card p-7"
            >
              <div className="h-11 w-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5">
                <Trophy className="h-5 w-5" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold tracking-tight">The McD Quiz</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                A live quiz series with points, leaderboards, and prizes — even family editions where
                parents and grandparents play along. It turns revision into the highlight of the week.
                Kids don’t dread it; they count down to it.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Scholar → Elite journey ──────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="max-w-xl mb-10">
            <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">The journey</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
              From Scholar to Elite.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Every child starts as a Scholar and climbs at their own pace — there’s always a next level to earn.
            </p>
          </div>

          <div className="relative">
            <div aria-hidden className="hidden md:block absolute left-0 right-0 top-6 h-px bg-border" />
            <div className="grid md:grid-cols-3 gap-4">
              {LADDER.map((l, i) => (
                <motion.div
                  key={l.stage}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="relative rounded-2xl border border-border bg-card p-6"
                >
                  <div className="relative z-10 h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4 -mt-9 border-4 border-background">
                    {i + 1}
                  </div>
                  <h3 className="text-lg font-bold tracking-tight">{l.stage}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{l.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Parent voices ────────────────────────────────────────────────── */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="max-w-xl mb-10">
            <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">Parent voices</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
              What parents notice first.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <motion.figure
                key={t.who}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-2xl border border-border bg-card p-6 flex flex-col"
              >
                <Quote className="h-6 w-6 text-primary/30" />
                <blockquote className="mt-3 text-[15px] leading-relaxed text-foreground/90 flex-1">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-4 text-xs font-semibold text-muted-foreground">
                  {t.who}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-3xl px-6">
          <div className="mb-10">
            <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">FAQ</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">Quick answers.</h2>
          </div>

          <div className="space-y-3">
            {FAQ.map((f, i) => {
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
                      className={`h-4 w-4 text-muted-foreground transition-transform shrink-0 ${open ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
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
