'use client';

import { useState } from 'react';
import { GraduationCap, Target, Scale, Trophy, Clock, Users, Award, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';

export default function ProgramFeatures() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const features = [
    {
      icon: GraduationCap,
      title: "Expert Faculty",
      description: "Learn from qualified instructors with years of teaching experience and deep subject matter expertise."
    },
    {
      icon: Target,
      title: "Goal-Oriented Learning",
      description: "Structured curriculum designed to help you achieve specific academic and career objectives."
    },
    {
      icon: Scale,
      title: "Balanced Approach",
      description: "Perfect blend of theoretical knowledge and practical application for comprehensive learning."
    },
    {
      icon: Trophy,
      title: "Proven Results",
      description: "Consistent success with students achieving their goals and excelling in their chosen fields."
    },
    {
      icon: Clock,
      title: "Flexible Schedules",
      description: "Multiple batch timings with flexible online live class schedules to fit your busy lifestyle."
    },
    {
      icon: Users,
      title: "Small Batch Sizes",
      description: "Personalized attention with limited students per batch for better learning outcomes."
    },
    {
      icon: Award,
      title: "Certification",
      description: "Recognized certificates upon completion to enhance your academic and professional profile."
    },
    {
      icon: BookOpen,
      title: "Study Materials",
      description: "Comprehensive study materials, practice tests, and digital resources included."
    }
  ];

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < features.length - 1) {
      nextCard();
    }
    if (isRightSwipe && currentIndex > 0) {
      prevCard();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const nextCard = () => {
    if (currentIndex < features.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(prev => prev + 1);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(prev => prev - 1);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };


  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto max-w-6xl px-6 sm:px-8 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
            Why Choose <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">Us</span>?
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed px-4">
            Our programs are designed with student success in mind, featuring modern teaching methods and comprehensive support.
          </p>
        </div>

        {/* 
          Mobile: Swipe carousel (one card at a time)
          Desktop: Continuous auto-scroll animation
        */}
        
        {/* Mobile View: Swipe Carousel (< lg) */}
        <div className="lg:hidden">
          {/* Carousel Container */}
          <div className="relative max-w-sm mx-auto">
            
            {/* Cards Stack */}
            <div 
              className="relative overflow-hidden touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div 
                className="flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {features.map((feature, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-2">
                    <Card 
                      className="border-2 border-gray-200 shadow-lg bg-white h-full"
                    >
                      <CardContent className="p-6 text-center flex flex-col items-center">
                        {/* Icon */}
                        <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-4 shadow-md">
                          <feature.icon className="w-8 h-8 text-red-600" />
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {feature.title}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-gray-700 leading-snug text-sm">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows - Minimal red arrows, no background */}
            <button
              onClick={prevCard}
              disabled={currentIndex === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 disabled:opacity-20 disabled:cursor-not-allowed hover:scale-125 transition-all duration-200 active:scale-95 z-10"
              aria-label="Previous card"
            >
              <ChevronLeft className="w-10 h-10 text-red-600" strokeWidth={3} />
            </button>

            <button
              onClick={nextCard}
              disabled={currentIndex === features.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 disabled:opacity-20 disabled:cursor-not-allowed hover:scale-125 transition-all duration-200 active:scale-95 z-10"
              aria-label="Next card"
            >
              <ChevronRight className="w-10 h-10 text-red-600" strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Desktop View: Continuous Auto-Scroll (≥ lg) */}
        <div className="hidden lg:block overflow-hidden">
          <div className="flex animate-scroll-right-to-left">
            {/* First set of features */}
            {features.map((feature, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white transform hover:-translate-y-1 hover:border-red-200 w-96 flex-shrink-0 mx-2">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <feature.icon className="w-10 h-10 text-red-600" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-700 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
            {/* Duplicate set for infinite scroll */}
            {features.map((feature, index) => (
              <Card key={`duplicate-${index}`} className="border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white transform hover:-translate-y-1 hover:border-red-200 w-96 flex-shrink-0 mx-2">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <feature.icon className="w-10 h-10 text-red-600" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-700 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
