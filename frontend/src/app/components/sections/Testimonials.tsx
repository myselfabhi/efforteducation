import { Quote } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Effort Education transformed my approach to competitive exams. The personalized guidance and comprehensive study material helped me clear Bank PO on my first attempt. The faculty's dedication and support made all the difference.",
      name: "Priya Sharma",
      role: "Bank PO, 2024",
      initials: "PS"
    },
    {
      quote: "The public speaking program at Effort Education boosted my confidence tremendously. What started as fear of speaking in front of others turned into my greatest strength. The skills I learned here continue to help me in college.",
      name: "Rajesh Kumar",
      role: "Class 12 Graduate",
      initials: "RK"
    },
    {
      quote: "As a parent, I've seen remarkable improvement in my daughter's overall personality and academic performance. The balanced approach of focusing on both studies and life skills is truly commendable.",
      name: "Mrs. Anjali Patel",
      role: "Parent",
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