import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProgramsHero from './components/ProgramsHero';
import ProgramCategories from './components/ProgramCategories';
import ProgramFeatures from './components/ProgramFeatures';
import ProgramCTA from './components/ProgramCTA';

export default function ProgramsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        <ProgramsHero />
        <ProgramCategories />
        <ProgramFeatures />
        <ProgramCTA />
      </main>
      <Footer />
    </div>
  );
}
