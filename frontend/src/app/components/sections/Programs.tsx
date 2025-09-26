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
      title: "Bank PO & Clerk",
      description: "Comprehensive preparation for banking sector examinations with focus on quantitative aptitude, reasoning, and general awareness."
    },
    {
      icon: Award,
      title: "SSC & CGL",
      description: "Complete coverage of Staff Selection Commission exams including tier-wise preparation and mock test series."
    },
    {
      icon: BookOpen,
      title: "Other Competitive Exams",
      description: "Specialized coaching for railway, insurance, and other government sector examinations with expert guidance."
    }
  ];

  const enrichmentPrograms = [
    {
      icon: Megaphone,
      title: "Public Speaking & Communication",
      description: "Build confidence and eloquence through structured speaking programs, debate sessions, and presentation skills."
    },
    {
      icon: Brain,
      title: "General Knowledge & Current Affairs",
      description: "Stay updated with comprehensive GK sessions covering history, geography, science, and current events."
    },
    {
      icon: Users,
      title: "Leadership & Skill Development",
      description: "Develop leadership qualities, teamwork skills, and practical life skills through interactive workshops."
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