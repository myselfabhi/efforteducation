'use client';

import { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { api, Testimonial } from '../../../lib/api';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await api.getTestimonials();
        if (response.success) {
          const data = response as { data?: { testimonials?: Testimonial[] }; testimonials?: Testimonial[] };
          const list = data.data?.testimonials ?? data.testimonials;
          if (Array.isArray(list)) setTestimonials(list);
        }
      } catch (err) {
        console.error('Failed to fetch testimonials:', err);
      }
    };

    fetchTestimonials();
  }, []);

  // Only real, consented testimonials are shown. Until some exist, the whole
  // section is hidden — we don't fabricate social proof. (When the backend
  // returns consented testimonials, this section appears automatically.)
  if (testimonials.length === 0) return null;

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

        {/* Testimonials Continuous Scrolling Animation */}
        <div className="relative">
          {/* Left Fade Gradient */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-secondary to-transparent z-10 hidden md:block" />

          <div className="overflow-hidden">
            <div className="flex animate-scroll-right-to-left py-3">
              {/* The list is duplicated once for a seamless continuous loop. */}
              {[...testimonials, ...testimonials].map((testimonial, i) => (
                <Card
                  key={`${testimonial.id}-${i}`}
                  className="bg-card border border-border hover:border-primary/30 transition-all duration-500 transform hover:-translate-y-1.5 w-72 md:w-[380px] flex-shrink-0 mx-3 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl"
                >
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
                        <h4 className="font-bold text-foreground text-base">{testimonial.name}</h4>
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
      </div>
    </section>
  );
}
