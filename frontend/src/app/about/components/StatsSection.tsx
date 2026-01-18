import { Users, Award, BookOpen, TrendingUp } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";

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
    <section className="py-16 bg-white">
      <div className="container mx-auto max-w-6xl px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Our Achievements
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Numbers that reflect our commitment to student success and educational excellence.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white text-center"
            >
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <stat.icon className="w-8 h-8 text-red-600" />
                </div>
                
                <div className="text-4xl font-bold text-red-600 mb-2">
                  {stat.number}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {stat.label}
                </h3>
                
                <p className="text-gray-700 text-sm leading-relaxed">
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
