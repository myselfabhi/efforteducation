import type { Metadata } from "next";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import AboutHero from "./components/AboutHero";
import StatsSection from "./components/StatsSection";
import TeamSection from "./components/TeamSection";
import ProgramFeatures from "../programs/components/ProgramFeatures";

export const metadata: Metadata = {
  title: "About Us - Our Story & Team",
  description: "Established in 1990, Effort Education has 34+ years of excellence in education. Learn about our mission, vision, and dedicated team of educators.",
  openGraph: {
    title: "About Effort Education - Our Story & Team",
    description: "34+ years of excellence in education. Meet our team and learn about our mission to empower students.",
    url: "https://efforteducation.vercel.app/about"
  }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AboutHero />
        <StatsSection />
        <TeamSection />
        <ProgramFeatures />
      </main>
      <Footer />
    </div>
  );
}
