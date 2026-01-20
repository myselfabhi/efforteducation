'use client';

import { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import Link from 'next/link';

interface FABProps {
  href?: string;
  label?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export default function FloatingActionButton({ 
  href = '/contact',
  label = 'Enroll Now',
  icon,
  onClick 
}: FABProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show FAB after scrolling down 200px
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const defaultIcon = <Phone className="w-6 h-6" />;

  return (
    <>
      {/* Mobile FAB */}
      <div
        className={`
          md:hidden fixed right-4 z-40 transition-all duration-500 ease-out
          ${isVisible ? 'bottom-24 opacity-100 scale-100' : 'bottom-10 opacity-0 scale-75 pointer-events-none'}
        `}
      >
        <Link
          href={href}
          onClick={handleClick}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          className={`
            flex items-center gap-3 px-5 py-4 rounded-full
            bg-gradient-to-r from-red-600 to-red-700
            hover:from-red-700 hover:to-red-800
            text-white font-semibold shadow-2xl
            transition-all duration-300
            btn-press fab-pulse
            ${isExpanded ? 'pr-6' : 'pr-5'}
          `}
        >
          {/* Icon */}
          <div className="relative">
            {icon || defaultIcon}
            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
          </div>

          {/* Label */}
          <span 
            className={`
              whitespace-nowrap overflow-hidden transition-all duration-300
              ${isExpanded ? 'max-w-[120px] opacity-100' : 'max-w-0 opacity-0'}
            `}
          >
            {label}
          </span>
        </Link>
      </div>

      {/* Desktop FAB (smaller, bottom-right corner) */}
      <div
        className={`
          hidden md:block fixed right-8 z-40 transition-all duration-500 ease-out
          ${isVisible ? 'bottom-8 opacity-100 scale-100' : 'bottom-0 opacity-0 scale-75 pointer-events-none'}
        `}
      >
        <Link
          href={href}
          onClick={handleClick}
          className="
            group flex items-center gap-3 px-6 py-4 rounded-full
            bg-gradient-to-r from-red-600 to-red-700
            hover:from-red-700 hover:to-red-800
            text-white font-semibold shadow-2xl
            transition-all duration-300 btn-press
            hover:shadow-red-500/50 hover:scale-105
          "
        >
          <div className="relative">
            {icon || defaultIcon}
          </div>
          <span className="text-base">{label}</span>
          
          {/* Hover glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400/0 via-red-400/30 to-red-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Link>
      </div>
    </>
  );
}
