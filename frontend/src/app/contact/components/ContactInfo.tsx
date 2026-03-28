import { Phone, Mail, Globe } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';

export default function ContactInfo() {
  const contactDetails = [
    {
      icon: Phone,
      title: "Phone",
      lines: ["+91 99103 35093"],
      href: "tel:+919910335093"
    },
    {
      icon: Mail,
      title: "Email",
      lines: ["info@efforteducation.com", "admissions@efforteducation.com"],
      href: "mailto:info@efforteducation.com"
    },
    {
      icon: Globe,
      title: "Location",
      lines: ["Online Classes (Live)", "Available across India and abroad"],
      href: null
    }
  ];

  return (
    <Card className="border border-gray-200 bg-white overflow-hidden rounded-2xl h-full shadow-sm hover:shadow-lg transition-shadow">
      <div className="h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-red-700"></div>
      
      <CardContent className="p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">
          Contact Details
        </h3>
        
        <div className="space-y-8">
          {contactDetails.map((detail, index) => {
            const Content = (
              <div className="flex items-start space-x-5 group">
                <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-red-100">
                  <detail.icon className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">{detail.title}</h4>
                  {detail.lines.map((line, i) => (
                    <p key={i} className="text-gray-700 font-medium text-sm leading-relaxed">{line}</p>
                  ))}
                </div>
              </div>
            );

            if (detail.href) {
              return (
                <a 
                  key={index} 
                  href={detail.href} 
                  className="block transition-transform hover:translate-x-1"
                >
                  {Content}
                </a>
              );
            }

            return <div key={index}>{Content}</div>;
          })}
        </div>
      </CardContent>
    </Card>
  );
}
