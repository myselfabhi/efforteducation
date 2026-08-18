import type { Metadata } from 'next';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { StickyCTABar } from '@/components/landing/StickyCTABar';
import { ContactMotion } from './components/ContactMotion';

export const metadata: Metadata = {
  title: 'Contact — Free Counselling & Enrollment',
  description:
    'Talk to a senior counsellor. Phone, WhatsApp, email — pick what works. Reply within 30 minutes during working hours.',
  openGraph: {
    title: 'Contact Effort Education',
    description:
      'Phone, WhatsApp, email — talk to a senior counsellor. Reply within 30 minutes.',
    url: 'https://efforteducation.in/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pb-24 sm:pb-28 md:pb-16">
        <ContactMotion />
      </main>
      <Footer />
      <StickyCTABar />
    </div>
  );
}
