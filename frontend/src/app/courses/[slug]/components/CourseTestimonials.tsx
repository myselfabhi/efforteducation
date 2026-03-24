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
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto max-w-6xl px-4 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Student <span className="text-red-600">Success</span> Stories
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Hear from our successful students who have excelled in their careers
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {course.testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="bg-gray-800 border border-gray-700 hover:bg-gray-750 transition-colors duration-300"
            >
              <CardContent className="p-6">
                <div className="mb-6">
                  <Quote className="w-8 h-8 text-red-500 mb-4" />
                  <p className="text-gray-300 leading-relaxed italic text-sm">
                    &quot;{testimonial.quote}&quot;
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-red-600 text-white font-bold">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-400">
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
