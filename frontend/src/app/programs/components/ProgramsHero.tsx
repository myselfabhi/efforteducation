export default function ProgramsHero() {
  return (
    <section className="relative py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-transparent to-red-800/10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>
      
      <div className="relative container mx-auto max-w-6xl px-6 sm:px-8 lg:px-6 pt-16 pb-12">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Our <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Programs</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed px-4">
            Comprehensive learning solutions designed to help you achieve your academic and career goals. 
            From competitive exams to skill development, we have everything you need to succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <a 
              href="#programs"
              className="inline-flex items-center justify-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-base sm:text-lg font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-red-500 shadow-lg hover:shadow-red-500/25 min-h-[52px]"
            >
              Explore Programs
            </a>
            <a 
              href="/contact"
              className="inline-flex items-center justify-center border-2 border-white text-white hover:bg-white hover:text-gray-900 text-base sm:text-lg font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-white backdrop-blur-sm min-h-[52px]"
            >
              Get Free Consultation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
