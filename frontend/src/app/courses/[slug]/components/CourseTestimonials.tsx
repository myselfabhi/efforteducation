'use client';

import { Quote } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import type { Course } from '../../../data/courses';

interface CourseTestimonialsProps {
  course: Course;
}

export default function CourseTestimonials({ course }: CourseTestimonialsProps) {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="container mx-auto max-w-6xl px-6">
        
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Student <span className="text-red-500">Success</span> Stories
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Hear from our successful students who have achieved their career goals
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {course.testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="bg-gray-800/80 border-gray-700 hover:bg-gray-800 transition-colors duration-300"
            >
              <CardContent className="p-6">
                <div className="mb-5">
                  <Quote className="w-8 h-8 text-red-500 mb-4 opacity-80" />
                  <p className="text-gray-300 leading-relaxed text-sm">
                    &quot;{testimonial.quote}&quot;
                  </p>
                </div>
                
                <div className="flex items-center gap-3 pt-4 border-t border-gray-700">
                  <Avatar className="w-11 h-11">
                    <AvatarFallback className="bg-red-600 text-white font-bold text-sm">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-white text-sm">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
