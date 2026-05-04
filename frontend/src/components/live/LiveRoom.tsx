'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Hand, MessageSquare, Users, LogOut, PhoneOff } from 'lucide-react';
import type { JitsiCredentials, LiveClass } from '@/lib/api';
import { api } from '@/lib/api';
import { classRoom, getSocket, type ClassChatMessage, type ClassParticipant, type ClassHandRaiseUpdate } from '@/lib/socket';
import { buildJitsiConfig } from '@/lib/jitsi';
import { useAuthStore } from '@/lib/stores/authStore';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ScrollArea } from '@/app/components/ui/scroll-area';

const JitsiMeeting = dynamic(
  () => import('@jitsi/react-sdk').then((m) => m.JitsiMeeting),
  { ssr: false }
);

interface Props {
  liveClass: LiveClass;
  credentials: JitsiCredentials;
}

export function LiveRoom({ liveClass, credentials }: Props) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const apiRef = useRef<unknown>(null);
  const [tab, setTab] = useState<'chat' | 'people'>('chat');
  const [chat, setChat] = useState<ClassChatMessage[]>([]);
  const [participants, setParticipants] = useState<Record<number, ClassParticipant>>({});
  const [hands, setHands] = useState<Record<number, boolean>>({});
  const [chatInput, setChatInput] = useState('');
  const [myHand, setMyHand] = useState(false);

  const config = useMemo(
    () =>
      buildJitsiConfig(credentials, {
        displayName: credentials.user.name,
        email: credentials.user.email,
      }),
    [credentials]
  );

  // Socket lifecycle: join + heartbeat + listeners
  useEffect(() => {
    const socket = getSocket();
    classRoom.join(liveClass.id);

    const onJoin = (p: ClassParticipant) => setParticipants((prev) => ({ ...prev, [p.userId]: p }));
    const onLeave = (p: { userId: number }) =>
      setParticipants((prev) => {
        const next = { ...prev };
        delete next[p.userId];
        return next;
      });
    const onChat = (m: ClassChatMessage) => setChat((prev) => [...prev, m]);
    const onHand = (h: ClassHandRaiseUpdate) =>
      setHands((prev) => ({ ...prev, [h.userId]: h.raised }));
    const onEnded = () => {
      api.classes.leave(liveClass.id).catch(() => {});
      router.push('/dashboard');
    };

    socket.on('class:participant-joined', onJoin);
    socket.on('class:participant-left', onLeave);
    socket.on('class:chat-broadcast', onChat);
    socket.on('class:hand-raise-update', onHand);
    socket.on('class:ended', onEnded);

    const heartbeat = setInterval(() => classRoom.heartbeat(liveClass.id), 30_000);

    const beforeUnload = () => {
      classRoom.leave(liveClass.id);
      api.classes.leave(liveClass.id).catch(() => {});
    };
    window.addEventListener('beforeunload', beforeUnload);

    return () => {
      socket.off('class:participant-joined', onJoin);
      socket.off('class:participant-left', onLeave);
      socket.off('class:chat-broadcast', onChat);
      socket.off('class:hand-raise-update', onHand);
      socket.off('class:ended', onEnded);
      window.removeEventListener('beforeunload', beforeUnload);
      clearInterval(heartbeat);
      classRoom.leave(liveClass.id);
      api.classes.leave(liveClass.id).catch(() => {});
    };
  }, [liveClass.id, router]);

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
    classRoom.leave(liveClass.id);
    api.classes.leave(liveClass.id).catch(() => {});
    router.push('/dashboard');
  }

  function endForAll() {
    classRoom.end(liveClass.id);
  }

  const peopleList = Object.values(participants);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100">
      <div className="flex-1 min-h-[60vh] lg:min-h-0">
        <JitsiMeeting
          {...config}
          onApiReady={(externalApi) => {
            apiRef.current = externalApi;
            if (credentials.isModerator) {
              externalApi.executeCommand('toggleLobby', true);
              if (credentials.password) {
                externalApi.executeCommand('password', credentials.password);
              }
            } else if (credentials.password) {
              externalApi.addEventListener('passwordRequired', () => {
                externalApi.executeCommand('password', credentials.password);
              });
            }
          }}
          getIFrameRef={(node) => {
            if (node) {
              node.style.height = '100%';
              node.style.width = '100%';
            }
          }}
        />
      </div>

      <aside className="w-full lg:w-80 flex flex-col border-t lg:border-t-0 lg:border-l border-zinc-800 bg-zinc-900">
        <div className="p-3 border-b border-zinc-800">
          <h2 className="text-sm font-semibold truncate">{liveClass.title}</h2>
          <p className="text-xs text-zinc-400 truncate">{liveClass.batch_name}</p>
        </div>

        <div className="flex border-b border-zinc-800">
          <button
            className={`flex-1 px-3 py-2 text-sm flex items-center justify-center gap-2 ${
              tab === 'chat' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            onClick={() => setTab('chat')}
          >
            <MessageSquare className="h-4 w-4" /> Chat
          </button>
          <button
            className={`flex-1 px-3 py-2 text-sm flex items-center justify-center gap-2 ${
              tab === 'people' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            onClick={() => setTab('people')}
          >
            <Users className="h-4 w-4" /> People ({peopleList.length})
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          {tab === 'chat' ? (
            <div className="flex flex-col h-full">
              <ScrollArea className="flex-1 p-3">
                {chat.length === 0 ? (
                  <p className="text-xs text-zinc-500 text-center py-8">No messages yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {chat.map((m, i) => (
                      <li key={i} className="text-sm">
                        <div className="flex items-baseline gap-2">
                          <span className="font-medium text-zinc-200">{m.fullName || m.username}</span>
                          <span className="text-[10px] text-zinc-500">
                            {new Date(m.ts).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-zinc-300 break-words">{m.text}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </ScrollArea>
              <div className="p-2 border-t border-zinc-800 flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                  placeholder="Message…"
                  className="bg-zinc-800 border-zinc-700 text-zinc-100"
                />
                <Button size="sm" onClick={sendChat}>Send</Button>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-full p-3">
              <ul className="space-y-1.5">
                {peopleList.map((p) => (
                  <li key={p.userId} className="flex items-center justify-between text-sm">
                    <span className="truncate">
                      {p.fullName || p.username}
                      {p.userId === user?.id && <span className="text-zinc-500 ml-1">(you)</span>}
                    </span>
                    {hands[p.userId] && <Hand className="h-4 w-4 text-amber-400" />}
                  </li>
                ))}
                {peopleList.length === 0 && (
                  <li className="text-xs text-zinc-500 text-center py-8">No one here yet.</li>
                )}
              </ul>
            </ScrollArea>
          )}
        </div>

        <div className="p-2 border-t border-zinc-800 flex gap-2">
          <Button
            variant={myHand ? 'default' : 'outline'}
            size="sm"
            className="flex-1"
            onClick={toggleHand}
          >
            <Hand className="h-4 w-4 mr-1" /> {myHand ? 'Lower hand' : 'Raise hand'}
          </Button>
          {credentials.isModerator ? (
            <Button variant="destructive" size="sm" onClick={endForAll}>
              <PhoneOff className="h-4 w-4 mr-1" /> End
            </Button>
          ) : (
            <Button variant="destructive" size="sm" onClick={leaveAll}>
              <LogOut className="h-4 w-4 mr-1" /> Leave
            </Button>
          )}
        </div>
      </aside>
    </div>
  );
}
