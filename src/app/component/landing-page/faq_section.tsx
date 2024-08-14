import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';


const FAQS = [
  {
    question: 'How do I enroll in a course?',
    answer:
      'Enrolling in a course is simple! Just browse our course catalog, select the course you want to take, and click on the "Enroll Now" button.',
  },
  {
    question: 'Are certificates provided upon course completion?',
    answer:
      'Yes, upon successfully completing a course, you will receive a certificate that you can download and share.',
  },
  {
    question: 'Is technical support available for online learning issues?',
    answer:
      'Absolutely! Our technical support team is available 24/7 to assist you with any issues you may encounter.',
  },
  {
    question: 'What payment methods are accepted?',
    answer:
      'We accept various payment methods including credit/debit cards, PayPal, and bank transfers.',
  },
  {
    question: 'Can I access the courses on mobile devices?',
    answer:
      'Yes, our platform is fully responsive, allowing you to access your courses on any device, including mobile phones and tablets.',
  },
  {
    question: 'What are the eligibility criteria for government exams?',
    answer:
      'Eligibility criteria for government exams vary depending on the specific exam. Common criteria include educational qualifications, age limits, and nationality requirements. Please refer to the specific exam notification for detailed information.',
  },
  {
    question: 'How can I stay updated with government exam notifications?',
    answer:
      'You can stay updated with government exam notifications by subscribing to our email alerts, following our social media channels, or regularly checking our blog for the latest updates.',
  },
  {
    question: 'Do you offer any courses specifically for government exam preparation?',
    answer:
      'Yes, we offer a variety of courses specifically designed to prepare you for various government exams, including UPSC, SSC, banking exams, and more. These courses cover the entire syllabus and include practice tests and study materials.',
  },
];

const FAQSection: React.FC = () => {
  return (
    <section className="bg-white text-black py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-left text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
        </div>

        <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
          {FAQS.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="font-semibold text-left text-black py-3 border-b border-black">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-black py-3">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
