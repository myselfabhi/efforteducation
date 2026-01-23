'use client';

import Link from 'next/link';
import { MessageCircle, Sparkles } from 'lucide-react';

export default function WannaConnect() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-700 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto max-w-4xl px-6 sm:px-8 relative z-10">
        <Link 
          href="/contact"
          className="block group"
        >
          {/* Card with hover effect */}
          <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border-2 border-red-500/30 rounded-3xl p-12 sm:p-16 text-center transition-all duration-500 hover:border-red-500/60 hover:shadow-2xl hover:shadow-red-500/20 hover:scale-105 active:scale-100">
            
            {/* Sparkles icon (top) */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full inline-flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>

            {/* Message icon (animated) */}
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full mb-6 shadow-xl group-hover:scale-110 transition-transform duration-500 relative">
              <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={2} />
              {/* Pulsing rings */}
              <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-30"></div>
              <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-20 animation-delay-150"></div>
            </div>

            {/* Heading with gradient */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent animate-gradient-shift">
                Wanna Connect?
              </span>
            </h2>

            {/* Subtext */}
            <p className="text-lg sm:text-xl text-gray-300 mb-6 group-hover:text-white transition-colors duration-300">
              Let&apos;s discuss how we can help you achieve your goals
            </p>

            {/* CTA Button (inline) */}
            <div className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 rounded-full text-white font-semibold text-lg shadow-xl group-hover:shadow-2xl group-hover:shadow-red-500/40 transition-all duration-300 group-hover:scale-105">
              <span>Get in Touch</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* Decorative corner elements */}
            <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-red-500/30 rounded-tl-2xl group-hover:border-red-500/60 transition-colors duration-500"></div>
            <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-red-500/30 rounded-br-2xl group-hover:border-red-500/60 transition-colors duration-500"></div>
          </div>
        </Link>

        {/* Bottom hint */}
        <p className="text-center text-sm text-gray-500 mt-6 animate-bounce">
          Click to start the conversation ✨
        </p>
      </div>

      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
        .animation-delay-150 {
          animation-delay: 150ms;
        }
        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </section>
  );
}
