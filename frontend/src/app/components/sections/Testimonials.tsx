'use client';

import { useState, useEffect } from 'react';
import { Quote, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { api, Testimonial } from '../../../lib/api';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.getTestimonials();
        setTestimonials(response.data.testimonials);
      } catch (err) {
        console.error('Failed to fetch testimonials:', err);
        setError('Failed to load testimonials. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const refetch = () => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.getTestimonials();
        setTestimonials(response.data.testimonials);
      } catch (err) {
        console.error('Failed to fetch testimonials:', err);
        setError('Failed to load testimonials. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  };

  // Use fallback testimonials if API fails
  const displayTestimonials = testimonials.length > 0 ? testimonials : [
    {
      id: 1,
      quote: "I cleared SBI PO in my first attempt with AIR 45! The mock test series and personalized doubt sessions at Effort Education were game-changers. The faculty's expertise in banking exams is unmatched.",
      name: "Priya Sharma",
      role: "SBI PO, AIR 45",
      initials: "PS"
    },
    {
      id: 2,
      quote: "From being extremely shy to winning the district debate competition - Effort Education's public speaking program transformed me completely. The confidence I gained here helped me get selected for college leadership roles.",
      name: "Rajesh Kumar",
      role: "College Student Leader",
      initials: "RK"
    },
    {
      id: 3,
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

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-red-400" />
            <span className="ml-2 text-gray-300">Loading testimonials...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-8">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-red-400 mb-2">{error}</p>
            <p className="text-gray-300 text-sm">Showing fallback testimonials...</p>
            <Button onClick={refetch} variant="outline" size="sm" className="mt-4">
              Try Again
            </Button>
          </div>
        )}

        {/* Testimonials Grid */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-gray-800 border border-gray-700 hover:bg-gray-750 hover:border-red-500/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-red-500/10">
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
        )}
      </div>
    </section>
  );
}