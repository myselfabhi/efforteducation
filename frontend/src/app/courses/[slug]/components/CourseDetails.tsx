'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, Monitor, Users, Languages, Award, BookOpen } from 'lucide-react';
import type { Course } from '../../../data/courses';

interface CourseDetailsProps {
  course: Course;
}

export default function CourseDetails({ course }: CourseDetailsProps) {
  return (
    <>
      {/* Overview Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Program <span className="text-red-600">Overview</span>
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed text-base">
                {course.overview}
              </p>
              
              {/* Highlights */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-red-600" />
                  What You&apos;ll Master
                </h3>
                <ul className="space-y-3">
                  {course.highlights.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                      <CheckCircle2 className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Syllabus Section */}
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-red-600">—</span> Detailed Syllabus
              </h3>
              <div className="space-y-6">
                {course.syllabus.map((section, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
                  >
                    <h4 className="text-base font-bold text-gray-900 mb-3">{section.title}</h4>
                    <ul className="grid sm:grid-cols-2 gap-2">
                      {section.topics.map((topic, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-gray-500">
                          <span className="text-red-500 font-bold">•</span>
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
              <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm sticky top-24">
                <h3 className="text-xs font-bold text-red-600 mb-6 uppercase tracking-widest">Quick Info</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block uppercase tracking-wider">Duration</span>
                      <span className="text-sm font-semibold text-gray-900">{course.duration}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                      <Monitor className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block uppercase tracking-wider">Mode</span>
                      <span className="text-sm font-semibold text-gray-900">{course.mode}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block uppercase tracking-wider">Batch</span>
                      <span className="text-sm font-semibold text-gray-900">{course.batch}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                      <Languages className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block uppercase tracking-wider">Language</span>
                      <span className="text-sm font-semibold text-gray-900">{course.language}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block uppercase tracking-wider">Eligibility</span>
                      <span className="text-sm font-medium text-gray-700 leading-relaxed">{course.eligibility}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Exam Pattern Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
              Exam <span className="text-red-600">Pattern</span>
            </h2>
            
            <div className="space-y-8 max-w-4xl mx-auto">
              {course.examPattern.map((pattern, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
                >
                  <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <span className="w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </span>
                    {pattern.stage}
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-gray-500">Section</th>
                          <th className="text-center py-3 px-4 text-xs font-bold uppercase tracking-wider text-gray-500">Questions</th>
                          <th className="text-center py-3 px-4 text-xs font-bold uppercase tracking-wider text-gray-500">Marks</th>
                          <th className="text-center py-3 px-4 text-xs font-bold uppercase tracking-wider text-gray-500">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pattern.sections.map((section, j) => (
                          <tr key={j} className="border-b border-gray-100 last:border-0 hover:bg-gray-100/50 transition-colors">
                            <td className="py-3 px-4 text-sm text-gray-700">{section.name}</td>
                            <td className="py-3 px-4 text-sm text-gray-700 text-center">{section.questions > 0 ? section.questions : '-'}</td>
                            <td className="py-3 px-4 text-sm text-gray-700 text-center">{section.marks}</td>
                            <td className="py-3 px-4 text-sm text-gray-700 text-center text-gray-400">{section.duration || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-red-50">
                          <td className="py-3 px-4 text-sm font-bold text-gray-900 rounded-bl-lg">Total</td>
                          <td className="py-3 px-4 text-sm font-bold text-gray-900 text-center">{pattern.totalQuestions > 0 ? pattern.totalQuestions : '-'}</td>
                          <td className="py-3 px-4 text-sm font-bold text-gray-900 text-center">{pattern.totalMarks}</td>
                          <td className="py-3 px-4 text-sm font-bold text-gray-900 text-center rounded-br-lg">
                            {pattern.sections[0]?.duration || '-'}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {pattern.negativeMarking && (
                    <p className="mt-4 text-xs text-gray-500">
                      <span className="text-red-600 font-semibold">Note:</span> {pattern.negativeMarking}
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
