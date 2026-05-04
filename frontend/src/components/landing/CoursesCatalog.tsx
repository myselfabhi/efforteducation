'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { api, type Course } from '@/lib/api';
import { COURSES as STATIC_COURSES } from '@/lib/courses';
import { Button } from '@/app/components/ui/button';

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All courses',
  banking: 'Banking',
  insurance: 'Insurance',
  'soft skills': 'Soft Skills',
  teaching: 'Teaching',
  'delhi govt': 'Delhi Govt',
  hospitality: 'Hospitality',
  entrance: 'Entrance',
  ssc: 'SSC',
  railway: 'Railway',
  cuet: 'CUET',
  'young-scholar': 'Young Scholar',
  'hotel-mgmt': 'Hotel Management',
  police: 'Police',
  net: 'NET / JRF',
  pcs: 'PCS',
};

interface CardCourse {
  slug: string;
  title: string;
  category: string;
  description?: string | null;
  duration_months?: number | null;
  price_inr?: number | null;
  hero_image_url?: string | null;
}

function deriveCategory(slug: string, title: string): string {
  const t = title.toLowerCase();
  const s = slug.toLowerCase();
  if (s.includes('young-scholar')) return 'young-scholar';
  if (t.includes('bank') || t.includes('lic') || t.includes('gic') || t.includes('ibps') || t.includes('sbi po')) return 'banking';
  if (t.includes('insurance')) return 'insurance';
  if (t.includes('ssc') || t.includes('cgl') || t.includes('chsl')) return 'ssc';
  if (t.includes('railway') || t.includes('ntpc')) return 'railway';
  if (t.includes('cuet')) return 'cuet';
  if (t.includes('hotel') || t.includes('nchmct')) return 'hospitality';
  if (t.includes('net') || t.includes('jrf')) return 'net';
  if (t.includes('ctet') || t.includes('tet') || t.includes('prt') || t.includes('tgt') || t.includes('pgt') || t.includes('dsssb') || t.includes('kvs') || t.includes('nvs')) return 'teaching';
  if (t.includes('interview') || t.includes('soft skill') || t.includes('public speak')) return 'soft skills';
  if (t.includes('police') || t.includes('constable')) return 'police';
  return 'banking';
}

export function CoursesCatalog({
  showSectionHeader = true,
  showViewAllBtn = true,
  compact = false,
  showFilters = true,
  featured = false,
}: {
  showSectionHeader?: boolean;
  showViewAllBtn?: boolean;
  compact?: boolean;
  showFilters?: boolean;
  featured?: boolean;
} = {}) {
  const { data, isLoading } = useQuery({
    queryKey: ['public', 'courses'],
    queryFn: () => api.courses.list() as Promise<Course[]>,
    staleTime: 5 * 60_000,
  });

  const courses: CardCourse[] = useMemo(() => {
    // Build a map of DB courses keyed by slug for quick lookup
    const dbBySlug = new Map<string, Course>();
    (data ?? []).forEach((c) => dbBySlug.set(c.slug, c));

    // Always start from the full static list so every course is visible.
    // DB rows enrich static entries (price, duration, image) or add new ones.
    const staticCards: CardCourse[] = STATIC_COURSES.map((c) => {
      const db = dbBySlug.get(c.slug);
      dbBySlug.delete(c.slug); // mark as consumed
      return {
        slug: c.slug,
        title: db?.title ?? c.title,
        category: (db?.category ?? c.category).toLowerCase(),
        description: db?.description ?? c.description,
        duration_months: db?.duration_months ?? null,
        price_inr: db?.price_inr ?? null,
        hero_image_url: db?.hero_image_url ?? null,
      };
    });

    // Any DB courses not in the static list (new courses added via admin) go at the end
    const extraDbCards: CardCourse[] = Array.from(dbBySlug.values()).map((c) => ({
      ...c,
      category: c.category.toLowerCase(),
    }));
    return [...staticCards, ...extraDbCards];
  }, [data]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => set.add(c.category));
    return ['all', ...Array.from(set)];
  }, [courses]);

  const [active, setActive] = useState<string>('all');
  const filteredAll = active === 'all' ? courses : courses.filter((c) => c.category === active);
  const filtered = featured ? filteredAll.slice(0, 6) : filteredAll;

  return (
    <section id="courses" className={compact ? 'pt-6 pb-10' : 'py-20 bg-secondary/40'}>
      <div className="container mx-auto max-w-6xl px-6">
        {showSectionHeader && (
          featured ? (
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
              <div className="max-w-xl">
                <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">
                  Course catalog
                </p>
                <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
                  Find your path.
                </h2>
              </div>
              <Link
                href="/courses"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2 transition-all"
              >
                See all {courses.length} courses
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="text-center max-w-2xl mx-auto mb-10">
              <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">Course catalog</p>
              <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">Find your path.</h2>
              <p className="mt-3 text-muted-foreground">
                From competitive exams to skill development for young learners — pick what fits your goal.
              </p>
            </div>
          )
        )}

        {showFilters && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  active === c
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                }`}
              >
                {CATEGORY_LABELS[c] ?? c}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-56 rounded-2xl border border-border bg-card animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((c, i) => (
              <motion.div
                key={c.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
              >
                <Link
                  href={`/courses/${c.slug}`}
                  className="group block h-full rounded-2xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
                      {CATEGORY_LABELS[c.category] ?? c.category}
                    </span>
                    {c.price_inr && (
                      <span className="text-xs font-semibold text-primary">
                        ₹{c.price_inr.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold tracking-tight group-hover:text-primary transition-colors">
                    {c.title}
                  </h3>
                  {c.description && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{c.description}</p>
                  )}
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    {c.duration_months ? <span>{c.duration_months} months</span> : <span />}
                    <span className="inline-flex items-center gap-1 text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn more <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {showViewAllBtn && (
          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg">
              <Link href="/courses">
                See all courses
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
