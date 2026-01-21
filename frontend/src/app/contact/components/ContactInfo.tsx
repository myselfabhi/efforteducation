import { Phone, Mail, Globe } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';

export default function ContactInfo() {
  return (
    <Card className="border-0 shadow-2xl hover:shadow-3xl bg-white overflow-hidden transform hover:-translate-y-1 transition-all duration-300 card-lift h-full">
      {/* Top accent bar with gradient animation */}
      <div className="h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-red-700 gradient-shift"></div>
      
      {/* Mobile-optimized padding */}
      <CardContent className="p-6 sm:p-8">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-5 sm:mb-6">
          Contact Information
        </h3>
        
        <div className="space-y-5 sm:space-y-6">
          {/* Phone - Enhanced touch target */}
          <a 
            href="tel:+919876543210"
            className="flex items-start space-x-4 group touch-glow rounded-lg p-3 -m-3 transition-colors hover:bg-red-50/50"
          >
            <div className="w-14 h-14 sm:w-12 sm:h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
              <Phone className="w-7 h-7 sm:w-6 sm:h-6 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 mb-1.5 text-base sm:text-base">Phone</h4>
              <p className="text-gray-700 font-medium text-base sm:text-sm break-words">+91 98765 43210</p>
              <p className="text-gray-700 font-medium text-base sm:text-sm break-words">+91 87654 32109</p>
            </div>
          </a>

          {/* Email - Enhanced touch target */}
          <a 
            href="mailto:info@efforteducation.com"
            className="flex items-start space-x-4 group touch-glow rounded-lg p-3 -m-3 transition-colors hover:bg-red-50/50"
          >
            <div className="w-14 h-14 sm:w-12 sm:h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
              <Mail className="w-7 h-7 sm:w-6 sm:h-6 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 mb-1.5 text-base sm:text-base">Email</h4>
              <p className="text-gray-700 font-medium text-base sm:text-sm break-words">info@efforteducation.com</p>
              <p className="text-gray-700 font-medium text-base sm:text-sm break-words">admissions@efforteducation.com</p>
            </div>
          </a>

          {/* Location */}
          <div className="flex items-start space-x-4 p-3 -m-3 rounded-lg">
            <div className="w-14 h-14 sm:w-12 sm:h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <Globe className="w-7 h-7 sm:w-6 sm:h-6 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 mb-1.5 text-base sm:text-base">Location</h4>
              <p className="text-gray-700 font-medium leading-relaxed text-base sm:text-sm">
                Online Classes (Live)<br />
                Available across India
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
