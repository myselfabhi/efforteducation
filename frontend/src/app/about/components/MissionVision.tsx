'use client';

import { Target, Lightbulb, Heart } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { motion } from "framer-motion";

export default function MissionVision() {
  const aboutCards = [
    {
      icon: Target,
      title: "Our Mission",
      content:
        "To bridge the gap between traditional education and real-world skills, empowering students to excel in competitive examinations while developing essential life skills and leadership qualities.",
    },
    {
      icon: Lightbulb,
      title: "Our Vision",
      content:
        "To be the leading educational institution that transforms students into confident, skilled, and successful individuals who contribute meaningfully to society and their chosen fields.",
    },
    {
      icon: Heart,
      title: "Founder's Note",
      content:
        "Education should inspire and empower. At Effort Education, we believe every student has unique potential, and our role is to nurture that potential through dedicated guidance and comprehensive skill development.",
    },
  ];

  return (
    <section className="relative py-16 bg-white z-10">
      <div className="container mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase"
          >
            Our <span className="text-red-600">Foundation</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Built on strong principles and a clear vision for student success.
          </motion.p>
        </div>

        {/* About Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {aboutCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="border border-gray-100 bg-white hover:border-red-100 transition-all duration-300 transform hover:-translate-y-1 rounded-2xl shadow-sm hover:shadow-xl group"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-600 transition-colors duration-300">
                    <card.icon className="w-7 h-7 text-red-600 group-hover:text-white transition-colors duration-300" />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors uppercase tracking-tight">
                    {card.title}
                  </h3>

                  <p className="text-gray-500 text-xs leading-relaxed font-medium">
                    {card.content}
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
