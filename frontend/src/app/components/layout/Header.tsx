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
      <nav className="container mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
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
              href="/courses"
              className={`transition-colors ${isActive('/courses') ? 'text-red-400' : 'text-gray-300 hover:text-white'}`}
            >
              Courses
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

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white p-2 rounded-md hover:bg-gray-800 transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-gray-900/98 backdrop-blur-sm border-b border-gray-800">
            <div className="px-4 py-4 space-y-4">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className={`block transition-colors w-full text-left ${isActive('/') ? 'text-red-400' : 'text-gray-300 hover:text-white'}`}
              >
                Home
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMenuOpen(false)}
                className={`block transition-colors w-full text-left ${isActive('/about') ? 'text-red-400' : 'text-gray-300 hover:text-white'}`}
              >
                About
              </Link>
              <Link
                href="/courses"
                onClick={() => setIsMenuOpen(false)}
                className={`block transition-colors w-full text-left ${isActive('/courses') ? 'text-red-400' : 'text-gray-300 hover:text-white'}`}
              >
                Courses
              </Link>
              <Link
                href="/programs"
                onClick={() => setIsMenuOpen(false)}
                className={`block transition-colors w-full text-left ${isActive('/programs') ? 'text-red-400' : 'text-gray-300 hover:text-white'}`}
              >
                Programs
              </Link>
              <Link
                href="/young-scholar"
                onClick={() => setIsMenuOpen(false)}
                className={`block transition-colors w-full text-left ${isActive('/young-scholar') ? 'text-red-400' : 'text-gray-300 hover:text-white'}`}
              >
                Young Scholar
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className={`block transition-colors w-full text-left ${isActive('/contact') ? 'text-red-400' : 'text-gray-300 hover:text-white'}`}
              >
                Contact
              </Link>
              <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                <Button className="bg-red-600 hover:bg-red-700 text-white rounded-md px-6 py-2 w-full transition-colors focus-visible:outline-2 focus-visible:outline-red-500">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}