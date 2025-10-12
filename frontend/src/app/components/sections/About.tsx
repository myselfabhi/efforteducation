import { Target, Lightbulb, Heart } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export default function About() {
  const aboutCards = [
    {
      icon: Target,
      title: "Our Mission",
      content:
        "To empower students with comprehensive Government Exam preparation, enhance school performance, and develop leadership skills that create confident, successful individuals ready to make a positive impact in society.",
    },
    {
      icon: Lightbulb,
      title: "Our Success",
      content:
        "Over 2,000+ successful students, 95% exam success rate, and 100+ students placed in prestigious government positions. Our proven track record speaks for our commitment to student success.",
    },
    {
      icon: Heart,
      title: "Why Choose Us",
      content:
        "Personalized attention, experienced faculty, comprehensive study materials, regular mock tests, and continuous mentorship. We don't just teach subjects; we build futures and create leaders.",
    },
  ];

  return (
    <section id="about" className="py-10 sm:py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto max-w-5xl px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            About <span className="text-red-600">Effort Education</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            With over 5 years of excellence in education, Effort Education has successfully guided more than 2,000 students to achieve their dreams.
          </p>
        </div>

        {/* About Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {aboutCards.map((card, index) => (
            <Card
              key={index}
              className="border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white transform hover:-translate-y-1 hover:border-red-200"
            >
              <CardContent className="p-5 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <card.icon className="w-7 h-7 text-red-600" />
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  {card.title}
                </h3>

                <p className="text-gray-700 leading-relaxed text-sm">
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