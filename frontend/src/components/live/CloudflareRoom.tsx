'use client';

/**
 * CloudflareRoom
 * Full-featured WebRTC video room powered by Cloudflare Calls (RealtimeKit).
 *
 * Architecture:
 *  - One RTCPeerConnection for publishing local tracks (pushPc)
 *  - One RTCPeerConnection for subscribing to remote tracks (pullPc)
 *  - Backend proxies all Cloudflare Calls REST API calls so the App Secret
 *    never touches the browser.
 *  - Socket.IO (existing classRoom) handles chat, hand-raise, and participant
 *    presence — same as before.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Hand,
  MessageSquare,
  Users,
  LogOut,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
  Loader2,
  Link2,
  Check,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog';
import Logo from '@/app/components/common/Logo';
import {
  api,
  type CFParticipant,
  type CFLocalTrack,
  type CFRemoteTrack,
  type JitsiCredentials,
  type LiveClass,
} from '@/lib/api';
import {
  classRoom,
  getSocket,
  type ClassChatMessage,
  type ClassParticipant,
  type ClassHandRaiseUpdate,
} from '@/lib/socket';
import { useAuthStore } from '@/lib/stores/authStore';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ScrollArea } from '@/app/components/ui/scroll-area';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface RemoteStream {
  userId: number;
  name: string;
  stream: MediaStream;
  isScreen?: boolean;
}

interface MidInfo {
  name: string;
  isScreen: boolean;
}

interface Props {
  liveClass: LiveClass;
  credentials: JitsiCredentials; // kept for isModerator + user info
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.cloudflare.com:3478' },
];

function makePc() {
  return new RTCPeerConnection({
    iceServers: ICE_SERVERS,
    bundlePolicy: 'max-bundle',
  });
}

/** Wait until ICE gathering is complete for a PeerConnection. */
function waitForIce(pc: RTCPeerConnection): Promise<void> {
  return new Promise((resolve) => {
    if (pc.iceGatheringState === 'complete') { resolve(); return; }
    const onStateChange = () => {
      if (pc.iceGatheringState === 'complete') {
        pc.removeEventListener('icegatheringstatechange', onStateChange);
        resolve();
      }
    };
    pc.addEventListener('icegatheringstatechange', onStateChange);
    // Timeout safety
    setTimeout(resolve, 4000);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function CloudflareRoom({ liveClass, credentials }: Props) {
  const router  = useRouter();
  const user    = useAuthStore((s) => s.user);
  const isMod   = credentials.isModerator;

  // Media state
  const [localStream, setLocalStream]       = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams]    = useState<RemoteStream[]>([]);
  const [micEnabled, setMicEnabled]         = useState(true);
  const [camEnabled, setCamEnabled]         = useState(true);
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'error'>('connecting');

  // Sidebar state
  const [tab, setTab]           = useState<'chat' | 'people'>('chat');
  const [chat, setChat]         = useState<ClassChatMessage[]>([]);
  const [participants, setParticipants] = useState<Record<number, ClassParticipant>>({});
  const [hands, setHands]       = useState<Record<number, boolean>>({});
  const [chatInput, setChatInput] = useState('');
  const [myHand, setMyHand]     = useState(false);

  // Screen share state
  const [isSharing, setIsSharing]   = useState(false);
  const screenStreamRef             = useRef<MediaStream | null>(null);

  // End-for-all confirmation
  const [confirmEnd, setConfirmEnd] = useState(false);

  // Copy class link UX
  const [copied, setCopied] = useState(false);

  // Elapsed time (mm:ss / h:mm:ss)
  const [elapsedSec, setElapsedSec] = useState(0);

  // Refs for peer connections & session
  const pushPcRef         = useRef<RTCPeerConnection | null>(null);
  const pullPcRef         = useRef<RTCPeerConnection | null>(null);
  const sessionIdRef      = useRef<string>('');
  const localRef          = useRef<HTMLVideoElement>(null);
  const trackMids         = useRef<{ video?: string; audio?: string }>({});
  // Maps pull-PC mid → { participant name, isScreen } so ontrack can label remote tiles
  const midToInfoRef      = useRef<Map<string, MidInfo>>(new Map());

  // ── Socket lifecycle ────────────────────────────────────────────────────

  useEffect(() => {
    const socket = getSocket();
    classRoom.join(liveClass.id);

    const onJoin    = (p: ClassParticipant) =>
      setParticipants((prev) => ({ ...prev, [p.userId]: p }));
    const onLeave   = (p: { userId: number }) =>
      setParticipants((prev) => { const next = { ...prev }; delete next[p.userId]; return next; });
    const onChat    = (m: ClassChatMessage) => setChat((prev) => [...prev, m]);
    const onHand    = (h: ClassHandRaiseUpdate) =>
      setHands((prev) => ({ ...prev, [h.userId]: h.raised }));
    const onEnded   = () => {
      api.classes.leave(liveClass.id).catch(() => {});
      router.push('/dashboard');
    };

    socket.on('class:participant-joined',   onJoin);
    socket.on('class:participant-left',     onLeave);
    socket.on('class:chat-broadcast',       onChat);
    socket.on('class:hand-raise-update',    onHand);
    socket.on('class:ended',                onEnded);

    const heartbeat = setInterval(() => classRoom.heartbeat(liveClass.id), 30_000);

    const beforeUnload = () => {
      classRoom.leave(liveClass.id);
      api.classes.leave(liveClass.id).catch(() => {});
      api.classes.cfLeave(liveClass.id).catch(() => {});
    };
    window.addEventListener('beforeunload', beforeUnload);

    return () => {
      socket.off('class:participant-joined', onJoin);
      socket.off('class:participant-left',   onLeave);
      socket.off('class:chat-broadcast',     onChat);
      socket.off('class:hand-raise-update',  onHand);
      socket.off('class:ended',              onEnded);
      window.removeEventListener('beforeunload', beforeUnload);
      clearInterval(heartbeat);
    };
  }, [liveClass.id, router]);

  // ── WebRTC setup ────────────────────────────────────────────────────────

  const pullRemoteTracks = useCallback(async (sessionId: string, others: CFParticipant[]) => {
    if (others.length === 0) return;

    // Flatten to a list that preserves participant ↔ trackName for later mid mapping
    const flat: { p: CFParticipant; trackName: string }[] = [];
    others.forEach((p) => p.tracks.forEach((trackName) => flat.push({ p, trackName })));
    const tracksToPull: CFRemoteTrack[] = flat.map(({ p, trackName }) => ({
      location: 'remote' as const,
      sessionId: p.sessionId,
      trackName,
    }));
    if (tracksToPull.length === 0) return;

    const pullPc = pullPcRef.current;
    if (!pullPc) return;

    // Add recv-only transceivers for each remote track
    tracksToPull.forEach((t) => {
      const kind = t.trackName.startsWith('audio') ? 'audio' : 'video';
      pullPc.addTransceiver(kind, { direction: 'recvonly' });
    });

    const offer = await pullPc.createOffer();
    await pullPc.setLocalDescription(offer);
    await waitForIce(pullPc);

    const result = await api.classes.cfPullTracks(sessionId, tracksToPull);

    // Populate mid → { name, isScreen } BEFORE setRemoteDescription so ontrack can tag streams
    result.tracks?.forEach(({ mid, trackName }, i) => {
      if (!mid) return;
      const source = flat[i];
      midToInfoRef.current.set(mid, {
        name: source?.p.name ?? 'Participant',
        isScreen: (source?.trackName ?? trackName ?? '').startsWith('screen'),
      });
    });

    if (result.requiresImmediateRenegotiation && result.sessionDescription) {
      // CF sent an offer — we must answer
      await pullPc.setRemoteDescription(result.sessionDescription as RTCSessionDescriptionInit);
      const answer = await pullPc.createAnswer();
      await pullPc.setLocalDescription(answer);
      await waitForIce(pullPc);
      await api.classes.cfRenegotiate(sessionId, pullPc.localDescription!.sdp);
    } else if (result.sessionDescription) {
      // CF sent an answer
      await pullPc.setRemoteDescription(result.sessionDescription as RTCSessionDescriptionInit);
    }
  }, []);

  // ── Socket: new CF participant ready ─────────────────────────────────────
  // When another participant finishes pushing their tracks, the backend
  // broadcasts class:cf-tracks-ready.  We pull those tracks immediately so
  // both sides see each other without a page reload.

  useEffect(() => {
    const socket = getSocket();
    const onCfReady = async (p: CFParticipant) => {
      if (p.userId === user?.id) return;            // skip our own echo
      const mySession = sessionIdRef.current;
      if (!mySession || !pullPcRef.current) return;  // not set up yet
      await pullRemoteTracks(mySession, [p]);
    };
    socket.on('class:cf-tracks-ready', onCfReady);
    return () => { socket.off('class:cf-tracks-ready', onCfReady); };
  }, [user, pullRemoteTracks]);

  useEffect(() => {
    let cancelled = false;

    async function setupWebRTC() {
      try {
        // 1. Get local media — try AV first, fall back to audio-only, then view-only.
        //    Wrap each call in a 6 s timeout so a pending permission dialog
        //    doesn't block the entire connection flow.
        function getMediaWithTimeout(constraints: MediaStreamConstraints, ms = 6000): Promise<MediaStream> {
          return Promise.race([
            navigator.mediaDevices.getUserMedia(constraints),
            new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
          ]);
        }
        let stream: MediaStream | null = null;
        try {
          stream = await getMediaWithTimeout({ video: true, audio: true });
        } catch {
          try {
            stream = await getMediaWithTimeout({ audio: true });
          } catch {
            // No camera/mic available or permission denied — join as view-only
            console.warn('No local media available; joining as view-only.');
          }
        }
        if (cancelled) { stream?.getTracks().forEach((t) => t.stop()); return; }
        if (stream) {
          setLocalStream(stream);
          if (localRef.current) {
            localRef.current.srcObject = stream;
            // Some browsers don't honour the `autoPlay` attribute when srcObject
            // is set imperatively — force a play() and swallow the rejection.
            localRef.current.play().catch(() => {});
          }
        }

        // 2. Create push PeerConnection
        const pushPc = makePc();
        pushPcRef.current = pushPc;

        // 3. Add tracks to push PC (skipped when view-only)
        const localTracks: CFLocalTrack[] = [];
        stream?.getTracks().forEach((track) => {
          const kind      = track.kind as 'audio' | 'video';
          const trackName = `${kind}0`;
          const transceiver = pushPc.addTransceiver(track, { direction: 'sendonly' });
          localTracks.push({ location: 'local', trackName, mid: transceiver.mid ?? undefined });
        });

        // 4. Create CF session
        const sessionResp = await api.classes.cfSession(liveClass.id);
        if (cancelled) return;
        sessionIdRef.current = sessionResp.sessionId;

        // 5. Offer → CF (only if we have local tracks to push)
        if (localTracks.length > 0) {
          const offer = await pushPc.createOffer();
          await pushPc.setLocalDescription(offer);
          await waitForIce(pushPc);

          const pushResult = await api.classes.cfPushTracks(
            sessionResp.sessionId,
            pushPc.localDescription!.sdp,
            localTracks.map((t, i) => ({
              ...t,
              mid: pushPc.getTransceivers()[i]?.mid ?? t.mid,
            })),
            liveClass.id
          );
          if (cancelled) return;

          // 6. Set answer from CF
          if (pushResult.sessionDescription) {
            await pushPc.setRemoteDescription(pushResult.sessionDescription as RTCSessionDescriptionInit);
          }

          // Track mids for mute
          pushPc.getTransceivers().forEach((tc) => {
            const kind = tc.sender.track?.kind;
            if (kind === 'video') trackMids.current.video = tc.mid ?? undefined;
            if (kind === 'audio') trackMids.current.audio = tc.mid ?? undefined;
          });
        }

        setConnectionState('connected');

        // 7. Pull existing remote tracks (always, even if we have no camera)
        const pullPc = makePc();
        pullPcRef.current = pullPc;

        pullPc.ontrack = ({ track, transceiver, streams }) => {
          if (!streams[0]) return;
          const remStream = streams[0];
          const info = midToInfoRef.current.get(transceiver?.mid ?? '');
          const baseName = info?.name ?? 'Participant';
          const isScreen = info?.isScreen ?? false;
          const name = isScreen ? `${baseName}'s screen` : baseName;

          // Remove tile when the remote track ends (screen share stopped by sender)
          track.onended = () => {
            setRemoteStreams((prev) => prev.filter((r) => r.stream.id !== remStream.id));
          };

          setRemoteStreams((prev) => {
            if (prev.find((r) => r.stream.id === remStream.id)) return prev;
            return [...prev, { userId: Date.now(), name, stream: remStream, isScreen }];
          });
        };

        if (sessionResp.participants.length > 0) {
          await pullRemoteTracks(sessionResp.sessionId, sessionResp.participants);
        }

      } catch (err) {
        if (!cancelled) {
          console.error('WebRTC setup error', err);
          setConnectionState('error');
        }
      }
    }

    if (user) setupWebRTC();

    return () => {
      cancelled = true;
      localStream?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
      pushPcRef.current?.close();
      pullPcRef.current?.close();
      api.classes.cfLeave(liveClass.id).catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveClass.id, user]);

  // ── Elapsed timer ───────────────────────────────────────────────────────

  useEffect(() => {
    if (connectionState !== 'connected') return;
    const id = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [connectionState]);

  // ── Copy class link ─────────────────────────────────────────────────────

  function copyClassLink() {
    const link = typeof window !== 'undefined' ? window.location.href : '';
    if (!link) return;
    navigator.clipboard?.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
  }

  // ── Media controls ──────────────────────────────────────────────────────

  function toggleMic() {
    localStream?.getAudioTracks().forEach((t) => { t.enabled = !t.enabled; });
    setMicEnabled((v) => !v);
  }

  function toggleCam() {
    localStream?.getVideoTracks().forEach((t) => { t.enabled = !t.enabled; });
    setCamEnabled((v) => !v);
  }

  async function startScreenShare() {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      console.warn('Screen sharing not supported in this browser');
      return;
    }
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      const screenTrack  = screenStream.getVideoTracks()[0];
      if (!screenTrack) return;

      // Auto-stop when user clicks browser's native "Stop sharing" button
      screenTrack.onended = () => stopScreenShare();

      const pushPc = pushPcRef.current;
      if (!pushPc || !sessionIdRef.current) {
        screenStream.getTracks().forEach((t) => t.stop());
        return;
      }

      // Add a new sendonly transceiver for the screen track
      const transceiver = pushPc.addTransceiver(screenTrack, { direction: 'sendonly' });

      // Renegotiate with CF to push the new track
      const offer = await pushPc.createOffer();
      await pushPc.setLocalDescription(offer);
      await waitForIce(pushPc);

      const result = await api.classes.cfPushTracks(
        sessionIdRef.current,
        pushPc.localDescription!.sdp,
        [{ location: 'local', trackName: 'screen0', mid: transceiver.mid ?? undefined }],
        liveClass.id,
      );

      if (result.sessionDescription) {
        await pushPc.setRemoteDescription(result.sessionDescription as RTCSessionDescriptionInit);
      }

      screenStreamRef.current = screenStream;
      setIsSharing(true);
    } catch (err) {
      console.error('Screen share failed', err);
    }
  }

  function stopScreenShare() {
    screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    screenStreamRef.current = null;
    setIsSharing(false);
  }

  // ── Chat / hand ────────────────────────────────────────────────────────

  function sendChat() {
    const text = chatInput.trim();
    if (!text) return;
    classRoom.sendChat(liveClass.id, text);
    setChatInput('');
  }

  function toggleHand() {
    const next = !myHand;
    setMyHand(next);
    classRoom.raiseHand(liveClass.id, next);
  }

  function leaveAll() {
    localStream?.getTracks().forEach((t) => t.stop());
    screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    screenStreamRef.current = null;
    pushPcRef.current?.close();
    pullPcRef.current?.close();
    classRoom.leave(liveClass.id);
    api.classes.leave(liveClass.id).catch(() => {});
    api.classes.cfLeave(liveClass.id).catch(() => {});
    router.push('/dashboard');
  }

  function endForAll() {
    setConfirmEnd(false);
    classRoom.end(liveClass.id);
  }

  const peopleList = Object.values(participants);
  const isAlone    = remoteStreams.length === 0;

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-[100dvh] bg-background text-foreground overflow-hidden">

      {/* ── Branded room header (logo · class title · timer · close) ────── */}
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
          {connectionState === 'connected' && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-destructive">
              <span className="inline-block h-2 w-2 rounded-full bg-destructive animate-pulse" />
              LIVE · {fmtElapsed(elapsedSec)}
            </span>
          )}
          <button
            onClick={leaveAll}
            className="text-xs text-muted-foreground hover:text-foreground transition"
            aria-label="Leave class"
          >
            <span className="hidden sm:inline">Exit</span>
            <LogOut className="h-4 w-4 sm:hidden" />
          </button>
        </div>
      </header>

      {/* ── Body: video area + sidebar ──────────────────────────────────── */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">

        {/* ── Video area ────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-h-0 relative">

          {/* Remote videos grid (or promoted self-view when alone) */}
          <div
            className={`flex-1 grid gap-1 p-1 bg-muted/30 overflow-hidden ${
              isAlone
                ? 'grid-cols-1'
                : remoteStreams.length === 1
                  ? 'grid-cols-1'
                  : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
            }`}
          >
            {connectionState === 'connecting' && (
              <div className="col-span-full flex flex-col items-center justify-center text-muted-foreground gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-sm">Connecting to meeting…</span>
              </div>
            )}
            {connectionState === 'error' && (
              <div className="col-span-full flex flex-col items-center justify-center text-destructive gap-3">
                <Monitor className="h-8 w-8" />
                <span className="text-sm">Connection failed. Please refresh the page.</span>
              </div>
            )}

            {/* When alone → promote local video to main tile */}
            {connectionState === 'connected' && isAlone && (
              <div className="relative rounded-xl overflow-hidden bg-card border border-border flex items-center justify-center">
                {localStream ? (
                  <video
                    ref={localRef}
                    autoPlay
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-sm text-muted-foreground">View-only — no camera/microphone</div>
                )}
                {!camEnabled && localStream && (
                  <div className="absolute inset-0 flex items-center justify-center bg-card/90">
                    <VideoOff className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                <span className="absolute bottom-2 left-2 text-xs bg-black/60 text-white px-2 py-0.5 rounded">
                  You
                </span>
                {/* Empty-state share CTA */}
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 flex flex-col items-center gap-2 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-xs sm:text-sm text-white/90 text-center">
                    Waiting for others to join — share the class link
                  </p>
                  <button
                    onClick={copyClassLink}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 text-foreground text-xs font-medium hover:bg-white transition"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Link2 className="h-3.5 w-3.5" />}
                    {copied ? 'Link copied' : 'Copy class link'}
                  </button>
                </div>
              </div>
            )}

            {/* Remote tiles when others are present */}
            {remoteStreams.map((rs) => (
              <RemoteVideo key={rs.stream.id} stream={rs.stream} name={rs.name} isScreen={rs.isScreen} />
            ))}
          </div>

          {/* Floating self-view PiP (only when others are present — when alone it's promoted into the grid above) */}
          {!isAlone && (
            <div className="absolute bottom-3 right-3 z-10 h-24 w-32 sm:h-32 sm:w-44 rounded-lg overflow-hidden bg-card border border-border shadow-lg">
              <video
                ref={localRef}
                autoPlay
                muted
                playsInline
                className="h-full w-full object-cover"
              />
              {!camEnabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-card/90">
                  <VideoOff className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">
                You
              </span>
            </div>
          )}

          {/* Controls bar */}
          <div className="shrink-0 border-t border-border bg-card px-2 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
              <ControlButton
                onClick={toggleMic}
                active={micEnabled}
                icon={micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                label={micEnabled ? 'Mute' : 'Unmute'}
              />
              <ControlButton
                onClick={toggleCam}
                active={camEnabled}
                icon={camEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                label={camEnabled ? 'Stop video' : 'Start video'}
              />
              <ControlButton
                onClick={toggleHand}
                active={!myHand}
                icon={<Hand className="h-5 w-5" />}
                label={myHand ? 'Lower hand' : 'Raise hand'}
              />
              {connectionState === 'connected' && (
                <ControlButton
                  onClick={isSharing ? stopScreenShare : startScreenShare}
                  active={!isSharing}
                  icon={isSharing ? <MonitorOff className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
                  label={isSharing ? 'Stop share' : 'Share screen'}
                />
              )}
              {isMod ? (
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

        {/* ── Sidebar ───────────────────────────────────────────────── */}
        <aside className="w-full lg:w-80 flex flex-col border-t lg:border-t-0 lg:border-l border-border bg-card max-h-[40vh] lg:max-h-none">
          <div className="flex border-b border-border">
            <SideTab active={tab === 'chat'} onClick={() => setTab('chat')} icon={<MessageSquare className="h-4 w-4" />} label="Chat" />
            <SideTab active={tab === 'people'} onClick={() => setTab('people')} icon={<Users className="h-4 w-4" />} label={`People (${peopleList.length})`} />
          </div>

          <div className="flex-1 min-h-0 overflow-hidden">
            {tab === 'chat' ? (
              <div className="flex flex-col h-full">
                <ScrollArea className="flex-1 p-3">
                  {chat.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-8">No messages yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {chat.map((m, i) => (
                        <li key={i} className="text-sm">
                          <div className="flex items-baseline gap-2">
                            <span className="font-medium text-foreground">{m.fullName || m.username}</span>
                            <span className="text-[10px] text-muted-foreground">{new Date(m.ts).toLocaleTimeString()}</span>
                          </div>
                          <div className="text-foreground/90 break-words">{m.text}</div>
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
                  <Button size="sm" onClick={sendChat} className="h-11 px-4">Send</Button>
                </div>
              </div>
            ) : (
              <ScrollArea className="h-full p-3">
                <ul className="space-y-1.5">
                  {peopleList.map((p) => (
                    <li key={p.userId} className="flex items-center justify-between text-sm py-1">
                      <span className="truncate">
                        {p.fullName || p.username}
                        {p.userId === user?.id && <span className="text-muted-foreground ml-1">(you)</span>}
                      </span>
                      {hands[p.userId] && <Hand className="h-4 w-4 text-amber-500" />}
                    </li>
                  ))}
                  {peopleList.length === 0 && (
                    <li className="text-xs text-muted-foreground text-center py-8">No one here yet.</li>
                  )}
                </ul>
              </ScrollArea>
            )}
          </div>
        </aside>
      </div>

      {/* ── End-for-all confirmation ────────────────────────────────────── */}
      <AlertDialog open={confirmEnd} onOpenChange={setConfirmEnd}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End the class for everyone?</AlertDialogTitle>
            <AlertDialogDescription>
              This will close the meeting for all participants and cannot be undone.
              You can also choose to leave the class without ending it.
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

function fmtElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function RemoteVideo({ stream, name, isScreen }: { stream: MediaStream; name: string; isScreen?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.srcObject = stream;
    ref.current.play().catch(() => {});
  }, [stream]);

  return (
    <div className={`relative rounded-lg overflow-hidden bg-card border border-border ${isScreen ? 'col-span-full row-span-2' : ''}`}>
      <video
        ref={ref}
        autoPlay
        playsInline
        className={`w-full h-full ${isScreen ? 'object-contain max-h-[70vh] bg-black' : 'object-cover'}`}
      />
      <span className={`absolute bottom-2 left-2 text-xs bg-black/60 text-white px-2 py-0.5 rounded flex items-center gap-1 ${isScreen ? 'text-blue-200' : ''}`}>
        {isScreen && <Monitor className="h-3 w-3" />}
        {name}
      </span>
    </div>
  );
}

function ControlButton({
  onClick, active, icon, label,
}: { onClick: () => void; active: boolean; icon: React.ReactNode; label: string }) {
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

function SideTab({
  active, onClick, icon, label,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
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
