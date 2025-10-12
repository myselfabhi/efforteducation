import { Button } from '../../components/ui/button';
import { ArrowRight, Phone, Mail } from 'lucide-react';

export default function ProgramCTA() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto max-w-6xl px-4 lg:px-6">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your <span className="text-red-400">Learning Journey</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join thousands of successful students who have achieved their dreams with our comprehensive programs. 
            Get a free consultation and personalized study plan today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a href="/contact">
              <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-lg px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-red-500 shadow-lg hover:shadow-red-500/25">
                <Phone className="w-5 h-5 mr-2" />
                Get Free Consultation
              </Button>
            </a>
            <a href="/courses">
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-gray-900 text-lg px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-white backdrop-blur-sm">
                <ArrowRight className="w-5 h-5 mr-2" />
                Browse All Courses
              </Button>
            </a>
          </div>

          {/* Contact Info */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-center mb-4">
                <Phone className="w-8 h-8 text-red-400 mr-3" />
                <h3 className="text-xl font-bold text-white">Call Us</h3>
              </div>
              <p className="text-gray-300 mb-2">Speak with our education counselors</p>
              <p className="text-lg font-semibold text-red-400">+91 98765 43210</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-red-400 mr-3" />
                <h3 className="text-xl font-bold text-white">Email Us</h3>
              </div>
              <p className="text-gray-300 mb-2">Get detailed information via email</p>
              <p className="text-lg font-semibold text-red-400">info@efforteducation.com</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
