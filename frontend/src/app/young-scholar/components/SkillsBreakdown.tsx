'use client';

import { Card, CardContent } from '@/app/components/ui/card';
import { Globe, Megaphone, Brain, Calculator, Lightbulb } from 'lucide-react';

const skills = [
  {
    id: 'current-affairs',
    title: 'Current Affairs',
    description: 'Keep your kids updated about national and international affairs',
    icon: Globe,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'from-blue-50 to-blue-100',
    iconColor: 'text-blue-600',
    learningOutcomes: [
      'Understand national and international news',
      'Stay informed about world events',
      'Develop awareness of current happenings',
      'Build knowledge base for competitive exams'
    ]
  },
  {
    id: 'public-speaking',
    title: 'Public Speaking',
    description: 'Give your child the power to Speak & Shine',
    icon: Megaphone,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'from-purple-50 to-purple-100',
    iconColor: 'text-purple-600',
    learningOutcomes: [
      'Build confidence in speaking',
      'Improve communication skills',
      'Master presentation techniques',
      'Overcome stage fear and anxiety'
    ]
  },
  {
    id: 'online-quizzes',
    title: 'Online Quizzes',
    description: 'Learning made fun',
    icon: Brain,
    color: 'from-green-500 to-green-600',
    bgColor: 'from-green-50 to-green-100',
    iconColor: 'text-green-600',
    learningOutcomes: [
      'Interactive learning experience',
      'Engage with educational content',
      'Make learning enjoyable',
      'Track progress through quizzes'
    ]
  },
  {
    id: 'fast-calculations',
    title: 'Fast Calculations',
    description: 'Learning Maths to improve speed and accuracy',
    icon: Calculator,
    color: 'from-orange-500 to-orange-600',
    bgColor: 'from-orange-50 to-orange-100',
    iconColor: 'text-orange-600',
    learningOutcomes: [
      'Improve calculation speed',
      'Enhance mathematical accuracy',
      'Develop mental math skills',
      'Master Vedic math techniques'
    ]
  },
  {
    id: 'reasoning',
    title: 'Reasoning',
    description: 'Prepare your kids for OLYMPIADS®. Quick Thinking',
    icon: Lightbulb,
    color: 'from-yellow-500 to-yellow-600',
    bgColor: 'from-yellow-50 to-yellow-100',
    iconColor: 'text-yellow-600',
    learningOutcomes: [
      'Develop logical thinking',
      'Prepare for Olympiads',
      'Enhance problem-solving skills',
      'Build analytical reasoning abilities'
    ]
  }
];

export default function SkillsBreakdown() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto max-w-6xl px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Skills Your Child Will Learn
          </h2>
          <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Our comprehensive program covers five essential skill areas designed to prepare your child for success in academics and life.
          </p>
        </div>

        {/* Skills Continuous Scrolling Animation */}
        <div className="overflow-hidden">
          <div className="flex animate-scroll-right-to-left">
            {/* First set of skills */}
            {skills.map((skill) => (
              <Card key={skill.id} className="border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white transform hover:-translate-y-1 overflow-hidden w-80 md:w-96 flex-shrink-0 mx-2">
                <div className={`h-2 bg-gradient-to-r ${skill.color}`}></div>
                <CardContent className="p-6">
                  <div className={`w-14 h-14 bg-gradient-to-br ${skill.bgColor} rounded-full flex items-center justify-center mb-4 shadow-lg`}>
                    <skill.icon className={`w-7 h-7 ${skill.iconColor}`} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {skill.title}
                  </h3>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {skill.description}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900">Learning Outcomes:</h4>
                    <ul className="space-y-1.5">
                      {skill.learningOutcomes.map((outcome, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className={`${skill.iconColor} mt-1 text-xs`}>•</span>
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Duplicate set for seamless continuous loop */}
            {skills.map((skill) => (
              <Card key={`duplicate-${skill.id}`} className="border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white transform hover:-translate-y-1 overflow-hidden w-80 md:w-96 flex-shrink-0 mx-2">
                <div className={`h-2 bg-gradient-to-r ${skill.color}`}></div>
                <CardContent className="p-6">
                  <div className={`w-14 h-14 bg-gradient-to-br ${skill.bgColor} rounded-full flex items-center justify-center mb-4 shadow-lg`}>
                    <skill.icon className={`w-7 h-7 ${skill.iconColor}`} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {skill.title}
                  </h3>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {skill.description}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900">Learning Outcomes:</h4>
                    <ul className="space-y-1.5">
                      {skill.learningOutcomes.map((outcome, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className={`${skill.iconColor} mt-1 text-xs`}>•</span>
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-base text-gray-600">
            <span className="font-semibold text-gray-900">And more...</span> Additional learning activities, 
            practice sessions, and skill-building exercises to ensure comprehensive development.
          </p>
        </div>
      </div>
    </section>
  );
}
