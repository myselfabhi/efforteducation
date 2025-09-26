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
        <div className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto max-w-6xl px-4 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Start Your <span className="text-red-600">Success Journey</span>
              </h2>
              <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                Ready to achieve your dreams? Get a free consultation and personalized study plan. Join thousands of successful students who chose Effort Education for their competitive exam preparation.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <ContactForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
