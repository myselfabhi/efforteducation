'use client';

import { ImageWithFallback } from '../../../components/common/ImageWithFallback';
import { motion } from 'framer-motion';

export default function CourseHero() {
  const courseData = {
    title: "Expert Career Preparation",
    description: "Comprehensive coaching for competitive examinations with focus on precision, logic, and core subject mastery.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5raW5nJTIwZWR1Y2F0aW9ufGVufDF8fHx8MTc1NTYyMDAxM3w%3D&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  };

  return (
    <section className="relative min-h-[40vh] bg-gray-950 overflow-hidden flex items-center pt-20">
      {/* Background Animated Orbs */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/4 -left-10 w-64 h-64 bg-red-600/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 -right-10 w-80 h-80 bg-yellow-500/10 rounded-full blur-[100px]" />
      </div>
      
      <div className="relative container mx-auto max-w-6xl px-6 pt-12 pb-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tight uppercase">
              {courseData.title}
            </h1>
            
            <p className="text-base sm:text-lg text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0 font-medium">
              {courseData.description}
            </p>
          </motion.div>

          {/* Right Column - Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="w-full max-w-md rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
                <ImageWithFallback
                  src={courseData.image}
                  alt={courseData.title}
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
