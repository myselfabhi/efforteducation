import type { Metadata } from "next";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import CourseHero from "./components/CourseHero";
import CourseDetails from "./components/CourseDetails";
import CounsellingCTA from "./components/CounsellingCTA";

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
    <div className="min-h-screen flex flex-col bg-gray-950">
      <Header />
      <main className="flex-1">
        <CourseHero />
        <CourseDetails />
        <div className="pb-24 sm:pb-28 md:pb-16">
          <CounsellingCTA />
        </div>
      </main>
      <Footer />
    </div>
  );
}
