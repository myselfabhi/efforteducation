'use client';

import { Calendar, Users, Clock } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export default function CounsellingCTA() {
  const handleCounsellingClick = () => {
    // TODO: Integrate with Calendly
    alert('Counselling booking will be integrated with Calendly soon!');
  };

  return (
    <Card className="border-0 shadow-2xl hover:shadow-3xl bg-gradient-to-br from-white to-red-50/30 overflow-hidden transform hover:-translate-y-1 transition-all duration-300 card-lift h-full">
      {/* Top accent bar with gradient animation */}
      <div className="h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-red-700 gradient-shift"></div>
      
      {/* Mobile-optimized padding */}
      <CardContent className="p-6 sm:p-8 flex flex-col h-full">
        <div className="text-center flex-1 flex flex-col">
          {/* Icon with pulse animation */}
          <div className="w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-lg transform hover:scale-110 transition-transform duration-300 fab-pulse">
            <Calendar className="w-8 h-8 sm:w-9 sm:h-9 text-red-600" />
          </div>
          
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
            Free Counselling Session
          </h3>
          
          <p className="text-base sm:text-base text-gray-700 mb-5 sm:mb-6 leading-relaxed px-2">
            Get personalized guidance from our experts. Book a free counselling session to discuss your career goals and find the right program for you.
          </p>

          {/* Benefits list with better mobile spacing */}
          <div className="space-y-3 sm:space-y-3 mb-6 sm:mb-8">
            <div className="flex items-center justify-center space-x-3 text-gray-700 min-h-[44px]">
              <Users className="w-6 h-6 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
              <span className="font-medium text-base sm:text-base">One-on-one guidance</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-gray-700 min-h-[44px]">
              <Clock className="w-6 h-6 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
              <span className="font-medium text-base sm:text-base">30-minute session</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-gray-700 min-h-[44px]">
              <Calendar className="w-6 h-6 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
              <span className="font-medium text-base sm:text-base">Flexible scheduling</span>
            </div>
          </div>

          {/* CTA Button - Enhanced for mobile */}
          <Button
            onClick={handleCounsellingClick}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-base sm:text-lg py-3.5 sm:py-3 min-h-[52px] sm:min-h-[56px] rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-red-500 shadow-xl hover:shadow-2xl hover:shadow-red-500/30 btn-press touch-glow font-semibold"
          >
            Book Free Counselling
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
