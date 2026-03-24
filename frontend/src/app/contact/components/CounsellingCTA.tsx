'use client';

import { Calendar, Users, Clock } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export default function CounsellingCTA() {
  const handleCounsellingClick = () => {
    alert('Counselling booking will be integrated with Calendly soon!');
  };

  return (
    <Card className="border border-gray-200 bg-white overflow-hidden rounded-2xl h-full shadow-sm hover:shadow-lg transition-shadow group">
      <div className="h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-red-700"></div>
      
      <CardContent className="p-8 flex flex-col h-full items-center text-center">
        <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm transition-all duration-300 group-hover:bg-red-100">
          <Calendar className="w-6 h-6 text-red-600" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">
          Free Counselling
        </h3>
        
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          Get personalized guidance from our experts to find the right program for your career goals.
        </p>

        <div className="w-full space-y-4 mb-10">
          {[
            { icon: Users, text: "One-on-one guidance" },
            { icon: Clock, text: "30-minute session" },
            { icon: Calendar, text: "Flexible scheduling" }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-center gap-2 text-gray-600">
              <item.icon className="w-4 h-4 text-red-600" />
              <span className="text-xs font-medium">{item.text}</span>
            </div>
          ))}
        </div>

        <Button
          onClick={handleCounsellingClick}
          className="w-full h-12 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
        >
          Book Session
        </Button>
      </CardContent>
    </Card>
  );
}
