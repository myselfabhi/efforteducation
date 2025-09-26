import { Target, Lightbulb, Heart } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export default function About() {
  const aboutCards = [
    {
      icon: Target,
      title: "Our Mission",
      content:
        "To bridge the gap between traditional education and real-world skills, empowering students to excel in competitive examinations while developing essential life skills and leadership qualities.",
    },
    {
      icon: Lightbulb,
      title: "Our Approach",
      content:
        "We combine proven teaching methodologies with innovative learning techniques, focusing on conceptual clarity, practical application, and holistic development of each student.",
    },
    {
      icon: Heart,
      title: "Founder's Note",
      content:
        "Education should inspire and empower. At Effort Education, we believe every student has unique potential, and our role is to nurture that potential through dedicated guidance and comprehensive skill development.",
    },
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto max-w-6xl px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-red-600">Effort Education</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Founded on the principle of student-first education,
            Effort Education is dedicated to providing
            comprehensive learning solutions that prepare
            students not just for examinations, but for success
            in life. We believe in nurturing talent, building
            confidence, and developing skills that extend far
            beyond the classroom.
          </p>
        </div>

        {/* About Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {aboutCards.map((card, index) => (
            <Card
              key={index}
              className="border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white transform hover:-translate-y-2 hover:border-red-200"
            >
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <card.icon className="w-10 h-10 text-red-600" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {card.title}
                </h3>

                <p className="text-gray-700 leading-relaxed text-lg">
                  {card.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}