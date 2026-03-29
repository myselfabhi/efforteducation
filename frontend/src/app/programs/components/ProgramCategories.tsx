'use client';

import { useState } from 'react';
import { BookOpen, Briefcase, MessageCircle, GraduationCap, Users, Building, Loader2, Utensils } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { COURSES } from '@/lib/courses';
import Link from 'next/link';
import { motion } from 'framer-motion';

const icons = {
  'bank-po-so': Briefcase,
  'interview-prep': MessageCircle,
  'ugc-net-jrf': GraduationCap,
  'ctet-tet': BookOpen,
  'prt-tgt-pgt': Users,
  'dsssb': Building,
  'hotel-management': Utensils,
  'cuet': GraduationCap,
};

export default function ProgramCategories() {
  const [loading] = useState(false);

  return (
    <section id="programs" className="py-16 bg-slate-50">
      <div className="container mx-auto max-w-6xl px-6">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase"
          >
            Our <span className="text-red-600">Curriculum</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Specialized coaching for government careers and professional excellence. 
            Choose the path that defines your future.
          </motion.p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            <span className="ml-2 text-gray-400 font-bold uppercase tracking-widest">Fetching...</span>
          </div>
        )}

        {/* Program Categories */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSES.map((course, index) => {
              const Icon = icons[course.slug as keyof typeof icons] || BookOpen;
              
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border border-gray-100 bg-white hover:border-red-100 transition-all duration-300 transform hover:-translate-y-1 rounded-2xl h-full group overflow-hidden shadow-sm hover:shadow-xl">
                    <CardContent className="p-8 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-red-600 group-hover:border-red-600">
                          <Icon className="w-6 h-6 text-red-600 group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{course.category}</span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors uppercase tracking-tight">
                        {course.title}
                      </h3>
                      
                      <p className="text-gray-500 text-xs mb-8 leading-relaxed font-medium flex-1">
                        {course.description}
                      </p>

                      <div className="space-y-2 mb-8">
                        {course.features.slice(0, 3).map((feature, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-red-600 rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Link href={`/courses/${course.slug}`}>
                        <Button className="w-full h-12 bg-white border border-gray-200 hover:border-red-600 hover:bg-red-50 text-gray-900 hover:text-red-600 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300">
                          View Program
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
