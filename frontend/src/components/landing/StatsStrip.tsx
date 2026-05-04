'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface Stat {
  value: number;
  suffix?: string;
  label: string;
  hint?: string;
}

const STATS: Stat[] = [
  { value: 50000, suffix: '+', label: 'Students taught' },
  { value: 2400, suffix: '+', label: 'Selections in 2025' },
  { value: 34, suffix: '', label: 'Years of legacy', hint: 'Established 1990' },
  { value: 4.8, label: 'Avg rating', hint: 'across 1,200+ reviews' },
];

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();
    const isFloat = !Number.isInteger(to);
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = to * eased;
      setN(isFloat ? Math.round(next * 10) / 10 : Math.round(next));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  const display = Number.isInteger(to)
    ? n.toLocaleString('en-IN')
    : n.toFixed(1);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export function StatsStrip() {
  return (
    <section className="border-y border-border bg-card/50">
      <div className="container mx-auto max-w-6xl px-6 py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center md:text-left">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <div className="text-3xl md:text-4xl font-black tracking-tight text-primary">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="text-sm font-medium mt-1">{s.label}</div>
              {s.hint && <div className="text-xs text-muted-foreground">{s.hint}</div>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
