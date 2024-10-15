"use client";

import React from 'react';
import { Book, Medal, GraduationCap } from 'lucide-react';

const FeatureSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50 text-black relative">
      {/* Decorative Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-red-50 to-white opacity-80"></div>

      <div className="container relative mx-auto px-4 text-center">
        {/* Content Wrapper */}
        <div className="w-full max-w-7xl mx-auto flex flex-col space-y-14 items-center">
          
          {/* Section Intro */}
          <div className="w-full flex flex-col items-center space-y-6">
            <h2 className="text-4xl font-bold text-red-600">
              About Effort Education
            </h2>
            <p className="text-lg text-gray-700 max-w-xl leading-relaxed">
              Since 1991, we have been offering a wide range of educational courses. Post-COVID, we transitioned online and introduced specialized IAS coaching for children, empowering future leaders.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature Card 1 */}
            <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-center mb-4 text-red-600">
                <Book className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Comprehensive Curriculum</h3>
              <p className="text-gray-700">
                Access an in-depth curriculum covering all subjects needed for IAS exams, created by top educators.
              </p>
            </div>
            
            {/* Feature Card 2 */}
            <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-center mb-4 text-red-600">
                <Medal className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Top-Notch Educators</h3>
              <p className="text-gray-700">
                Learn from experienced tutors who have guided thousands of students to success.
              </p>
            </div>
            
            {/* Feature Card 3 */}
            <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-center mb-4 text-red-600">
                <GraduationCap className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Proven Success Stories</h3>
              <p className="text-gray-700">
                Join the ranks of students who have successfully cleared competitive exams with our guidance.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureSection;
