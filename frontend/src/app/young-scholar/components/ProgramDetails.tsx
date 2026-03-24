'use client';

import { Card, CardContent } from '@/app/components/ui/card';
import { Calendar, Users, Laptop, IndianRupee, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProgramDetails() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase"
          >
            Program <span className="text-red-600">Logistics</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Everything you need to know about the Young Scholar Program infrastructure and costs.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border border-gray-100 bg-white rounded-2xl h-full shadow-lg">
              <CardContent className="p-8">
                <div className="space-y-8">
                  {[
                    { icon: Users, title: "Age Group", text: "Class 4-8 Students" },
                    { icon: Calendar, title: "Schedule", text: "Weekend program", sub: "Flexible timing available" },
                    { icon: Laptop, title: "Mode", text: "Online (Live Classes)", sub: "Learn from home comfort" },
                    { icon: Users, title: "Class Size", text: "Small, Interactive Batches" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-5 group">
                      <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-red-600 transition-colors">
                        <item.icon className="w-5 h-5 text-red-600 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{item.title}</h3>
                        <p className="text-gray-900 font-bold text-base">{item.text}</p>
                        {item.sub && <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-0.5">{item.sub}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border border-gray-100 bg-slate-50 rounded-2xl h-full shadow-lg overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <CardContent className="p-8">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-600/20">
                    <IndianRupee className="w-7 h-7 text-white" strokeWidth={3} />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Investment</h3>
                    <p className="text-4xl font-black text-gray-900 tracking-tighter">₹999</p>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-200">
                  <h3 className="text-xs font-black uppercase tracking-widest text-red-600 mb-6">What&apos;s Included</h3>
                  <div className="space-y-4">
                    {[
                      "Live interactive classes on weekends",
                      "Digital study materials & resources",
                      "Practice quizzes and assessments",
                      "Regular student progress tracking",
                      "Dedicated doubt clearing sessions"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-600">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
