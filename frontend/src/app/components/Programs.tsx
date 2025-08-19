import { ShieldCheck, School, Megaphone, BookOpen } from "lucide-react";

const govItems = [
  {
    icon: ShieldCheck,
    title: "Bank PO",
    desc: "Concepts, practice tests, and mentorship for cracking Bank PO exams.",
  },
  {
    icon: ShieldCheck,
    title: "SSC/CGL",
    desc: "Structured preparation plans with previous year analysis and mocks.",
  },
  {
    icon: ShieldCheck,
    title: "Other Exams",
    desc: "Guidance for state and central government competitive examinations.",
  },
];

const schoolItems = [
  {
    icon: Megaphone,
    title: "Public Speaking",
    desc: "Activity-based modules to build confident and clear communication.",
  },
  {
    icon: BookOpen,
    title: "General Knowledge",
    desc: "Curated content to develop awareness about India and the world.",
  },
  {
    icon: School,
    title: "Skill Development",
    desc: "Critical thinking, leadership, and teamwork through projects.",
  },
];

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

function Card({ Icon, title, desc }: { Icon: IconType; title: string; desc: string }) {
  return (
    <div className="p-6 rounded-lg border bg-white hover:shadow-md transition">
      <div className="text-red-600 mb-3">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-gray-700 mb-3 text-sm">{desc}</p>
      <a href="#contact" className="text-red-600 hover:text-red-700 font-medium text-sm">
        Learn More →
      </a>
    </div>
  );
}

export default function Programs() {
  return (
    <section id="programs" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-10">Courses & Programs</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-xl font-semibold mb-4">Government Competitive Exams</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {govItems.map((i) => (
                <Card key={i.title} Icon={i.icon} title={i.title} desc={i.desc} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">School Enrichment Programs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {schoolItems.map((i) => (
                <Card key={i.title} Icon={i.icon} title={i.title} desc={i.desc} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


