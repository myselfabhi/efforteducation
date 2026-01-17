'use client';

import { Button } from '@/app/components/ui/button';
import Link from 'next/link';

export default function YoungScholarHero() {
  const scrollToContact = () => {
    const element = document.getElementById('enrollment-cta');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[60vh] bg-gradient-to-br from-red-600 via-red-700 to-red-800 overflow-hidden flex items-center justify-center py-16 sm:py-20 md:py-24">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      
      <div className="relative container mx-auto max-w-6xl px-4 lg:px-6 text-center z-10">
        <div className="inline-block px-4 py-2 bg-white/20 border border-white/30 rounded-full mb-6">
          <span className="text-white text-sm font-semibold">Hero Product</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
          Young Scholar Program
        </h1>
        
        <div className="inline-block px-4 py-2 bg-white/20 rounded-lg mb-6">
          <span className="text-white text-base sm:text-lg font-medium">For Class 4-8 Students</span>
        </div>
        
        <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
          Weekend skill-building program to develop essential skills for future success. Invest a few hours on weekends to learn new skills!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={scrollToContact}
            className="bg-white text-red-700 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-base sm:text-lg"
          >
            Contact for Enrollment
          </Button>
          <Link href="/programs">
            <Button
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-red-700 font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm text-base sm:text-lg"
            >
              View All Programs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
