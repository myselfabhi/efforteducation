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
    <section id="courses-grid" className="py-16 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-red-50 border border-red-100 rounded-full mb-4"
          >
            <span className="text-red-600 text-[10px] font-black uppercase tracking-widest">Our Programs</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase"
          >
            Competitive <span className="text-red-600">Excellence</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base text-gray-500 max-w-xl mx-auto font-medium"
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
                <div className="absolute -inset-0.5 bg-red-600 rounded-xl opacity-0 group-hover:opacity-10 blur transition-opacity duration-500" />
                
                {/* Main Card */}
                <div className="relative h-full bg-white border border-gray-100 rounded-xl p-6 transition-all duration-300 transform group-hover:-translate-y-1 flex flex-col justify-between shadow-sm group-hover:shadow-xl group-hover:border-red-100">
                  <div>
                    {/* Icon & Category */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 group-hover:border-red-200 group-hover:bg-red-50 transition-colors duration-300">
                        <Icon className="w-6 h-6 text-red-600" />
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{course.category}</span>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300 uppercase tracking-tight">
                      {course.title}
                    </h3>
                    <p className="text-gray-500 text-xs mb-4 leading-relaxed font-medium">
                      {course.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-1.5 mb-6">
                      {course.features.slice(0, 3).map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-red-600 rounded-full" />
                          <span className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Button */}
                  <Link href={`/courses/${course.slug}`}>
                    <Button className="w-full bg-white border border-gray-200 hover:border-red-600 hover:bg-red-50 text-gray-900 hover:text-red-600 font-black py-3 rounded-lg text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center">
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
