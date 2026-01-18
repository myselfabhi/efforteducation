'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Users, TrendingUp, Megaphone, Brain, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { api, Course } from '../../../lib/api';
import Link from 'next/link';

export default function ProgramCategories() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  // Only show Government Competitive Exams - Young Scholar has its own dedicated page
  const categories = ['government_exam'];
  const categoryCourses = categories.map(category => ({
    category,
    courses: courses.filter(course => course.category === category)
  }));

  return (
    <section id="programs" className="py-16 sm:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto max-w-6xl px-6 sm:px-8 lg:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 px-4">
            Program <span className="text-red-600">Categories</span>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed px-4">
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
                    <div className="bg-gradient-to-br from-red-50 via-red-50/50 to-white p-6 sm:p-8 pb-6 border-b border-gray-100">
                      <div className="flex flex-col sm:flex-row items-start gap-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                            {getCategoryTitle(category)}
                          </h3>
                          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
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
                          <div 
                            key={course.id}
                            onClick={() => handleCourseClick(course)}
                            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-xl hover:from-red-50 hover:to-red-50/30 border border-gray-100 hover:border-red-200 transition-all duration-300 group/course cursor-pointer min-h-[80px]"
                          >
                            <div className="flex-1 w-full">
                              <h5 className="font-semibold text-gray-900 mb-2 group-hover/course:text-red-700 transition-colors text-base sm:text-lg">
                                {course.title}
                              </h5>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-sm text-gray-600">
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
                            <div className="w-full sm:w-auto sm:ml-4">
                              <span className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2.5 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors min-h-[44px]">
                                View Details →
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Course Details Modal - Mobile Optimized */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white w-[95vw] sm:w-full">
            {selectedCourse && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 pr-8">
                    {selectedCourse.title}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6 mt-4 px-1">
                  {/* Course Description */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">About This Course</h3>
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{selectedCourse.description}</p>
                  </div>

                  {/* Course Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-4 bg-gradient-to-br from-red-50 to-red-50/30 rounded-lg border border-red-100">
                      <div className="flex items-center gap-2 text-red-700 mb-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium">Duration</span>
                      </div>
                      <p className="text-gray-900 font-bold text-lg">{selectedCourse.duration}</p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-red-50 to-red-50/30 rounded-lg border border-red-100">
                      <div className="flex items-center gap-2 text-red-700 mb-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium">Mode</span>
                      </div>
                      <p className="text-gray-900 font-bold text-lg">Online (Live Classes)</p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-red-50 to-red-50/30 rounded-lg border border-red-100">
                      <div className="flex items-center gap-2 text-red-700 mb-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-sm font-medium">Batch Size</span>
                      </div>
                      <p className="text-gray-900 font-bold text-lg">Small Batches</p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-red-50 to-red-50/30 rounded-lg border border-red-100">
                      <div className="flex items-center gap-2 text-red-700 mb-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span className="text-sm font-medium">Study Material</span>
                      </div>
                      <p className="text-gray-900 font-bold text-lg">Included</p>
                    </div>
                  </div>

                  {/* What You'll Learn */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">What You&apos;ll Learn</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-gray-700">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">Comprehensive syllabus coverage</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">Regular mock tests and practice sessions</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">Expert faculty with years of experience</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">Personalized doubt clearing sessions</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">Current affairs and study materials</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">Performance tracking and guidance</span>
                      </li>
                    </ul>
                  </div>

                  {/* CTA Section */}
                  <div className="bg-gradient-to-br from-red-100 to-red-50 p-5 sm:p-6 rounded-xl border-2 border-red-200">
                    <div className="text-center">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Interested in this course?</h3>
                      <p className="text-gray-700 mb-4 font-medium text-sm sm:text-base">Contact us to get detailed information about pricing, batch timings, and enrollment.</p>
                      <Link href="/contact">
                        <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto min-h-[52px]">
                          Contact for Pricing & Details →
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
