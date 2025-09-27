'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Users, TrendingUp, Megaphone, Brain, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { api, Course } from '../../../lib/api';

export default function Programs() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await api.getCourses({ featured: true });
        setCourses(response.data.courses);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Get icon for course category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'government_exam':
        return TrendingUp;
      case 'school_enrichment':
        return Brain;
      case 'leadership':
        return Users;
      case 'public_speaking':
        return Megaphone;
      default:
        return BookOpen;
    }
  };

  // Filter courses by category
  const governmentExams = courses.filter(course => course.category === 'government_exam');
  const enrichmentPrograms = courses.filter(course => 
    course.category === 'school_enrichment' || 
    course.category === 'leadership' || 
    course.category === 'public_speaking'
  );

  return (
    <section id="programs" className="py-16 sm:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto max-w-6xl px-4 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 animate-slide-up">
            Our <span className="text-red-600">Programs</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed animate-slide-up-delay">
            Choose from our comprehensive range of programs designed to meet diverse learning needs and career aspirations.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            <span className="ml-2 text-gray-600">Loading courses...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Government Competitive Exams */}
            <div className="animate-slide-up">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 sm:mb-10 text-center">
                Government Competitive Exams
              </h3>
              <div className="space-y-4 sm:space-y-6">
                {governmentExams.map((exam, index) => {
                  const IconComponent = getCategoryIcon(exam.category);
                  return (
                    <Card key={exam.id} className="border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white transform hover:-translate-y-1 hover:border-red-200 animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                      <CardContent className="p-6 sm:p-8">
                        <div className="flex items-start space-x-4 sm:space-x-6">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                              {exam.title}
                            </h4>
                            <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg leading-relaxed">
                              {exam.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-600">
                                <span className="font-semibold text-red-600">₹{exam.price.toLocaleString()}</span>
                                {exam.originalPrice && exam.originalPrice > exam.price && (
                                  <span className="ml-2 line-through text-gray-400">
                                    ₹{exam.originalPrice.toLocaleString()}
                                  </span>
                                )}
                              </div>
                              <Button
                                onClick={scrollToContact}
                                variant="ghost"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 p-0 h-auto font-semibold text-sm sm:text-base lg:text-lg group"
                              >
                                Learn More 
                                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* School Enrichment Programs */}
            <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 sm:mb-10 text-center">
                School Enrichment Programs
              </h3>
              <div className="space-y-4 sm:space-y-6">
                {enrichmentPrograms.map((program, index) => {
                  const IconComponent = getCategoryIcon(program.category);
                  return (
                    <Card key={program.id} className="border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white transform hover:-translate-y-1 hover:border-red-200 animate-scale-in" style={{animationDelay: `${(index + 3) * 0.1}s`}}>
                      <CardContent className="p-6 sm:p-8">
                        <div className="flex items-start space-x-4 sm:space-x-6">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                              {program.title}
                            </h4>
                            <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg leading-relaxed">
                              {program.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-600">
                                <span className="font-semibold text-red-600">₹{program.price.toLocaleString()}</span>
                                {program.originalPrice && program.originalPrice > program.price && (
                                  <span className="ml-2 line-through text-gray-400">
                                    ₹{program.originalPrice.toLocaleString()}
                                  </span>
                                )}
                              </div>
                              <Button
                                onClick={scrollToContact}
                                variant="ghost"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 p-0 h-auto font-semibold text-sm sm:text-base lg:text-lg group"
                              >
                                Learn More 
                                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}