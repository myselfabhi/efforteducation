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
      
      <div className="relative container mx-auto max-w-6xl px-4 lg:px-6 py-16 sm:py-20 md:py-24 text-center">
        <div className="inline-block px-4 py-2 bg-red-600/20 border border-red-500/30 rounded-full mb-6">
          <span className="text-red-400 text-sm font-semibold">Established Since 2000</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight animate-fade-in">
          <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Effort Education</span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed animate-fade-in-delay">
          Empowering students with comprehensive learning solutions for competitive exams and life skills development.
        </p>

        <p className="text-gray-400 text-sm mb-8 animate-fade-in-delay">
          23+ Years of Excellence in Education
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-delay-2">
          <Button
            onClick={() => scrollToSection('programs-section')}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-red-500 shadow-lg hover:shadow-red-500/25"
          >
            View Our Programs
          </Button>
          <Button
            onClick={() => scrollToSection('contact')}
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-white backdrop-blur-sm"
          >
            Get Free Consultation
          </Button>
        </div>
      </div>
    </section>
  );
}
