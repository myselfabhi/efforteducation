'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion';
import { motion } from 'framer-motion';

const faqs = [
  {
    question: 'What is the class schedule?',
    answer: 'Classes are held on weekends for a few hours. The exact schedule will be shared upon enrollment. We offer flexible timing options to accommodate different schedules.'
  },
  {
    question: 'How do I enroll?',
    answer: 'Contact us through the contact form below or call us at 9910335093. Our team will guide you through the enrollment process and provide all necessary details.'
  },
  {
    question: 'What are the technical requirements?',
    answer: 'You need a device (computer, tablet, or smartphone) with a stable internet connection and a web browser. We recommend using a laptop or tablet for the best learning experience.'
  },
  {
    question: 'Can I get a refund?',
    answer: 'Please contact us directly to discuss our refund policy. We aim to ensure student satisfaction and will work with you to resolve any concerns.'
  },
  {
    question: 'Is there a demo class?',
    answer: 'Yes, we offer demo classes for interested students and parents. Please contact us to schedule a free demo session where you can experience our teaching methodology.'
  },
  {
    question: 'What materials are provided?',
    answer: 'All study materials and resources are provided digitally as part of the program. This includes practice sheets, quizzes, current affairs updates, and other learning resources.'
  },
  {
    question: 'How many students are in each batch?',
    answer: 'We maintain small batch sizes to ensure personalized attention. Typically, each batch has 15-25 students, allowing for individual attention and interactive learning.'
  },
  {
    question: 'Will this interfere with school studies?',
    answer: 'No, the program is designed to complement school studies. Weekend timing ensures there\'s no conflict with regular school hours. The skills learned here actually enhance academic performance.'
  }
];

export default function FAQSection() {
  return (
    <section className="py-16 bg-gray-950">
      <div className="container mx-auto max-w-4xl px-6">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight"
          >
            Common <span className="text-red-500">Queries</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base text-gray-400 max-w-2xl mx-auto font-medium"
          >
            Find everything you need to know about the Young Scholar Program.
          </motion.p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <AccordionItem
                value={`item-${index}`}
                className="border border-gray-800 rounded-2xl px-6 bg-gray-900/40 backdrop-blur-sm hover:border-red-500/30 transition-all duration-300"
              >
                <AccordionTrigger className="text-left font-bold text-gray-200 hover:text-red-400 py-5 text-sm sm:text-base uppercase tracking-tight">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 leading-relaxed pb-5 text-sm font-medium">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
