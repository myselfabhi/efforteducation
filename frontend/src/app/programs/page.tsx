import type { Metadata } from "next";
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProgramsHero from './components/ProgramsHero';
import ProgramCategories from './components/ProgramCategories';

export const metadata: Metadata = {
  title: "Our Programs - Competitive Exams & Skill Development",
  description: "Explore our comprehensive range of programs: Banking (IBPS PO, SBI PO), SSC (CGL, CHSL), Railway, Police, UPPSC, NET, PCS, and Young Scholar Program. All courses online with live classes.",
  openGraph: {
    title: "Our Programs - Competitive Exams & Skill Development",
    description: "Banking, SSC, Railway coaching and Young Scholar Program. Expert guidance, online live classes, proven success.",
    url: "https://efforteducation.vercel.app/programs"
  }
};

export default function ProgramsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        <ProgramsHero />
        <ProgramCategories />
      </main>
      <Footer />
    </div>
  );
}
