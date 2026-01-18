import type { Metadata } from "next";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import YoungScholarHero from "./components/YoungScholarHero";
import ProgramOverview from "./components/ProgramOverview";
import SkillsBreakdown from "./components/SkillsBreakdown";
import ProgramDetails from "./components/ProgramDetails";
import FAQSection from "./components/FAQSection";
import EnrollmentCTA from "./components/EnrollmentCTA";

export const metadata: Metadata = {
  title: "Young Scholar Program - Weekend Skill Building for Class 4-8",
  description: "Hero product! Weekend skill-building program for Class 4-8 students. Develop essential skills in Current Affairs, Public Speaking, Reasoning, and Maths. Just ₹999. Online live classes on weekends.",
  keywords: ["young scholar program", "class 4-8", "weekend classes", "skill development", "current affairs", "public speaking", "reasoning", "mathematics"],
  openGraph: {
    title: "Young Scholar Program - Weekend Skill Building for Class 4-8",
    description: "Weekend program for Class 4-8. Develop essential skills in Current Affairs, Public Speaking, Reasoning & Maths. Just ₹999.",
    url: "https://efforteducation.vercel.app/young-scholar"
  }
};

export default function YoungScholarPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <YoungScholarHero />
        <ProgramOverview />
        <SkillsBreakdown />
        <ProgramDetails />
        <FAQSection />
        <EnrollmentCTA />
      </main>
      <Footer />
    </div>
  );
}
