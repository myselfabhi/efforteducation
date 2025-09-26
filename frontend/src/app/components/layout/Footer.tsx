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
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto max-w-6xl px-4 lg:px-8">
        
        <div className="grid md:grid-cols-4 gap-8">
          
          {/* Brand & Description */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">
              Effort Education
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Empowering students with comprehensive learning solutions for competitive exams and life skills development. Building tomorrow&apos;s leaders through quality education and personal growth.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
                aria-label="Visit our YouTube channel"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
                aria-label="Visit our Facebook page"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
            <nav className="space-y-3">
              <button
                onClick={() => scrollToSection('about')}
                className="block text-gray-300 hover:text-white transition-colors"
              >
                About Us
              </button>
              <button
                onClick={() => scrollToSection('programs')}
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Our Programs
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Contact Us
              </button>
              <a
                href="#"
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Admissions
              </a>
            </nav>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Programs</h4>
            <nav className="space-y-3">
              <a
                href="#"
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Bank PO & Clerk
              </a>
              <a
                href="#"
                className="block text-gray-300 hover:text-white transition-colors"
              >
                SSC & CGL
              </a>
              <a
                href="#"
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Public Speaking
              </a>
              <a
                href="#"
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Skill Development
              </a>
            </nav>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Effort Education. All rights reserved. | Built with dedication for student success.
          </p>
        </div>
      </div>
    </footer>
  );
}