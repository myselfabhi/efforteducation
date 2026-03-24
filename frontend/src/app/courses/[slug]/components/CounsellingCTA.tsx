'use client';

import { MessageCircle, Users, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface CounsellingCTAProps {
  courseName?: string;
}

export default function CounsellingCTA({ courseName }: CounsellingCTAProps) {
  const phoneNumber = '+919910335093';
  const courseMessage = courseName 
    ? `Hi, I am interested in the ${courseName} program. Please provide more details.`
    : 'Hi, I would like to know more about your courses. Please help me.';
  const whatsappMessage = encodeURIComponent(courseMessage);
  const whatsappLink = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${whatsappMessage}`;

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-green-600/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px]" />
          </div>

          <div className="relative z-10">
            <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-600/30">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Free <span className="text-green-500">Counselling</span>
            </h2>
            
            <p className="text-gray-400 mb-10 max-w-xl mx-auto">
              Chat with us instantly on WhatsApp for personalized guidance and quick responses about our programs.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {[
                { icon: Users, text: "One-on-one" },
                { icon: Clock, text: "Quick response" },
                { icon: MessageCircle, text: "Instant chat" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-center gap-2 text-gray-300">
                  <item.icon className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <button className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold uppercase tracking-wider text-sm rounded-xl transition-all duration-300 shadow-lg shadow-green-600/30 hover:shadow-green-600/50">
                <MessageCircle className="w-5 h-5 inline-block mr-2" />
                Chat on WhatsApp
              </button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
