import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { StickyCTABar } from "@/components/landing/StickyCTABar";
import { CourseDetailContent } from "./components/CourseDetailContent";
import { courseList, getCourseBySlug } from "../../data/courses";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    return {
      title: "Course details coming soon",
      description: "We're building a dedicated page for this program.",
    };
  }

  return {
    title: course.title,
    description: course.tagline,
    openGraph: {
      title: course.title,
      description: course.tagline,
      url: `https://efforteducation.vercel.app/courses/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  return courseList.map((course) => ({
    slug: course.slug,
  }));
}

function CourseNotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center pt-16">
        <div className="container mx-auto max-w-2xl px-6 py-24 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-3">Course details coming soon</h1>
          <p className="text-muted-foreground mb-8">
            We&apos;re building a dedicated page for this program. In the meantime, browse all
            courses or talk to a counsellor.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              Browse all courses
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl border border-border font-semibold hover:bg-secondary transition-colors"
            >
              Talk to a counsellor
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default async function CoursePage({ params }: PageProps) {
  const { slug } = await params;

  if (slug === "young-scholar") {
    redirect("/young-scholar");
  }

  const course = getCourseBySlug(slug);

  if (!course) {
    return <CourseNotFound />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pb-24 sm:pb-28 md:pb-16">
        <CourseDetailContent course={course} />
      </main>
      <Footer />
      <StickyCTABar />
    </div>
  );
}
