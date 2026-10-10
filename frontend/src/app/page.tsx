import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Testimonials from './components/sections/Testimonials';
import YoungScholarBanner from './components/sections/YoungScholarBanner';
import { HeroV2 } from '@/components/landing/HeroV2';
import { StatsStrip } from '@/components/landing/StatsStrip';
import { ProductPreviewScroll } from '@/components/landing/ProductPreviewScroll';
import { TryQuizDemo } from '@/components/landing/TryQuizDemo';
import { CoursesCatalog } from '@/components/landing/CoursesCatalog';
import { FacultySpotlight } from '@/components/landing/FacultySpotlight';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { StickyCTABar } from '@/components/landing/StickyCTABar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Effort Education — Live Online Coaching for Competitive Exams & Young Scholars' },
  description:
    'Live classes, real-time quizzes, and batch notes for Bank PO, SSC, CUET, UGC NET and more — plus the Young Scholar program for kids. Precision coaching since 1991.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Effort Education — Live Online Coaching',
    description:
      'Live classes, real-time quizzes, and the Young Scholar program for kids. Coaching since 1991.',
    url: 'https://efforteducation.in',
  },
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pb-24 sm:pb-28 md:pb-16">
        <HeroV2 />
        <StatsStrip />
        <ProductPreviewScroll />
        <TryQuizDemo />
        <CoursesCatalog featured showFilters={false} showViewAllBtn={false} />
        <YoungScholarBanner />
        <FacultySpotlight />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
      <StickyCTABar />
    </div>
  );
}
