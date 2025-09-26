'use client';

import { ImageWithFallback } from '../common/ImageWithFallback';
import { Button } from '../ui/button';

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Enhanced Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/30 via-transparent to-red-800/20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>
      
      <div className="relative container mx-auto max-w-7xl px-4 lg:px-8 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-12 sm:pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-6rem)] sm:min-h-[calc(100vh-8rem)]">
          
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight animate-fade-in">
              Transform Your Future with 
              <span className="text-red-500 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent"> Effort Education</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0 animate-fade-in-delay leading-relaxed">
              Master Government Exams, Excel in School Studies, and Develop Leadership Skills. Join thousands of successful students who achieved their dreams with our proven teaching methods and comprehensive programs.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start animate-fade-in-delay-2">
              <Button
                onClick={() => scrollToSection('programs')}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-red-500 shadow-lg hover:shadow-red-500/25 w-full sm:w-auto"
              >
                Start Your Journey
              </Button>
              <Button
                onClick={() => scrollToSection('contact')}
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-white backdrop-blur-sm w-full sm:w-auto"
              >
                Get Free Consultation
              </Button>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1641683521844-700c456379bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwZWR1Y2F0aW9uJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc1NTYyMDAxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Students studying and learning"
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-600/30 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-red-800/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}