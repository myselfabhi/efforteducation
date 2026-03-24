'use client';

import { Button } from '../ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '../common/Logo';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-900">
      <nav className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand - Centered on mobile, left on desktop */}
          <div className="flex items-center md:flex-none flex-1 md:flex-initial justify-center md:justify-start">
            <Link
              href="/"
              className="flex items-center gap-3 sm:gap-4 hover:opacity-80 transition-opacity"
            >
              <Logo className="text-2xl sm:text-3xl pl-2" />
              <span className="text-lg sm:text-xl font-black text-white tracking-tighter">EFFORT <span className="text-red-600">EDUCATION</span></span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${isActive('/') ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${isActive('/about') ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}
            >
              About
            </Link>
            <Link
              href="/programs"
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${isActive('/programs') ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}
            >
              Programs
            </Link>
            <Link
              href="/young-scholar"
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${isActive('/young-scholar') ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}
            >
              Young Scholar
            </Link>
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex">
            <Link href="/contact">
              <Button className="bg-red-600 hover:bg-red-700 text-white font-black rounded-lg px-6 py-4 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-red-600/10 text-sm">
                Enroll Now
              </Button>
            </Link>
          </div>

          {/* 
            NO Mobile Hamburger Menu on purpose!
            Reason: Bottom navigation handles all mobile navigation
            Benefits: Cleaner header, no confusion, follows best practices
          */}
        </div>
      </nav>
    </header>
  );
}