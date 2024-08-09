"use client"

import React from 'react';
import Link from 'next/link';
import Image from 'next/image'
import CTASection from './CTASection';
import P from './1653393633phphF03nQ.jpeg'
import { useState } from 'react';

const HomePage: React.FC = () => {
  const [isTextVisible, setIsTextVisible] = useState(false);

  const toggleTextVisibility = () => {
    setIsTextVisible(!isTextVisible);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-grey py-10">
        <div className="my-10">
          <div className="mx-20">
            <span className="text-3xl font-medium italic">Lessons and insights</span>
            <span className="text-4xl text-blue-400 font-light"> from</span>
            <h2 className=" text-center text-6xl text-green-600 font-extrabold">effort education</h2>
          </div>


          <p className="mx-20 text-blue-500">Unlock Your Potential with Our Comprehensive Courses</p>
          <br />
          <button className="mx-20 bg-green-600 hover:bg-red-700 text-white font-bold py-2 px-4 border  rounded">Register</button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto ">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Effort Education?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Expert Instructors</h3>
              <p className="text-gray-700">Learn from industry-leading experts with years of experience in banking and finance. Our instructors are dedicated to providing high-quality education and sharing their practical insights to help you succeed.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Comprehensive Course Curriculum</h3>
              <p className="text-gray-700">Our courses are meticulously designed to cover all aspects of banking exams, ensuring you have the knowledge and skills needed to excel. From foundational concepts to advanced strategies, we've got you covered.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Personalized Learning Experience</h3>
              <p className="text-gray-700">At Effort Education, we understand that every student is unique. That's why we offer personalized learning experiences tailored to your needs and learning style. Whether you prefer interactive lectures, one-on-one sessions, or self-paced learning, we've got the resources to support you.</p>
            </div>
            {/* Add more feature cards here */}
          </div>
        </div>
      </section>

      {/* Courses Section */}



      <section id="homecourses" className="py-12 bg-white">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Courses</h2>

        {/* row 1 of cards */}
        <div className="container mx-auto flex flex-wrap   ">
          {/* card 1 */}
          <div className="flex flex-col justify-center items-center max-w-sm mx-auto my-8">
            <div
              
              className="bg-gray-300 h-55 w-full rounded-lg shadow-md bg-cover bg-center"
            >  <Image  src={P} alt="image"  /></div>
          <div className="w-56 md:w-64 bg-white -mt-10 shadow-lg rounded-lg  items-center content-center overflow-hidden py-2 px-3">

            <div className=" text-center py-2 px-3 bg-white \\">


              <div className="max-w-md mx-auto ">
                <h1 className="py-2 font-bold text-xl">Aptitude Test</h1>
                <p className="leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi non ipsum vel nunc commodo hendrerit sit amet vel

                  {isTextVisible && (
                    <span id="more-text">
                      Sed eu enim malesuada, fermentum mi eu, finibus velit. Nam quis blandit velit, vel vehicula neque. Etiam eu lorem suscipit, sollicitudin ante at, pharetra quam.
                    </span>
                  )}
                </p>
                {!isTextVisible && (
                  <button onClick={toggleTextVisibility} className="mt-4 text-green-400 focus:outline-none text-xs  px-2 py-1 font-semibold rounded uppercase  hover:text-red-600">
                    Read More
                  </button>
                )}
                {isTextVisible && (
                  <button onClick={toggleTextVisibility} className="mt-4 text-green-400 focus:outline-none">
                    Hide
                  </button>
                )}
              </div>

            </div>
                </div>
          </div>
                {/* card 2 */}
                <div className="flex flex-col justify-center items-center max-w-sm mx-auto my-8">
            <div
              
              className="bg-gray-300 h-55 w-full rounded-lg shadow-md bg-cover bg-center"
            >  <Image src={P} alt="image"  /></div>
          <div className="w-56 md:w-64 bg-white -mt-10 shadow-lg rounded-lg  items-center content-center overflow-hidden py-2 px-3">

            <div className=" text-center py-2 px-3 bg-white \\">


              <div className="max-w-md mx-auto ">
                <h1 className="py-2 font-bold text-xl">Aptitude Test</h1>
                <p className="leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi non ipsum vel nunc commodo hendrerit sit amet vel

                  {isTextVisible && (
                    <span id="more-text">
                      Sed eu enim malesuada, fermentum mi eu, finibus velit. Nam quis blandit velit, vel vehicula neque. Etiam eu lorem suscipit, sollicitudin ante at, pharetra quam.
                    </span>
                  )}
                </p>
                {!isTextVisible && (
                  <button onClick={toggleTextVisibility} className="mt-4 text-green-400 focus:outline-none text-xs  px-2 py-1 font-semibold rounded uppercase  hover:text-red-600">
                    Read More
                  </button>
                )}
                {isTextVisible && (
                  <button onClick={toggleTextVisibility} className="mt-4 text-green-400 focus:outline-none">
                    Hide
                  </button>
                )}
              </div>

            </div>
                </div>
          </div>
        {/* card3 */}
        <div className="flex flex-col justify-center items-center max-w-sm mx-auto my-8">
            <div
              
              className="bg-gray-300 h-55 w-full rounded-lg shadow-md bg-cover bg-center"
            >  <Image src={P} alt="image" /></div>
          <div className="w-56 md:w-64 bg-white -mt-10 shadow-lg rounded-lg  items-center content-center overflow-hidden py-2 px-3">

            <div className=" text-center py-2 px-3 bg-white \\">


              <div className="max-w-md mx-auto ">
                <h1 className="py-2 font-bold text-xl">Aptitude Test</h1>
                <p className="leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi non ipsum vel nunc commodo hendrerit sit amet vel

                  {isTextVisible && (
                    <span id="more-text">
                      Sed eu enim malesuada, fermentum mi eu, finibus velit. Nam quis blandit velit, vel vehicula neque. Etiam eu lorem suscipit, sollicitudin ante at, pharetra quam.
                    </span>
                  )}
                </p>
                {!isTextVisible && (
                  <button onClick={toggleTextVisibility} className="mt-4 text-green-400 focus:outline-none text-xs  px-2 py-1 font-semibold rounded uppercase  hover:text-red-600">
                    Read More
                  </button>
                )}
                {isTextVisible && (
                  <button onClick={toggleTextVisibility} className="mt-4 text-green-400 focus:outline-none">
                    Hide
                  </button>
                )}
              </div>

            </div>
                </div>
          </div>
          </div>
        {/* row 2 of cards */}
        
       
      </section >
      
        {/* Call-to-Action Section */ }
        < CTASection />
    </div>



 
      
  );
}

export default HomePage;
