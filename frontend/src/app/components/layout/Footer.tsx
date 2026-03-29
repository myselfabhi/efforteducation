'use client';

import { Facebook, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';
import Logo from '../common/Logo';

export default function Footer() {
  return (
    <footer className="bg-white text-gray-900 py-12 border-t border-gray-100">
      <div className="container mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
        
        {/* Mobile View: Compact Layout */}
        <div className="lg:hidden">
          {/* Brand & Social - Centered on Mobile */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Logo className="text-3xl" />
              <h3 className="text-2xl font-black text-gray-900 tracking-tighter">
                EFFORT EDUCATION
              </h3>
            </div>
            <p className="text-gray-500 text-sm mb-8 leading-snug max-w-md mx-auto font-medium">
              Empowering students for competitive exams and life skills with precision coaching since 1990.
            </p>
            
            {/* Social Links - Centered */}
            <div className="flex gap-4 justify-center">
              <a
                href="#"
                className="w-12 h-12 bg-gray-50 border border-gray-100 hover:border-red-500/50 hover:bg-red-50 rounded-xl flex items-center justify-center transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5 text-red-600" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-gray-50 border border-gray-100 hover:border-red-500/50 hover:bg-red-50 rounded-xl flex items-center justify-center transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-red-600" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-gray-50 border border-gray-100 hover:border-red-500/50 hover:bg-red-50 rounded-xl flex items-center justify-center transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-red-600" />
              </a>
            </div>
          </div>

          {/* Links - 2 Column Grid on Mobile */}
          <div className="grid grid-cols-2 gap-8 mb-10 border-t border-gray-100 pt-10">
            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-black text-red-600 mb-6 uppercase tracking-widest">Navigation</h4>
              <nav className="space-y-4">
                <Link
                  href="/about"
                  className="block text-gray-500 hover:text-red-600 transition-colors text-sm font-bold"
                >
                  About Us
                </Link>
                <Link
                  href="/programs"
                  className="block text-gray-500 hover:text-red-600 transition-colors text-sm font-bold"
                >
                  Programs
                </Link>
                <Link
                  href="/contact"
                  className="block text-gray-500 hover:text-red-600 transition-colors text-sm font-bold"
                >
                  Contact
                </Link>
              </nav>
            </div>

            {/* Programs */}
            <div>
              <h4 className="text-xs font-black text-red-600 mb-6 uppercase tracking-widest">Top Courses</h4>
              <nav className="space-y-4">
                <Link
                  href="/courses/bank-po-so"
                  className="block text-gray-500 hover:text-red-600 transition-colors text-sm font-bold"
                >
                  Bank PO / SO
                </Link>
                <Link
                  href="/courses/ugc-net-jrf"
                  className="block text-gray-500 hover:text-red-600 transition-colors text-sm font-bold"
                >
                  UGC NET/JRF
                </Link>
                <Link
                  href="/young-scholar"
                  className="block text-gray-500 hover:text-red-600 transition-colors text-sm font-bold"
                >
                  Young Scholar
                </Link>
                <Link
                  href="/courses/hotel-management"
                  className="block text-gray-500 hover:text-red-600 transition-colors text-sm font-bold"
                >
                  Hotel Management
                </Link>
                <Link
                  href="/courses/cuet"
                  className="block text-gray-500 hover:text-red-600 transition-colors text-sm font-bold"
                >
                  CUET (UG)
                </Link>
              </nav>
            </div>
          </div>

          {/* Copyright - Mobile */}
          <div className="border-t border-gray-100 pt-8 text-center">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              © 2026 Effort Education. All rights reserved.
            </p>
          </div>
        </div>

        {/* Desktop View: Original Layout */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            
            {/* Brand & Description */}
            <div className="col-span-2 pr-12">
              <div className="flex items-center gap-4 mb-8">
                <Logo className="text-4xl" />
                <h3 className="text-2xl font-black text-gray-900 tracking-tighter">
                  EFFORT EDUCATION
                </h3>
              </div>
              <p className="text-gray-500 text-lg mb-10 leading-relaxed font-medium">
                Empowering students with comprehensive learning solutions for competitive exams and life skills development. Expert guidance in Banking, Teaching, and Government services.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-14 h-14 bg-gray-50 border border-gray-100 hover:border-red-500/50 hover:bg-red-50 rounded-2xl flex items-center justify-center transition-all duration-300 group"
                  aria-label="Visit our YouTube channel"
                >
                  <Youtube className="w-6 h-6 text-red-600 group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href="#"
                  className="w-14 h-14 bg-gray-50 border border-gray-100 hover:border-red-500/50 hover:bg-red-50 rounded-2xl flex items-center justify-center transition-all duration-300 group"
                  aria-label="Visit our Facebook page"
                >
                  <Facebook className="w-6 h-6 text-red-600 group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href="#"
                  className="w-14 h-14 bg-gray-50 border border-gray-100 hover:border-red-500/50 hover:bg-red-50 rounded-2xl flex items-center justify-center transition-all duration-300 group"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="w-6 h-6 text-red-600 group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-black text-red-600 mb-8 uppercase tracking-widest">Navigation</h4>
              <nav className="space-y-4">
                <Link
                  href="/about"
                  className="block text-gray-500 hover:text-red-600 transition-colors text-base font-bold"
                >
                  About Us
                </Link>
                <Link
                  href="/programs"
                  className="block text-gray-500 hover:text-red-600 transition-colors text-base font-bold"
                >
                  Our Programs
                </Link>
                <Link
                  href="/contact"
                  className="block text-gray-500 hover:text-red-600 transition-colors text-base font-bold"
                >
                  Contact Us
                </Link>
                <Link
                  href="/young-scholar"
                  className="block text-gray-500 hover:text-red-600 transition-colors text-base font-bold"
                >
                  Young Scholar
                </Link>
              </nav>
            </div>

            {/* Programs */}
            <div>
              <h4 className="text-xs font-black text-red-600 mb-8 uppercase tracking-widest">Programs</h4>
              <nav className="space-y-4">
                <Link
                  href="/courses/bank-po-so"
                  className="block text-gray-500 hover:text-red-600 transition-colors text-base font-bold"
                >
                  Bank PO & SO
                </Link>
                <Link
                  href="/courses/ugc-net-jrf"
                  className="block text-gray-500 hover:text-red-600 transition-colors text-base font-bold"
                >
                  UGC NET / JRF
                </Link>
                <Link
                  href="/courses/interview-prep"
                  className="block text-gray-500 hover:text-red-600 transition-colors text-base font-bold"
                >
                  Interview Preparation
                </Link>
                <Link
                  href="/courses/dsssb"
                  className="block text-gray-500 hover:text-red-600 transition-colors text-base font-bold"
                >
                  DSSSB Coaching
                </Link>
                <Link
                  href="/courses/hotel-management"
                  className="block text-gray-500 hover:text-red-600 transition-colors text-base font-bold"
                >
                  Hotel Management
                </Link>
                <Link
                  href="/courses/cuet"
                  className="block text-gray-500 hover:text-red-600 transition-colors text-base font-bold"
                >
                  CUET (UG) Entrance
                </Link>
              </nav>
            </div>
          </div>

          {/* Copyright - Desktop */}
          <div className="border-t border-gray-100 mt-16 pt-10 flex items-center justify-between">
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
              © 2026 Effort Education. All rights reserved.
            </p>
            <div className="flex gap-8">
              <span className="text-gray-400 text-sm font-bold uppercase tracking-widest cursor-pointer hover:text-red-600 transition-colors">Privacy Policy</span>
              <span className="text-gray-400 text-sm font-bold uppercase tracking-widest cursor-pointer hover:text-red-600 transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
