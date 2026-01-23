'use client';

import { useState, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SwipeCarouselProps {
  items: ReactNode[];
  className?: string;
}

export default function SwipeCarousel({ items, className = '' }: SwipeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

    if (isLeftSwipe && currentIndex < items.length - 1) {
      nextCard();
    }
    if (isRightSwipe && currentIndex > 0) {
      prevCard();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const nextCard = () => {
    if (currentIndex < items.length - 1 && !isTransitioning) {
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
    <div className={`relative ${className}`}>
      {/* Carousel Container */}
      <div 
        className="relative overflow-hidden touch-pan-y max-w-sm mx-auto"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div key={index} className="w-full flex-shrink-0 px-2">
              {item}
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
        disabled={currentIndex === items.length - 1}
        className="absolute right-2 top-1/2 -translate-y-1/2 disabled:opacity-20 disabled:cursor-not-allowed hover:scale-125 transition-all duration-200 active:scale-95 z-10"
        aria-label="Next card"
      >
        <ChevronRight className="w-10 h-10 text-red-600" strokeWidth={3} />
      </button>

    </div>
  );
}
