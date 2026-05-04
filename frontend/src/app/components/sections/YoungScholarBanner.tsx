'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Mic, Brain, Trophy, Sparkles } from 'lucide-react';
import { useAuthModal } from '@/lib/stores/authModalStore';

const SKILLS = [
  { icon: Mic, label: 'Public Speaking' },
  { icon: Brain, label: 'Reasoning' },
  { icon: Trophy, label: 'Olympiad Prep' },
  { icon: Sparkles, label: 'Current Affairs' },
];

const AVATAR_GRADIENTS = [
  'from-amber-200 to-orange-300',
  'from-sky-200 to-blue-300',
  'from-emerald-200 to-teal-300',
  'from-pink-200 to-rose-300',
  'from-violet-200 to-purple-300',
];

export default function YoungScholarBanner() {
  const openAuth = useAuthModal((s) => s.openModal);
  return (
    <section className="py-20 md:py-24 bg-background">
      <div className="container mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary-soft/80 via-card to-card"
        >
          {/* Subtle decorative ring on the right */}
          <div
            aria-hidden
            className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -right-20 top-10 h-64 w-64 rounded-full border border-primary/20"
          />
          <div
            aria-hidden
            className="absolute right-10 top-32 h-32 w-32 rounded-full border border-primary/15"
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 p-8 md:p-12 lg:p-14 items-center">
            {/* Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card/80 backdrop-blur border border-border/60 text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Ages 8–14 · Weekend program
              </div>

              <h2 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
                Young{' '}
                <span className="bg-gradient-to-br from-primary via-primary-strong to-primary bg-clip-text text-transparent">
                  Scholar.
                </span>
                <br />
                Built for curious kids.
              </h2>

              <p className="mt-5 max-w-lg text-base text-muted-foreground leading-relaxed">
                A weekend skill-building program for Class 4–8 — public speaking, reasoning, current
                affairs, and olympiad prep, all in one focused track.
              </p>

              {/* Skill chips */}
              <div className="mt-6 flex flex-wrap gap-2">
                {SKILLS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <span
                      key={s.label}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border text-xs font-semibold text-foreground/80"
                    >
                      <Icon className="h-3.5 w-3.5 text-primary" strokeWidth={2.2} />
                      {s.label}
                    </span>
                  );
                })}
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/young-scholar"
                  className="group inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Explore the program
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <button
                  type="button"
                  onClick={() => openAuth('register')}
                  className="inline-flex items-center gap-1.5 h-11 px-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Book a free demo class
                </button>
              </div>
            </div>

            {/* Avatar stack — replaces empty decorative circle */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-sm">
                {/* Floating stat card top */}
                <motion.div
                  initial={{ opacity: 0, y: -12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="absolute -top-2 right-2 sm:right-6 z-10 rounded-2xl bg-card border border-border shadow-lg p-3 pr-4"
                >
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-warning" strokeWidth={2.4} />
                    <div>
                      <div className="text-sm font-bold leading-tight">120+ medals</div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        Olympiads &amp; quizzes
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating stat card bottom */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                  className="absolute -bottom-2 left-2 sm:left-6 z-10 rounded-2xl bg-card border border-border shadow-lg p-3 pr-4"
                >
                  <div className="flex items-center gap-2">
                    <Mic className="h-4 w-4 text-primary" strokeWidth={2.4} />
                    <div>
                      <div className="text-sm font-bold leading-tight">2× a week</div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        Live online sessions
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Centerpiece — happy-faces stack */}
                <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-card to-primary-soft/40 border border-border/60 grid grid-cols-3 grid-rows-3 gap-2 p-4">
                  {AVATAR_GRADIENTS.concat(AVATAR_GRADIENTS).slice(0, 9).map((g, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.6 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.05 * i,
                        duration: 0.3,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={`rounded-2xl bg-gradient-to-br ${g} relative overflow-hidden`}
                    >
                      {/* simple smiley */}
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

                {/* "+200 students" pill below */}
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
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
