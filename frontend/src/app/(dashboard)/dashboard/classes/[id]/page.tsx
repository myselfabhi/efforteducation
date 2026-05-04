'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft, Video } from 'lucide-react';
import Link from 'next/link';
import { api, ApiError, type JitsiCredentials, type LiveClass } from '@/lib/api';
import { LiveRoom } from '@/components/live/LiveRoom';
import { useAuthStore } from '@/lib/stores/authStore';
import { Button } from '@/app/components/ui/button';

interface JoinResp {
  class: { id: number; title: string; status: LiveClass['status'] };
  credentials: JitsiCredentials;
}

export default function ClassRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const classId = parseInt(id, 10);
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [state, setState] = useState<
    | { kind: 'loading' }
    | { kind: 'waiting'; willStartAt?: string; message: string }
    | { kind: 'error'; message: string }
    | { kind: 'ready'; resp: JoinResp; cls: LiveClass }
  >({ kind: 'loading' });

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function attempt() {
      try {
        const resp = (await api.classes.join(classId)) as JoinResp;
        // We need batch_name for the side rail header — fetch class via batch upcoming endpoint.
        const upcoming = (await api.classes.upcoming()) as LiveClass[];
        const cls =
          upcoming.find((c) => c.id === classId) ||
          ({
            id: classId,
            title: resp.class.title,
            batch_id: 0,
            teacher_id: 0,
            scheduled_start: '',
            scheduled_end: '',
            room_id: resp.credentials.room,
            room_password: null,
            status: resp.class.status,
            description: null,
            started_at: null,
            ended_at: null,
            recording_url: null,
            created_at: '',
          } as LiveClass);
        if (!cancelled) setState({ kind: 'ready', resp, cls });
      } catch (err: unknown) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 425) {
          const willStartAt = (err.details as { willStartAt?: string } | null)?.willStartAt;
          setState({ kind: 'waiting', willStartAt, message: err.message });
          // Re-poll every 8 seconds while waiting
          setTimeout(attempt, 8000);
        } else if (err instanceof ApiError && err.status === 410) {
          setState({ kind: 'error', message: 'This class is over.' });
        } else {
          const message = err instanceof Error ? err.message : 'Failed to join class';
          setState({ kind: 'error', message });
        }
      }
    }

    attempt();

    return () => {
      cancelled = true;
    };
  }, [classId, user]);

  if (state.kind === 'loading') {
    return <div className="flex items-center justify-center p-12 text-muted-foreground">Joining class…</div>;
  }
  if (state.kind === 'waiting') {
    return (
      <div className="max-w-md mx-auto p-8 text-center space-y-4">
        <Video className="h-10 w-10 mx-auto text-primary" />
        <h1 className="text-xl font-semibold">{state.message}</h1>
        {state.willStartAt && (
          <p className="text-sm text-muted-foreground">
            Scheduled for {format(new Date(state.willStartAt), 'PPpp')}
          </p>
        )}
        <p className="text-xs text-muted-foreground">We&rsquo;ll auto-refresh — you don&rsquo;t need to do anything.</p>
        <Button asChild variant="outline">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to dashboard
          </Link>
        </Button>
      </div>
    );
  }
  if (state.kind === 'error') {
    return (
      <div className="max-w-md mx-auto p-8 text-center space-y-4">
        <h1 className="text-xl font-semibold text-destructive">{state.message}</h1>
        <Button onClick={() => router.push('/dashboard')} variant="outline">
          Back
        </Button>
      </div>
    );
  }

  return <LiveRoom liveClass={state.cls} credentials={state.resp.credentials} />;
}
