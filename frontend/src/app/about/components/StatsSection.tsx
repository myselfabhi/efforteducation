'use client';

import { Users, Award, BookOpen, TrendingUp } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { motion } from "framer-motion";

export default function StatsSection() {
  const stats = [
    {
      icon: Users,
      number: "50,000+",
      label: "Students Taught",
      description: "Successfully guided thousands of students through their educational journey"
    },
    {
      icon: Award,
      number: "95%",
      label: "Success Rate",
      description: "Students who achieve their academic and career goals"
    },
    {
      icon: BookOpen,
      number: "25+",
      label: "Years Experience",
      description: "Dedicated to providing quality education and guidance since 1991"
    },
    {
      icon: TrendingUp,
      number: "5,000+",
      label: "Success Stories",
      description: "Students who have excelled in competitive examinations"
    }
  ];

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="container mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase"
          >
            Our <span className="text-red-600">Achievements</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Numbers that reflect our commitment to student success and educational excellence.
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="border border-gray-100 bg-white hover:border-red-100 transition-all duration-300 transform hover:-translate-y-1 rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-6 border border-red-100 group-hover:bg-red-600 transition-colors duration-300">
                    <stat.icon className="w-6 h-6 text-red-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  
                  <div className="text-4xl font-black text-gray-900 mb-2 tracking-tighter">
                    {stat.number}
                  </div>
                  
                  <h3 className="text-xs font-black text-red-600 uppercase tracking-widest mb-3">
                    {stat.label}
                  </h3>
                  
                  <p className="text-gray-400 text-[10px] leading-relaxed font-bold uppercase tracking-widest">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
