'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <nav className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-white hover:text-red-400 transition-colors"
            >
              Effort Education
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`transition-colors ${isActive('/') ? 'text-red-400' : 'text-gray-300 hover:text-white'}`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`transition-colors ${isActive('/about') ? 'text-red-400' : 'text-gray-300 hover:text-white'}`}
            >
              About
            </Link>
            <Link
              href="/programs"
              className={`transition-colors ${isActive('/programs') ? 'text-red-400' : 'text-gray-300 hover:text-white'}`}
            >
              Programs
            </Link>
            <Link
              href="/young-scholar"
              className={`transition-colors ${isActive('/young-scholar') ? 'text-red-400' : 'text-gray-300 hover:text-white'}`}
            >
              Young Scholar
            </Link>
            <Link
              href="/contact"
              className={`transition-colors ${isActive('/contact') ? 'text-red-400' : 'text-gray-300 hover:text-white'}`}
            >
              Contact
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex">
            <Link href="/contact">
              <Button className="bg-red-600 hover:bg-red-700 text-white rounded-md px-6 py-2 transition-colors focus-visible:outline-2 focus-visible:outline-red-500">
                Get in Touch
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button - 48x48px touch target */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white p-3 rounded-md hover:bg-gray-800 transition-colors focus-visible:outline-2 focus-visible:outline-red-500 min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu - Enhanced with proper touch targets and spacing */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-gray-900/98 backdrop-blur-sm border-b border-gray-800 shadow-xl">
            <div className="px-6 py-6 space-y-2">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className={`block transition-colors w-full text-left py-3 px-4 rounded-lg text-base font-medium min-h-[48px] flex items-center ${isActive('/') ? 'text-red-400 bg-red-500/10' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
              >
                Home
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMenuOpen(false)}
                className={`block transition-colors w-full text-left py-3 px-4 rounded-lg text-base font-medium min-h-[48px] flex items-center ${isActive('/about') ? 'text-red-400 bg-red-500/10' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
              >
                About
              </Link>
              <Link
                href="/programs"
                onClick={() => setIsMenuOpen(false)}
                className={`block transition-colors w-full text-left py-3 px-4 rounded-lg text-base font-medium min-h-[48px] flex items-center ${isActive('/programs') ? 'text-red-400 bg-red-500/10' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
              >
                Programs
              </Link>
              <Link
                href="/young-scholar"
                onClick={() => setIsMenuOpen(false)}
                className={`block transition-colors w-full text-left py-3 px-4 rounded-lg text-base font-medium min-h-[48px] flex items-center ${isActive('/young-scholar') ? 'text-red-400 bg-red-500/10' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
              >
                Young Scholar
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className={`block transition-colors w-full text-left py-3 px-4 rounded-lg text-base font-medium min-h-[48px] flex items-center ${isActive('/contact') ? 'text-red-400 bg-red-500/10' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
              >
                Contact
              </Link>
              <div className="pt-4 mt-2 border-t border-gray-800">
                <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                  <Button className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-6 py-3 w-full transition-colors focus-visible:outline-2 focus-visible:outline-red-500 min-h-[48px] text-base font-semibold">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}