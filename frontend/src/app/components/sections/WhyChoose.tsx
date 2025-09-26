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
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto max-w-6xl px-4 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose <span className="text-red-600">Effort Education</span>?
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            We stand apart through our commitment to excellence, innovative teaching methods, and genuine care for each student&apos;s success.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white transform hover:-translate-y-2 hover:border-red-200">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <feature.icon className="w-10 h-10 text-red-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-700 leading-relaxed text-lg">
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