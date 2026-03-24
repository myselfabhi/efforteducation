'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, Monitor, Users, Languages, Award } from 'lucide-react';
import type { Course } from '../../../data/courses';

interface CourseDetailsProps {
  course: Course;
}

export default function CourseDetails({ course }: CourseDetailsProps) {
  return (
    <>
      {/* Overview Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight uppercase">
                Program <span className="text-red-600">Overview</span>
              </h2>
              <p className="text-gray-500 mb-8 font-medium leading-relaxed text-lg">
                {course.overview}
              </p>
              
              <h3 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-widest text-red-600 text-sm">
                What You&apos;ll Master
              </h3>
              <ul className="space-y-4 mb-10">
                {course.highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Syllabus Section */}
              <h3 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-widest text-red-600 text-sm mt-12">
                Detailed Syllabus
              </h3>
              <div className="space-y-8">
                {course.syllabus.map((section, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                  >
                    <h4 className="text-lg font-bold text-gray-900 mb-4">{section.title}</h4>
                    <ul className="grid sm:grid-cols-2 gap-2">
                      {section.topics.map((topic, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-red-600 font-black">•</span>
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <div className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-2xl sticky top-24">
                <h3 className="text-xs font-black text-red-600 mb-8 uppercase tracking-[0.2em]">Quick Specs</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                    <Calendar className="w-4 h-4 text-red-600" />
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Duration</span>
                      <span className="text-gray-900 font-bold">{course.duration}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                    <Monitor className="w-4 h-4 text-red-600" />
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Mode</span>
                      <span className="text-gray-900 font-bold">{course.mode}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                    <Users className="w-4 h-4 text-red-600" />
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Batch</span>
                      <span className="text-gray-900 font-bold">{course.batch}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                    <Languages className="w-4 h-4 text-red-600" />
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Language</span>
                      <span className="text-gray-900 font-bold">{course.language}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <Award className="w-4 h-4 text-red-600" />
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Eligibility</span>
                      <span className="text-gray-900 font-bold text-xs leading-relaxed">{course.eligibility}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Exam Pattern Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight uppercase text-center">
              Exam <span className="text-red-600">Pattern</span>
            </h2>
            
            <div className="space-y-8">
              {course.examPattern.map((pattern, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-slate-50 rounded-2xl p-6 border border-gray-100"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">
                    {pattern.stage}
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-xs font-black uppercase tracking-wider text-gray-500">Section</th>
                          <th className="text-center py-3 px-4 text-xs font-black uppercase tracking-wider text-gray-500">Questions</th>
                          <th className="text-center py-3 px-4 text-xs font-black uppercase tracking-wider text-gray-500">Marks</th>
                          <th className="text-center py-3 px-4 text-xs font-black uppercase tracking-wider text-gray-500">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pattern.sections.map((section, j) => (
                          <tr key={j} className="border-b border-gray-100 last:border-0">
                            <td className="py-3 px-4 text-sm text-gray-700 font-medium">{section.name}</td>
                            <td className="py-3 px-4 text-sm text-gray-700 text-center">{section.questions > 0 ? section.questions : '-'}</td>
                            <td className="py-3 px-4 text-sm text-gray-700 text-center">{section.marks}</td>
                            <td className="py-3 px-4 text-sm text-gray-700 text-center">{section.duration || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-100">
                          <td className="py-3 px-4 text-sm font-bold text-gray-900">Total</td>
                          <td className="py-3 px-4 text-sm font-bold text-gray-900 text-center">{pattern.totalQuestions > 0 ? pattern.totalQuestions : '-'}</td>
                          <td className="py-3 px-4 text-sm font-bold text-gray-900 text-center">{pattern.totalMarks}</td>
                          <td className="py-3 px-4 text-sm font-bold text-gray-900 text-center">
                            {pattern.sections[0]?.duration || '-'}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {pattern.negativeMarking && (
                    <p className="mt-4 text-xs text-gray-500 font-medium">
                      <span className="text-red-600 font-black">Note:</span> {pattern.negativeMarking}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
