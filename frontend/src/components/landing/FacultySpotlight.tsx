'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useAuthModal } from '@/lib/stores/authModalStore';

interface Faculty {
  initials: string;
  name: string;
  subjects: string;
  experience: string;
  blurb: string;
}

const FACULTY: Faculty[] = [
  {
    initials: 'NS',
    name: 'Neha Sharma',
    subjects: 'Quant · Reasoning',
    experience: '12 years',
    blurb: '300+ banking selections. Famous for breaking complex DI sets into 30-second tricks.',
  },
  {
    initials: 'AM',
    name: 'Arjun Mehta',
    subjects: 'English · GA',
    experience: '15 years',
    blurb: 'Daily current-affairs digest reader by 14k aspirants. Editorial vocab specialist.',
  },
  {
    initials: 'RV',
    name: 'Rohit Verma',
    subjects: 'CUET (UG) · NET',
    experience: '10 years',
    blurb: 'NTA pattern strategist. Mentored 80+ NET selections in the last cycle.',
  },
  {
    initials: 'PK',
    name: 'Priya Kapoor',
    subjects: 'Young Scholar · Public Speaking',
    experience: '8 years',
    blurb: 'Builds confidence in Class 4–8 kids through structured speaking & quiz games.',
  },
];

export function FacultySpotlight() {
  const openAuth = useAuthModal((s) => s.openModal);
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">Faculty</p>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
            Taught by people who&rsquo;ve cracked it.
          </h2>
          <p className="mt-3 text-muted-foreground">
            10+ years of teaching experience on average. Many are former rank-holders themselves.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {FACULTY.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group rounded-2xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-bold text-lg flex items-center justify-center mb-4">
                {f.initials}
              </div>
              <h3 className="font-bold text-base">{f.name}</h3>
              <p className="text-xs text-primary font-semibold mt-0.5">{f.subjects}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{f.experience} · teaching</p>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{f.blurb}</p>
              <button
                type="button"
                onClick={() => openAuth('register')}
                className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Book a demo class <ArrowRight className="h-3 w-3" />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => openAuth('register')}
            className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Book a free demo class
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
