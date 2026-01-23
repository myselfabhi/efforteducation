'use client';

import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Card, CardContent } from "../../components/ui/card";
import SwipeCarousel from "../../components/mobile/SwipeCarousel";

export default function TeamSection() {
  const teamMembers = [
    {
      name: "Dr. Priya Sharma",
      role: "Founder & Director",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjB0ZWFjaGVyJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc1NTYyMDAxM3w%3D&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
      initials: "PS",
      description: "15+ years of experience in competitive exam preparation and student development."
    },
    {
      name: "Prof. Rajesh Kumar",
      role: "Senior Faculty - Mathematics",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjB0ZWFjaGVyJTIwbWF0aHxlbnwxfHx8fDE3NTU2MjAwMTN8&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
      initials: "RK",
      description: "Expert in quantitative aptitude and mathematical reasoning for competitive exams."
    },
    {
      name: "Ms. Anjali Patel",
      role: "Faculty - English & Communication",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjB0ZWFjaGVyJTIwZW5nbGlzaHxlbnwxfHx8fDE3NTU2MjAwMTN8&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
      initials: "AP",
      description: "Specializes in English language skills and public speaking development."
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1),transparent_50%)]"></div>
      
      <div className="relative container mx-auto max-w-6xl px-6 sm:px-8 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 px-4">
            Meet Our <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Team</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto px-4 leading-relaxed">
            Experienced educators dedicated to your success and growth.
          </p>
        </div>

        {/* Mobile: Swipe Carousel */}
        <div className="lg:hidden">
          <SwipeCarousel
            items={teamMembers.map((member, index) => (
              <Card
                key={index}
                className="border-2 border-gray-700 shadow-lg bg-gray-800/60 backdrop-blur-md h-full"
              >
                <CardContent className="p-6 text-center flex flex-col items-center justify-center">
                  {/* Avatar */}
                  <div className="relative inline-block mb-4">
                    <Avatar className="w-24 h-24 ring-4 ring-red-500/30">
                      <AvatarImage src={member.image} alt={member.name} />
                      <AvatarFallback className="bg-gradient-to-br from-red-600 to-red-700 text-white text-2xl font-bold">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">
                    {member.name}
                  </h3>
                  
                  <p className="text-red-400 font-semibold mb-3 text-base">
                    {member.role}
                  </p>
                  
                  <p className="text-gray-300 leading-snug text-sm">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          />
        </div>

        {/* Desktop: Grid with stagger animation */}
        <div className="hidden lg:grid grid-cols-3 gap-8 stagger-children">
          {teamMembers.map((member, index) => (
            <Card
              key={index}
              className="border-2 border-gray-700 hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300 bg-gray-800/60 backdrop-blur-md transform hover:-translate-y-2 card-lift group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-8 text-center">
                {/* Avatar with ring and hover scale */}
                <div className="relative inline-block mb-6">
                  <Avatar className="w-32 h-32 ring-4 ring-red-500/20 group-hover:ring-red-500/50 transition-all duration-300 transform group-hover:scale-110">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback className="bg-gradient-to-br from-red-600 to-red-700 text-white text-2xl font-bold">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  {/* Pulse ring effect */}
                  <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping opacity-0 group-hover:opacity-100"></div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors duration-300">
                  {member.name}
                </h3>
                
                <p className="text-red-400 font-semibold mb-4 text-lg">
                  {member.role}
                </p>
                
                <p className="text-gray-300 leading-relaxed text-base">
                  {member.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
