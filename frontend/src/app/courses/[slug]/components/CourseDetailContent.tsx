'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  Calendar,
  Clock,
  Globe,
  GraduationCap,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Quote,
} from 'lucide-react';
import type { Course } from '../../../data/courses';
import { useAuthModal } from '@/lib/stores/authModalStore';

export function CourseDetailContent({ course }: { course: Course }) {
  const [openSyllabusIdx, setOpenSyllabusIdx] = useState<number | null>(0);
  const [examTab, setExamTab] = useState(0);
  const openAuth = useAuthModal((s) => s.openModal);

  const meta = [
    { icon: Clock, label: 'Duration', value: course.duration },
    { icon: GraduationCap, label: 'Mode', value: course.mode },
    { icon: Globe, label: 'Language', value: course.language },
    { icon: Calendar, label: 'Batch', value: course.batch },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-[480px] bg-gradient-to-b from-primary-soft/60 via-background/0 to-background" />
          <div className="absolute top-32 right-[-10%] h-[460px] w-[460px] rounded-full bg-primary/15 blur-[120px]" />
        </div>

        <div className="container mx-auto max-w-6xl px-6 pt-32 md:pt-36 pb-12 md:pb-16">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            {/* Left content */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2"
              >
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  All courses
                </Link>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs uppercase tracking-widest text-primary font-semibold">
                  Course details
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]"
              >
                {course.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="mt-5 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed"
              >
                {course.tagline}
              </motion.p>

              {/* Meta pills */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 flex flex-wrap gap-2"
              >
                {meta.map((m) => {
                  const Icon = m.icon;
                  return (
                    <span
                      key={m.label}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border text-xs"
                    >
                      <Icon className="h-3.5 w-3.5 text-primary" strokeWidth={2.2} />
                      <span className="text-muted-foreground">{m.label}:</span>
                      <span className="font-semibold text-foreground">{m.value}</span>
                    </span>
                  );
                })}
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <button
                  type="button"
                  onClick={() => openAuth('register')}
                  className="group inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Enroll now
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 h-12 px-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Book a free demo class
                </Link>
              </motion.div>
            </div>

            {/* Right — sticky enrolment card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="lg:sticky lg:top-24 rounded-3xl border border-border bg-card overflow-hidden">
                <div className="p-6 bg-gradient-to-br from-primary-soft/60 via-card to-card border-b border-border">
                  <div className="text-[11px] uppercase tracking-widest text-primary font-semibold">
                    Enrolling now
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl md:text-4xl font-bold tracking-tight">
                      {course.batch.toLowerCase().includes('soon') ? 'Open' : course.batch}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {course.duration} · {course.mode}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" strokeWidth={2.2} />
                    <div>
                      <div className="text-sm font-semibold">Free demo class</div>
                      <div className="text-xs text-muted-foreground">No card. No commitment.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" strokeWidth={2.2} />
                    <div>
                      <div className="text-sm font-semibold">Recorded lectures included</div>
                      <div className="text-xs text-muted-foreground">
                        Pinned to your batch within 2 hours.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" strokeWidth={2.2} />
                    <div>
                      <div className="text-sm font-semibold">Eligibility check</div>
                      <div className="text-xs text-muted-foreground">{course.eligibility}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => openAuth('register')}
                    className="group mt-4 w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Reserve your seat
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="rounded-3xl border border-border bg-card p-8 md:p-10">
            <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">
              Overview
            </p>
            <p className="mt-3 text-base md:text-lg text-foreground/90 leading-relaxed">
              {course.overview}
            </p>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="max-w-xl mb-8">
            <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">
              What you&rsquo;ll get
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
              Course highlights.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {course.highlights.map((h, i) => (
              <motion.div
                key={h}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="rounded-2xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <Sparkles className="h-4 w-4" strokeWidth={2.2} />
                </div>
                <p className="text-sm leading-relaxed">{h}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Syllabus accordion */}
      {course.syllabus.length > 0 && (
        <section className="py-12 md:py-16 bg-secondary/30">
          <div className="container mx-auto max-w-4xl px-6">
            <div className="mb-8">
              <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">
                Syllabus
              </p>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
                What you&rsquo;ll learn.
              </h2>
            </div>

            <div className="space-y-3">
              {course.syllabus.map((s, i) => {
                const open = openSyllabusIdx === i;
                return (
                  <motion.div
                    key={s.title}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    className="rounded-2xl border border-border bg-card overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenSyllabusIdx(open ? null : i)}
                      className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="h-8 w-8 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="text-sm md:text-base font-semibold">{s.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {s.topics.length} topics
                        </span>
                      </div>
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
                      <ul className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        {s.topics.map((t) => (
                          <li key={t} className="flex items-start gap-2 text-muted-foreground">
                            <CheckCircle2
                              className="h-4 w-4 text-primary shrink-0 mt-0.5"
                              strokeWidth={2.2}
                            />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Exam pattern */}
      {course.examPattern.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto max-w-5xl px-6">
            <div className="mb-8">
              <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">
                Exam pattern
              </p>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
                Know what to expect on test day.
              </h2>
            </div>

            {/* Stage tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {course.examPattern.map((p, i) => (
                <button
                  key={p.stage}
                  onClick={() => setExamTab(i)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                    examTab === i
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                  }`}
                >
                  {p.stage}
                </button>
              ))}
            </div>

            {course.examPattern[examTab] && (
              <motion.div
                key={examTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-border bg-card overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/50 text-xs uppercase tracking-widest text-muted-foreground">
                      <tr>
                        <th className="text-left px-5 py-3 font-semibold">Section</th>
                        <th className="text-right px-5 py-3 font-semibold">Questions</th>
                        <th className="text-right px-5 py-3 font-semibold">Marks</th>
                        <th className="text-right px-5 py-3 font-semibold">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {course.examPattern[examTab].sections.map((sec) => (
                        <tr key={sec.name}>
                          <td className="px-5 py-3 font-medium">{sec.name}</td>
                          <td className="px-5 py-3 text-right tabular-nums">{sec.questions}</td>
                          <td className="px-5 py-3 text-right tabular-nums">{sec.marks}</td>
                          <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                            {sec.duration}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-secondary/30 font-semibold">
                      <tr>
                        <td className="px-5 py-3">Total</td>
                        <td className="px-5 py-3 text-right tabular-nums">
                          {course.examPattern[examTab].totalQuestions}
                        </td>
                        <td className="px-5 py-3 text-right tabular-nums">
                          {course.examPattern[examTab].totalMarks}
                        </td>
                        <td className="px-5 py-3" />
                      </tr>
                    </tfoot>
                  </table>
                </div>
                {course.examPattern[examTab].negativeMarking && (
                  <div className="px-5 py-3 text-xs text-muted-foreground border-t border-border bg-card">
                    <span className="font-semibold text-foreground">Negative marking:</span>{' '}
                    {course.examPattern[examTab].negativeMarking}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* Testimonials */}
      {course.testimonials.length > 0 && (
        <section className="py-12 md:py-16 bg-secondary/30">
          <div className="container mx-auto max-w-5xl px-6">
            <div className="mb-8">
              <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">
                What our students say
              </p>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
                Real selections, real stories.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {course.testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <Quote className="h-5 w-5 text-primary/40" strokeWidth={2} />
                  <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{t.name}</div>
                      <div className="text-xs text-primary font-medium">{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="rounded-3xl border border-border bg-gradient-to-br from-primary-soft/60 via-card to-card p-10 md:p-14 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Ready to start preparing?
            </h2>
            <p className="mt-3 max-w-xl mx-auto text-muted-foreground">
              Reserve your seat in the next batch, or book a 20-minute call with a counsellor first
              — whichever you prefer.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => openAuth('register')}
                className="group inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Reserve your seat
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 h-11 px-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Talk to a counsellor
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
