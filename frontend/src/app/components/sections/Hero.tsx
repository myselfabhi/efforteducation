'use client';

import { Button } from '../ui/button';

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden flex items-center justify-center">
      {/* Enhanced Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/30 via-transparent to-red-800/20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>
      
      <div className="relative container mx-auto max-w-6xl px-6 sm:px-8 lg:px-6 py-16 sm:py-20 md:py-24 text-center">
        <div className="inline-block px-5 py-2.5 bg-red-600/20 border border-red-500/30 rounded-full mb-6">
          <span className="text-red-400 text-sm sm:text-base font-semibold">Established Since 1990</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in px-4">
          <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Effort Education</span>
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed animate-fade-in-delay px-4">
          Empowering students with comprehensive learning solutions for competitive exams and life skills development.
        </p>

        <p className="text-gray-400 text-base sm:text-lg mb-10 animate-fade-in-delay">
          34+ Years of Excellence in Education
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2 px-4">
          <Button
            onClick={() => scrollToSection('programs-section')}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-red-500 shadow-lg hover:shadow-red-500/25 min-h-[52px] text-base sm:text-lg font-semibold"
          >
            View Our Programs
          </Button>
          <Button
            onClick={() => scrollToSection('contact')}
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-white backdrop-blur-sm min-h-[52px] text-base sm:text-lg font-semibold"
          >
            Get Free Consultation
          </Button>
        </div>
      </div>
    </section>
  );
}
