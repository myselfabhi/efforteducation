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
    <section className="relative min-h-[60vh] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden flex items-center justify-center py-16 sm:py-20 md:py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-transparent to-red-800/10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>
      
      <div className="relative container mx-auto max-w-6xl px-6 sm:px-8 lg:px-6 text-center z-10">
        <div className="inline-block px-5 py-2.5 bg-gradient-to-r from-red-600/20 to-red-700/20 border border-red-500/40 rounded-full mb-6 backdrop-blur-sm shadow-lg shadow-red-500/20">
          <span className="text-red-300 text-sm sm:text-base font-semibold tracking-wide">Hero Product</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 px-4">
          Young Scholar <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Program</span>
        </h1>
        
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-400/30 rounded-lg mb-6 backdrop-blur-sm shadow-md shadow-red-500/10">
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span className="text-white text-base sm:text-lg font-semibold">For Class 4-8 Students</span>
        </div>
        
        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed px-4">
          Weekend skill-building program to develop essential skills for future success. Invest a few hours on weekends to learn new skills!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
          <Button
            onClick={scrollToContact}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-base sm:text-lg font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-red-500 shadow-lg hover:shadow-red-500/25 min-h-[52px]"
          >
            Contact for Enrollment
          </Button>
          <Link href="/programs">
            <Button
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 text-base sm:text-lg font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-white backdrop-blur-sm min-h-[52px] w-full sm:w-auto"
            >
              View All Programs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
