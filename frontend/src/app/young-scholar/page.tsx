import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { StickyCTABar } from '@/components/landing/StickyCTABar';
import { ArrowRight } from 'lucide-react';
import { AuthCTA } from '@/components/auth/AuthCTA';
import { YoungScholarMotion } from './components/YoungScholarMotion';

export const metadata: Metadata = {
  title: 'Young Scholar Program — Weekend Skill-Building for Class 4–8',
  description:
    'Public speaking, reasoning, olympiad prep, and current affairs — a focused weekend program for young learners aged 8–14. Just ₹999/month.',
  openGraph: {
    title: 'Young Scholar Program — Effort Education',
    description:
      'Weekend program for Class 4–8. Live online sessions, twice a week. Just ₹999/month.',
    url: 'https://efforteducation.vercel.app/young-scholar',
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
                Try the first class — free.
              </h2>
              <p className="mt-3 max-w-xl mx-auto text-muted-foreground">
                Pick a weekend slot. We&rsquo;ll send the join link to your email.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <AuthCTA
                  mode="register"
                  className="group inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Book a free demo
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </AuthCTA>
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
      </main>
      <Footer />
      <StickyCTABar />
    </div>
  );
}
