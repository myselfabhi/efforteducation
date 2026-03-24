'use client';

import { ImageWithFallback } from '../../../components/common/ImageWithFallback';
import { motion } from 'framer-motion';
import { Clock, Users, Globe } from 'lucide-react';
import type { Course } from '../../../data/courses';

interface CourseHeroProps {
  course: Course;
}

export default function CourseHero({ course }: CourseHeroProps) {
  return (
    <section className="relative min-h-screen bg-white overflow-hidden flex flex-col">
      {/* Background Animated Orbs */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-1/4 -left-10 w-64 h-64 bg-red-600/30 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 -right-10 w-80 h-80 bg-red-400/20 rounded-full blur-[100px]" />
      </div>
      
      <div className="relative z-10 container mx-auto max-w-6xl px-6 flex-1 flex items-center pt-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full py-12">
          
          {/* Left Column - Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight tracking-tight uppercase">
              {course.title}
            </h1>
            
            <p className="text-base sm:text-lg text-gray-500 mb-8 max-w-2xl mx-auto lg:mx-0 font-medium">
              {course.tagline}
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-red-600" />
                <span className="font-medium">{course.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4 text-red-600" />
                <span className="font-medium">{course.batch}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Globe className="w-4 h-4 text-red-600" />
                <span className="font-medium">{course.mode}</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="w-full max-w-md rounded-2xl overflow-hidden border border-gray-100 shadow-2xl">
                <ImageWithFallback
                  src={course.heroImage}
                  alt={course.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
