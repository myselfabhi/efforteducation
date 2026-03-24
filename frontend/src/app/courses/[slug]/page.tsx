import type { Metadata } from "next";
import Image from "next/image";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import CourseHero from "./components/CourseHero";
import CourseDetails from "./components/CourseDetails";
import CourseTestimonials from "./components/CourseTestimonials";
import CounsellingCTA from "./components/CounsellingCTA";
import { courseList, getCourseBySlug } from "../../data/courses";
import Link from "next/link";
import { ArrowRight, BookOpen, Users, Award } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  
  if (!course) {
    return {
      title: "Course Not Found | Effort Education",
      description: "The requested course could not be found."
    };
  }
  
  return {
    title: `${course.title} | Effort Education`,
    description: course.tagline,
    openGraph: {
      title: `${course.title} | Effort Education`,
      description: course.tagline,
      url: `https://efforteducation.vercel.app/courses/${slug}`
    }
  };
}

export async function generateStaticParams() {
  return courseList.map((course) => ({
    slug: course.slug,
  }));
}

function CourseListingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-600/30 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-400/20 rounded-full blur-[120px]" />
          </div>
          
          <div className="relative z-10 container mx-auto max-w-6xl px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 uppercase tracking-tight">
              Our <span className="text-red-600">Programs</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium">
              Comprehensive coaching for competitive examinations with expert faculty, structured curriculum, and proven results.
            </p>
          </div>
        </section>

        {/* Course Grid */}
        <section className="py-16 bg-white">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courseList.map((course) => (
                <Link 
                  key={course.slug}
                  href={`/courses/${course.slug}`}
                  className="group block bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Course Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={course.heroImage}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  
                  {/* Course Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight group-hover:text-red-600 transition-colors">
                      {course.title}
                    </h2>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {course.tagline}
                    </p>
                    
                    {/* Course Stats */}
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Clock className="w-3.5 h-3.5 text-red-600" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Users className="w-3.5 h-3.5 text-red-600" />
                        <span>{course.batch}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Award className="w-3.5 h-3.5 text-red-600" />
                        <span>{course.mode}</span>
                      </div>
                    </div>
                    
                    {/* View Course Link */}
                    <div className="flex items-center gap-2 text-sm font-bold text-red-600 group-hover:gap-3 transition-all">
                      <span>View Program</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { label: "Students Enrolled", value: "10,000+" },
                { label: "Success Rate", value: "85%" },
                { label: "Expert Faculty", value: "50+" },
                { label: "Mock Tests", value: "500+" }
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl md:text-4xl font-black text-red-600 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto max-w-4xl px-6 text-center">
            <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <BookOpen className="w-6 h-6 text-red-600" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 uppercase tracking-tight">
              Not Sure Which Course is Right for You?
            </h2>
            
            <p className="text-base text-gray-500 mb-8 max-w-xl mx-auto font-medium">
              Book a free counseling session and get personalized guidance on which program best suits your career goals.
            </p>
            
            <button className="px-10 py-4 bg-red-600 hover:bg-red-700 rounded-xl text-white font-bold uppercase tracking-widest text-sm transition-all duration-300 shadow-xl shadow-red-600/20">
              Book Free Counseling
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Clock({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export default async function CoursePage({ params }: PageProps) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  
  // If no valid slug provided or course not found, show listing page
  if (!course) {
    return <CourseListingPage />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <CourseHero course={course} />
        <CourseDetails course={course} />
        <CourseTestimonials course={course} />
        <div className="pb-24 sm:pb-28 md:pb-16">
          <CounsellingCTA />
        </div>
      </main>
      <Footer />
    </div>
  );
}
