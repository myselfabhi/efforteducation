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
      description: "Multiple batch timings with flexible online live class schedules to fit your busy lifestyle."
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
    <section className="py-16 bg-white">
      <div className="container mx-auto max-w-6xl px-4 lg:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose <span className="text-red-600">Us</span>?
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Our programs are designed with student success in mind, featuring modern teaching methods and comprehensive support.
          </p>
        </div>

        {/* Features Continuous Scrolling Animation */}
        <div className="overflow-hidden">
          <div className="flex animate-scroll-right-to-left">
            {/* First set of features */}
            {features.map((feature, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white transform hover:-translate-y-1 hover:border-red-200 w-80 md:w-96 flex-shrink-0 mx-2">
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
            {/* Duplicate set for infinite scroll */}
            {features.map((feature, index) => (
              <Card key={`duplicate-${index}`} className="border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white transform hover:-translate-y-1 hover:border-red-200 w-80 md:w-96 flex-shrink-0 mx-2">
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
        </div>

      </div>
    </section>
  );
}
