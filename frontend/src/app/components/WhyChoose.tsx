import { Users, Lightbulb, Scale, Trophy } from "lucide-react";

const items = [
  { icon: Users, title: "Experienced Educators", desc: "Mentors with proven expertise and results." },
  { icon: Lightbulb, title: "Skills Beyond Schools", desc: "Communication, confidence, and leadership." },
  { icon: Scale, title: "Balanced Approach", desc: "Academics + real-world skill building." },
  { icon: Trophy, title: "Proven Track Record", desc: "Success across competitive exams and programs." },
];

export default function WhyChoose() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-10">Why Choose Effort Education?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 rounded-lg border bg-gray-50">
              <div className="text-red-600 mb-3">
                <Icon className="w-8 h-8" />
              </div>
              <h4 className="font-semibold mb-1">{title}</h4>
              <p className="text-gray-700 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


