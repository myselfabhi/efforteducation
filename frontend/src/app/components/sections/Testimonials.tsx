import { Quote } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';

export default function Testimonials() {
  const testimonials = [
    {
      quote: "I cleared SBI PO in my first attempt with AIR 45! The mock test series and personalized doubt sessions at Effort Education were game-changers. The faculty's expertise in banking exams is unmatched.",
      name: "Priya Sharma",
      role: "SBI PO, AIR 45",
      initials: "PS"
    },
    {
      quote: "From being extremely shy to winning the district debate competition - Effort Education's public speaking program transformed me completely. The confidence I gained here helped me get selected for college leadership roles.",
      name: "Rajesh Kumar",
      role: "College Student Leader",
      initials: "RK"
    },
    {
      quote: "My son cleared SSC CGL with rank 127! The comprehensive study plan and regular assessments at Effort Education made all the difference. The teachers are not just educators but mentors who truly care.",
      name: "Mrs. Anjali Patel",
      role: "Parent of SSC CGL Success",
      initials: "AP"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto max-w-6xl px-4 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            What Our <span className="text-red-400">Students Say</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Hear from our successful students and parents who have experienced the Effort Education difference.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-gray-800 border border-gray-700 hover:bg-gray-750 hover:border-red-500/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-red-500/10">
              <CardContent className="p-8">
                <div className="mb-8">
                  <Quote className="w-10 h-10 text-red-500 mb-6" />
                  <p className="text-gray-300 leading-relaxed italic text-lg">
                    &quot;{testimonial.quote}&quot;
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-gradient-to-br from-red-600 to-red-700 text-white font-bold text-lg">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-white text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-red-400 font-semibold">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}