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
    <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-transparent to-red-800/10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>
      
      <div className="relative container mx-auto max-w-6xl px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Meet Our Team
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Experienced educators dedicated to your success and growth.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <Card
              key={index}
              className="border border-gray-700 hover:border-red-500/30 hover:shadow-xl transition-all duration-300 bg-gray-800/50 backdrop-blur-sm"
            >
              <CardContent className="p-8 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-6">
                  <AvatarImage src={member.image} alt={member.name} />
                  <AvatarFallback className="bg-red-600 text-white text-xl font-bold">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                
                <h3 className="text-xl font-bold text-white mb-2">
                  {member.name}
                </h3>
                
                <p className="text-red-400 font-semibold mb-4">
                  {member.role}
                </p>
                
                <p className="text-gray-300 leading-relaxed">
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
