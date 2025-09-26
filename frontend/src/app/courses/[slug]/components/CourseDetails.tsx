interface CourseDetailsProps {
  slug: string;
}

export default function CourseDetails({ slug: _slug }: CourseDetailsProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto max-w-6xl px-4 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Course Details</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6">
                This comprehensive course is designed to prepare students for banking sector examinations with a focus on all key areas including quantitative aptitude, reasoning, and general awareness.
              </p>
              <h3 className="text-xl font-bold text-gray-900 mb-4">What You&apos;ll Learn</h3>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Quantitative Aptitude - Number systems, algebra, geometry, and data interpretation</li>
                <li>Reasoning - Logical reasoning, analytical reasoning, and verbal reasoning</li>
                <li>General Awareness - Current affairs, banking awareness, and general knowledge</li>
                <li>English Language - Grammar, vocabulary, comprehension, and writing skills</li>
                <li>Computer Knowledge - Basic computer concepts and applications</li>
              </ul>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Course Structure</h3>
              <p className="text-gray-700">
                The course is divided into 6 modules, each focusing on specific topics with regular assessments and mock tests to track your progress.
              </p>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Course Information</h3>
              <div className="space-y-4">
                <div>
                  <span className="font-semibold text-gray-900">Duration:</span>
                  <span className="ml-2 text-gray-700">6 months</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Mode:</span>
                  <span className="ml-2 text-gray-700">Online & Offline</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Batch Size:</span>
                  <span className="ml-2 text-gray-700">30 students</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Language:</span>
                  <span className="ml-2 text-gray-700">English & Hindi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
