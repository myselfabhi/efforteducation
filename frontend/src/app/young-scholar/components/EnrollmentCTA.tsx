'use client';

import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function EnrollmentCTA() {
  const scrollToContact = () => {
    // Pre-fill contact form with Young Scholar Program interest
    window.location.href = '/contact?interest=young-scholar';
  };

  return (
    <section id="enrollment-cta" className="py-16 sm:py-20 bg-gradient-to-br from-red-600 via-red-700 to-red-800">
      <div className="container mx-auto max-w-4xl px-4 lg:px-6">
        <Card className="border-0 shadow-2xl bg-white overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-red-500 via-red-600 to-red-700"></div>
          <CardContent className="p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
                Join the Young Scholar Program today and give your child the skills they need for future success. 
                Contact us now for enrollment or to schedule a free demo class.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
                  <a href="tel:9910335093" className="text-red-600 hover:text-red-700 text-sm">
                    9910335093
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Contact Form</h3>
                  <button
                    onClick={scrollToContact}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Fill out the form →
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={scrollToContact}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Contact for Enrollment
              </Button>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Schedule Demo Class
                </Button>
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Program Fee:</span> ₹999 | 
                <span className="font-semibold ml-2">Schedule:</span> Weekend Classes | 
                <span className="font-semibold ml-2">Mode:</span> Online (Live Classes)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
