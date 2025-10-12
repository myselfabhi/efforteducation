'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Users, TrendingUp, Megaphone, Brain, Loader2, AlertCircle } from 'lucide-react';
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
        setError(null);
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

  const refetch = () => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
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
  };

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
    <section id="programs" className="py-10 sm:py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto max-w-5xl px-4 lg:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 animate-slide-up">
            Our <span className="text-red-600">Programs</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed animate-slide-up-delay">
            Choose from our comprehensive range of programs designed to meet diverse learning needs.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-red-600" />
            <span className="ml-2 text-gray-600 text-sm">Loading courses...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <p className="text-red-600 mb-3 text-sm">{error}</p>
            <Button onClick={refetch} variant="outline" size="sm" className="mr-2">
              Try Again
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline" size="sm">
              Reload Page
            </Button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <div className="grid lg:grid-cols-2 gap-5 lg:gap-6">
            
            {/* Government Competitive Exams */}
            <div className="animate-slide-up">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 text-center">
                Government Competitive Exams
              </h3>
              <div className="space-y-3">
                {governmentExams.map((exam, index) => {
                  const IconComponent = getCategoryIcon(exam.category);
                  return (
                    <Card key={exam.id} className="border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white transform hover:-translate-y-1 hover:border-red-200 animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                            <IconComponent className="w-5 h-5 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                              {exam.title}
                            </h4>
                            <p className="text-gray-700 mb-3 text-xs sm:text-sm leading-relaxed">
                              {exam.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-gray-600">
                                <span className="font-semibold text-red-600">₹{exam.price.toLocaleString()}</span>
                                {exam.originalPrice && exam.originalPrice > exam.price && (
                                  <span className="ml-1 line-through text-gray-400">
                                    ₹{exam.originalPrice.toLocaleString()}
                                  </span>
                                )}
                              </div>
                              <Button
                                onClick={scrollToContact}
                                variant="ghost"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 p-0 h-auto font-semibold text-xs sm:text-sm group"
                              >
                                Learn More 
                                <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
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
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 text-center">
                School Enrichment Programs
              </h3>
              <div className="space-y-3">
                {enrichmentPrograms.map((program, index) => {
                  const IconComponent = getCategoryIcon(program.category);
                  return (
                    <Card key={program.id} className="border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white transform hover:-translate-y-1 hover:border-red-200 animate-scale-in" style={{animationDelay: `${(index + 3) * 0.1}s`}}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                            <IconComponent className="w-5 h-5 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                              {program.title}
                            </h4>
                            <p className="text-gray-700 mb-3 text-xs sm:text-sm leading-relaxed">
                              {program.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-gray-600">
                                <span className="font-semibold text-red-600">₹{program.price.toLocaleString()}</span>
                                {program.originalPrice && program.originalPrice > program.price && (
                                  <span className="ml-1 line-through text-gray-400">
                                    ₹{program.originalPrice.toLocaleString()}
                                  </span>
                                )}
                              </div>
                              <Button
                                onClick={scrollToContact}
                                variant="ghost"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 p-0 h-auto font-semibold text-xs sm:text-sm group"
                              >
                                Learn More 
                                <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
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