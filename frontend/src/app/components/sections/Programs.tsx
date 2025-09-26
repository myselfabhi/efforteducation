'use client';

import { BookOpen, Users, Award, TrendingUp, Megaphone, Brain } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

export default function Programs() {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const governmentExams = [
    {
      icon: TrendingUp,
      title: "Banking Exams (PO/Clerk/SO)",
      description: "Complete preparation for IBPS, SBI, and other banking exams. Includes quantitative aptitude, reasoning, English, and general awareness with 200+ mock tests and personalized doubt sessions."
    },
    {
      icon: Award,
      title: "SSC CGL/CHSL/MTS",
      description: "Comprehensive SSC exam preparation with tier-wise strategy, previous year analysis, and specialized coaching for each subject. 95% success rate in SSC exams."
    },
    {
      icon: BookOpen,
      title: "Railway & Insurance Exams",
      description: "Specialized coaching for RRB NTPC, Group D, LIC AAO, and other government exams. Expert faculty with proven track record of student success."
    }
  ];

  const enrichmentPrograms = [
    {
      icon: Megaphone,
      title: "Public Speaking & Communication",
      description: "Transform from shy to confident speaker! Weekly debate sessions, presentation workshops, and personality development programs. Build the communication skills that set you apart."
    },
    {
      icon: Brain,
      title: "General Knowledge & Current Affairs",
      description: "Stay ahead with our comprehensive GK program covering history, geography, science, and daily current affairs. Regular quizzes and monthly assessments to track progress."
    },
    {
      icon: Users,
      title: "Leadership & Life Skills",
      description: "Develop leadership qualities, teamwork, time management, and decision-making skills. Interactive workshops and real-world projects that build character and confidence."
    }
  ];

  return (
    <section id="programs" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto max-w-6xl px-4 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-red-600">Programs</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Choose from our comprehensive range of programs designed to meet diverse learning needs and career aspirations.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Government Competitive Exams */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-10 text-center">
              Government Competitive Exams
            </h3>
            <div className="space-y-6">
              {governmentExams.map((exam, index) => (
                <Card key={index} className="border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white transform hover:-translate-y-1 hover:border-red-200">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <exam.icon className="w-8 h-8 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-2xl font-bold text-gray-900 mb-3">
                          {exam.title}
                        </h4>
                        <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                          {exam.description}
                        </p>
                        <Button
                          onClick={scrollToContact}
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-0 h-auto font-semibold text-lg group"
                        >
                          Learn More 
                          <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* School Enrichment Programs */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-10 text-center">
              School Enrichment Programs
            </h3>
            <div className="space-y-6">
              {enrichmentPrograms.map((program, index) => (
                <Card key={index} className="border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white transform hover:-translate-y-1 hover:border-red-200">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <program.icon className="w-8 h-8 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-2xl font-bold text-gray-900 mb-3">
                          {program.title}
                        </h4>
                        <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                          {program.description}
                        </p>
                        <Button
                          onClick={scrollToContact}
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-0 h-auto font-semibold text-lg group"
                        >
                          Learn More 
                          <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}