'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <nav className="container mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center">
            <button
              onClick={() => scrollToSection('home')}
              className="text-xl font-bold text-white hover:text-red-400 transition-colors"
            >
              Effort Education
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('home')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('courses')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Courses
            </button>
            <button
              onClick={() => scrollToSection('programs')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Programs
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Contact
            </button>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex">
            <Button
              onClick={() => scrollToSection('contact')}
              className="bg-red-600 hover:bg-red-700 text-white rounded-md px-6 py-2 transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
            >
              Get in Touch
            </Button>
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
              <button
                onClick={() => scrollToSection('home')}
                className="block text-gray-300 hover:text-white transition-colors w-full text-left"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="block text-gray-300 hover:text-white transition-colors w-full text-left"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('courses')}
                className="block text-gray-300 hover:text-white transition-colors w-full text-left"
              >
                Courses
              </button>
              <button
                onClick={() => scrollToSection('programs')}
                className="block text-gray-300 hover:text-white transition-colors w-full text-left"
              >
                Programs
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block text-gray-300 hover:text-white transition-colors w-full text-left"
              >
                Contact
              </button>
              <Button
                onClick={() => scrollToSection('contact')}
                className="bg-red-600 hover:bg-red-700 text-white rounded-md px-6 py-2 w-full transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
              >
                Get in Touch
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}