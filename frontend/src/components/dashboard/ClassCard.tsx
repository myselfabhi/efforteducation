'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Video, Clock, PlayCircle } from 'lucide-react';
import { format, formatDistanceToNowStrict, isAfter, isBefore, addMinutes, subMinutes } from 'date-fns';
import type { LiveClass } from '@/lib/api';
import { Button } from '@/app/components/ui/button';

interface Props {
  cls: LiveClass;
  manageSlot?: React.ReactNode;
}

function statusLabel(cls: LiveClass) {
  const now = new Date();
  const start = new Date(cls.scheduled_start);
  const end = new Date(cls.scheduled_end);
  if (cls.status === 'CANCELLED') return { label: 'Cancelled', tone: 'bg-muted text-muted-foreground' };
  if (cls.status === 'ENDED' || isAfter(now, addMinutes(end, 30))) return { label: 'Ended', tone: 'bg-muted text-muted-foreground' };
  if (cls.status === 'LIVE' || (isAfter(now, start) && isBefore(now, end))) return { label: 'Live now', tone: 'bg-success/10 text-success' };
  if (isAfter(now, subMinutes(start, 10))) return { label: 'Joinable', tone: 'bg-info/10 text-info' };
  return { label: 'Scheduled', tone: 'bg-muted text-muted-foreground' };
}

export function ClassCard({ cls, manageSlot }: Props) {
  const [, tick] = useState(0);
  // Re-render every 30s so the countdown stays fresh.
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const status = statusLabel(cls);
  const start = new Date(cls.scheduled_start);
  const now = new Date();
  const canJoin = cls.status === 'LIVE' || isAfter(now, subMinutes(start, 10));
  const isFuture = isAfter(start, now);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold truncate">{cls.title}</h3>
          <p className="text-xs text-muted-foreground truncate">
            {cls.batch_name && `${cls.batch_name} · `}
            {cls.teacher_name || cls.teacher_username}
          </p>
        </div>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${status.tone}`}>{status.label}</span>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        <span>
          {format(start, 'PP p')}
          {isFuture && ` · in ${formatDistanceToNowStrict(start)}`}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {canJoin ? (
          <Button asChild className="w-full">
            <Link href={`/dashboard/classes/${cls.id}`}>
              <Video className="h-4 w-4 mr-2" />
              {cls.status === 'LIVE' ? 'Join now' : 'Open room'}
            </Link>
          </Button>
        ) : cls.recording_url ? (
          <Button asChild variant="outline" className="w-full">
            <a href={cls.recording_url} target="_blank" rel="noopener noreferrer">
              <PlayCircle className="h-4 w-4 mr-2" />
              Watch recording
            </a>
          </Button>
        ) : (
          <Button variant="outline" disabled className="w-full">
            {cls.status === 'ENDED' || isAfter(now, addMinutes(new Date(cls.scheduled_end), 30))
              ? 'Class ended'
              : 'Opens 10 min before'}
          </Button>
        )}
        {manageSlot}
      </div>
    </div>
  );
}
