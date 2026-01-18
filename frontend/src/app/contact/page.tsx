import type { Metadata } from "next";
import { Suspense } from 'react';
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ContactHero from "./components/ContactHero";
import ContactForm from "../components/forms/ContactForm";
import ContactInfo from "./components/ContactInfo";
import CounsellingCTA from "./components/CounsellingCTA";

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
        <div className="py-16 bg-white">
          <div className="container mx-auto max-w-6xl px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <Suspense fallback={<div>Loading form...</div>}>
                <ContactForm />
              </Suspense>
              <div className="space-y-8">
                <ContactInfo />
                <CounsellingCTA />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
