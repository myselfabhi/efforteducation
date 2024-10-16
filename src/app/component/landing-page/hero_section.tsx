"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const Hero: React.FC = () => {
  return (
    <section className="relative py-16 bg-gray-900 text-white">
      <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-red-600 via-black to-red-800"></div>

      <div className="relative container mx-auto flex flex-col md:flex-row items-center justify-between space-y-10 md:space-y-0 px-4 sm:px-6 lg:px-8">
        
        {/* Left Content */}
        <motion.div 
          className="md:w-1/2 text-left z-10"
          initial={{ opacity: 0, x: -50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl font-bold leading-tight mb-6 text-white">
            Empower Tomorrow’s Leaders with <br /> 
            <span className="text-5xl md:text-6xl text-red-500">Effort Education</span>
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Equip your child with the knowledge, critical thinking, and leadership skills needed to excel in competitive exams. Our <b>Young Scholars IAS</b> program is tailored to prepare students for a bright future in public service.
          </p>
          <motion.button 
            className="bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition"
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Get Started
          </motion.button>
        </motion.div>

        {/* Right Image */}
        <motion.div 
          className="md:w-1/2 flex justify-center z-10"
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
