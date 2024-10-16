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
            At Effort Education, we empower young minds with the skills, knowledge,<br/> and discipline needed to  excel in competitive exams like IAS, SSC, and more.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
            <Book className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Comprehensive Curriculum</h3>
            <p className="text-gray-600">
              Our carefully structured curriculum covers every subject needed for government exams, ensuring a holistic learning experience.
            </p>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
            <UserCheck className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Expert Educators</h3>
            <p className="text-gray-600">
              Our team consists of experienced educators who have mentored thousands of students to success in the most challenging exams.
            </p>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
            <CheckCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Proven Success Rate</h3>
            <p className="text-gray-600">
              With a 95% success rate, our students consistently outperform their peers in competitive exams.
            </p>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
            <Clock className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Flexible Learning</h3>
            <p className="text-gray-600">
              Our flexible learning platform allows students to attend live classes and access study materials at their convenience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
