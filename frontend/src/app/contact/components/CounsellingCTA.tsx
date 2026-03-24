'use client';

import { Calendar, Users, Clock } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export default function CounsellingCTA() {
  const handleCounsellingClick = () => {
    alert('Counselling booking will be integrated with Calendly soon!');
  };

  return (
    <Card className="border border-gray-800 bg-gray-900/40 backdrop-blur-xl overflow-hidden rounded-2xl h-full shadow-2xl group">
      <div className="h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-red-700"></div>
      
      <CardContent className="p-8 flex flex-col h-full items-center text-center">
        <div className="w-14 h-14 bg-gray-800 border border-gray-700 rounded-2xl flex items-center justify-center mb-6 shadow-xl transition-all duration-500 group-hover:border-red-500/50 group-hover:scale-110">
          <Calendar className="w-6 h-6 text-red-500" />
        </div>
        
        <h3 className="text-xl font-black text-white mb-4 tracking-tight uppercase">
          Free Counselling
        </h3>
        
        <p className="text-sm text-gray-400 mb-8 leading-relaxed font-medium">
          Get personalized guidance from our experts to find the right program for your career goals.
        </p>

        <div className="w-full space-y-4 mb-10">
          {[
            { icon: Users, text: "One-on-one guidance" },
            { icon: Clock, text: "30-minute session" },
            { icon: Calendar, text: "Flexible scheduling" }
          ].map((item, i) => (
            <div key={i} className="flex items-center space-x-3 text-gray-300">
              <item.icon className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-bold uppercase tracking-wider">{item.text}</span>
            </div>
          ))}
        </div>

        <Button
          onClick={handleCounsellingClick}
          className="w-full h-12 bg-transparent border-2 border-gray-700 hover:border-yellow-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
        >
          Book Session
        </Button>
      </CardContent>
    </Card>
  );
}
