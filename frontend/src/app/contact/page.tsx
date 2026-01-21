import type { Metadata } from "next";
import { Suspense } from 'react';
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ContactHero from "./components/ContactHero";
import ContactForm from "../components/forms/ContactForm";
import ContactInfo from "./components/ContactInfo";
import CounsellingCTA from "./components/CounsellingCTA";
import ScrollReveal from "../components/mobile/ScrollReveal";

export const metadata: Metadata = {
  title: "Contact Us - Get Free Consultation & Enrollment",
  description: "Contact Effort Education for free consultation, enrollment, or demo classes. Call 9910335093 or fill the form. Expert guidance for competitive exams and Young Scholar Program.",
  openGraph: {
    title: "Contact Effort Education - Get Free Consultation",
    description: "Reach out for free consultation, enrollment, or demo classes. Expert guidance in competitive exams and skill development.",
    url: "https://efforteducation.vercel.app/contact"
  }
};

export default async function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ContactHero />
        
        {/* Mobile-optimized: Responsive padding, gap, bottom nav spacing */}
        <div className="py-12 sm:py-16 lg:py-20 bg-white pb-24 sm:pb-28 md:pb-16">
          <div className="container mx-auto max-w-6xl px-6 sm:px-8 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-start">
              
              {/* Contact Form - Stagger animation */}
              <ScrollReveal direction="up" delay={0}>
                <div className="h-full">
                  <Suspense fallback={
                    <div className="flex items-center justify-center py-12">
                      <div className="skeleton h-96 w-full rounded-xl"></div>
                    </div>
                  }>
                    <ContactForm />
                  </Suspense>
                </div>
              </ScrollReveal>
              
              {/* Info Cards - Stagger animation */}
              <div className="flex flex-col gap-6 sm:gap-8 h-full">
                <ScrollReveal direction="up" delay={100}>
                  <ContactInfo />
                </ScrollReveal>
                
                <ScrollReveal direction="up" delay={200}>
                  <CounsellingCTA />
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
