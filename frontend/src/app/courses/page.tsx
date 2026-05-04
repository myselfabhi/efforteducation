import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { CoursesCatalog } from '@/components/landing/CoursesCatalog';
import { StickyCTABar } from '@/components/landing/StickyCTABar';
import { AuthCTA } from '@/components/auth/AuthCTA';
import { ArrowRight, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'All courses',
  description:
    'Browse every course at Effort Education — Banking, SSC, Railway, CUET, Young Scholar Program and more.',
};

export default function CoursesIndex() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pb-24 md:pb-16">
        {/* Page hero */}
        <div className="pt-28 pb-10 bg-gradient-to-b from-primary-soft via-background to-background">
          <div className="container mx-auto max-w-6xl px-6">
            <p className="text-[11px] uppercase tracking-widest text-primary font-semibold mb-3">
              Course catalog
            </p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Find your path.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl">
              From competitive exams to skill development for young learners — pick what fits your goal.
            </p>
          </div>
        </div>

        {/* Catalog grid — no internal heading, no "see all" btn, no extra padding */}
        <CoursesCatalog showSectionHeader={false} showViewAllBtn={false} compact />

        {/* Bottom CTA */}
        <div className="container mx-auto max-w-6xl px-6 mt-4">
          <div className="rounded-2xl border border-border bg-card p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold">Not sure which course to pick?</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Talk to a counsellor — free, no-pressure guidance to match you with the right program.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Talk to counsellor
              </Link>
              <AuthCTA
                mode="register"
                className="inline-flex items-center gap-2 h-11 px-5 rounded-xl border border-border bg-background text-sm font-semibold hover:bg-secondary transition-colors"
              >
                Enroll free
                <ArrowRight className="h-4 w-4" />
              </AuthCTA>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <StickyCTABar />
    </div>
  );
}
