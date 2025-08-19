export default function About() {
  return (
    <section id="about" className="py-16 bg-white text-gray-900">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-8">About Effort Education</h2>
        <p className="text-gray-700 text-center max-w-3xl mx-auto mb-10">
          Effort Education is a modern learning initiative focused on building real-world skills and academic excellence. We offer coaching for government competitive exams and enrichment programs that enhance communication, confidence, and leadership.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg border bg-gray-50">
            <h3 className="font-semibold mb-2">Our Mission</h3>
            <p className="text-gray-700">To empower young minds with knowledge, skills, and values that prepare them for future challenges.</p>
          </div>
          <div className="p-6 rounded-lg border bg-gray-50">
            <h3 className="font-semibold mb-2">Our Approach</h3>
            <p className="text-gray-700">Balanced focus on academics and skill development through engaging, student-first pedagogy.</p>
          </div>
          <div className="p-6 rounded-lg border bg-gray-50">
            <h3 className="font-semibold mb-2">Founder’s Note</h3>
            <p className="text-gray-700">“Education should build character, confidence, and competence.” — Founder</p>
          </div>
        </div>
      </div>
    </section>
  );
}


