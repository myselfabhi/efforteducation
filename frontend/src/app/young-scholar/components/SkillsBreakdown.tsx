'use client';

import { Card, CardContent } from '@/app/components/ui/card';
import { Globe, Megaphone, Brain, Calculator, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

const skills = [
  {
    id: 'current-affairs',
    title: 'Current Affairs',
    description: 'Keep your kids updated about national and international affairs',
    icon: Globe,
    color: 'from-blue-500 to-blue-600',
     learningOutcomes: [
      'Understand national news',
      'Stay informed about world events',
      'Develop awareness of surroundings',
      'Build competitive knowledge base'
    ]
  },
  {
    id: 'public-speaking',
    title: 'Public Speaking',
    description: 'Give your child the power to Speak & Shine with confidence',
    icon: Megaphone,
    color: 'from-purple-500 to-purple-600',
    learningOutcomes: [
      'Build confidence in speaking',
      'Improve communication skills',
      'Master presentation techniques',
      'Overcome stage fear'
    ]
  },
  {
    id: 'online-quizzes',
    title: 'Online Quizzes',
    description: 'Interactive learning made fun and engaging for everyone',
    icon: Brain,
    color: 'from-green-500 to-green-600',
    learningOutcomes: [
      'Interactive learning',
      'Engage with content',
      'Make learning enjoyable',
      'Track progress through quizzes'
    ]
  },
  {
    id: 'fast-calculations',
    title: 'Fast Calculations',
    description: 'Learning Maths to improve speed and accuracy in problems',
    icon: Calculator,
    color: 'from-orange-500 to-orange-600',
    learningOutcomes: [
      'Improve calculation speed',
      'Enhance mathematical accuracy',
      'Develop mental math skills',
      'Master Vedic techniques'
    ]
  },
  {
    id: 'reasoning',
    title: 'Reasoning',
    description: 'Prepare your kids for OLYMPIADS® with quick thinking',
    icon: Lightbulb,
    color: 'from-yellow-500 to-yellow-600',
    learningOutcomes: [
      'Develop logical thinking',
      'Prepare for Olympiads',
      'Enhance problem solving',
      'Build analytical abilities'
    ]
  }
];

export default function SkillsBreakdown() {
  return (
    <section className="py-16 bg-gray-950">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight"
          >
            Skills Your Child <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">Will Learn</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Our comprehensive program covers five essential skill areas designed to prepare your child for success in academics and life.
          </motion.p>
        </div>

        <div className="relative">
          {/* Left Fade */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-950 to-transparent z-10 hidden md:block" />
          
          <div className="overflow-hidden">
            <div className="flex animate-scroll-right-to-left py-4">
              {[...skills, ...skills].map((skill, index) => (
                <Card key={`${skill.id}-${index}`} className="border border-gray-800 bg-gray-900/40 backdrop-blur-sm hover:border-red-500/30 transition-all duration-500 transform hover:-translate-y-1.5 w-72 md:w-[350px] flex-shrink-0 mx-3 rounded-2xl overflow-hidden group">
                  <div className={`h-1.5 bg-gradient-to-r ${skill.color}`}></div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:border-red-500/50 group-hover:bg-red-600/10">
                        <skill.icon className="w-6 h-6 text-red-500" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Curriculum</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                      {skill.title}
                    </h3>
                    
                    <p className="text-gray-400 text-xs mb-6 leading-relaxed font-medium">
                      {skill.description}
                    </p>
                    
                    <div className="space-y-2.5">
                      {skill.learningOutcomes.slice(0, 3).map((outcome, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className="w-1 h-1 bg-yellow-500 rounded-full mt-1.5" />
                          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tighter">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Fade */}
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-950 to-transparent z-10 hidden md:block" />
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-600">
            And much more interactive learning sessions...
          </p>
        </div>
      </div>
    </section>
  );
}
