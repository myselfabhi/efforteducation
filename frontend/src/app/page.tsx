import Header from "./components/layout/Header";
import Hero from "./components/sections/Hero";
import ProgramsScrollable from "./components/sections/ProgramsScrollable";
import Testimonials from "./components/sections/Testimonials";
import WannaConnect from "./components/sections/WannaConnect";
import Footer from "./components/layout/Footer";
import ScrollReveal from "./components/mobile/ScrollReveal";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-24 sm:pb-28 md:pb-16">
        <Hero />
        
        <ScrollReveal>
          <ProgramsScrollable />
        </ScrollReveal>
        
        <ScrollReveal delay={100}>
          <Testimonials />
        </ScrollReveal>
        
        <ScrollReveal delay={200}>
          <WannaConnect />
        </ScrollReveal>
      </main>
      <Footer />
    </div>
  );
}
