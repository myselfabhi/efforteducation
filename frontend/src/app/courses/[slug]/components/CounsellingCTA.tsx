import { Calendar, Users, Clock } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';

export default function CounsellingCTA() {
  const handleCounsellingClick = () => {
    // TODO: Integrate with Calendly
    alert('Counselling booking will be integrated with Calendly soon!');
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto max-w-6xl px-4 lg:px-8">
        <Card className="border border-gray-200 shadow-lg">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-red-600" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Start Your Journey?
              </h2>
              
              <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
                Book a free counselling session to discuss your goals and get personalized guidance on this course.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center space-x-3 text-gray-700">
                  <Users className="w-6 h-6 text-red-600" />
                  <span>One-on-one guidance</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Clock className="w-6 h-6 text-red-600" />
                  <span>30-minute session</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Calendar className="w-6 h-6 text-red-600" />
                  <span>Flexible scheduling</span>
                </div>
              </div>

              <Button
                onClick={handleCounsellingClick}
                className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-4 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
              >
                Book Free Counselling
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
