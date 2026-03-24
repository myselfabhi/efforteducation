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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-600/20 via-transparent to-transparent" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[128px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[150px]" />
          </div>
          
          <div className="relative z-10 container mx-auto max-w-6xl px-6 text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 uppercase tracking-tight">
              Our <span className="text-red-500">Programs</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-normal">
              Expert coaching for competitive examinations with proven results and personalized guidance.
            </p>
          </div>
        </section>

        {/* Course Grid */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courseList.map((course) => (
                <Link 
                  key={course.slug}
                  href={`/courses/${course.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:border-red-200 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Course Image */}
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={course.heroImage}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                        {course.duration}
                      </span>
                    </div>
                  </div>
                  
                  {/* Course Content */}
                  <div className="p-5">
                    <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                      {course.title}
                    </h2>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                      {course.tagline}
                    </p>
                    
                    {/* Course Stats */}
                    <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-red-500" />
                        <span>{course.batch}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-red-500" />
                        <span>{course.mode}</span>
                      </div>
                    </div>
                    
                    {/* View Course Link */}
                    <div className="flex items-center gap-2 text-sm font-semibold text-red-600 group-hover:gap-3 transition-all">
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
        <section className="py-16 bg-white border-y border-gray-200">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { label: "Students Enrolled", value: "10,000+" },
                { label: "Success Rate", value: "85%" },
                { label: "Expert Faculty", value: "50+" },
                { label: "Mock Tests", value: "500+" }
              ].map((stat, i) => (
                <div key={i} className="p-4">
                  <div className="text-3xl md:text-4xl font-black text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto max-w-4xl px-6">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-600/10 to-transparent" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-600/30">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-2xl md:text-4xl font-black text-white mb-4">
                  Need Help Choosing?
                </h2>
                
                <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                  Get personalized guidance from our experts. Book a free counseling session to find the perfect program for your career goals.
                </p>
                
                <button className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-xl text-white font-bold uppercase tracking-wider text-sm transition-all duration-300 shadow-lg shadow-red-600/30 hover:shadow-red-600/50">
                  Book Free Counseling
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default async function CoursePage({ params }: PageProps) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  
  if (!course) {
    return <CourseListingPage />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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
