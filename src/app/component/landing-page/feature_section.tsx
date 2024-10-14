"use client";

import React from 'react';
import { Book, Medal, GraduationCap } from 'lucide-react';

const FeatureSection: React.FC = () => {
  return (
    <section className="py-16 bg-white text-black">
      <div className="container mx-auto px-4">
        {/* Content Wrapper */}
        <div className="w-full max-w-7xl mx-auto flex flex-col space-y-14 items-center">
          <div className="w-full flex flex-col md:flex-row items-start justify-between">
            {/* Left Side: About Us and Subtitle */}
            <div className="md:w-1/3 mb-8 md:mb-0">
              <h2 className="text-4xl font-bold mb-4 text-red-600">About Effort Education</h2>
              <p className="text-gray-700 text-lg">
                Since 1991, we have been offering a wide range of educational courses. Post-COVID, we transitioned online and introduced specialized IAS coaching for children, empowering future leaders.
              </p>
            </div>
            {/* Right Side: Feature Cards */}
            <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center mb-4 text-red-600">
                  <Book className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-black">Comprehensive Curriculum</h3>
                <p className="text-gray-700">
                  Access an in-depth curriculum covering all subjects needed for IAS exams, created by top educators.
                </p>
              </div>
              <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center mb-4 text-red-600">
                  <Medal className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-black">Top-Notch Educators</h3>
                <p className="text-gray-700">
                  Learn from experienced tutors who have guided thousands of students to success.
                </p>
              </div>
              <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center mb-4 text-red-600">
                  <GraduationCap className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-black">Proven Success Stories</h3>
                <p className="text-gray-700">
                  Join the ranks of students who have successfully cleared competitive exams with our guidance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureSection;
