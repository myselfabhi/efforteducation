'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const MARKETING_PATHS = ['/', '/about', '/courses', '/young-scholar', '/contact'];

export default function ProgressBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const isMarketingPage = MARKETING_PATHS.some(p => pathname === p || pathname.startsWith('/courses/'));

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;

      setProgress(Math.min(progress, 100));
      setIsVisible(scrolled > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isMarketingPage) return null;

  return (
    <div
      className={`
        fixed top-16 left-0 right-0 z-50 h-1 bg-gray-200/50 backdrop-blur-sm
        transition-opacity duration-300
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      <div
        className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-600 progress-fill shadow-lg shadow-red-500/50"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
