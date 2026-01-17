'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Users, TrendingUp, Megaphone, Brain, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { api, Course } from '../../../lib/api';
import Link from 'next/link';

export default function ProgramCategories() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.getCourses();
        setCourses(response.data.courses);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setError('Failed to load programs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

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

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'government_exam':
        return 'Government Competitive Exams';
      case 'school_enrichment':
        return 'School Enrichment Programs';
      case 'leadership':
        return 'Leadership Development';
      case 'public_speaking':
        return 'Public Speaking & Communication';
      default:
        return 'Other Programs';
    }
  };

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case 'government_exam':
        return 'Comprehensive preparation for various government competitive examinations including SSC, Banking, and other public sector jobs.';
      case 'school_enrichment':
        return 'Enhance academic performance and develop critical thinking skills for school students.';
      case 'leadership':
        return 'Build essential leadership qualities and learn to inspire and lead teams effectively.';
      case 'public_speaking':
        return 'Master the art of public speaking and develop confident communication skills.';
      default:
        return 'Specialized programs designed to meet specific learning needs.';
    }
  };

  // Only show Government Competitive Exams - Young Scholar has its own dedicated page
  const categories = ['government_exam'];
  const categoryCourses = categories.map(category => ({
    category,
    courses: courses.filter(course => course.category === category)
  }));

  return (
    <section id="programs" className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto max-w-6xl px-4 lg:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Program <span className="text-red-600">Categories</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Explore our comprehensive range of programs designed to meet diverse learning needs and career aspirations.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            <span className="ml-2 text-gray-600">Loading programs...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Reload Page
            </Button>
          </div>
        )}

        {/* Program Categories */}
        {!loading && !error && (
          <div className="grid lg:grid-cols-1 gap-8 max-w-4xl mx-auto">
            {categoryCourses.map(({ category, courses: categoryCoursesList }) => {
              const IconComponent = getCategoryIcon(category);
              const hasCourses = categoryCoursesList.length > 0;
              
              return (
                <Card key={category} className="border border-gray-200 hover:shadow-2xl transition-all duration-300 bg-white transform hover:-translate-y-3 hover:border-red-300 overflow-hidden group">
                  <CardContent className="p-0">
                    {/* Category Header with Gradient Background */}
                    <div className="bg-gradient-to-br from-red-50 via-red-50/50 to-white p-8 pb-6 border-b border-gray-100">
                      <div className="flex items-start space-x-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="w-10 h-10 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            {getCategoryTitle(category)}
                          </h3>
                          <p className="text-gray-700 text-base leading-relaxed">
                            {getCategoryDescription(category)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Course List */}
                    {hasCourses && (
                      <div className="p-6 pt-4 space-y-3">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900 text-lg">Available Courses</h4>
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                            {categoryCoursesList.length} {categoryCoursesList.length === 1 ? 'Course' : 'Courses'}
                          </span>
                        </div>
                        {categoryCoursesList.map((course) => (
                          <Link 
                            key={course.id}
                            href={`/courses/${course.id}`}
                            className="block"
                          >
                            <div 
                              className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-xl hover:from-red-50 hover:to-red-50/30 border border-gray-100 hover:border-red-200 transition-all duration-300 group/course cursor-pointer"
                            >
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-900 mb-1 group-hover/course:text-red-700 transition-colors">
                                  {course.title}
                                </h5>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {course.duration}
                                  </span>
                                  <span className="flex items-center gap-1 text-red-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Online (Live Classes)
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                {course.price === 0 ? (
                                  <span className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-semibold">
                                    Contact for Pricing
                                  </span>
                                ) : (
                                  <div className="text-right">
                                    <span className="font-bold text-red-600">₹{course.price.toLocaleString()}</span>
                                    {course.originalPrice && course.originalPrice > course.price && (
                                      <p className="text-xs line-through text-gray-400">₹{course.originalPrice.toLocaleString()}</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
