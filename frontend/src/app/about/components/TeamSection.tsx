import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Card, CardContent } from "../../components/ui/card";

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
    <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      
      <div className="relative container mx-auto max-w-6xl px-6 sm:px-8 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 px-4">
            Meet Our Team
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto px-4 leading-relaxed">
            Experienced educators dedicated to your success and growth.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {teamMembers.map((member, index) => (
            <Card
              key={index}
              className="border border-gray-700 hover:border-red-500/30 hover:shadow-xl transition-all duration-300 bg-gray-800/50 backdrop-blur-sm transform hover:-translate-y-1"
            >
              <CardContent className="p-6 sm:p-8 text-center">
                <Avatar className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-6">
                  <AvatarImage src={member.image} alt={member.name} />
                  <AvatarFallback className="bg-red-600 text-white text-xl sm:text-2xl font-bold">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {member.name}
                </h3>
                
                <p className="text-red-400 font-semibold mb-4 text-base sm:text-lg">
                  {member.role}
                </p>
                
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
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
