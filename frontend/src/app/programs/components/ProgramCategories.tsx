'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Users, TrendingUp, Megaphone, Brain, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { api, Course } from '../../../lib/api';

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

  const categories = ['government_exam', 'school_enrichment', 'leadership', 'public_speaking'];
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
          <div className="grid lg:grid-cols-2 gap-8">
            {categoryCourses.map(({ category, courses: categoryCoursesList }) => {
              const IconComponent = getCategoryIcon(category);
              const hasCourses = categoryCoursesList.length > 0;
              
              return (
                <Card key={category} className="border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white transform hover:-translate-y-2 hover:border-red-200">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <IconComponent className="w-8 h-8 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          {getCategoryTitle(category)}
                        </h3>
                        <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                          {getCategoryDescription(category)}
                        </p>
                        
                        {hasCourses && (
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900 text-lg">Available Courses:</h4>
                            {categoryCoursesList.slice(0, 3).map((course) => (
                              <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <h5 className="font-semibold text-gray-900">{course.title}</h5>
                                  <p className="text-sm text-gray-600">{course.duration}</p>
                                </div>
                                <div className="text-right">
                                  <span className="font-bold text-red-600">₹{course.price.toLocaleString()}</span>
                                  {course.originalPrice && course.originalPrice > course.price && (
                                    <p className="text-xs line-through text-gray-400">₹{course.originalPrice.toLocaleString()}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                            {categoryCoursesList.length > 3 && (
                              <p className="text-sm text-gray-600 font-medium">
                                +{categoryCoursesList.length - 3} more courses available
                              </p>
                            )}
                          </div>
                        )}
                        
                        <div className="mt-6">
                          <a 
                            href="/courses"
                            className="inline-flex items-center text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors font-semibold group"
                          >
                            View All Courses 
                            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                          </a>
                        </div>
                      </div>
                    </div>
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
