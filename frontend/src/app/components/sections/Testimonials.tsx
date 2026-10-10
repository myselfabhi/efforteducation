'use client';

import { useState, useEffect } from 'react';
import { Quote, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { api, Testimonial } from '../../../lib/api';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await api.getTestimonials();
        if (response.success) {
          const data = (response as { data?: { testimonials?: Testimonial[] }; testimonials?: Testimonial[] });
          const list = data.data?.testimonials ?? data.testimonials;
          if (Array.isArray(list)) setTestimonials(list);
        }
      } catch (err) {
        console.error('Failed to fetch testimonials:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

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
    <section className="py-16 bg-secondary">
      <div className="container mx-auto max-w-6xl px-6">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4 tracking-tight uppercase">
            Our Student <span className="text-primary">Success Stories</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            Over three decades of empowering students to achieve their dreams. Join our legacy of excellence.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2.5 text-muted-foreground font-medium text-sm">Loading testimonials...</span>
          </div>
        )}

        {/* Testimonials Continuous Scrolling Animation */}
        {!loading && (
          <div className="relative">
             {/* Left Fade Gradient */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-secondary to-transparent z-10 hidden md:block" />
            
            <div className="overflow-hidden">
              <div className="flex animate-scroll-right-to-left py-3">
                {/* First set of testimonials */}
                {displayTestimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="bg-card border border-border hover:border-primary/30 transition-all duration-500 transform hover:-translate-y-1.5 w-72 md:w-[380px] flex-shrink-0 mx-3 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl">
                    <CardContent className="p-6 md:p-8">
                      <div className="mb-4">
                        <Quote className="w-8 h-8 text-primary/20 mb-3" />
                        <p className="text-muted-foreground leading-relaxed font-medium text-base italic">
                          &quot;{testimonial.quote}&quot;
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-11 h-11 border border-primary/20">
                          <AvatarFallback className="bg-primary text-primary-foreground font-black text-base">
                            {testimonial.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-bold text-foreground text-base">
                            {testimonial.name}
                          </h4>
                          <p className="text-primary font-black text-[10px] uppercase tracking-widest">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {/* Duplicate set for seamless continuous loop */}
                {displayTestimonials.map((testimonial) => (
                  <Card key={`duplicate-${testimonial.id}`} className="bg-card border border-border hover:border-primary/30 transition-all duration-500 transform hover:-translate-y-1.5 w-72 md:w-[380px] flex-shrink-0 mx-3 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl">
                    <CardContent className="p-6 md:p-8">
                      <div className="mb-4">
                        <Quote className="w-8 h-8 text-primary/20 mb-3" />
                        <p className="text-muted-foreground leading-relaxed font-medium text-base italic">
                          &quot;{testimonial.quote}&quot;
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-11 h-11 border border-primary/20">
                          <AvatarFallback className="bg-primary text-primary-foreground font-black text-base">
                            {testimonial.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-bold text-foreground text-base">
                            {testimonial.name}
                          </h4>
                          <p className="text-primary font-black text-[10px] uppercase tracking-widest">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Fade Gradient */}
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-secondary to-transparent z-10 hidden md:block" />
          </div>
        )}
      </div>
    </section>
  );
}
