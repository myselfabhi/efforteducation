'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, Users, Globe } from 'lucide-react';
import type { Course } from '../../../data/courses';

interface CourseHeroProps {
  course: Course;
}

export default function CourseHero({ course }: CourseHeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-600/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[128px]" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-red-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center lg:text-left"
          >
            {/* Duration Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-600/30 rounded-full mb-6">
              <Clock className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm font-semibold">{course.duration}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight tracking-tight">
              {course.title}
            </h1>
            
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {course.tagline}
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6">
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-red-500" />
                </div>
                <div className="text-left">
                  <span className="text-xs text-gray-500 block uppercase tracking-wider">Batch</span>
                  <span className="text-sm font-semibold text-white">{course.batch}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-red-500" />
                </div>
                <div className="text-left">
                  <span className="text-xs text-gray-500 block uppercase tracking-wider">Mode</span>
                  <span className="text-sm font-semibold text-white">{course.mode}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-red-500" />
                </div>
                <div className="text-left">
                  <span className="text-xs text-gray-500 block uppercase tracking-wider">Language</span>
                  <span className="text-sm font-semibold text-white">{course.language}</span>
                </div>
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
              <div className="w-full max-w-md rounded-2xl overflow-hidden border border-gray-700 shadow-2xl shadow-red-600/10">
                <Image
                  src={course.heroImage}
                  alt={course.title}
                  width={500}
                  height={350}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 60V0C240 40 480 60 720 40C960 20 1200 0 1440 20V60H0Z" fill="#f9fafb"/>
        </svg>
      </div>
    </section>
  );
}
