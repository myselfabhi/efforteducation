import { Phone, Mail, MapPin } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';

export default function ContactInfo() {
  return (
    <Card className="border border-gray-200 shadow-lg">
      <CardContent className="p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Contact Information
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Phone className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Phone</h4>
              <p className="text-gray-700">+91 98765 43210</p>
              <p className="text-gray-700">+91 87654 32109</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Email</h4>
              <p className="text-gray-700">info@efforteducation.com</p>
              <p className="text-gray-700">admissions@efforteducation.com</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Address</h4>
              <p className="text-gray-700">
                123 Education Hub<br />
                Knowledge Park, Sector 15<br />
                New Delhi - 110001
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
