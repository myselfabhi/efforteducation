"use client";

import React from 'react';
import { Book, CheckCircle, Clock, UserCheck } from 'lucide-react'; // Lucide Icons

const WhyChooseUsSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50 text-gray-800 relative">
      {/* Background Visual */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-red-50 to-white opacity-80"></div>

      <div className="relative container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-red-600 mb-4">Why Choose Effort Education?</h2>
          <p className="text-lg text-gray-600">
            At Effort Education, we offer a comprehensive range of educational services that help students excel and achieve their goals.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
            <Book className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Comprehensive Curriculum</h3>
            <p className="text-gray-600">
              Our well-rounded curriculum covers all aspects needed for competitive exams, built by top educators in the field.
            </p>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
            <UserCheck className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Expert Educators</h3>
            <p className="text-gray-600">
              Learn from industry-leading educators with decades of experience guiding students to success.
            </p>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
            <CheckCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Proven Success Rate</h3>
            <p className="text-gray-600">
              95% of our students successfully clear competitive exams and go on to achieve their dreams.
            </p>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
            <Clock className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Flexible Learning</h3>
            <p className="text-gray-600">
              Attend live classes at your convenience and access resources anytime with our flexible learning platform.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
