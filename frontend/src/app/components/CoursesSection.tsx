"use client";

import { Star, Award, Users, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function CoursesSection() {
  return (
    <section id="courses" className="py-12 bg-gray-900 text-white relative">
      <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-red-600 via-black to-red-800" />
      <div className="container relative mx-auto flex flex-col space-y-14 items-center">
        <div className="text-center max-w-2xl">
          <div className="flex justify-center items-center space-x-3">
            <Star className="w-8 h-8 text-red-500" />
            <h2 className="text-4xl font-bold">Discover Our Range of Courses</h2>
          </div>
          <p className="text-lg text-gray-300 mt-4">
            Effort Education has been delivering high-quality coaching for <strong>school children</strong> aspiring to crack the toughest exams since 1991. With the <strong>Young Scholars IAS</strong> program, we are shaping the future leaders of tomorrow.
          </p>
        </div>

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

        <div className="mt-8">
          <Link href="#" passHref>
            <button className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-800 transition duration-300">
              Explore All Courses
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}


