'use client';

import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';

export default function EnrollmentCTA() {
  const scrollToContact = () => {
    // Pre-fill contact form with Young Scholar Program interest
    window.location.href = '/contact?interest=young-scholar';
  };

  return (
    <section id="enrollment-cta" className="py-16 sm:py-20 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto max-w-4xl px-4 lg:px-6">
        <Card className="border border-gray-200 shadow-2xl bg-white overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-red-700"></div>
          <CardContent className="p-8 md:p-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
                Join the Young Scholar Program today and give your child the skills they need for future success.
              </p>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={scrollToContact}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-10 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-red-500/30 min-h-[56px] text-lg"
              >
                Enroll Now
              </Button>
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
