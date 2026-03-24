'use client';

import { motion } from 'framer-motion';

export default function CourseDetails() {
  return (
    <section className="py-16 bg-gray-950">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid lg:grid-cols-3 gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <h2 className="text-3xl font-black text-white mb-8 tracking-tight uppercase">Program <span className="text-red-500">Overview</span></h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-400 mb-8 font-medium leading-relaxed">
                This comprehensive course is designed to prepare students for competitive examinations with a focus on all key areas including logical reasoning, core subject depth, and general awareness.
              </p>
              
              <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest text-yellow-500 text-sm">What You&apos;ll Master</h3>
              <ul className="space-y-4 mb-10">
                {[
                  "Quantitative Aptitude - Advanced problem solving & logic",
                  "Reasoning - Analytical and verbal reasoning mastery",
                  "General Awareness - Daily current affairs & domain knowledge",
                  "Subject Expertise - Deep dive into core examination syllabus",
                  "Interview Skills - Personality development & mock sessions"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300 font-medium">
                    <span className="text-red-500 font-black">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-900 border border-gray-800 p-8 rounded-[2rem] shadow-2xl sticky top-24">
              <h3 className="text-xs font-black text-red-500 mb-8 uppercase tracking-[0.2em]">Quick Specs</h3>
              <div className="space-y-6">
                {[
                  { label: "Duration", value: "6 Months" },
                  { label: "Mode", value: "Online Live" },
                  { label: "Batch", value: "Limited Seats" },
                  { label: "Language", value: "Eng / Hindi" }
                ].map((spec, i) => (
                  <div key={i} className="border-b border-gray-800 pb-4 last:border-0 last:pb-0">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 block mb-1">{spec.label}</span>
                    <span className="text-gray-200 font-bold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
