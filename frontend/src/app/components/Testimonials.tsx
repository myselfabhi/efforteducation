export default function Testimonials() {
  const items = [
    {
      quote:
        "Effort Education helped my son gain confidence and clarity. The speaking activities were excellent!",
      name: "Parent - Mrs. Sharma",
    },
    {
      quote:
        "The exam strategies and regular mocks made a huge difference in my preparation.",
      name: "Student - Rohan",
    },
  ];

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-10">Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((t, idx) => (
            <div key={idx} className="p-6 rounded-lg border border-gray-800 bg-gray-800/60">
              <div className="w-14 h-14 rounded-full bg-gray-700 mb-3" />
              <p className="text-gray-200 mb-3">“{t.quote}”</p>
              <p className="text-gray-400 text-sm">{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


