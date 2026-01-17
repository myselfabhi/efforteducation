'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';

// Young Scholar Program Card
function YoungScholarCard() {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex-shrink-0 w-[90vw] md:w-[80vw] lg:w-[600px] h-[500px] md:h-[550px] rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-red-800 p-8 md:p-10 flex flex-col justify-between relative overflow-hidden shadow-2xl">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="inline-block px-4 py-2 bg-white/20 border border-white/30 rounded-full mb-4">
          <span className="text-white text-sm font-semibold">Hero Product</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
          Young Scholar Program
        </h2>
        
        <div className="inline-block px-3 py-1 bg-white/20 rounded-md mb-4">
          <span className="text-white text-sm font-medium">For Class 4-8 Students</span>
        </div>
        
        <p className="text-white/90 text-base md:text-lg mb-6 leading-relaxed">
          Weekend skill-building program to develop essential skills for future success. Learn Current Affairs, Public Speaking, Reasoning, and more!
        </p>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-white font-bold text-lg">₹999</div>
            <div className="text-white/80 text-xs">Affordable</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-white font-bold text-lg">Weekend</div>
            <div className="text-white/80 text-xs">Flexible</div>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 flex gap-3">
        <Link href="/young-scholar" className="flex-1">
          <Button className="w-full bg-white text-red-700 hover:bg-gray-100 font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
            Learn More
          </Button>
        </Link>
        <Button
          onClick={scrollToContact}
          variant="outline"
          className="flex-1 border-2 border-white text-white hover:bg-white hover:text-red-700 font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
        >
          Enroll Now
        </Button>
      </div>
    </div>
  );
}

// Competitive Exams Card
function CompetitiveExamsCard() {
  return (
    <div className="flex-shrink-0 w-[90vw] md:w-[80vw] lg:w-[600px] h-[500px] md:h-[550px] rounded-2xl bg-white p-8 md:p-10 flex flex-col justify-between border-2 border-gray-200 shadow-xl relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-red-50 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="inline-block px-4 py-2 bg-red-100 border border-red-200 rounded-full mb-4">
          <span className="text-red-700 text-sm font-semibold">Competitive Exams</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Government Exam Coaching
        </h2>
        
        <p className="text-gray-700 text-base md:text-lg mb-6 leading-relaxed">
          Comprehensive preparation for Banking, SSC, Railway, Police, and other competitive examinations.
        </p>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-gray-700">
            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
            <span className="text-sm">Banking Coaching (IBPS PO, SBI PO)</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
            <span className="text-sm">SSC Coaching (SSC CGL, SSC CHSL)</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
            <span className="text-sm">Railway, Police, UPPSC, NET, PCS</span>
          </div>
        </div>
        
        <div className="inline-block px-3 py-1 bg-gray-100 rounded-md">
          <span className="text-gray-700 text-sm font-medium">Online (Live Classes)</span>
        </div>
      </div>
      
      <div className="relative z-10">
        <Link href="/courses" className="block">
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
            Explore Courses
          </Button>
        </Link>
      </div>
    </div>
  );
}

// Skill Development & Communication Card
function SkillDevelopmentCard() {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex-shrink-0 w-[90vw] md:w-[80vw] lg:w-[600px] h-[500px] md:h-[550px] rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-8 md:p-10 flex flex-col justify-between relative overflow-hidden shadow-2xl">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="inline-block px-4 py-2 bg-white/20 border border-white/30 rounded-full mb-4">
          <span className="text-white text-sm font-semibold">Skill Development</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
          Communication & Leadership
        </h2>
        
        <p className="text-white/90 text-base md:text-lg mb-6 leading-relaxed">
          Build essential life skills including public speaking, leadership qualities, and effective communication for personal and professional success.
        </p>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-white/90">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span className="text-sm">Public Speaking Excellence</span>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span className="text-sm">Leadership Development Program</span>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span className="text-sm">Effective Communication Skills</span>
          </div>
        </div>
        
        <div className="inline-block px-3 py-1 bg-white/20 rounded-md">
          <span className="text-white text-sm font-medium">Online (Live Classes)</span>
        </div>
      </div>
      
      <div className="relative z-10 flex gap-3">
        <Link href="/programs" className="flex-1">
          <Button className="w-full bg-white text-purple-700 hover:bg-gray-100 font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
            View Programs
          </Button>
        </Link>
        <Button
          onClick={scrollToContact}
          variant="outline"
          className="flex-1 border-2 border-white text-white hover:bg-white hover:text-purple-700 font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
        >
          Learn More
        </Button>
      </div>
    </div>
  );
}

export default function ProgramsScrollable() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalCards = 3;

  const checkScrollability = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    
    // Update current index based on scroll position
    // Cards are: 0=Competitive Exams, 1=Young Scholar (center), 2=Skill Development
    const containerWidth = scrollContainerRef.current.clientWidth;
    const cardWidth = containerWidth; // Each card takes full viewport width
    const padding = 16; // w-4 = 16px
    const gap = 24; // gap-6 = 24px
    
    // Calculate which card is most visible based on scroll position
    // Account for padding and gaps
    const adjustedScroll = scrollLeft + padding;
    const cardPosition = adjustedScroll / (cardWidth + gap);
    const newIndex = Math.round(cardPosition);
    setCurrentIndex(Math.min(Math.max(0, newIndex), totalCards - 1));
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const centerOnYoungScholar = () => {
      const containerWidth = container.clientWidth;
      // Get actual card width from computed style
      const firstCard = container.querySelector('[class*="rounded-2xl"]') as HTMLElement;
      if (!firstCard) return;
      
      const cardWidth = firstCard.offsetWidth;
      const gap = 24; // gap-6
      
      // Left padding width is (containerWidth - cardWidth) / 2 to show half of first card
      const leftPadding = (containerWidth - cardWidth) / 2;
      
      // Calculate scroll position to center Young Scholar card
      // Position = leftPadding + Competitive card + gap - (containerWidth/2) + (cardWidth/2)
      const centerPosition = leftPadding + cardWidth + gap - (containerWidth / 2) + (cardWidth / 2);
      
      container.scrollLeft = Math.max(0, centerPosition);
      checkScrollability();
    };

    // Wait for layout to complete
    setTimeout(centerOnYoungScholar, 150);

    checkScrollability();
    container.addEventListener('scroll', checkScrollability);
    
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(centerOnYoungScholar, 150);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    const containerWidth = scrollContainerRef.current.clientWidth;
    scrollContainerRef.current.scrollBy({
      left: -containerWidth,
      behavior: 'smooth'
    });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    const containerWidth = scrollContainerRef.current.clientWidth;
    scrollContainerRef.current.scrollBy({
      left: containerWidth,
      behavior: 'smooth'
    });
  };

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;
    const containerWidth = scrollContainerRef.current.clientWidth;
    const cardWidth = containerWidth;
    const gap = 24; // gap-6 = 24px
    const padding = 16; // w-4 = 16px
    
    // Card order: 0=Competitive, 1=Young Scholar (center), 2=Skill Development
    // Calculate scroll position for the card at given index
    const scrollPosition = padding + index * (cardWidth + gap);
    scrollContainerRef.current.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  };

  // Touch/swipe handling
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && canScrollRight) {
      scrollRight();
    }
    if (isRightSwipe && canScrollLeft) {
      scrollLeft();
    }
  };

  return (
    <section id="programs-section" className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 sm:py-20 flex items-center">
      <div className="container mx-auto max-w-7xl px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">Programs</span>
          </h2>
          <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto">
            Choose from our comprehensive range of programs designed to meet diverse learning needs.
          </p>
        </div>

        {/* Navigation Arrows - Desktop only */}
        <div className="hidden md:flex items-center justify-between absolute top-1/2 -translate-y-1/2 left-0 right-0 z-20 pointer-events-none px-4">
          {canScrollLeft && (
            <Button
              onClick={scrollLeft}
              variant="ghost"
              size="icon"
              className="bg-gray-900/80 hover:bg-gray-900 text-white border border-gray-700 rounded-full w-12 h-12 pointer-events-auto backdrop-blur-sm shadow-lg"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          )}
          {canScrollRight && (
            <Button
              onClick={scrollRight}
              variant="ghost"
              size="icon"
              className="bg-gray-900/80 hover:bg-gray-900 text-white border border-gray-700 rounded-full w-12 h-12 pointer-events-auto backdrop-blur-sm shadow-lg ml-auto"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          )}
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            scrollSnapType: 'x mandatory',
          }}
        >
          {/* Left padding - half card width to center the first card when scrolled */}
          <div className="flex-shrink-0 w-[calc(50vw-300px)] md:w-[calc(40vw-300px)] lg:w-[calc(50%-300px)]"></div>
          <CompetitiveExamsCard />
          <div className="flex-shrink-0 w-6"></div>
          <YoungScholarCard />
          <div className="flex-shrink-0 w-6"></div>
          <SkillDevelopmentCard />
          {/* Right padding - half card width to allow centering the last card */}
          <div className="flex-shrink-0 w-[calc(50vw-300px)] md:w-[calc(40vw-300px)] lg:w-[calc(50%-300px)]"></div>
        </div>

        {/* Navigation Dots - Desktop only */}
        <div className="hidden md:flex justify-center gap-2 mt-8">
          {['Competitive Exams', 'Young Scholar', 'Skill Development'].map((label, index) => (
            <button
              key={index}
              onClick={() => {
                // Map dot index to card position: 0=Competitive, 1=Young Scholar (center), 2=Skill
                const cardPositions = [0, 1, 2]; // Competitive, Young Scholar, Skill Development
                scrollToIndex(cardPositions[index]);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? 'bg-red-600 w-8'
                  : 'bg-gray-300 hover:bg-gray-400 w-2'
              }`}
              aria-label={`Go to ${label}`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
