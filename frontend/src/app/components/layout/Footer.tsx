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
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto max-w-5xl px-4 lg:px-6">
        
        <div className="grid md:grid-cols-4 gap-6">
          
          {/* Brand & Description */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold text-white mb-3">
              Effort Education
            </h3>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              Empowering students with comprehensive learning solutions for competitive exams and life skills development.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-9 h-9 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
                aria-label="Visit our YouTube channel"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
                aria-label="Visit our Facebook page"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-bold text-white mb-3">Quick Links</h4>
            <nav className="space-y-2">
              <button
                onClick={() => scrollToSection('about')}
                className="block text-gray-300 hover:text-white transition-colors text-sm"
              >
                About Us
              </button>
              <button
                onClick={() => scrollToSection('programs')}
                className="block text-gray-300 hover:text-white transition-colors text-sm"
              >
                Our Programs
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block text-gray-300 hover:text-white transition-colors text-sm"
              >
                Contact Us
              </button>
              <a
                href="#"
                className="block text-gray-300 hover:text-white transition-colors text-sm"
              >
                Admissions
              </a>
            </nav>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-base font-bold text-white mb-3">Programs</h4>
            <nav className="space-y-2">
              <a
                href="#"
                className="block text-gray-300 hover:text-white transition-colors text-sm"
              >
                Bank PO & Clerk
              </a>
              <a
                href="#"
                className="block text-gray-300 hover:text-white transition-colors text-sm"
              >
                SSC & CGL
              </a>
              <a
                href="#"
                className="block text-gray-300 hover:text-white transition-colors text-sm"
              >
                Public Speaking
              </a>
              <a
                href="#"
                className="block text-gray-300 hover:text-white transition-colors text-sm"
              >
                Skill Development
              </a>
            </nav>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-6 pt-6 text-center">
          <p className="text-gray-400 text-xs">
            © 2025 Effort Education. All rights reserved. | Built with dedication for student success.
          </p>
        </div>
      </div>
    </footer>
  );
}