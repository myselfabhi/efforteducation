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
