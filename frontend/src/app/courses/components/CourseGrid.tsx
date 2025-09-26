import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { BookOpen, Users, Clock, Star } from "lucide-react";
import Link from "next/link";

export default function CourseGrid() {
  const courses = [
    {
      id: "bank-po-clerk",
      title: "Bank PO & Clerk Preparation",
      description: "Comprehensive preparation for banking sector examinations with focus on quantitative aptitude, reasoning, and general awareness.",
      duration: "6 months",
      students: "150+",
      rating: "4.8",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5raW5nJTIwZWR1Y2F0aW9ufGVufDF8fHx8MTc1NTYyMDAxM3w%3D&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
      category: "Government Exams"
    },
    {
      id: "ssc-cgl",
      title: "SSC & CGL Preparation",
      description: "Complete coverage of Staff Selection Commission exams including tier-wise preparation and mock test series.",
      duration: "8 months",
      students: "200+",
      rating: "4.9",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3Zlcm5tZW50JTIwZXhhbXxlbnwxfHx8fDE3NTU2MjAwMTN8&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
      category: "Government Exams"
    },
    {
      id: "public-speaking",
      title: "Public Speaking & Communication",
      description: "Build confidence and eloquence through structured speaking programs, debate sessions, and presentation skills.",
      duration: "3 months",
      students: "100+",
      rating: "4.7",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdWJsaWMlMjBzcGVha2luZ3xlbnwxfHx8fDE3NTU2MjAwMTN8&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
      category: "Skill Development"
    },
    {
      id: "leadership-skills",
      title: "Leadership & Skill Development",
      description: "Develop leadership qualities, teamwork skills, and practical life skills through interactive workshops.",
      duration: "4 months",
      students: "80+",
      rating: "4.8",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWFkZXJzaGlwJTIwZWR1Y2F0aW9ufGVufDF8fHx8MTc1NTYyMDAxM3w%3D&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
      category: "Skill Development"
    }
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
      {courses.map((course) => (
        <Card key={course.id} className="border border-gray-200 hover:shadow-lg transition-shadow duration-300 bg-white">
          <CardContent className="p-0">
            {/* Course Image */}
            <div className="relative h-48 overflow-hidden rounded-t-lg">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {course.category}
                </span>
              </div>
            </div>

            {/* Course Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {course.title}
              </h3>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                {course.description}
              </p>

              {/* Course Stats */}
              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{course.students} students</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{course.rating}</span>
                </div>
              </div>

              {/* CTA Button */}
              <Link href={`/courses/${course.id}`}>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                  <BookOpen className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
