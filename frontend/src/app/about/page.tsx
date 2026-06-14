import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { StickyCTABar } from '@/components/landing/StickyCTABar';
import { ArrowRight, Compass } from 'lucide-react';
import { AboutMotionSections } from './components/AboutMotionSections';

export const metadata: Metadata = {
  title: 'About Us — Our Story & Team',
  description:
    'Effort Education has guided 50,000+ students since 1991. Read our story, mission, and the people behind the platform.',
  openGraph: {
    title: 'About Effort Education',
    description:
      '34+ years of teaching. 50,000+ students. The same focused mission — help serious aspirants crack their exam.',
    url: 'https://efforteducation.vercel.app/about',
  },
};

const STATS = [
  { value: '50K+', label: 'students taught' },
  { value: '95%', label: 'avg. selection rate' },
  { value: '34', label: 'years of teaching' },
  { value: '4.9', label: 'avg. rating' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pb-24 sm:pb-28 md:pb-16">
        {/* Hero */}
        <section className="relative isolate overflow-hidden">
          <div aria-hidden className="absolute inset-0 -z-10">
            <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-primary-soft/60 via-background/0 to-background" />
            <div className="absolute top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-primary/15 blur-[120px]" />
          </div>

          <div className="container mx-auto max-w-5xl px-6 pt-32 md:pt-36 pb-12 md:pb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card/80 backdrop-blur border border-border/60 text-xs text-muted-foreground">
              <Compass className="h-3.5 w-3.5 text-primary" />
              About Effort Education
            </div>
            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05]">
              Coaching that{' '}
              <span className="bg-gradient-to-br from-primary via-primary-strong to-primary bg-clip-text text-transparent">
                stays with you
              </span>{' '}
              long after the lecture ends.
            </h1>
            <p className="mt-6 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
              For 34 years, we&rsquo;ve helped serious aspirants crack their exam — Banking, SSC,
              CUET, NET, and more. Same mission. New platform. Built for how today&rsquo;s students
              actually study.
            </p>

            {/* Stats strip */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 max-w-2xl gap-x-6 gap-y-2 border-t border-border/60 pt-6">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl md:text-3xl font-bold tracking-tight">{s.value}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <AboutMotionSections />

        {/* CTA */}
        <section className="py-20">
          <div className="container mx-auto max-w-4xl px-6">
            <div className="rounded-3xl border border-border bg-gradient-to-br from-primary-soft/60 via-card to-card p-10 md:p-14 text-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Talk to a counsellor — free.
              </h2>
              <p className="mt-3 max-w-xl mx-auto text-muted-foreground">
                Not sure which program fits you? A 20-minute call with a senior counsellor will
                clarify your options.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Book a counselling call
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-1.5 h-11 px-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Browse all courses
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

