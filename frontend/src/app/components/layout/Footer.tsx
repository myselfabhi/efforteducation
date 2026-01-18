'use client';

import { Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-10 sm:py-12">
      <div className="container mx-auto max-w-5xl px-6 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-6">
          
          {/* Brand & Description */}
          <div className="sm:col-span-2 md:col-span-2">
            <h3 className="text-xl font-bold text-white mb-4">
              Effort Education
            </h3>
            <p className="text-gray-300 text-base mb-6 leading-relaxed">
              Empowering students with comprehensive learning solutions for competitive exams and life skills development.
            </p>
            
            {/* Social Links - 48x48px touch targets */}
            <div className="flex gap-3">
              <a
                href="#"
                className="w-12 h-12 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
                aria-label="Visit our YouTube channel"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
                aria-label="Visit our Facebook page"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
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
              <button
                onClick={() => scrollToSection('about')}
                className="block text-gray-300 hover:text-white transition-colors text-base py-2 min-h-[44px] text-left w-full"
              >
                About Us
              </button>
              <button
                onClick={() => scrollToSection('programs')}
                className="block text-gray-300 hover:text-white transition-colors text-base py-2 min-h-[44px] text-left w-full"
              >
                Our Programs
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block text-gray-300 hover:text-white transition-colors text-base py-2 min-h-[44px] text-left w-full"
              >
                Contact Us
              </button>
              <a
                href="#"
                className="block text-gray-300 hover:text-white transition-colors text-base py-2 min-h-[44px] flex items-center"
              >
                Admissions
              </a>
            </nav>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-base font-bold text-white mb-4">Programs</h4>
            <nav className="space-y-1">
              <a
                href="#"
                className="block text-gray-300 hover:text-white transition-colors text-base py-2 min-h-[44px] flex items-center"
              >
                Bank PO & Clerk
              </a>
              <a
                href="#"
                className="block text-gray-300 hover:text-white transition-colors text-base py-2 min-h-[44px] flex items-center"
              >
                SSC & CGL
              </a>
              <a
                href="#"
                className="block text-gray-300 hover:text-white transition-colors text-base py-2 min-h-[44px] flex items-center"
              >
                Public Speaking
              </a>
              <a
                href="#"
                className="block text-gray-300 hover:text-white transition-colors text-base py-2 min-h-[44px] flex items-center"
              >
                Skill Development
              </a>
            </nav>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm sm:text-base">
            © 2025 Effort Education. All rights reserved. | Built with dedication for student success.
          </p>
        </div>
      </div>
    </footer>
  );
}