import { cn } from '@/lib/utils';

interface Props {
  label: string;
  value: number | string;
  hint?: string;
  accent?: 'primary' | 'emerald' | 'amber' | 'blue';
  icon?: React.ReactNode;
}

const ACCENTS: Record<NonNullable<Props['accent']>, string> = {
  primary: 'text-primary bg-primary/10',
  emerald: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30',
  amber: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30',
  blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
};

export function StatCard({ label, value, hint, accent = 'primary', icon }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        {icon && (
          <span className={cn('h-9 w-9 rounded-lg flex items-center justify-center', ACCENTS[accent])}>
            {icon}
          </span>
        )}
      </div>
      <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
