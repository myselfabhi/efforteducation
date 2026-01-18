import type { Metadata } from "next";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import CourseHero from "./components/CourseHero";
import CourseDetails from "./components/CourseDetails";
import FacultyList from "./components/FacultyList";
import CounsellingCTA from "./components/CounsellingCTA";
import CourseTestimonials from "./components/CourseTestimonials";

export const metadata: Metadata = {
  title: "Course Details - Competitive Exam Preparation",
  description: "Expert coaching for competitive exams with comprehensive study materials, mock tests, and personalized guidance. Online live classes. Contact for pricing.",
  openGraph: {
    title: "Course Details - Effort Education",
    description: "Expert coaching for competitive exams. Online live classes with experienced faculty.",
    url: "https://efforteducation.vercel.app/courses"
  }
};

export default function CourseDetailPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <CourseHero />
        <CourseDetails />
        <FacultyList />
        <CounsellingCTA />
        <CourseTestimonials />
      </main>
      <Footer />
    </div>
  );
}
