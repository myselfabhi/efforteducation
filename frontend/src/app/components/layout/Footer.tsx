'use client';

import { Facebook, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 sm:py-8 md:py-12">
      <div className="container mx-auto max-w-5xl px-6 sm:px-6 lg:px-8">
        
        {/* Mobile View: Compact Layout */}
        <div className="lg:hidden">
          {/* Brand & Social - Centered on Mobile */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-white mb-2">
              Effort Education
            </h3>
            <p className="text-gray-400 text-sm mb-4 leading-snug max-w-md mx-auto">
              Empowering students for competitive exams and life skills.
            </p>
            
            {/* Social Links - Centered */}
            <div className="flex gap-3 justify-center">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 touch-glow"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 touch-glow"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 touch-glow"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links - 2 Column Grid on Mobile */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-bold text-white mb-2">Quick Links</h4>
              <nav className="space-y-0">
                <Link
                  href="/about"
                  className="block text-gray-400 hover:text-red-400 transition-colors text-sm py-1.5 min-h-[44px] flex items-center"
                >
                  About Us
                </Link>
                <Link
                  href="/programs"
                  className="block text-gray-400 hover:text-red-400 transition-colors text-sm py-1.5 min-h-[44px] flex items-center"
                >
                  Programs
                </Link>
                <Link
                  href="/contact"
                  className="block text-gray-400 hover:text-red-400 transition-colors text-sm py-1.5 min-h-[44px] flex items-center"
                >
                  Contact
                </Link>
              </nav>
            </div>

            {/* Programs */}
            <div>
              <h4 className="text-sm font-bold text-white mb-2">Programs</h4>
              <nav className="space-y-0">
                <Link
                  href="/courses/bank-po-clerk"
                  className="block text-gray-400 hover:text-red-400 transition-colors text-sm py-1.5 min-h-[44px] flex items-center"
                >
                  Bank PO
                </Link>
                <Link
                  href="/courses/ssc-cgl"
                  className="block text-gray-400 hover:text-red-400 transition-colors text-sm py-1.5 min-h-[44px] flex items-center"
                >
                  SSC & CGL
                </Link>
                <Link
                  href="/young-scholar"
                  className="block text-gray-400 hover:text-red-400 transition-colors text-sm py-1.5 min-h-[44px] flex items-center"
                >
                  Young Scholar
                </Link>
              </nav>
            </div>
          </div>

          {/* Copyright - Mobile */}
          <div className="border-t border-gray-800 pt-4 text-center">
            <p className="text-gray-500 text-xs leading-relaxed">
              © 2025 Effort Education
              <br className="sm:hidden" />
              <span className="hidden sm:inline"> | </span>
              All rights reserved.
            </p>
          </div>
        </div>

        {/* Desktop View: Original Layout */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-6">
            
            {/* Brand & Description */}
            <div className="col-span-2">
              <h3 className="text-xl font-bold text-white mb-4">
                Effort Education
              </h3>
              <p className="text-gray-300 text-base mb-6 leading-relaxed">
                Empowering students with comprehensive learning solutions for competitive exams and life skills development.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-12 h-12 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 card-lift"
                  aria-label="Visit our YouTube channel"
                >
                  <Youtube className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 card-lift"
                  aria-label="Visit our Facebook page"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 card-lift"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-base font-bold text-white mb-4">Quick Links</h4>
              <nav className="space-y-1">
                <Link
                  href="/about"
                  className="block text-gray-300 hover:text-white transition-colors text-base py-2 min-h-[44px] flex items-center"
                >
                  About Us
                </Link>
                <Link
                  href="/programs"
                  className="block text-gray-300 hover:text-white transition-colors text-base py-2 min-h-[44px] flex items-center"
                >
                  Our Programs
                </Link>
                <Link
                  href="/contact"
                  className="block text-gray-300 hover:text-white transition-colors text-base py-2 min-h-[44px] flex items-center"
                >
                  Contact Us
                </Link>
                <Link
                  href="/young-scholar"
                  className="block text-gray-300 hover:text-white transition-colors text-base py-2 min-h-[44px] flex items-center"
                >
                  Young Scholar
                </Link>
              </nav>
            </div>

            {/* Programs */}
            <div>
              <h4 className="text-base font-bold text-white mb-4">Programs</h4>
              <nav className="space-y-1">
                <Link
                  href="/courses/bank-po-clerk"
                  className="block text-gray-300 hover:text-white transition-colors text-base py-2 min-h-[44px] flex items-center"
                >
                  Bank PO & Clerk
                </Link>
                <Link
                  href="/courses/ssc-cgl"
                  className="block text-gray-300 hover:text-white transition-colors text-base py-2 min-h-[44px] flex items-center"
                >
                  SSC & CGL
                </Link>
                <Link
                  href="/courses/public-speaking"
                  className="block text-gray-300 hover:text-white transition-colors text-base py-2 min-h-[44px] flex items-center"
                >
                  Public Speaking
                </Link>
                <Link
                  href="/courses/skill-development"
                  className="block text-gray-300 hover:text-white transition-colors text-base py-2 min-h-[44px] flex items-center"
                >
                  Skill Development
                </Link>
              </nav>
            </div>
          </div>

          {/* Copyright - Desktop */}
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm sm:text-base">
              © 2025 Effort Education. All rights reserved. | Built with dedication for student success.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}