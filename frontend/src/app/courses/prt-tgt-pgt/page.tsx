import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";

export default function CoursePlaceholder() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Course Coming Soon</h1>
          <p className="text-xl text-gray-400 mb-8">We&apos;re currently refining our program for this course to give you the best learning experience. Stay tuned!</p>
          <div className="inline-block px-8 py-4 bg-red-600 rounded-lg text-white font-semibold">Under Development</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
