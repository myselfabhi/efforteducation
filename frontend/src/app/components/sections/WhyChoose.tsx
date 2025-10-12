import { GraduationCap, Target, Scale, Trophy } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

export default function WhyChoose() {
  const features = [
    {
      icon: GraduationCap,
      title: "Experienced Educators",
      description: "Learn from qualified instructors with years of teaching experience and deep subject matter expertise."
    },
    {
      icon: Target,
      title: "Skills Beyond Schools",
      description: "Develop practical life skills, critical thinking, and problem-solving abilities that go beyond textbook knowledge."
    },
    {
      icon: Scale,
      title: "Balanced Approach",
      description: "Perfect blend of academic excellence and personality development to create well-rounded individuals."
    },
    {
      icon: Trophy,
      title: "Proven Track Record",
      description: "Consistent results with students successfully clearing competitive exams and excelling in their chosen fields."
    }
  ];

  return (
    <section className="py-10 sm:py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto max-w-5xl px-4 lg:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Why Choose <span className="text-red-600">Effort Education</span>?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            We stand apart through our commitment to excellence and genuine care for each student&apos;s success.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <Card key={index} className="border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white transform hover:-translate-y-1 hover:border-red-200">
              <CardContent className="p-5 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <feature.icon className="w-7 h-7 text-red-600" />
                </div>
                
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-gray-700 leading-relaxed text-xs sm:text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}