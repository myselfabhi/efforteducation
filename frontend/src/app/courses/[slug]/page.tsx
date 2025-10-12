import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import CourseHero from "./components/CourseHero";
import CourseDetails from "./components/CourseDetails";
import FacultyList from "./components/FacultyList";
import CounsellingCTA from "./components/CounsellingCTA";
import CourseTestimonials from "./components/CourseTestimonials";

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
