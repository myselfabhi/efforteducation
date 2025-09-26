'use client';

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import CourseGrid from "./components/CourseGrid";
import CourseFilter from "./components/CourseFilter";

export default function CoursesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto max-w-6xl px-4 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our Courses
              </h1>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Choose from our comprehensive range of programs designed to meet diverse learning needs and career aspirations.
              </p>
            </div>
            <CourseFilter />
            <CourseGrid />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
