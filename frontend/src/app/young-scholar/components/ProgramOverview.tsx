'use client';

import { Card, CardContent } from '@/app/components/ui/card';
import { Target, Users, Award, Clock } from 'lucide-react';

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
    <section className="py-16 sm:py-20 bg-white overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            What is Young Scholar Program?
          </h2>
          <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            A comprehensive weekend skill-building program designed specifically for students in Class 4-8. 
            We focus on developing essential life skills through interactive learning and engaging activities.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-full">
          {features.map((feature, index) => (
            <Card key={index} className="border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white transform hover:-translate-y-1 min-w-0">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <feature.icon className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 p-8 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Why Choose Young Scholar Program?
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">For Students:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✓</span>
                  <span>Build confidence and communication skills</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✓</span>
                  <span>Develop critical thinking and problem-solving abilities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✓</span>
                  <span>Stay updated with current affairs and world events</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✓</span>
                  <span>Improve mathematical speed and accuracy</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">For Parents:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✓</span>
                  <span>Affordable investment in your child&apos;s future</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✓</span>
                  <span>Weekend schedule - no conflict with school</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✓</span>
                  <span>Online live classes - learn from home</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✓</span>
                  <span>Holistic development beyond academics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
