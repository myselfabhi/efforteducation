'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Video, Trophy, FileText, GraduationCap, ArrowRight } from 'lucide-react';

const FEATURES = [
  {
    icon: Video,
    title: 'Live classes',
    body: 'One-click join from your dashboard. Attendance tracked automatically.',
    accent: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Trophy,
    title: 'Real-time quizzes',
    body: 'Speed-bonus scoring with a leaderboard that updates as you play.',
    accent: 'text-info',
    bg: 'bg-info/10',
  },
  {
    icon: FileText,
    title: 'Batch material',
    body: 'PDFs, videos, notes — pinned to your batch and notified on upload.',
    accent: 'text-warning',
    bg: 'bg-warning/10',
  },
  {
    icon: GraduationCap,
    title: 'Expert faculty',
    body: 'Mentors with 10+ years of experience and a track record of selections.',
    accent: 'text-success',
    bg: 'bg-success/10',
  },
];

export function ProductPreviewScroll() {
  return (
    <section className="relative bg-background py-20 md:py-24">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div className="max-w-xl">
            <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">
              The platform
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
              Everything a serious aspirant needs.
            </h2>
          </div>
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2 transition-all"
          >
            How the platform works
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative rounded-2xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div
                  className={`h-10 w-10 rounded-xl ${f.bg} ${f.accent} flex items-center justify-center mb-4`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <h3 className="text-base font-bold tracking-tight">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
