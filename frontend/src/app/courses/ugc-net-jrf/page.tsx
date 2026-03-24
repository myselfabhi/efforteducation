import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";

export default function CoursePlaceholder() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="min-h-screen flex flex-col pt-16">
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 uppercase tracking-tight">Course Coming Soon</h1>
            <p className="text-lg md:text-xl text-gray-500 mb-8 max-w-2xl mx-auto font-medium">We&apos;re currently refining our program for this course to give you the best learning experience. Stay tuned!</p>
            <div className="inline-block px-8 py-4 bg-red-600 rounded-xl text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-red-600/20">Under Development</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
