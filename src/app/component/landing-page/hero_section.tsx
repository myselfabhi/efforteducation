"use client";

import React from 'react';
import Image from 'next/image';

const Hero: React.FC = () => {
  return (
    <section className="bg-gray-900 py-10 text-white">
      <div className="container mx-auto flex flex-col space-y-14 items-center">
        {/* Content Wrapper */}
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4">
          {/* Left Side */}
          <div className="md:w-1/2 text-left">
            <span className="text-red-600 text-xl">5 Stars</span>
            <p className="text-gray-400">Check our Courses</p>
            <h1 className="text-4xl md:text-6xl font-bold my-4">
              Find Your Perfect Learning <span className="text-red-600">Platform</span>
            </h1>
            <p className="text-gray-400 mb-6">
              In the vast landscape of online learning platforms, finding the perfect one tailored to your needs can be a transformative journey.
            </p>
            <button className="bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700">
              Get Started
            </button>
          </div>
          {/* Right Side */}
          <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
            <Image
              src="/hero.jpg" // This is the correct path to your image file in the public folder
              alt="Learning Platform"
              width={500}
              height={500}
              className="rounded-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
