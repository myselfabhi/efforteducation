'use client';

import { motion } from 'framer-motion';
import { Target, Heart, Sparkles } from 'lucide-react';

const VALUES = [
  {
    icon: Target,
    title: 'Outcome-first teaching',
    body: 'Every class, every quiz, every mock — designed around the day you sit for the exam.',
    accent: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Heart,
    title: 'Mentor, not just teacher',
    body: 'Faculty stay with you through doubts, mock reviews, and interview rounds — long after the lecture ends.',
    accent: 'text-info',
    bg: 'bg-info/10',
  },
  {
    icon: Sparkles,
    title: 'Built for serious aspirants',
    body: 'No fluff, no padding. A focused platform for people who treat preparation like a job.',
    accent: 'text-warning',
    bg: 'bg-warning/10',
  },
];

const TIMELINE = [
  { year: '1990', title: 'Founded in Delhi', body: 'Started as a single classroom for Banking aspirants.' },
  { year: '2005', title: 'Expanded to Teaching exams', body: 'Added UGC NET, CTET, and PRT/TGT/PGT coaching.' },
  { year: '2018', title: 'Went online', body: 'First batch of fully online live classes for SSC and Banking.' },
  { year: '2024', title: 'Young Scholar Program', body: 'Launched a weekend program for Class 4–8 learners.' },
  { year: '2026', title: 'New platform', body: 'Live classes, real-time quizzes, batch material — all in one app.' },
];

export function AboutMotionSections() {
  const values = VALUES;
  const timeline = TIMELINE;
  return (
    <>
      {/* Values */}
      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="max-w-xl mb-10">
            <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">
              How we work
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
              Three things we don&rsquo;t compromise on.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <div className={`h-10 w-10 rounded-xl ${v.bg} ${v.accent} flex items-center justify-center mb-4`}>
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <h3 className="text-base font-bold tracking-tight">{v.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{v.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto max-w-3xl px-6">
          <div className="mb-12">
            <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">
              Our journey
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
              From one classroom to one platform.
            </h2>
          </div>

          <ol className="relative border-l-2 border-border ml-3 space-y-8">
            {timeline.map((t, i) => (
              <motion.li
                key={t.year}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="pl-8 relative"
              >
                <span className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-primary border-4 border-background" />
                <div className="text-[11px] uppercase tracking-widest text-primary font-semibold">
                  {t.year}
                </div>
                <h3 className="mt-1 text-lg font-bold tracking-tight">{t.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{t.body}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
