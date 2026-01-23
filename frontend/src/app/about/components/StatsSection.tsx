'use client';

import { Users, Award, BookOpen, TrendingUp } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import SwipeCarousel from "../../components/mobile/SwipeCarousel";

export default function StatsSection() {
  const stats = [
    {
      icon: Users,
      number: "500+",
      label: "Students Taught",
      description: "Successfully guided students through their educational journey"
    },
    {
      icon: Award,
      number: "95%",
      label: "Success Rate",
      description: "Students who achieve their academic and career goals"
    },
    {
      icon: BookOpen,
      number: "15+",
      label: "Years Experience",
      description: "Dedicated to providing quality education and guidance"
    },
    {
      icon: TrendingUp,
      number: "200+",
      label: "Success Stories",
      description: "Students who have excelled in competitive examinations"
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto max-w-6xl px-6 sm:px-8 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
            Our <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">Achievements</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto px-4 leading-relaxed">
            Numbers that reflect our commitment to student success and educational excellence.
          </p>
        </div>

        {/* Mobile: Swipe Carousel */}
        <div className="lg:hidden">
          <SwipeCarousel
            items={stats.map((stat, index) => (
              <Card
                key={index}
                className="border-2 border-gray-200 shadow-lg bg-white h-full"
              >
                <CardContent className="p-6 text-center flex flex-col items-center justify-center">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-4 shadow-md">
                    <stat.icon className="w-8 h-8 text-red-600" />
                  </div>
                  
                  {/* Number */}
                  <div className="text-5xl font-bold text-red-600 mb-3">
                    {stat.number}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {stat.label}
                  </h3>
                  
                  <p className="text-gray-700 text-sm leading-snug">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          />
        </div>

        {/* Desktop: Grid with stagger animation */}
        <div className="hidden lg:grid grid-cols-4 gap-8 stagger-children">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="border-2 border-gray-200 hover:border-red-300 hover:shadow-2xl transition-all duration-300 bg-white text-center transform hover:-translate-y-2 card-lift touch-glow"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-8">
                {/* Icon with hover scale */}
                <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md transform hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-10 h-10 text-red-600" />
                </div>
                
                {/* Number with gradient on hover */}
                <div className="text-6xl font-bold text-red-600 mb-3 hover:scale-105 transition-transform duration-300">
                  {stat.number}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {stat.label}
                </h3>
                
                <p className="text-gray-700 text-base leading-relaxed">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
