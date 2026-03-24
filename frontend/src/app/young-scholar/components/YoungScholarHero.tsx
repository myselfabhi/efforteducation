'use client';

import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function YoungScholarHero() {
  const scrollToContact = () => {
    const element = document.getElementById('enrollment-cta');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen bg-white overflow-hidden flex items-center justify-center pt-16">
      {/* Background Animated Orbs */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-1/4 -left-10 w-64 h-64 bg-red-600/30 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 -right-10 w-80 h-80 bg-red-400/20 rounded-full blur-[100px]" />
      </div>
      
      <div className="relative z-10 container mx-auto max-w-6xl px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1 bg-red-50 border border-red-100 rounded-full mb-6"
        >
          <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.2em]">Hero Product</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 tracking-tight uppercase"
        >
          Young Scholar <span className="text-red-600">Program</span>
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg mb-8"
        >
          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span className="text-gray-900 text-xs font-bold uppercase tracking-widest">For Class 4-8 Students</span>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-base sm:text-lg text-gray-500 mb-10 max-w-3xl mx-auto leading-relaxed font-medium"
        >
          Weekend skill-building program to develop essential skills for future success. 
          Holistic growth beyond textbooks through interactive sessions.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={scrollToContact}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest px-8 py-6 rounded-xl transition-all duration-300 shadow-xl shadow-red-600/20"
          >
            Enroll Now
          </Button>
          <Link href="/programs">
            <Button
              variant="outline"
              className="border-2 border-gray-100 bg-white text-gray-900 hover:border-red-600 text-xs font-black uppercase tracking-widest px-8 py-6 rounded-xl transition-all duration-300"
            >
              Other Programs
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
