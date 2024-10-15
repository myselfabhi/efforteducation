"use client";

import React from 'react';
import { Star, Award, Users, CheckCircle } from 'lucide-react'; // Import Lucide icons
import Link from 'next/link';

const CourseSection: React.FC = () => {

  return (
    <section id="homecourses" className="py-12 bg-gray-900 text-white relative">
      {/* Background Visual (optional abstract patterns or light gradients) */}
      <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-red-600 via-black to-red-800"></div>

      <div className="container relative mx-auto flex flex-col space-y-14 items-center">
        {/* Heading with Visual Icon */}
        <div className="text-center max-w-2xl">
          <div className="flex justify-center items-center space-x-3">
            <Star className="w-8 h-8 text-red-500" />
            <h2 className="text-4xl font-bold">Discover Our Range of Courses</h2>
          </div>
          <p className="text-lg text-gray-300 mt-4">
            Effort Education has been delivering high-quality coaching for school children aiming for IAS and competitive exams since 1991. Learn live from expert educators and take your preparation to the next level.
          </p>
        </div>

        {/* Statistics / Highlights Section */}
        <div className="flex justify-around w-full max-w-5xl mt-8 text-center space-x-4">
          <div className="flex flex-col items-center">
            <Award className="w-10 h-10 text-red-500 mb-2" />
            <h3 className="text-3xl font-bold text-red-500">30+</h3>
            <p className="text-lg text-gray-300">Years of Excellence</p>
          </div>
          <div className="flex flex-col items-center">
            <Users className="w-10 h-10 text-red-500 mb-2" />
            <h3 className="text-3xl font-bold text-red-500">5000+</h3>
            <p className="text-lg text-gray-300">Students Coached</p>
          </div>
          <div className="flex flex-col items-center">
            <CheckCircle className="w-10 h-10 text-red-500 mb-2" />
            <h3 className="text-3xl font-bold text-red-500">95%</h3>
            <p className="text-lg text-gray-300">Success Rate</p>
          </div>
        </div>

        {/* Testimonials Carousel (Placeholder for future slider/carousel) */}
        <div className="mt-8 w-full max-w-4xl">
          <div className="bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
            <h3 className="text-xl font-semibold">What Our Students Say</h3>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-700"></div>
              <p className="text-lg text-gray-300">
                "Effort Education's live classes and personal guidance helped me excel in my IAS preparation. The tutors were outstanding!"
              </p>
            </div>
            <div className="flex items-center justify-end space-x-2">
              <span className="text-sm text-gray-400">- Student Name</span>
            </div>
          </div>
        </div>

        {/* Explore Courses Button */}
        <div className="mt-8">
          <Link href="/courses" passHref>
            <button className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-800 transition duration-300">
              Explore All Courses
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CourseSection;
