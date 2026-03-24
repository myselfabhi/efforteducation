'use client';

import { ImageWithFallback } from '../../components/common/ImageWithFallback';
import { motion } from 'framer-motion';

export default function AboutHero() {
  return (
    <section className="relative min-h-[40vh] bg-gray-950 overflow-hidden flex items-center">
      {/* Background Animated Orbs */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/4 -left-10 w-64 h-64 bg-red-600/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 -right-10 w-80 h-80 bg-yellow-500/10 rounded-full blur-[100px]" />
      </div>
      
      <div className="relative container mx-auto max-w-6xl px-6 pt-20 pb-12">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          
          {/* Left Column - Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">Effort Education</span>
            </h1>
            
            <p className="text-base sm:text-lg text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Founded on the principle of student-first education, we are dedicated to providing comprehensive learning solutions that prepare students not just for examinations, but for success in life.
            </p>
          </motion.div>

          {/* Right Column - Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex justify-center lg:justify-end"
          >
            <div className="relative z-10">
              <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjB0ZWFtJTIwdGVhY2hlcnN8ZW58MXx8fHwxNzU1NjIwMDEzfA%3D%3D&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Education team and teachers"
                  className="w-full h-auto object-cover opacity-80"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
