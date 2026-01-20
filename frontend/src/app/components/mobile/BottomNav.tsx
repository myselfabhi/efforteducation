'use client';

import { Home, BookOpen, User, Phone, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BottomNav() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Auto-hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/programs', icon: BookOpen, label: 'Programs' },
    { href: '/young-scholar', icon: GraduationCap, label: 'Scholar' },
    { href: '/about', icon: User, label: 'About' },
    { href: '/contact', icon: Phone, label: 'Contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Bottom Navigation - Only visible on mobile */}
      <nav
        className={`md:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Glassmorphism Background */}
        <div className="glass bg-white/80 backdrop-blur-xl border-t border-gray-200 shadow-2xl">
          <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl
                    min-w-[64px] min-h-[56px] relative overflow-hidden
                    transition-all duration-300 btn-press
                    ${active 
                      ? 'text-red-600' 
                      : 'text-gray-600 hover:text-gray-900 active:text-red-600'
                    }
                  `}
                >
                  {/* Active Indicator Background */}
                  {active && (
                    <div className="absolute inset-0 bg-red-50 rounded-xl scale-100 transition-transform duration-300" />
                  )}

                  {/* Icon with pulse effect when active */}
                  <div className={`relative ${active ? 'animate-scale-in' : ''}`}>
                    <Icon 
                      className={`w-6 h-6 transition-all duration-300 ${
                        active ? 'scale-110' : 'scale-100'
                      }`}
                      strokeWidth={active ? 2.5 : 2}
                    />
                    
                    {/* Active dot indicator */}
                    {active && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full animate-scale-in" />
                    )}
                  </div>

                  {/* Label */}
                  <span 
                    className={`
                      text-xs font-medium transition-all duration-300 relative
                      ${active ? 'font-semibold' : 'font-normal'}
                    `}
                  >
                    {item.label}
                  </span>

                  {/* Ripple effect on tap */}
                  <div className="absolute inset-0 touch-glow" />
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from being hidden behind bottom nav */}
      <div className="md:hidden h-20" />
    </>
  );
}
