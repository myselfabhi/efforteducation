'use client';

import { TrendingUp, TrendingDown, Target } from 'lucide-react';
import type { SkillMastery } from '@/lib/api';
import { cn } from '@/lib/utils';

// A 5-segment bar filled up to the skill's level (0–5).
function LevelBar({ level }: { level: number }) {
  return (
    <div className="flex gap-1" aria-hidden>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={cn('h-1.5 w-5 rounded-full', n <= level ? 'bg-primary' : 'bg-secondary')}
        />
      ))}
    </div>
  );
}

function Trend({ trend }: { trend: number }) {
  if (trend > 0) return <TrendingUp className="h-3.5 w-3.5 text-success" aria-label="improving" />;
  if (trend < 0) return <TrendingDown className="h-3.5 w-3.5 text-muted-foreground" aria-label="dipped" />;
  return null;
}

/** Full mastery panel — the child's hub. */
export function MasteryCard({ skills }: { skills: SkillMastery[] }) {
  if (!skills || skills.length === 0) return null;
  const started = skills.some((s) => s.level > 0);

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Target className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Your skills</h3>
      </div>

      {!started && (
        <p className="mb-4 text-sm text-muted-foreground">
          Play skill quizzes to start building your mastery — each one lifts the matching skill.
        </p>
      )}

      <ul className="space-y-3.5">
        {skills.map((s) => {
          const started = s.level > 0;
          return (
            <li key={s.skill_id} className="flex items-center gap-3">
              <span className={cn('text-xl leading-none', !started && 'opacity-40 grayscale')}>{s.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className={cn('truncate text-sm font-medium', !started && 'text-muted-foreground')}>{s.name}</p>
                  <Trend trend={s.trend} />
                </div>
                <div className="mt-1.5"><LevelBar level={s.level} /></div>
              </div>
              <div className="shrink-0 text-right">
                <p className={cn('text-sm font-semibold', !started && 'text-muted-foreground')}>{s.level_label}</p>
                <p className="text-[11px] text-muted-foreground">
                  {started ? `${s.accuracy_pct}% · ${s.quizzes} ${s.quizzes === 1 ? 'quiz' : 'quizzes'}` : 'No quizzes yet'}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Compact strip of started skills — the parent card. Renders nothing until
 *  the child has mastery data. */
export function CompactMastery({ skills }: { skills: SkillMastery[] }) {
  const started = (skills ?? []).filter((s) => s.level > 0);
  if (started.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Skills</p>
      <div className="flex flex-wrap gap-1.5">
        {started.map((s) => (
          <span
            key={s.skill_id}
            className="inline-flex items-center gap-1 rounded-full bg-secondary/60 px-2.5 py-1 text-xs"
            title={`${s.name}: ${s.level_label} (${s.accuracy_pct}%)`}
          >
            <span>{s.emoji}</span>
            <span className="font-medium">{s.level_label}</span>
            {s.trend > 0 && <TrendingUp className="h-3 w-3 text-success" />}
          </span>
        ))}
      </div>
    </div>
  );
}
