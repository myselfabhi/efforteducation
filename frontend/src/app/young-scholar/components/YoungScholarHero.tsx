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
    <section className="relative min-h-[50vh] bg-gray-950 overflow-hidden flex items-center justify-center pt-20">
      {/* Background Animated Orbs */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/4 -left-10 w-64 h-64 bg-red-600/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 -right-10 w-80 h-80 bg-yellow-500/10 rounded-full blur-[100px]" />
      </div>
      
      <div className="relative z-10 container mx-auto max-w-6xl px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full mb-6"
        >
          <span className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.2em]">Hero Product</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight"
        >
          Young Scholar <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Program</span>
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg mb-8"
        >
          <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span className="text-white text-xs font-bold uppercase tracking-widest">For Class 4-8 Students</span>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-base sm:text-lg text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed font-medium"
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
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-black uppercase tracking-widest px-8 py-6 rounded-xl transition-all duration-300 shadow-xl shadow-red-600/20"
          >
            Enroll Now
          </Button>
          <Link href="/programs">
            <Button
              variant="outline"
              className="border-2 border-gray-800 bg-transparent text-white hover:border-yellow-500 text-sm font-black uppercase tracking-widest px-8 py-6 rounded-xl transition-all duration-300"
            >
              Other Programs
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
