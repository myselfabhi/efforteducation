'use client';

import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import {
  ArrowRight,
  PlayCircle,
  Video,
  Users,
  Trophy,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useAuthModal } from '@/lib/stores/authModalStore';

const ROTATING_EXAMS = ['Bank PO', 'SSC CGL', 'CUET', 'UGC NET', 'Railway NTPC'];

const TRUST_STATS = [
  { value: '50K+', label: 'students taught' },
  { value: '95%', label: 'avg. selection rate' },
  { value: '1990', label: 'trusted since' },
];

const ACTIVITY_FEED = [
  { name: 'Aarav', action: 'joined Bank PO batch', when: '2 min ago' },
  { name: 'Priya', action: 'scored AIR 4 in Quant mock', when: '8 min ago' },
  { name: 'Rohan', action: 'enrolled in CUET program', when: '14 min ago' },
  { name: 'Sneha', action: 'cleared SSC CGL 2025', when: '32 min ago' },
  { name: 'Karan', action: 'started UGC NET prep', when: '47 min ago' },
];

const LEADERBOARD = [
  { rank: 1, name: 'Aarav S.', score: 9240, gradient: 'from-amber-200 to-orange-300' },
  { rank: 2, name: 'Priya M.', score: 8870, gradient: 'from-pink-200 to-rose-300' },
  { rank: 3, name: 'Rohan K.', score: 8560, gradient: 'from-sky-200 to-blue-300' },
];

const ATTENDING_AVATARS = [
  'from-amber-200 to-orange-300',
  'from-sky-200 to-blue-300',
  'from-emerald-200 to-teal-300',
  'from-pink-200 to-rose-300',
  'from-violet-200 to-purple-300',
];

export function HeroV2() {
  const [examIdx, setExamIdx] = useState(0);
  const [activityIdx, setActivityIdx] = useState(0);
  const openAuth = useAuthModal((s) => s.openModal);
  const sectionRef = useRef<HTMLElement>(null);

  // Magnetic spotlight that follows the cursor
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightX = useSpring(mouseX, { stiffness: 80, damping: 30 });
  const spotlightY = useSpring(mouseY, { stiffness: 80, damping: 30 });
  const spotlightBg = useTransform(
    [spotlightX, spotlightY],
    ([x, y]) =>
      `radial-gradient(600px circle at ${x}px ${y}px, var(--primary-soft, rgba(229, 9, 20, 0.08)), transparent 50%)`,
  );

  useEffect(() => {
    const examTimer = setInterval(() => {
      setExamIdx((i) => (i + 1) % ROTATING_EXAMS.length);
    }, 2800);
    const activityTimer = setInterval(() => {
      setActivityIdx((i) => (i + 1) % ACTIVITY_FEED.length);
    }, 3500);
    return () => {
      clearInterval(examTimer);
      clearInterval(activityTimer);
    };
  }, []);

  function onMove(e: React.MouseEvent<HTMLElement>) {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMove}
      className="relative isolate overflow-hidden bg-background"
    >
      {/* Background — dot grid + diagonal beam + cursor spotlight */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[640px] bg-gradient-to-b from-primary-soft/60 via-background/0 to-background" />
        {/* Cursor spotlight */}
        <motion.div className="absolute inset-0" style={{ background: spotlightBg }} />
        {/* Diagonal beam — Linear-style accent */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'linear-gradient(115deg, transparent 0%, transparent 35%, color-mix(in oklab, var(--primary, #e50914) 12%, transparent) 50%, transparent 65%, transparent 100%)',
          }}
        />
        {/* Soft glow blob */}
        <motion.div
          className="absolute top-24 right-[-12%] h-[560px] w-[560px] rounded-full bg-primary/15 blur-[120px]"
          animate={{ scale: [1, 1.06, 1], opacity: [0.55, 0.8, 0.55] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Dot grid with mask */}
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
            backgroundSize: '22px 22px',
            maskImage: 'linear-gradient(to bottom, black 30%, transparent 90%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 90%)',
          }}
        />
      </div>

      <div className="container mx-auto max-w-6xl px-6 pt-28 md:pt-32 pb-16 md:pb-20">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Left — content */}
          <div className="lg:col-span-7">
            {/* Status pill */}
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card/80 backdrop-blur border border-border/60 text-xs text-muted-foreground"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary/40 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              New batches enrolling · Banking, SSC, CUET, NET
            </motion.div>

            {/* Headline */}
            <h1 className="mt-7 text-[40px] sm:text-6xl md:text-7xl lg:text-[80px] font-black tracking-tight leading-[1.02]">
              <span className="sr-only">
                Crack your exam — Bank PO, SSC CGL, CUET, UGC NET, Railway NTPC.
              </span>
              <motion.span
                aria-hidden
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                Crack your
              </motion.span>
              <motion.span
                aria-hidden
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                <span className="relative inline-block align-baseline">
                  <span className="invisible whitespace-nowrap" aria-hidden>
                    Railway NTPC
                  </span>
                  {/* Highlight underline SVG */}
                  <svg
                    aria-hidden
                    className="absolute left-0 right-0 -bottom-1 w-full h-3 text-primary/30"
                    viewBox="0 0 200 12"
                    preserveAspectRatio="none"
                  >
                    <motion.path
                      d="M2 8 Q 50 2, 100 6 T 198 5"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
                    />
                  </svg>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={ROTATING_EXAMS[examIdx]}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -24 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute left-0 top-0 whitespace-nowrap bg-gradient-to-br from-primary via-primary-strong to-primary bg-clip-text text-transparent"
                    >
                      {ROTATING_EXAMS[examIdx]}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span aria-hidden className="text-foreground">
                  .
                </span>
              </motion.span>
            </h1>

            {/* Subhead */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed"
            >
              Live classes, real-time quizzes, batch-wide notes — one focused platform built for
              serious aspirants.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button asChild size="lg" className="h-12 px-6 text-base group">
                <Link href="#courses">
                  Explore courses
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base group">
                <Link href="#try-quiz">
                  <PlayCircle className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
                  Try a free quiz
                </Link>
              </Button>
              <button
                type="button"
                onClick={() => openAuth('login')}
                className="hidden sm:inline-flex items-center gap-1.5 h-12 px-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Already a student?
                <span className="font-semibold underline underline-offset-4 decoration-muted-foreground/40 hover:decoration-foreground">
                  Sign in
                </span>
              </button>
            </motion.div>

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 grid grid-cols-3 max-w-md gap-x-6 gap-y-2 border-t border-border/60 pt-5"
            >
              {TRUST_STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.55 + i * 0.08 }}
                >
                  <div className="text-2xl md:text-3xl font-bold tracking-tight">{s.value}</div>
                  <div className="mt-0.5 text-[11px] uppercase tracking-widest text-muted-foreground">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right — floating product preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, rotate: 1 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative max-w-sm mx-auto lg:max-w-none">
              {/* Browser-chrome card — live class preview */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
              >
                {/* Window chrome */}
                <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border bg-secondary/40">
                  <span className="h-2.5 w-2.5 rounded-full bg-destructive/40" />
                  <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
                  <div className="ml-auto flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-success/50 animate-ping" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                    </span>
                    Live now
                  </div>
                </div>

                {/* Class preview body */}
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Video className="h-5 w-5" strokeWidth={2.2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] uppercase tracking-widest text-primary font-semibold">
                        Bank PO · Quant
                      </div>
                      <div className="text-sm font-bold tracking-tight mt-0.5">
                        Time, Speed &amp; Distance — shortcuts
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        <span>
                          <span className="font-semibold text-foreground">47</span> students
                          attending
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Attending avatars row */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {ATTENDING_AVATARS.map((g, i) => (
                        <div
                          key={i}
                          className={`h-7 w-7 rounded-full bg-gradient-to-br ${g} border-2 border-card`}
                        />
                      ))}
                      <div className="h-7 w-7 rounded-full bg-secondary border-2 border-card flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                        +42
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => openAuth('register')}
                      className="inline-flex items-center gap-1 h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Join
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Animated progress bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
                      <span>Class progress</span>
                      <span className="text-foreground font-semibold">62%</span>
                    </div>
                    <div className="h-1 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: '62%' }}
                        transition={{ duration: 1.5, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full bg-primary"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating mini-leaderboard */}
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="absolute -bottom-6 -left-4 sm:-left-8 w-56 rounded-2xl border border-border bg-card shadow-xl p-3"
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <Trophy className="h-3.5 w-3.5 text-warning" strokeWidth={2.4} />
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                    Live leaderboard
                  </span>
                </div>
                <div className="space-y-1.5">
                  {LEADERBOARD.map((p, i) => (
                    <motion.div
                      key={p.rank}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + i * 0.08, duration: 0.3 }}
                      className="flex items-center gap-2"
                    >
                      <div
                        className={`h-6 w-6 rounded-md bg-gradient-to-br ${p.gradient} text-[10px] font-bold flex items-center justify-center text-foreground/80`}
                      >
                        {p.rank}
                      </div>
                      <span className="text-xs font-semibold flex-1 truncate">{p.name}</span>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {p.score.toLocaleString()}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Floating "speed bonus" pill */}
              <motion.div
                initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: -6 }}
                transition={{ delay: 1, duration: 0.4 }}
                className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success text-success-foreground text-xs font-bold shadow-lg"
              >
                <Zap className="h-3.5 w-3.5" strokeWidth={2.4} fill="currentColor" />
                Speed bonus +20
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Live activity ticker */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="mt-16 md:mt-20 flex items-center gap-3 px-4 py-3 rounded-2xl border border-border/60 bg-card/60 backdrop-blur max-w-2xl"
        >
          <div className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-success/40 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
              Live
            </span>
          </div>
          <div className="h-4 w-px bg-border shrink-0" />
          <div className="relative flex-1 h-5 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activityIdx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex items-center gap-2 text-sm"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" strokeWidth={2.4} />
                <span className="font-semibold">{ACTIVITY_FEED[activityIdx].name}</span>
                <span className="text-muted-foreground">
                  {ACTIVITY_FEED[activityIdx].action}
                </span>
                <span className="text-muted-foreground/60 ml-auto shrink-0 text-xs">
                  {ACTIVITY_FEED[activityIdx].when}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
