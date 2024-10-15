import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

const FAQS = [
  {
    question: 'How do I enroll in an IAS preparation course?',
    answer:
      'Enrolling in our IAS preparation course is easy! Browse the courses offered, select your preferred batch, and click "Enroll Now" to start your journey.',
  },
  {
    question: 'Are live classes recorded for future reference?',
    answer:
      'No, we believe in the value of live interaction. All our classes are conducted live with no recorded versions, encouraging real-time learning and engagement.',
  },
  {
    question: 'What is the eligibility to enroll in IAS preparation courses?',
    answer:
      'There are no specific eligibility criteria for our IAS preparation courses. Students of all backgrounds aiming for government exams can join our programs.',
  },
  {
    question: 'What is the structure of the IAS preparation curriculum?',
    answer:
      'Our IAS curriculum covers all required subjects, including History, Geography, Polity, Economics, and Current Affairs, with mock tests and study materials included.',
  },
  {
    question: 'How can I stay updated with IAS exam notifications?',
    answer:
      'Stay updated by subscribing to our email notifications or following our social media for real-time updates on IAS exam announcements and study tips.',
  },
  {
    question: 'Do you offer courses for other competitive exams?',
    answer:
      'Yes! Apart from IAS, we offer courses for SSC, Banking exams, UGC NET, and more. Each course is carefully designed to cater to the syllabus and exam patterns.',
  },
  {
    question: 'Is there any support available for students after class?',
    answer:
      'Yes, our educators are available for doubt resolution through scheduled Q&A sessions, ensuring every student’s questions are addressed.',
  },
  {
    question: 'What payment methods are available for course enrollment?',
    answer:
      'We accept all major payment methods including debit/credit cards, UPI, and bank transfers for your convenience.',
  },
  // Additional FAQs
  // {
  //   question: 'What makes Effort Education unique for IAS coaching?',
  //   answer:
  //     'Effort Education stands out with its emphasis on live interaction, personalized mentoring, and a curriculum designed by experts with decades of experience. We provide mock tests, doubt sessions, and real-time feedback to ensure a thorough preparation for IAS exams.',
  // },
  // {
  //   question: 'Are there any free resources available for preparation?',
  //   answer:
  //     'Yes, we offer several free resources including demo classes, sample materials, and previous year question papers to give you a glimpse of our quality and help you prepare better.',
  // },
  // {
  //   question: 'How do I schedule a doubt-clearing session with instructors?',
  //   answer:
  //     'Doubt-clearing sessions are available at specific times every week. You can book these sessions through your student dashboard or by contacting our support team.',
  // },
  // {
  //   question: 'What is the duration of the IAS preparation course?',
  //   answer:
  //     'The duration of our IAS courses ranges from 6 to 12 months depending on the program you choose, with flexible batches available for working professionals and students.',
  // },
  // {
  //   question: 'How can I track my progress in the course?',
  //   answer:
  //     'You can track your progress through our personalized dashboard, where you will find your test results, attendance records, and feedback from educators.',
  // },
  // {
  //   question: 'Are study materials provided as part of the course fee?',
  //   answer:
  //     'Yes, the course fee includes comprehensive study materials, which are regularly updated to match the latest exam trends.',
  // },
  // {
  //   question: 'What is the refund policy if I am unable to continue the course?',
  //   answer:
  //     'We have a transparent refund policy. You can request a refund within the first two weeks of enrollment if you decide to discontinue.',
  // },
  // {
  //   question: 'Do you offer one-on-one mentoring for IAS aspirants?',
  //   answer:
  //     'Yes, we provide one-on-one mentoring sessions with senior educators for personalized guidance and strategic exam preparation.',
  // },
  // {
  //   question: 'How can I stay focused during long preparation periods?',
  //   answer:
  //     'Our tutors provide regular motivation, time management techniques, and stress-relief strategies to keep you focused throughout your preparation journey.',
  // },
  // {
  //   question: 'Can I switch batches if my schedule changes?',
  //   answer:
  //     'Yes, we offer the flexibility to switch between batches depending on availability. You can request this through your student portal or contact our support team for assistance.',
  // },
];

const FAQSection: React.FC = () => {
  return (
    <section className="relative py-16 bg-gray-900 text-white">
      {/* Background Gradient */}
      <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-red-600 via-black to-red-800"></div>

      <div className="relative container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-red-500 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-400">Get answers to common questions about our courses and services</p>
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
          {FAQS.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="font-semibold text-left text-red-500 py-3 border-b border-gray-700">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 py-3">
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
