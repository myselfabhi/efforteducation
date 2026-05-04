import Link from 'next/link';
import { CalendarDays, Clock } from 'lucide-react';
import { format } from 'date-fns';
import type { Batch } from '@/lib/api';
import { Badge } from '@/app/components/ui/badge';

interface Props {
  batch: Batch;
  href: string;
}

const STATUS_VARIANT: Record<string, string> = {
  upcoming: 'bg-info/10 text-info',
  active: 'bg-success/10 text-success',
  completed: 'bg-muted text-muted-foreground',
  archived: 'bg-muted text-muted-foreground',
};

export function BatchCard({ batch, href }: Props) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{batch.course_title || 'Course'}</p>
          <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
            {batch.name}
          </h3>
        </div>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_VARIANT[batch.status] || 'bg-muted text-muted-foreground'}`}>
          {batch.status}
        </span>
      </div>
      <div className="mt-3 space-y-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5" />
          <span>
            Starts {format(new Date(batch.start_date), 'PP')}
            {batch.end_date && ` · Ends ${format(new Date(batch.end_date), 'PP')}`}
          </span>
        </div>
        {batch.schedule_description && (
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span className="truncate">{batch.schedule_description}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

export { Badge };
