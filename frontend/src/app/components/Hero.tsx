"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative py-16 bg-gray-900" id="home">
      <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-red-600 via-black to-red-800" />
      <div className="relative container mx-auto flex flex-col md:flex-row items-center justify-between space-y-10 md:space-y-0 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="md:w-1/2 text-left z-10"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl font-bold leading-tight mb-6 text-white">
            Building Skills Beyond Classrooms & Preparing Leaders of Tomorrow
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Effort Education empowers students with real-world skills and academic excellence. Explore our Government Competitive Exams and School Enrichment Programs designed to build confident, future-ready leaders.
          </p>
          <motion.button
            className="bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Explore Courses
          </motion.button>
        </motion.div>

        <motion.div
          className="md:w-1/2 flex justify-center z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="w-[450px] h-[300px] bg-gray-800 rounded-lg shadow-lg flex items-center justify-center text-gray-400">
            Hero Image
          </div>
        </motion.div>
      </div>
    </section>
  );
}


