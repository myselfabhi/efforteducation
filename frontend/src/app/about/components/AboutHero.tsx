import { ImageWithFallback } from '../../components/common/ImageWithFallback';

export default function AboutHero() {
  return (
    <section className="relative min-h-[45vh] sm:min-h-[50vh] lg:min-h-[60vh] bg-gray-900 overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-black/40 to-red-800/20"></div>
      
      {/* Mobile-optimized padding */}
      <div className="relative container mx-auto max-w-7xl px-6 sm:px-8 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight px-4 sm:px-0">
              About <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Effort Education</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed px-4 sm:px-0">
              Founded on the principle of student-first education, we are dedicated to providing comprehensive learning solutions that prepare students not just for examinations, but for success in life.
            </p>
          </div>

          {/* Right Column - Hero Image (hidden on mobile for cleaner UX) */}
          <div className="hidden lg:flex justify-center lg:justify-end">
            <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
              <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjB0ZWFtJTIwdGVhY2hlcnN8ZW58MXx8fHwxNzU1NjIwMDEzfA%3D%3D&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Education team and teachers"
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Decorative Elements with pulse */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-600/30 rounded-full blur-xl z-0 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-red-800/20 rounded-full blur-xl z-0 animate-pulse delay-150"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
