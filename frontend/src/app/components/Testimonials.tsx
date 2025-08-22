import { Quote } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';

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
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto max-w-6xl px-4 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            What Our Students Say
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Hear from our successful students and parents who have experienced the Effort Education difference.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-gray-800 border border-gray-700 hover:bg-gray-750 transition-colors duration-300">
              <CardContent className="p-6">
                <div className="mb-6">
                  <Quote className="w-8 h-8 text-red-500 mb-4" />
                  <p className="text-gray-300 leading-relaxed italic">
                    &quot;{testimonial.quote}&quot;
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-red-600 text-white font-bold">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-400">
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