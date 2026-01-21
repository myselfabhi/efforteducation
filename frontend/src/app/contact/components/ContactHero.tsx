import { ImageWithFallback } from '../../components/common/ImageWithFallback';

export default function ContactHero() {
  return (
    <section className="relative min-h-[45vh] sm:min-h-[50vh] bg-gray-900 overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-black/40 to-red-800/20"></div>
      
      {/* Mobile-optimized padding: pt-24 on mobile (accounts for header), pt-32 on desktop */}
      <div className="relative container mx-auto max-w-7xl px-6 sm:px-8 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight px-4 sm:px-0">
              Get in <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Touch</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed px-4 sm:px-0">
              Ready to start your learning journey? Contact us today to learn more about our programs and how we can help you achieve your goals.
            </p>
          </div>

          {/* Right Column - Hero Image (hidden on mobile for cleaner UX) */}
          <div className="hidden lg:flex justify-center lg:justify-end">
            <div className="relative transform hover:scale-105 transition-transform duration-500">
              <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250YWN0JTIwY29tbXVuaWNhdGlvbnxlbnwxfHx8fDE3NTU2MjAwMTN8&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Contact and communication"
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-600/30 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-red-800/20 rounded-full blur-xl animate-pulse delay-150"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
