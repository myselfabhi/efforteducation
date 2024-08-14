"use client"

import React from 'react';
import Image, { StaticImageData } from 'next/image';
import P from '../../../../public/ctet-cards.jpeg';

interface CourseCardProps {
  title: string;
  category: string;
  price: string;
  duration: string;
  image: StaticImageData;
}

const CourseCard: React.FC<CourseCardProps> = ({ title, category, price, duration, image }) => {
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden max-w-xs mx-auto">
      <div className="relative h-40 w-full">
        <Image src={image} alt={title} layout="fill" objectFit="cover" />
      </div>
      <div className="p-4">
        <div className="text-xs font-semibold uppercase text-red-600 mb-2">{category}</div>
        <h3 className="text-lg font-bold mb-2 text-gray-800">{title}</h3>
        <div className="flex justify-between items-center text-gray-600">
          <span className="font-bold text-xl">{price}</span>
          <span className="text-sm">{duration}</span>
        </div>
      </div>
    </div>
  );
};

const CourseSection: React.FC = () => {
  const courses = [
    { title: 'Mastering the Fundamentals', category: 'Education and Mastery', price: '$142', duration: '50 hrs', image: P },
    { title: 'From Foundations to Advanced Techniques', category: 'Marketing and Strategy', price: '$120', duration: '35 hrs', image: P },
    { title: 'A Step-by-Step Learning Journey', category: 'Data Science and Analytics', price: '$120', duration: '30 hrs', image: P },
    { title: 'Unlocking Graphic Design Mastery', category: 'Graphic Design', price: '$125', duration: '20 hrs', image: P },
  ];

  return (
    <section id="homecourses" className="py-12 bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col space-y-14 items-center">
        {/* Section Header */}
        <div className="flex justify-between items-center w-full max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold">Featured Courses</h2>
          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800">
            Explore All Courses
          </button>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
          {courses.map((course, index) => (
            <CourseCard
              key={index}
              title={course.title}
              category={course.category}
              price={course.price}
              duration={course.duration}
              image={course.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default CourseSection;
