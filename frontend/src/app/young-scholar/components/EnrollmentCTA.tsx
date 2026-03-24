'use client';

import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { motion } from 'framer-motion';

export default function EnrollmentCTA() {
  const scrollToContact = () => {
    window.location.href = '/contact?interest=young-scholar';
  };

  return (
    <section id="enrollment-cta" className="py-16 bg-gray-950">
      <div className="container mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <Card className="border border-gray-800 bg-gray-900/40 backdrop-blur-xl overflow-hidden rounded-[2.5rem] shadow-2xl">
            <div className="h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-red-700"></div>
            <CardContent className="p-10 md:p-16 text-center">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter uppercase">
                Ready to <span className="text-red-500">Transform</span>?
              </h2>
              <p className="text-base sm:text-lg text-gray-400 mb-10 max-w-xl mx-auto font-medium">
                Join the Young Scholar Program today and give your child the tools they need for future success.
              </p>

              <div className="flex justify-center">
                <Button
                  onClick={scrollToContact}
                  className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest px-10 py-7 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl shadow-red-600/20 text-lg"
                >
                  Enroll Now
                </Button>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-800">
                <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
                  {[
                    { label: "Fee", value: "₹999" },
                    { label: "Schedule", value: "Weekends" },
                    { label: "Mode", value: "Online Live" }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-1">{item.label}</span>
                      <span className="text-xs font-bold text-gray-300 uppercase">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
