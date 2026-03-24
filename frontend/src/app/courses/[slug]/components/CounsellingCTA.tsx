'use client';

import { Calendar, Users, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CounsellingCTA() {
  const handleCounsellingClick = () => {
    alert('Counselling booking will be integrated with Calendly soon!');
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
        >
          {/* Background Effect */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px]" />
          </div>

          <div className="relative z-10">
            <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-red-600/30">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Free <span className="text-red-500">Counselling</span>
            </h2>
            
            <p className="text-gray-400 mb-10 max-w-xl mx-auto">
              Book a free session to discuss your career objectives and get personalized guidance on our programs.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {[
                { icon: Users, text: "One-on-one" },
                { icon: Clock, text: "30-min session" },
                { icon: Calendar, text: "Flexible time" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-center gap-2 text-gray-300">
                  <item.icon className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleCounsellingClick}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-sm rounded-xl transition-all duration-300 shadow-lg shadow-red-600/30 hover:shadow-red-600/50"
            >
              Book Session
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
