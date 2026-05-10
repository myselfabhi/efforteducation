'use client';

/**
 * RealtimekitRoom
 *
 * Cloudflare RealtimeKit (https://developers.cloudflare.com/realtime/realtimekit/)
 * full-takeover meeting UI. Replaces the hand-rolled CloudflareRoom that drove
 * the SFU REST API directly.
 *
 * The backend mints a per-participant authToken via /api/classes/:id/join;
 * we hand it to <RtkMeeting>, which renders the entire branded meeting UI
 * — chat, screen share, hand-raise, participants panel, host moderation —
 * with no WebRTC code on our side.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { useRealtimeKitClient, RealtimeKitProvider } from '@cloudflare/realtimekit-react';
import { api, type LiveClass } from '@/lib/api';

// The UI Kit registers Stencil web components and touches `navigator`/`window`
// during import — load it client-only.
const RtkMeeting = dynamic(
  () => import('@cloudflare/realtimekit-react-ui').then((m) => m.RtkMeeting),
  { ssr: false, loading: () => null },
);

interface Props {
  liveClass: LiveClass;
  authToken: string;
}

export function RealtimekitRoom({ liveClass, authToken }: Props) {
  const router = useRouter();
  const [meeting, initMeeting] = useRealtimeKitClient();

  // Initialise once per mount with the server-issued token.
  useEffect(() => {
    initMeeting({
      authToken,
      defaults: { audio: true, video: true },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken]);

  // When the meeting ends (host clicked End-for-all, or the user clicked Leave),
  // log the leave on our side and bounce back to the dashboard.
  useEffect(() => {
    if (!meeting) return;
    const onLeft = () => {
      api.classes.leave(liveClass.id).catch(() => {});
      router.push('/dashboard');
    };
    meeting.self.on('roomLeft', onLeft);
    return () => {
      meeting.self.off('roomLeft', onLeft);
    };
  }, [meeting, liveClass.id, router]);

  return (
    <RealtimeKitProvider value={meeting}>
      <div className="h-[100dvh] w-full bg-black">
        {meeting ? (
          <RtkMeeting meeting={meeting} mode="fill" />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center text-white gap-3">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-sm">Loading meeting…</span>
          </div>
        )}
      </div>
    </RealtimeKitProvider>
  );
}
