import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import CourseHero from "./components/CourseHero";
import CourseDetails from "./components/CourseDetails";
import FacultyList from "./components/FacultyList";
import CounsellingCTA from "./components/CounsellingCTA";
import CourseTestimonials from "./components/CourseTestimonials";

interface CoursePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { slug } = await params;
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <CourseHero slug={slug} />
        <CourseDetails slug={slug} />
        <FacultyList slug={slug} />
        <CounsellingCTA slug={slug} />
        <CourseTestimonials slug={slug} />
      </main>
      <Footer />
    </div>
  );
}
