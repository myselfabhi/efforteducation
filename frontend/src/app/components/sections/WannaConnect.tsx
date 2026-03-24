'use client';

import Link from 'next/link';
import { MessageCircle, Sparkles } from 'lucide-react';

export default function WannaConnect() {
  return (
    <section className="py-16 bg-gray-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-red-600 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-500/15 rounded-full blur-[100px] animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto max-w-4xl px-6 sm:px-8 relative z-10">
        <Link 
          href="/contact"
          className="block group"
        >
          {/* Card with hover effect */}
          <div className="relative bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-[2rem] p-10 sm:p-14 text-center transition-all duration-500 hover:border-red-500/40 hover:shadow-2xl hover:shadow-red-500/10 hover:scale-[1.01] active:scale-100">
            
            {/* Sparkles icon (top) */}
            <div className="absolute -top-5 -right-5 w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl inline-flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform duration-500">
              <Sparkles className="w-7 h-7 text-gray-900 animate-pulse" />
            </div>

            {/* Message icon (animated) */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 border border-gray-700 rounded-full mb-8 shadow-xl group-hover:scale-110 group-hover:border-red-500/50 transition-all duration-500 relative overflow-hidden">
              <MessageCircle className="w-10 h-10 text-red-500" strokeWidth={1.5} />
              {/* Inner glow */}
              <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors duration-500" />
            </div>

            {/* Heading with gradient */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-tighter">
              <span className="text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-yellow-500 transition-all duration-500">
                Wanna Connect?
              </span>
            </h2>

            {/* Subtext */}
            <p className="text-lg sm:text-xl text-gray-400 mb-8 group-hover:text-gray-200 transition-colors duration-300 font-medium max-w-xl mx-auto leading-snug">
              Let&apos;s discuss how we can help you achieve your career goals with expert guidance.
            </p>

            {/* CTA Button (inline) */}
            <div className="inline-flex items-center gap-2.5 px-8 py-4 bg-red-600 hover:bg-red-700 rounded-xl text-white font-black text-lg shadow-xl shadow-red-600/20 transition-all duration-300 group-hover:scale-105">
              <span>Start Now</span>
              <svg className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Bottom hint */}
        <p className="text-center text-xs text-gray-600 mt-6 font-bold uppercase tracking-widest">
          Click to start the conversation ✨
        </p>
      </div>
    </section>
  );
}
