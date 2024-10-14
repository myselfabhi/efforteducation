"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const Hero: React.FC = () => {
  return (
    <section className="bg-gray-900 py-16 text-white px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between space-y-10 md:space-y-0">
        {/* Left Side */}
        <motion.div 
          className="md:w-1/2 text-left"
          initial={{ opacity: 0, x: -50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Prepare for Your Future with <span className="text-red-600">Effort Education</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Join our comprehensive programs designed to help students excel in IAS and other competitive exams, shaping the leaders of tomorrow.
          </p>
          <motion.button 
            className="bg-red-600 text-white font-bold py-3 px-8 rounded-lg"
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Get Started
          </motion.button>
        </motion.div>

        {/* Right Side */}
        <motion.div 
          className="md:w-1/2 flex justify-center"
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1, delay: 0.3 }}
        >
          <Image
            src="/hero.jpg" 
            alt="Effort Education"
            width={450}
            height={450}
            className="rounded-lg shadow-lg"
          />
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
