'use client';

import { motion } from 'framer-motion';
import { Button } from '../ui/button';


export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen bg-white overflow-hidden flex items-center justify-center pt-16">
      {/* Background Animated Orbs - Subtle & Modern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 -left-10 w-[300px] h-[300px] bg-red-600/30 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 -right-10 w-[350px] h-[350px] bg-red-400/20 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 container mx-auto max-w-6xl px-6 py-12 text-center">
        {/* Established Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block px-4 py-1.5 bg-gray-50 border border-gray-100 rounded-full mb-8"
        >
          <span className="text-gray-500 text-xs font-bold tracking-widest uppercase">
            ESTABLISHED <span className="text-red-600">1991</span>
          </span>
        </motion.div>
        
        {/* Main Brand & Headline */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center justify-center mb-6"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
            EFFORT<br />
            <span className="text-red-600">EDUCATION</span>
          </h1>
        </motion.div>
        
        {/* Sub-headline */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-base sm:text-lg text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed font-medium"
        >
          Precision coaching for banking, teaching, and government careers.
          Empowering leaders for over three decades.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={() => scrollToSection('courses-grid')}
            className="group relative overflow-hidden bg-red-600 hover:bg-red-700 text-white px-8 py-5 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-xl shadow-red-600/20 text-sm font-bold uppercase tracking-widest"
          >
            Explore Courses
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </Button>
          
          <Button
            onClick={() => scrollToSection('contact')}
            variant="outline"
            className="border-2 border-gray-100 bg-white text-gray-900 hover:border-red-600 px-8 py-5 rounded-lg transition-all duration-300 transform hover:-translate-y-1 text-sm font-bold uppercase tracking-widest"
          >
            Get Counselling
          </Button>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-300"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-auto" />
      </motion.div>
    </section>
  );
}
