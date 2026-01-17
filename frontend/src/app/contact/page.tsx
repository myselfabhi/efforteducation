
'use client';

import { Suspense } from 'react';
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ContactHero from "./components/ContactHero";
import ContactForm from "../components/forms/ContactForm";
import ContactInfo from "./components/ContactInfo";
import CounsellingCTA from "./components/CounsellingCTA";

export default function ContactPage() {
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
