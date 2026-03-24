'use client';

import { Users, Award, BookOpen, TrendingUp } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { motion } from "framer-motion";

export default function StatsSection() {
  const stats = [
    {
      icon: Users,
      number: "500+",
      label: "Students Taught",
      description: "Successfully guided students through their educational journey"
    },
    {
      icon: Award,
      number: "95%",
      label: "Success Rate",
      description: "Students who achieve their academic and career goals"
    },
    {
      icon: BookOpen,
      number: "15+",
      label: "Years Experience",
      description: "Dedicated to providing quality education and guidance"
    },
    {
      icon: TrendingUp,
      number: "200+",
      label: "Success Stories",
      description: "Students who have excelled in competitive examinations"
    }
  ];

  return (
    <section className="py-16 bg-gray-950 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight"
          >
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">Achievements</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base text-gray-400 max-w-2xl mx-auto leading-relaxed"
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
                className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-red-500/30 transition-all duration-300 transform hover:-translate-y-1 rounded-2xl overflow-hidden group"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-6 border border-gray-700 group-hover:border-red-500/50 transition-colors">
                    <stat.icon className="w-6 h-6 text-red-500" />
                  </div>
                  
                  <div className="text-4xl font-black text-white mb-2 tracking-tighter">
                    {stat.number}
                  </div>
                  
                  <h3 className="text-sm font-bold text-yellow-500 uppercase tracking-widest mb-3">
                    {stat.label}
                  </h3>
                  
                  <p className="text-gray-500 text-xs leading-relaxed font-medium">
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
