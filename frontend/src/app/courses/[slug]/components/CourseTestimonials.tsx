import { Quote } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';

export default function CourseTestimonials() {
  const testimonials = [
    {
      quote: "The Bank PO preparation course at Effort Education was exceptional. The structured approach and expert guidance helped me clear the exam in my first attempt. The faculty's dedication and comprehensive study material made all the difference.",
      name: "Priya Sharma",
      role: "Bank PO, 2024",
      initials: "PS"
    },
    {
      quote: "I was struggling with quantitative aptitude before joining this course. The step-by-step approach and regular practice sessions helped me improve significantly. The mock tests were particularly helpful in building confidence.",
      name: "Rajesh Kumar",
      role: "Bank Clerk, 2024",
      initials: "RK"
    },
    {
      quote: "The course not only prepared me for the exam but also helped me develop strong analytical skills. The faculty's teaching methods and the supportive learning environment made the journey enjoyable and successful.",
      name: "Anjali Patel",
      role: "Bank PO, 2023",
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
            Hear from our successful students who have excelled in this course.
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
