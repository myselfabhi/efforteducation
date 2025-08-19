import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Programs from "./components/Programs";
import WhyChoose from "./components/WhyChoose";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import SiteFooter from "./components/SiteFooter";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <Programs />
        <WhyChoose />
        <Testimonials />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  );
}
