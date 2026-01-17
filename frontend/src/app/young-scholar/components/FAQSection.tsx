'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion';

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
    <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto max-w-4xl px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Got questions? We&apos;ve got answers. Find everything you need to know about the Young Scholar Program.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-gray-200 rounded-lg px-4 bg-white hover:shadow-md transition-shadow"
            >
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-red-600 py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
