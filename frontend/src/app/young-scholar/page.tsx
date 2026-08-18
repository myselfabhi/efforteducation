import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { StickyCTABar } from '@/components/landing/StickyCTABar';
import { ArrowRight } from 'lucide-react';
import { YoungScholarMotion } from './components/YoungScholarMotion';

export const metadata: Metadata = {
  title: 'Young Scholar — Confident, Self-Driven Kids · Class 4–8',
  description:
    'Live classes, quizzes kids beg to win, and a weekly report they write themselves. Young Scholar turns Class 4–8 kids into confident, self-driven learners. Book a call to join the next batch.',
  openGraph: {
    title: 'Young Scholar — Effort Education',
    description:
      'Where curious Class 4–8 kids become confident, self-driven scholars. Live online, small batches. Book a call to join the next batch.',
    url: 'https://efforteducation.in/young-scholar',
  },
};

export default function YoungScholarPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pb-24 sm:pb-28 md:pb-16">
        <YoungScholarMotion />

        {/* Final CTA */}
        <section className="py-20">
          <div className="container mx-auto max-w-4xl px-6">
            <div className="rounded-3xl border border-border bg-gradient-to-br from-primary-soft/60 via-card to-card p-10 md:p-14 text-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Join the next batch.
              </h2>
              <p className="mt-3 max-w-xl mx-auto text-muted-foreground">
                Book a call with a counsellor &mdash; we&rsquo;ll walk you through the weekly rhythm, the schedule, and how to get your child started.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Book a call
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center gap-1.5 h-11 px-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  See how a week works
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <StickyCTABar />
    </div>
  );
}
