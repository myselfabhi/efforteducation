'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '../ui/button';
import Logo from '../common/Logo';
import { GraduationCap, ArrowRight, Star, Clock, Trophy } from 'lucide-react';

export default function YoungScholarBanner() {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Decorative background effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-50 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto max-w-6xl px-6 relative z-10">
        {/* Banner Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-2xl group"
        >
          {/* Accent Line */}
          <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-40" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 md:p-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-100 rounded-full mb-4">
                <GraduationCap className="w-3.5 h-3.5 text-red-600" />
                <span className="text-red-600 text-[10px] font-black uppercase tracking-widest">Ages 8-14</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4 tracking-tighter uppercase">
                YOUNG <span className="text-red-600">SCHOLAR</span><br />
                PROGRAM
              </h2>
              
              <p className="text-base md:text-lg text-gray-500 mb-8 max-w-xl leading-relaxed font-medium">
                Developing the next generation of critical thinkers. Our weekend skill-building program focuses on holistic growth beyond textbooks.
              </p>
              
              {/* Feature Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="flex flex-col gap-1.5">
                  <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 group-hover:bg-red-50 group-hover:border-red-100 transition-colors">
                    <Star className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Current Affairs</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 group-hover:bg-red-50 group-hover:border-red-100 transition-colors">
                    <Trophy className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Reasoning</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 group-hover:bg-red-50 group-hover:border-red-100 transition-colors">
                    <Clock className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Public Speaking</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 group-hover:bg-red-50 group-hover:border-red-100 transition-colors">
                    <ArrowRight className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">And More!</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/young-scholar">
                  <Button className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest px-6 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl shadow-red-600/10 text-xs">
                    Explore Program
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="border-2 border-gray-100 bg-white text-gray-900 hover:border-red-600 font-black uppercase tracking-widest px-6 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 text-xs">
                    Enroll Now
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Right Side - Visual element or placeholder */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-square rounded-xl bg-gradient-to-br from-red-50 to-white border border-gray-100 relative group-hover:border-red-100 transition-colors duration-500 overflow-hidden flex items-center justify-center">
                 <Logo className="text-7xl opacity-10 group-hover:opacity-30 transition-opacity duration-500" />
                 {/* Decorative Rings */}
                 <div className="absolute inset-0 border-[30px] border-red-500/5 rounded-full scale-110" />
                 <div className="absolute inset-0 border-[60px] border-red-500/10 rounded-full scale-125" />
              </div>
            </div>
            
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Fixed import in the component above
// import { MessageCircle } from 'lucide-react'; (already imported)

