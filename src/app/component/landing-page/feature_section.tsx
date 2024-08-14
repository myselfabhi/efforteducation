"use client"

import React from 'react';
import { BadgeCheck, Infinity, Accessibility } from 'lucide-react';

const FeatureSection: React.FC = () => {
  return (
    <section className="py-12 bg-white text-black">
      <div className="container mx-auto flex flex-col space-y-14 items-center">
        {/* Content Wrapper */}
        <div className="w-full max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-start justify-between">
          {/* Left Side: About Us and Subtitle */}
          <div className="md:w-1/3 mb-8 md:mb-0">
            <h2 className="text-4xl font-bold mb-4">About Us</h2>
            <p className="text-gray-600 text-lg">
              Dive into today&apos;s trendiest courses, from tech essentials like Python to well-being topics such as mental health and nutrition.
            </p>
          </div>
          {/* Right Side: Feature Cards */}
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center mb-4 text-red-600">
                <BadgeCheck className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Tutors</h3>
              <p className="text-gray-700">
                Unlock your potential with the best tutors who inspire you to your unique learning style.
              </p>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center mb-4 text-red-600">
                <Infinity className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Learning</h3>
              <p className="text-gray-700">
                Choose a learning path that suits your schedule with our flexible course options.
              </p>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center mb-4 text-red-600">
                <Accessibility className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Access</h3>
              <p className="text-gray-700">
                Access your learning materials anytime, anywhere with our user-friendly platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureSection;
