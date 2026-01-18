'use client';

import { Card, CardContent } from '@/app/components/ui/card';
import { Calendar, Users, Laptop, IndianRupee, Clock } from 'lucide-react';

export default function ProgramDetails() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto max-w-6xl px-6 sm:px-8 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 px-4">
            Program Details
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed px-4">
            Everything you need to know about the Young Scholar Program
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-gray-200 bg-white shadow-lg">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Age Group</h3>
                    <p className="text-gray-700">Class 4-8 Students</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Schedule</h3>
                    <p className="text-gray-700">Weekend program - Few hours on weekends</p>
                    <p className="text-sm text-gray-600 mt-1">Flexible timing to fit your schedule</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Laptop className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Mode</h3>
                    <p className="text-gray-700">Online (Live Classes)</p>
                    <p className="text-sm text-gray-400 mt-1">Learn from the comfort of your home</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Class Size</h3>
                    <p className="text-gray-700">Small batches for personalized attention</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-red-200 shadow-lg bg-gradient-to-br from-red-50 to-white">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IndianRupee className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Program Fee</h3>
                    <p className="text-3xl font-bold text-red-600 mb-1">₹999</p>
                    <p className="text-sm text-gray-600">Affordable education for everyone</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Duration</h3>
                    <p className="text-gray-700">Weekend program (extendable)</p>
                    <p className="text-sm text-gray-600 mt-1">Continue learning based on progress</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-red-300">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">What&apos;s Included:</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">✓</span>
                      <span className="font-medium">Live interactive classes on weekends</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">✓</span>
                      <span className="font-medium">Study materials and resources</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">✓</span>
                      <span className="font-medium">Practice quizzes and assessments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">✓</span>
                      <span className="font-medium">Regular progress tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">✓</span>
                      <span className="font-medium">Doubt clearing sessions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
