import Header from "./components/layout/Header";
import Hero from "./components/sections/Hero";
import CourseGrid from "./components/sections/CourseGrid";
import YoungScholarBanner from "./components/sections/YoungScholarBanner";
import Testimonials from "./components/sections/Testimonials";
import WannaConnect from "./components/sections/WannaConnect";
import Footer from "./components/layout/Footer";
import ScrollReveal from "./components/mobile/ScrollReveal";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 pb-24 sm:pb-28 md:pb-16">
        <Hero />
        
        <ScrollReveal>
          <CourseGrid />
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <YoungScholarBanner />
        </ScrollReveal>
        
        <ScrollReveal delay={200}>
          <Testimonials />
        </ScrollReveal>
        
        <ScrollReveal delay={300}>
          <WannaConnect />
        </ScrollReveal>
      </main>
      <Footer />
    </div>
  );
}
