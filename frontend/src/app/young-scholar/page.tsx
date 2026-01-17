import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import YoungScholarHero from "./components/YoungScholarHero";
import ProgramOverview from "./components/ProgramOverview";
import SkillsBreakdown from "./components/SkillsBreakdown";
import ProgramDetails from "./components/ProgramDetails";
import FAQSection from "./components/FAQSection";
import EnrollmentCTA from "./components/EnrollmentCTA";

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
