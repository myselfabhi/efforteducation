'use client';

import { Card, CardContent } from '@/app/components/ui/card';
import { Target, Users, Award, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProgramOverview() {
  const features = [
    {
      icon: Target,
      title: 'Skill Development',
      description: 'Build essential skills that go beyond academics - communication, reasoning, and awareness.'
    },
    {
      icon: Clock,
      title: 'Weekend Learning',
      description: 'Just a few hours on weekends - flexible schedule that doesn\'t interfere with school.'
    },
    {
      icon: Users,
      title: 'Personalized Attention',
      description: 'Small batch sizes ensure individual attention and personalized learning experience.'
    },
    {
      icon: Award,
      title: 'Affordable Education',
      description: 'Quality education at just ₹999 - making skill development accessible for all students.'
    }
  ];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-gray-900 mb-6 tracking-tight uppercase"
          >
            What is <span className="text-red-600">Young Scholar</span> Program?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            A comprehensive weekend skill-building program designed specifically for students in Class 4-8. 
            We focus on developing essential life skills through interactive learning.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border border-gray-100 bg-white hover:border-red-100 transition-all duration-300 transform hover:-translate-y-1 rounded-2xl h-full group shadow-sm hover:shadow-xl">
                <CardContent className="p-6 text-center flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4 border border-gray-100 group-hover:bg-red-600 transition-colors">
                    <feature.icon className="w-6 h-6 text-red-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors uppercase tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-16 p-8 bg-slate-50 rounded-[2rem] border border-gray-100 shadow-sm"
        >
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-8 text-center uppercase tracking-tighter">
            Why Choose <span className="text-red-600">This Program</span>?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 mb-4">For Students</h4>
              <ul className="space-y-4">
                {[
                  "Build confidence and communication skills",
                  "Develop critical thinking abilities",
                  "Stay updated with world events",
                  "Improve mathematical speed & logic"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                    <span className="text-red-600 font-black">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 mb-4">For Parents</h4>
              <ul className="space-y-4">
                {[
                  "Affordable investment in child's future",
                  "Weekend schedule - no school conflict",
                  "Online live classes - learn from home",
                  "Holistic development beyond academics"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                    <span className="text-red-600 font-black">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
