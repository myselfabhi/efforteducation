import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import AboutHero from "./components/AboutHero";
import MissionVision from "./components/MissionVision";
import StatsSection from "./components/StatsSection";
import TeamSection from "./components/TeamSection";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AboutHero />
        <MissionVision />
        <StatsSection />
        <TeamSection />
      </main>
      <Footer />
    </div>
  );
}
