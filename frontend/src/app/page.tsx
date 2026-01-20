import { Suspense } from 'react';
import Header from "./components/layout/Header";
import Hero from "./components/sections/Hero";
import ProgramsScrollable from "./components/sections/ProgramsScrollable";
import Testimonials from "./components/sections/Testimonials";
import ContactForm from "./components/forms/ContactForm";
import Footer from "./components/layout/Footer";
import ScrollReveal from "./components/mobile/ScrollReveal";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        
        <ScrollReveal>
          <ProgramsScrollable />
        </ScrollReveal>
        
        <ScrollReveal delay={100}>
          <Testimonials />
        </ScrollReveal>
        
        <ScrollReveal delay={200}>
          <section id="contact" className="py-16 bg-gradient-to-b from-white via-gray-50 to-white">
            <div className="container mx-auto max-w-5xl px-4 lg:px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 px-4">
                  Start Your <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">Success Journey</span>
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed px-4">
                  Ready to achieve your dreams? Get a free consultation and personalized study plan.
                </p>
              </div>
              <div className="max-w-3xl mx-auto">
                <Suspense fallback={<div className="text-center py-8">Loading contact form...</div>}>
                  <ContactForm />
                </Suspense>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </main>
      <Footer />
    </div>
  );
}
