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
    <section className="py-16 bg-white">
      <div className="container mx-auto max-w-6xl px-6">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase"
          >
            Why Choose <span className="text-red-600">Us</span>?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium"
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
                className="border border-gray-100 bg-white hover:border-red-100 transition-all duration-300 transform hover:-translate-y-1 rounded-2xl h-full group shadow-sm hover:shadow-xl"
              >
                <CardContent className="p-6 text-center flex flex-col items-center">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4 border border-red-100 group-hover:bg-red-600 transition-colors duration-300">
                    <feature.icon className="w-6 h-6 text-red-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
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
