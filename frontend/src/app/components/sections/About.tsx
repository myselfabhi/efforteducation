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
    <section id="about" className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto max-w-6xl px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            About <span className="text-red-600">Effort Education</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            With over 5 years of excellence in education, Effort Education has successfully guided more than 2,000 students to achieve their dreams. We specialize in Government Exam preparation, school studies enhancement, and leadership development programs that build confident, capable leaders of tomorrow.
          </p>
        </div>

        {/* About Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {aboutCards.map((card, index) => (
            <Card
              key={index}
              className="border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white transform hover:-translate-y-2 hover:border-red-200"
            >
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                  <card.icon className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  {card.title}
                </h3>

                <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
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