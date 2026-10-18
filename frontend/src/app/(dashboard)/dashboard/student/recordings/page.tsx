'use client';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Film, PlayCircle, ExternalLink } from 'lucide-react';
import { api, type Recording } from '@/lib/api';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { EmptyState } from '@/components/dashboard/EmptyState';

// R2-hosted recordings are direct video files we can play inline; a teacher's
// external link (YouTube/Drive) opens in a new tab instead.
const isPlayable = (url: string) => /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url) || /r2\.dev|r2\.cloudflarestorage/i.test(url);

export default function StudentRecordingsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['recordings', 'mine'],
    queryFn: () => api.recordings.mine(),
  });
  const recordings = data?.recordings ?? [];

  return (
    <div>
      <PageHeader title="Recordings" description="Catch up on classes you missed, or watch one again." />

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : recordings.length === 0 ? (
        <EmptyState
          icon={<Film className="h-6 w-6" />}
          title="No recordings yet"
          description="When a class is recorded, it shows up here to watch any time."
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {recordings.map((r) => <RecordingCard key={r.id} rec={r} />)}
        </div>
      )}
    </div>
  );
}

function RecordingCard({ rec }: { rec: Recording }) {
  const when = rec.ended_at || rec.scheduled_start;
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card">
      {isPlayable(rec.recording_url) ? (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video controls preload="none" className="aspect-video w-full bg-black" src={rec.recording_url} />
      ) : (
        <a
          href={rec.recording_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex aspect-video w-full items-center justify-center gap-2 bg-secondary/50 text-sm font-medium text-primary hover:bg-secondary"
        >
          <PlayCircle className="h-5 w-5" /> Watch recording <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
      <div className="p-4">
        <h3 className="truncate font-semibold">{rec.title}</h3>
        <p className="mt-0.5 truncate text-sm text-muted-foreground">
          {rec.batch_name}{when && <> · {format(new Date(when), 'EEE, MMM d')}</>}
        </p>
      </div>
    </section>
  );
}
