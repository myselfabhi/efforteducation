import Header from "./components/layout/Header";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Programs from "./components/sections/Programs";
import WhyChoose from "./components/sections/WhyChoose";
import Testimonials from "./components/sections/Testimonials";
import ContactForm from "./components/forms/ContactForm";
import Footer from "./components/layout/Footer";

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
        <section id="contact" className="py-16 bg-gradient-to-b from-white via-gray-50 to-white">
          <div className="container mx-auto max-w-5xl px-4 lg:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Start Your <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">Success Journey</span>
              </h2>
              <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Ready to achieve your dreams? Get a free consultation and personalized study plan.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
