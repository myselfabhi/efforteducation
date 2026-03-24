'use client';

import { GraduationCap, Target, Scale, Trophy, Clock, Users, Award, BookOpen } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { motion } from 'framer-motion';

export default function ProgramFeatures() {
  const features = [
    {
      icon: GraduationCap,
      title: "Expert Faculty",
      description: "Learn from qualified instructors with years of teaching experience and deep subject matter expertise."
    },
    {
      icon: Target,
      title: "Goal-Oriented Learning",
      description: "Structured curriculum designed to help you achieve specific academic and career objectives."
    },
    {
      icon: Scale,
      title: "Balanced Approach",
      description: "Perfect blend of theoretical knowledge and practical application for comprehensive learning."
    },
    {
      icon: Trophy,
      title: "Proven Results",
      description: "Consistent success with students achieving their goals and excelling in their chosen fields."
    },
    {
      icon: Clock,
      title: "Flexible Schedules",
      description: "Multiple batch timings with flexible online live class schedules to fit your busy lifestyle."
    },
    {
      icon: Users,
      title: "Small Batch Sizes",
      description: "Personalized attention with limited students per batch for better learning outcomes."
    },
    {
      icon: Award,
      title: "Certification",
      description: "Recognized certificates upon completion to enhance your academic and professional profile."
    },
    {
      icon: BookOpen,
      title: "Study Materials",
      description: "Comprehensive study materials, practice tests, and digital resources included."
    }
  ];

  return (
    <section className="py-16 bg-gray-950">
      <div className="container mx-auto max-w-6xl px-6">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight"
          >
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">Us</span>?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Our programs are designed with student success in mind, featuring modern teaching methods and comprehensive support.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className="border border-gray-800 bg-gray-900/40 backdrop-blur-sm hover:border-red-500/30 transition-all duration-300 transform hover:-translate-y-1 rounded-2xl h-full group"
              >
                <CardContent className="p-6 text-center flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-4 border border-gray-700 group-hover:border-red-500/50 transition-colors">
                    <feature.icon className="w-6 h-6 text-red-500" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
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
      </div>
    </section>
  );
}
