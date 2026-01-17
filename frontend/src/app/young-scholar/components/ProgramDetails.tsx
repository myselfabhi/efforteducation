'use client';

import { Card, CardContent } from '@/app/components/ui/card';
import { Calendar, Users, Laptop, IndianRupee, Clock } from 'lucide-react';

export default function ProgramDetails() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto max-w-6xl px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Program Details
          </h2>
          <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about the Young Scholar Program
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border border-gray-700 bg-gray-800/50 shadow-lg backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 border-2 border-red-500 rounded-lg flex items-center justify-center flex-shrink-0 bg-transparent">
                    <Users className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Age Group</h3>
                    <p className="text-gray-300">Class 4-8 Students</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 border-2 border-red-500 rounded-lg flex items-center justify-center flex-shrink-0 bg-transparent">
                    <Calendar className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Schedule</h3>
                    <p className="text-gray-300">Weekend program - Few hours on weekends</p>
                    <p className="text-sm text-gray-400 mt-1">Flexible timing to fit your schedule</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 border-2 border-red-500 rounded-lg flex items-center justify-center flex-shrink-0 bg-transparent">
                    <Laptop className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Mode</h3>
                    <p className="text-gray-300">Online (Live Classes)</p>
                    <p className="text-sm text-gray-400 mt-1">Learn from the comfort of your home</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 border-2 border-red-500 rounded-lg flex items-center justify-center flex-shrink-0 bg-transparent">
                    <Users className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Class Size</h3>
                    <p className="text-gray-300">Small batches for personalized attention</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-red-500/30 shadow-lg bg-gradient-to-br from-red-900/20 to-red-800/10 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IndianRupee className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Program Fee</h3>
                    <p className="text-3xl font-bold text-red-400 mb-1">₹999</p>
                    <p className="text-sm text-gray-300">Affordable education for everyone</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 border-2 border-red-500 rounded-lg flex items-center justify-center flex-shrink-0 bg-transparent">
                    <Clock className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Duration</h3>
                    <p className="text-gray-300">Weekend program (extendable)</p>
                    <p className="text-sm text-gray-400 mt-1">Continue learning based on progress</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-red-500/30">
                  <h3 className="text-lg font-semibold text-white mb-3">What&apos;s Included:</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">✓</span>
                      <span>Live interactive classes on weekends</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">✓</span>
                      <span>Study materials and resources</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">✓</span>
                      <span>Practice quizzes and assessments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">✓</span>
                      <span>Regular progress tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">✓</span>
                      <span>Doubt clearing sessions</span>
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
