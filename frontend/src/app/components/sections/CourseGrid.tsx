'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { COURSES } from '@/lib/courses';
import { Button } from '../ui/button';
import { 
  Briefcase, 
  MessageCircle, 
  BookOpen, 
  Users, 
  GraduationCap, 
  Building 
} from 'lucide-react';

const icons = {
  'bank-po-so': Briefcase,
  'interview-prep': MessageCircle,
  'ugc-net-jrf': GraduationCap,
  'ctet-tet': BookOpen,
  'prt-tgt-pgt': Users,
  'dsssb': Building,
};

export default function CourseGrid() {
  return (
    <section id="courses-grid" className="py-16 bg-gray-950 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-red-600/10 border border-red-500/20 rounded-full mb-4"
          >
            <span className="text-red-400 text-xs font-semibold tracking-wide uppercase">Our Programs</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight"
          >
            Competitive <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">Excellence</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base text-gray-400 max-w-xl mx-auto"
          >
            Explore our range of comprehensive courses, expertly designed to help you secure your dream career in the public sector.
          </motion.p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.map((course, index) => {
            const Icon = icons[course.slug as keyof typeof icons] || BookOpen;
            
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                {/* Background Accent Gradient */}
                <div className="absolute -inset-0.5 bg-gradient-to-br from-red-600 to-yellow-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-500" />
                
                {/* Main Card */}
                <div className="relative h-full bg-gray-900 border border-gray-800 rounded-xl p-6 transition-all duration-300 transform group-hover:-translate-y-1 flex flex-col justify-between">
                  <div>
                    {/* Icon & Category */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700 group-hover:border-red-500/50 group-hover:bg-red-600/10 transition-colors duration-300">
                        <Icon className="w-6 h-6 text-red-500 group-hover:text-red-400" />
                      </div>
                      <span className="text-[10px] font-bold text-yellow-500/80 uppercase tracking-widest">{course.category}</span>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors duration-300">
                      {course.title}
                    </h3>
                    <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-1.5 mb-6">
                      {course.features.slice(0, 3).map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-red-600 rounded-full" />
                          <span className="text-gray-500 text-[10px] font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Button */}
                  <Link href={`/courses/${course.slug}`}>
                    <Button className="w-full bg-transparent border border-gray-800 hover:border-red-600 hover:bg-red-600/10 text-white font-bold py-3 rounded-lg text-sm transition-all duration-300 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(220,38,38,0.15)]">
                      Explore Course
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
