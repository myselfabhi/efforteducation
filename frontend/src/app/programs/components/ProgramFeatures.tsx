import { GraduationCap, Target, Scale, Trophy, Clock, Users, Award, BookOpen } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';

export default function ProgramFeatures() {
  const features = [
    {
      icon: GraduationCap,
      title: "Expert Faculty",
      description: "Learn from qualified instructors with years of teaching experience and deep subject matter expertise."
    },
    {
      icon: Target,
      title: "Goal-Oriented Learning",
      description: "Structured curriculum designed to help you achieve specific academic and career objectives."
    },
    {
      icon: Scale,
      title: "Balanced Approach",
      description: "Perfect blend of theoretical knowledge and practical application for comprehensive learning."
    },
    {
      icon: Trophy,
      title: "Proven Results",
      description: "Consistent success with students achieving their goals and excelling in their chosen fields."
    },
    {
      icon: Clock,
      title: "Flexible Schedules",
      description: "Multiple batch timings and online/offline options to fit your busy lifestyle."
    },
    {
      icon: Users,
      title: "Small Batch Sizes",
      description: "Personalized attention with limited students per batch for better learning outcomes."
    },
    {
      icon: Award,
      title: "Certification",
      description: "Recognized certificates upon completion to enhance your academic and professional profile."
    },
    {
      icon: BookOpen,
      title: "Study Materials",
      description: "Comprehensive study materials, practice tests, and digital resources included."
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto max-w-6xl px-4 lg:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose Our <span className="text-red-600">Programs</span>?
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Our programs are designed with student success in mind, featuring modern teaching methods and comprehensive support.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white transform hover:-translate-y-2 hover:border-red-200">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <feature.icon className="w-10 h-10 text-red-600" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-700 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-red-600 mb-2">2000+</h3>
              <p className="text-gray-700 font-semibold">Successful Students</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-red-600 mb-2">95%</h3>
              <p className="text-gray-700 font-semibold">Success Rate</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-red-600 mb-2">5+</h3>
              <p className="text-gray-700 font-semibold">Years of Excellence</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
