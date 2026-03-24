'use client';

import { Calendar, Users, Clock } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { motion } from 'framer-motion';

export default function CounsellingCTA() {
  const handleCounsellingClick = () => {
    alert('Counselling booking will be integrated with Calendly soon!');
  };

  return (
    <section className="py-16 bg-gray-950">
      <div className="container mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <Card className="border border-gray-800 bg-gray-900/40 backdrop-blur-xl overflow-hidden rounded-[2.5rem] shadow-2xl group">
            <div className="h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-red-700"></div>
            <CardContent className="p-10 md:p-16 text-center">
              <div className="w-14 h-14 bg-gray-800 border border-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl group-hover:border-red-500/50 transition-all duration-500 group-hover:scale-110">
                <Calendar className="w-6 h-6 text-red-500" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tight uppercase">
                Free <span className="text-red-500">Counselling</span>
              </h2>
              
              <p className="text-base text-gray-400 mb-10 max-w-xl mx-auto font-medium">
                Book a free session to discuss your career objectives and get personalized guidance on our programs.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {[
                  { icon: Users, text: "One-on-one" },
                  { icon: Clock, text: "30-min session" },
                  { icon: Calendar, text: "Flexible time" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-center space-x-3 text-gray-300">
                    <item.icon className="w-4 h-4 text-yellow-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{item.text}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleCounsellingClick}
                className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest px-10 py-6 rounded-xl transition-all duration-300 shadow-xl shadow-red-600/20 text-sm"
              >
                Book Session
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
