'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '../../components/ui/button';

export default function ProgramsHero() {
  return (
    <section className="relative min-h-screen bg-white overflow-hidden flex flex-col">
      {/* Background Animated Orbs */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-1/4 -left-10 w-64 h-64 bg-red-600/30 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 -right-10 w-80 h-80 bg-red-400/20 rounded-full blur-[100px]" />
      </div>
      
      <div className="relative container mx-auto max-w-6xl px-6 flex-1 flex flex-col items-center justify-center pt-16 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight uppercase"
        >
          Our <span className="text-red-600">Programs</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-base sm:text-lg text-gray-500 mb-10 max-w-3xl mx-auto leading-relaxed font-medium"
        >
          Comprehensive learning solutions designed to help you achieve your career goals. 
          From competitive exams to foundational skills, we empower your journey to success.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/contact">
            <Button
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest px-8 py-6 rounded-xl transition-all duration-300 shadow-xl shadow-red-600/20"
            >
              Get Consultation
            </Button>
          </Link>
          <Button
            variant="outline"
            className="border-2 border-gray-100 bg-white text-gray-900 hover:border-red-600 text-xs font-black uppercase tracking-widest px-8 py-6 rounded-xl transition-all duration-300"
            onClick={() => {
              const el = document.getElementById('programs');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Explore More
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
