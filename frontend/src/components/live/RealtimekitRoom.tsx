'use client';

/**
 * RealtimekitRoom — Effort Education-themed custom UI on top of the
 * @cloudflare/realtimekit hooks.
 *
 * The pre-built <RtkMeeting> component renders nothing when the preset
 * has no permissions config; a custom UI is independent of preset config
 * and drives directly from the meeting's state, so we never need to
 * configure presets in the Cloudflare dashboard for the room to work.
 *
 * Layout matches the QA-passed shell: branded slim header (Logo · title ·
 * LIVE timer · Exit), responsive video grid with promoted self-view when
 * alone + floating PiP otherwise, controls bar with h-11 tap targets,
 * Chat + People sidebar (≥16px chat input on mobile), End-for-all guarded
 * by an AlertDialog, "Copy class link" CTA on the alone state.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Hand, Mic, MicOff, Video, VideoOff,
  Monitor, MonitorOff, PhoneOff, LogOut,
  MessageSquare, Users, Loader2, Send,
  Link2, Check,
} from 'lucide-react';
import {
  useRealtimeKitClient,
  useRealtimeKitMeeting,
  useRealtimeKitSelector,
  RealtimeKitProvider,
} from '@cloudflare/realtimekit-react';
import type RTKClient from '@cloudflare/realtimekit';
import { api, type LiveClass } from '@/lib/api';
import Logo from '@/app/components/common/Logo';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/app/components/ui/alert-dialog';

// ─────────────────────────────────────────────────────────────────────────────
// Top-level mount: initialise the RealtimeKit client, then hand the meeting
// instance into the themed shell.
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  liveClass: LiveClass;
  authToken: string;
}

export function RealtimekitRoom({ liveClass, authToken }: Props) {
  const [meeting, initMeeting] = useRealtimeKitClient();

  useEffect(() => {
    initMeeting({ authToken, defaults: { audio: true, video: true } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken]);

  if (!meeting) {
    return (
      <div className="h-[100dvh] w-full flex flex-col items-center justify-center gap-3 bg-background text-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Loading meeting…</span>
      </div>
    );
  }

  return (
    <RealtimeKitProvider value={meeting}>
      <RoomShell liveClass={liveClass} />
    </RealtimeKitProvider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shell: gates between the pre-join setup screen and the in-room UI.
// ─────────────────────────────────────────────────────────────────────────────

function RoomShell({ liveClass }: { liveClass: LiveClass }) {
  const router = useRouter();
  const { meeting } = useRealtimeKitMeeting();

  // `roomState` flips through 'init' → 'joined' → 'left' as the user moves
  // through the lifecycle. We listen on it to redirect back to the dashboard
  // when the host ends the call or the user clicks Leave.
  const roomJoined = useRealtimeKitSelector((m) => m.self.roomJoined);
  const roomLeft   = useRealtimeKitSelector((m) => m.self.roomState === 'left' || m.self.roomState === 'kicked' || m.self.roomState === 'ended');

  useEffect(() => {
    if (!roomLeft) return;
    api.classes.leave(liveClass.id).catch(() => {});
    router.push('/dashboard');
  }, [roomLeft, liveClass.id, router]);

  if (!roomJoined) return <PreJoinScreen meeting={meeting} liveClass={liveClass} />;
  return <InRoom meeting={meeting} liveClass={liveClass} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Pre-join: device preview + Join button.
// ─────────────────────────────────────────────────────────────────────────────

function PreJoinScreen({ meeting, liveClass }: { meeting: RTKClient; liveClass: LiveClass }) {
  const previewRef = useRef<HTMLVideoElement>(null);
  const [joining, setJoining] = useState(false);

  // Local-track preview — RealtimeKit pre-acquires audio+video when defaults
  // are set, so the videoTrack is usually attached before this screen mounts.
  const videoTrack = useRealtimeKitSelector((m) => m.self.videoTrack);
  const audioOn    = useRealtimeKitSelector((m) => m.self.audioEnabled);
  const videoOn    = useRealtimeKitSelector((m) => m.self.videoEnabled);

  useEffect(() => {
    const node = previewRef.current;
    if (!node) return;
    if (videoTrack) {
      const stream = new MediaStream([videoTrack]);
      node.srcObject = stream;
      node.play().catch(() => {});
    } else {
      node.srcObject = null;
    }
  }, [videoTrack]);

  async function join() {
    setJoining(true);
    try {
      await meeting.joinRoom();
    } catch (e) {
      console.error('joinRoom failed', e);
      setJoining(false);
    }
  }

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-background text-foreground overflow-hidden">
      <header className="h-12 sm:h-14 shrink-0 flex items-center justify-between px-3 sm:px-4 border-b border-border bg-card/90 backdrop-blur">
        <Link href="/dashboard" className="shrink-0" aria-label="Effort Education home">
          <Logo className="h-7 sm:h-8" />
        </Link>
        <button
          onClick={() => meeting.leaveRoom().catch(() => {})}
          className="inline-flex items-center justify-center gap-1.5 h-11 min-w-[44px] px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Cancel</span>
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-1 text-center">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{liveClass.title}</h1>
            {liveClass.batch_name && (
              <p className="text-sm text-muted-foreground">{liveClass.batch_name}</p>
            )}
          </div>

          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-card border border-border shadow-sm">
            <video
              ref={previewRef}
              autoPlay
              muted
              playsInline
              className="h-full w-full object-cover"
            />
            {!videoOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-card/95">
                <VideoOff className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              <PreJoinToggle
                onClick={() => audioOn ? meeting.self.disableAudio() : meeting.self.enableAudio()}
                active={audioOn}
                icon={audioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                label={audioOn ? 'Mute' : 'Unmute'}
              />
              <PreJoinToggle
                onClick={() => videoOn ? meeting.self.disableVideo() : meeting.self.enableVideo()}
                active={videoOn}
                icon={videoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                label={videoOn ? 'Stop video' : 'Start video'}
              />
            </div>
          </div>

          <Button onClick={join} disabled={joining} className="w-full h-11">
            {joining ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {joining ? 'Joining…' : 'Join class'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function PreJoinToggle({ onClick, active, icon, label }: {
  onClick: () => void; active: boolean; icon: React.ReactNode; label: string;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`h-11 w-11 rounded-full inline-flex items-center justify-center transition shadow-sm ${
        active ? 'bg-white/95 text-foreground hover:bg-white' : 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
      }`}
    >
      {icon}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// In-room view (post-join): header · grid · controls · sidebar.
// ─────────────────────────────────────────────────────────────────────────────

type SideTab = 'chat' | 'people';

function InRoom({ meeting, liveClass }: { meeting: RTKClient; liveClass: LiveClass }) {
  const [tab, setTab]               = useState<SideTab>('chat');
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [copied, setCopied]         = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [chatInput, setChatInput]   = useState('');
  const [hands, setHands]           = useState<Set<string>>(new Set());
  const [chatTick, setChatTick]     = useState(0);

  const isHost = meeting.self.permissions?.kickParticipant === true
    || (meeting.self as { presetName?: string }).presetName?.toLowerCase().includes('host');

  // Keep elapsed timer running.
  useEffect(() => {
    const id = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Listen to chat updates — Chat is an EventEmitter that fires on every
  // change. We bump a tick so the chat list re-renders with the new array.
  useEffect(() => {
    const c = meeting.chat as unknown as { on: (e: string, fn: () => void) => void; off: (e: string, fn: () => void) => void };
    const onUpdate = () => setChatTick((t) => t + 1);
    c.on('chatUpdate', onUpdate);
    return () => c.off('chatUpdate', onUpdate);
  }, [meeting]);

  // Listen for hand-raise broadcasts from any participant.
  useEffect(() => {
    type Payload = { type: string; payload: { raised?: boolean; userId?: string }; from?: string };
    const handler = (msg: Payload) => {
      if (msg.type !== 'hand_raise') return;
      const id = msg.payload?.userId || msg.from;
      if (!id) return;
      setHands((prev) => {
        const next = new Set(prev);
        if (msg.payload?.raised) next.add(id);
        else next.delete(id);
        return next;
      });
    };
    const p = meeting.participants as unknown as { on: (e: string, fn: (m: Payload) => void) => void; off: (e: string, fn: (m: Payload) => void) => void };
    p.on('broadcastedMessage', handler);
    return () => p.off('broadcastedMessage', handler);
  }, [meeting]);

  // Reactive selectors for self media state (re-render on toggle).
  const audioOn   = useRealtimeKitSelector((m) => m.self.audioEnabled);
  const videoOn   = useRealtimeKitSelector((m) => m.self.videoEnabled);
  const sharing   = useRealtimeKitSelector((m) => m.self.screenShareEnabled);
  const myHand    = hands.has(meeting.self.id);

  // Reactive participants list — selector re-runs whenever participants change.
  const remoteIds = useRealtimeKitSelector((m) => Array.from(m.participants.joined.keys()));

  // Track who is screen-sharing. Selector returns a stable string so we only
  // re-render when the sharing set actually changes.
  const sharingKey = useRealtimeKitSelector((m) => {
    const ids: string[] = [];
    if ((m.self as { screenShareEnabled?: boolean }).screenShareEnabled) ids.push(m.self.id);
    m.participants.joined.forEach((p, id) => {
      if ((p as { screenShareEnabled?: boolean }).screenShareEnabled) ids.push(id);
    });
    return ids.join(',');
  });
  const sharingIds = sharingKey ? sharingKey.split(',') : [];

  // ── handlers ───────────────────────────────────────────────────────────
  const toggleMic    = () => audioOn ? meeting.self.disableAudio() : meeting.self.enableAudio();
  const toggleCam    = () => videoOn ? meeting.self.disableVideo() : meeting.self.enableVideo();
  const toggleShare  = () => sharing ? meeting.self.disableScreenShare() : meeting.self.enableScreenShare();
  const leaveAll     = () => meeting.leaveRoom().catch(() => {});
  const endForAll    = () => {
    setConfirmEnd(false);
    (meeting.participants as unknown as { kickAll: () => Promise<void> }).kickAll().catch(() => {});
    meeting.leaveRoom().catch(() => {});
  };
  const toggleHand = useCallback(() => {
    const next = !myHand;
    // Optimistic local update.
    setHands((prev) => {
      const s = new Set(prev);
      if (next) s.add(meeting.self.id); else s.delete(meeting.self.id);
      return s;
    });
    meeting.participants.broadcastMessage('hand_raise', {
      raised: next,
      userId: meeting.self.id,
    } as unknown as Parameters<typeof meeting.participants.broadcastMessage>[1])
      .catch(() => {});
  }, [myHand, meeting]);

  function copyLink() {
    if (typeof window === 'undefined') return;
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
  }

  function sendChat() {
    const text = chatInput.trim();
    if (!text) return;
    meeting.chat.sendTextMessage(text).catch(() => {});
    setChatInput('');
  }

  // chatTick is read implicitly by the messages snapshot
  void chatTick;
  const chatMessages = ((meeting.chat.messages || []) as unknown as Array<{
    message?: string; userId?: string; displayName?: string; time?: Date | number;
  }>).filter((m) => typeof m.message === 'string');
  const isAlone = remoteIds.length === 0;
  const remoteParticipants = remoteIds.map((id) => meeting.participants.joined.get(id)).filter(Boolean) as RemoteLike[];
  const peopleList = [meeting.self as unknown as RemoteLike, ...remoteParticipants];

  // First screen-sharer to display prominently. Prefer a remote share so the
  // sharer doesn't see their own desktop infinitely mirrored.
  const remoteSharerId = sharingIds.find((id) => id !== meeting.self.id);
  const sharerParticipant: RemoteLike | undefined = remoteSharerId
    ? (meeting.participants.joined.get(remoteSharerId) as unknown as RemoteLike | undefined)
    : undefined;
  const isSharing = sharingIds.length > 0;

  return (
    <div className="flex flex-col h-[100dvh] bg-background text-foreground overflow-hidden">

      {/* Header */}
      <header className="h-12 sm:h-14 shrink-0 flex items-center justify-between px-3 sm:px-4 border-b border-border bg-card/90 backdrop-blur">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link href="/dashboard" className="shrink-0" aria-label="Effort Education home">
            <Logo className="h-7 sm:h-8" />
          </Link>
          <div className="hidden sm:flex items-center gap-2 min-w-0">
            <span className="h-4 w-px bg-border" />
            <h1 className="text-sm font-semibold truncate">{liveClass.title}</h1>
            {liveClass.batch_name && (
              <span className="text-xs text-muted-foreground truncate hidden md:inline">· {liveClass.batch_name}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="flex items-center gap-1.5 text-xs font-medium text-destructive">
            <span className="inline-block h-2 w-2 rounded-full bg-destructive animate-pulse" />
            LIVE · {fmtElapsed(elapsedSec)}
          </span>
          <button
            onClick={leaveAll}
            className="inline-flex items-center justify-center gap-1.5 h-11 min-w-[44px] px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition"
            aria-label="Leave class"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">

        {/* Video area */}
        <div className="flex-1 flex flex-col min-h-0 relative">
          {isSharing && sharerParticipant ? (
            // Screen-share layout: prominent share on top, video strip below.
            <div className="flex-1 flex flex-col min-h-0 gap-1 p-1 bg-muted/30 overflow-hidden">
              <div className="flex-1 min-h-0">
                <ScreenShareTile participant={sharerParticipant} />
              </div>
              {remoteParticipants.length > 0 && (
                <div className="shrink-0 h-24 sm:h-28 flex gap-1 overflow-x-auto">
                  {remoteParticipants.map((p) => (
                    <div key={p.id} className="h-full w-32 sm:w-40 shrink-0">
                      <RemoteTile participant={p} handRaised={hands.has(p.id)} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : isSharing && !sharerParticipant ? (
            // Self is sharing (no remote sharer). Show a hint + video grid.
            <div className="flex-1 flex flex-col min-h-0 gap-1 p-1 bg-muted/30 overflow-hidden">
              <div className="shrink-0 mx-auto bg-primary/10 text-primary text-xs sm:text-sm px-3 py-1.5 rounded-full inline-flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                You are sharing your screen
              </div>
              <div className={`flex-1 grid gap-1 overflow-hidden ${
                remoteParticipants.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
              }`}>
                {remoteParticipants.map((p) => (
                  <RemoteTile key={p.id} participant={p} handRaised={hands.has(p.id)} />
                ))}
              </div>
            </div>
          ) : (
            <div className={`flex-1 grid gap-1 p-1 bg-muted/30 overflow-hidden ${
              isAlone ? 'grid-cols-1' : remoteParticipants.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
            }`}>
              {isAlone ? (
                <SelfTile
                  meeting={meeting}
                  videoOn={videoOn}
                  copyLink={copyLink}
                  copied={copied}
                  promoted
                />
              ) : (
                remoteParticipants.map((p) => (
                  <RemoteTile key={p.id} participant={p} handRaised={hands.has(p.id)} />
                ))
              )}
            </div>
          )}

          {/* Floating self PiP when others are present */}
          {!isAlone && (
            <div className="absolute bottom-3 right-3 z-10 h-24 w-32 sm:h-32 sm:w-44 rounded-lg overflow-hidden bg-card border border-border shadow-lg">
              <SelfTile meeting={meeting} videoOn={videoOn} copyLink={copyLink} copied={copied} promoted={false} />
            </div>
          )}

          {/* Controls */}
          <div className="shrink-0 border-t border-border bg-card px-2 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
              <ControlButton
                onClick={toggleMic} active={audioOn}
                icon={audioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                label={audioOn ? 'Mute' : 'Unmute'}
              />
              <ControlButton
                onClick={toggleCam} active={videoOn}
                icon={videoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                label={videoOn ? 'Stop video' : 'Start video'}
              />
              <ControlButton
                onClick={toggleHand} active={!myHand}
                icon={<Hand className="h-5 w-5" />}
                label={myHand ? 'Lower hand' : 'Raise hand'}
              />
              <ControlButton
                onClick={toggleShare} active={!sharing}
                icon={sharing ? <MonitorOff className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
                label={sharing ? 'Stop share' : 'Share screen'}
              />
              {isHost ? (
                <button
                  onClick={() => setConfirmEnd(true)}
                  className="ml-1 sm:ml-2 inline-flex items-center gap-1.5 h-11 min-w-[44px] px-3 sm:px-4 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition shadow-sm"
                >
                  <PhoneOff className="h-4 w-4" />
                  <span className="hidden sm:inline">End for all</span>
                </button>
              ) : (
                <button
                  onClick={leaveAll}
                  className="ml-1 sm:ml-2 inline-flex items-center gap-1.5 h-11 min-w-[44px] px-3 sm:px-4 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition shadow-sm"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Leave</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 flex flex-col border-t lg:border-t-0 lg:border-l border-border bg-card max-h-[40vh] lg:max-h-none">
          <div className="flex border-b border-border">
            <SideTabBtn active={tab === 'chat'} onClick={() => setTab('chat')} icon={<MessageSquare className="h-4 w-4" />} label="Chat" />
            <SideTabBtn active={tab === 'people'} onClick={() => setTab('people')} icon={<Users className="h-4 w-4" />} label={`People (${peopleList.length})`} />
          </div>

          <div className="flex-1 min-h-0 overflow-hidden">
            {tab === 'chat' ? (
              <div className="flex flex-col h-full">
                <ScrollArea className="flex-1 p-3">
                  {chatMessages.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-8">No messages yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {chatMessages.map((m, i) => (
                        <li key={i} className="text-sm">
                          <div className="flex items-baseline gap-2">
                            <span className="font-medium text-foreground">{m.displayName || 'User'}</span>
                            <span className="text-[10px] text-muted-foreground">{m.time ? new Date(m.time as Date | number).toLocaleTimeString() : ''}</span>
                          </div>
                          <div className="text-foreground/90 break-words">{m.message}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </ScrollArea>
                <div className="p-2 border-t border-border flex gap-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                    placeholder="Message…"
                    maxLength={500}
                    className="text-base sm:text-sm h-11"
                  />
                  <Button size="sm" onClick={sendChat} className="h-11 px-4">
                    <Send className="h-4 w-4 sm:hidden" />
                    <span className="hidden sm:inline">Send</span>
                  </Button>
                </div>
              </div>
            ) : (
              <ScrollArea className="h-full p-3">
                <ul className="space-y-1.5">
                  {peopleList.map((p) => (
                    <li key={p.id} className="flex items-center justify-between text-sm py-1">
                      <span className="truncate">
                        {p.name}
                        {p.id === meeting.self.id && <span className="text-muted-foreground ml-1">(you)</span>}
                      </span>
                      {hands.has(p.id) && <Hand className="h-4 w-4 text-amber-500" />}
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </div>
        </aside>
      </div>

      <AlertDialog open={confirmEnd} onOpenChange={setConfirmEnd}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End the class for everyone?</AlertDialogTitle>
            <AlertDialogDescription>
              This will close the meeting for all participants and cannot be undone.
              You can also choose to leave without ending.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep meeting</AlertDialogCancel>
            <AlertDialogAction
              onClick={endForAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              End for all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tile components — drive directly from the meeting's MediaStreamTracks.
// ─────────────────────────────────────────────────────────────────────────────

interface RemoteLike {
  id: string;
  name: string;
  videoEnabled?: boolean;
  audioEnabled?: boolean;
  screenShareEnabled?: boolean;
  videoTrack?: MediaStreamTrack;
  audioTrack?: MediaStreamTrack;
  screenShareTracks?: { video?: MediaStreamTrack; audio?: MediaStreamTrack };
}

// Participant-level event subscription. RealtimeKit fires these whenever
// a participant toggles a track, so we tick a counter to re-read fresh
// track references and enabled flags.
type ParticipantEmitter = {
  on: (event: string, fn: (...args: unknown[]) => void) => void;
  off: (event: string, fn: (...args: unknown[]) => void) => void;
};
function useParticipantTick(participant: { id: string } & Partial<ParticipantEmitter>) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const p = participant as Partial<ParticipantEmitter>;
    if (!p.on || !p.off) return;
    const refresh = () => setTick((t) => t + 1);
    const events = ['audioUpdate', 'videoUpdate', 'screenShareUpdate', 'mediaScoreUpdate'];
    events.forEach((e) => p.on!(e, refresh));
    return () => events.forEach((e) => p.off!(e, refresh));
  }, [participant]);
  return tick;
}

function SelfTile({ meeting, videoOn, copyLink, copied, promoted }: {
  meeting: RTKClient;
  videoOn: boolean;
  copyLink: () => void;
  copied: boolean;
  promoted: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const videoTrack = useRealtimeKitSelector((m) => m.self.videoTrack);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (videoTrack) {
      const stream = new MediaStream([videoTrack]);
      node.srcObject = stream;
      node.play().catch(() => {});
    } else {
      node.srcObject = null;
    }
  }, [videoTrack]);

  return (
    <div className={`relative h-full w-full overflow-hidden ${promoted ? 'rounded-xl bg-card border border-border flex items-center justify-center' : ''}`}>
      <video ref={ref} autoPlay muted playsInline className="h-full w-full object-cover" />
      {!videoOn && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/95">
          <VideoOff className={promoted ? 'h-10 w-10 text-muted-foreground' : 'h-5 w-5 text-muted-foreground'} />
        </div>
      )}
      <span className={`absolute bottom-${promoted ? '2' : '1'} left-${promoted ? '2' : '1'} text-${promoted ? 'xs' : '[10px]'} bg-black/60 text-white px-${promoted ? '2' : '1.5'} py-0.5 rounded`}>
        {meeting.self.name} (you)
      </span>
      {promoted && (
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 flex flex-col items-center gap-2 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-xs sm:text-sm text-white/90 text-center">
            Waiting for others to join — share the class link
          </p>
          <button
            onClick={copyLink}
            className="inline-flex items-center gap-2 h-11 min-w-[44px] px-4 rounded-lg bg-white/95 text-foreground text-sm font-medium hover:bg-white transition shadow"
          >
            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Link2 className="h-4 w-4" />}
            {copied ? 'Link copied' : 'Copy class link'}
          </button>
        </div>
      )}
    </div>
  );
}

function RemoteTile({ participant, handRaised }: { participant: RemoteLike; handRaised: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Re-render when this participant updates audio/video state.
  useParticipantTick(participant);

  const videoTrack = participant.videoTrack;
  const audioTrack = participant.audioTrack;

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    if (videoTrack) {
      node.srcObject = new MediaStream([videoTrack]);
      node.play().catch(() => {});
    } else {
      node.srcObject = null;
    }
  }, [videoTrack]);

  useEffect(() => {
    const node = audioRef.current;
    if (!node) return;
    if (audioTrack) {
      node.srcObject = new MediaStream([audioTrack]);
      // Remote audio must NOT be muted (unlike self preview).
      node.muted = false;
      node.play().catch(() => {});
    } else {
      node.srcObject = null;
    }
  }, [audioTrack]);

  return (
    <div className="relative rounded-lg overflow-hidden bg-card border border-border">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
      <audio ref={audioRef} autoPlay playsInline />
      {!participant.videoEnabled && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/95">
          <VideoOff className="h-10 w-10 text-muted-foreground" />
        </div>
      )}
      <span className="absolute bottom-2 left-2 text-xs bg-black/60 text-white px-2 py-0.5 rounded flex items-center gap-1">
        {participant.name}
        {handRaised && <Hand className="h-3 w-3 text-amber-300" />}
        {!participant.audioEnabled && <MicOff className="h-3 w-3" />}
      </span>
    </div>
  );
}

// ScreenShareTile — full-width prominent display of a participant's screen share.
function ScreenShareTile({ participant }: { participant: RemoteLike }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  useParticipantTick(participant);

  const screenVideo = participant.screenShareTracks?.video;
  const screenAudio = participant.screenShareTracks?.audio;

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    if (screenVideo) {
      node.srcObject = new MediaStream([screenVideo]);
      node.play().catch(() => {});
    } else {
      node.srcObject = null;
    }
  }, [screenVideo]);

  useEffect(() => {
    const node = audioRef.current;
    if (!node) return;
    if (screenAudio) {
      node.srcObject = new MediaStream([screenAudio]);
      node.muted = false;
      node.play().catch(() => {});
    } else {
      node.srcObject = null;
    }
  }, [screenAudio]);

  return (
    <div className="relative rounded-lg overflow-hidden bg-black border border-border h-full w-full">
      <video ref={videoRef} autoPlay playsInline className="h-full w-full object-contain bg-black" />
      <audio ref={audioRef} autoPlay playsInline />
      <span className="absolute top-2 left-2 text-xs bg-black/70 text-white px-2 py-0.5 rounded flex items-center gap-1.5">
        <Monitor className="h-3 w-3" />
        {participant.name} is sharing
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components.
// ─────────────────────────────────────────────────────────────────────────────

function ControlButton({ onClick, active, icon, label }: {
  onClick: () => void; active: boolean; icon: React.ReactNode; label: string;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`relative flex items-center justify-center h-11 w-11 sm:h-11 sm:w-auto sm:gap-2 sm:px-4 rounded-xl text-sm font-medium transition-colors ${
        active
          ? 'bg-muted hover:bg-muted/80 text-foreground'
          : 'bg-destructive/10 hover:bg-destructive/20 text-destructive'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function SideTabBtn({ active, onClick, icon, label }: {
  active: boolean; onClick: () => void; icon: React.ReactNode; label: string;
}) {
  return (
    <button
      className={`flex-1 px-3 h-11 text-sm flex items-center justify-center gap-2 transition border-b-2 ${
        active
          ? 'border-primary text-foreground font-medium'
          : 'border-transparent text-muted-foreground hover:text-foreground'
      }`}
      onClick={onClick}
    >
      {icon} {label}
    </button>
  );
}

function fmtElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}
