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
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto max-w-6xl px-4 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Why Choose Effort Education?
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            We stand apart through our commitment to excellence, innovative teaching methods, and genuine care for each student&apos;s success.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow duration-300 bg-white">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-red-600" />
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
    </section>
  );
}