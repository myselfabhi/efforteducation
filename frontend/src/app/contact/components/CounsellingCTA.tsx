import { Calendar, Users, Clock } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export default function CounsellingCTA() {
  const handleCounsellingClick = () => {
    // TODO: Integrate with Calendly
    alert('Counselling booking will be integrated with Calendly soon!');
  };

  return (
    <Card className="border border-gray-200 shadow-lg">
      <CardContent className="p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-8 h-8 text-red-600" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Free Counselling Session
          </h3>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            Get personalized guidance from our experts. Book a free counselling session to discuss your career goals and find the right program for you.
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3 text-gray-700">
              <Users className="w-5 h-5 text-red-600" />
              <span>One-on-one guidance</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <Clock className="w-5 h-5 text-red-600" />
              <span>30-minute session</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <Calendar className="w-5 h-5 text-red-600" />
              <span>Flexible scheduling</span>
            </div>
          </div>

          <Button
            onClick={handleCounsellingClick}
            className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-3 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
          >
            Book Free Counselling
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
