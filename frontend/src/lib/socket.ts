import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('quiz_token') : '';
    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function reconnectSocket() {
  disconnectSocket();
  return getSocket();
}

// =====================================================
// Live class room helpers
// =====================================================

export interface ClassChatMessage {
  userId: number;
  username: string;
  fullName: string | null;
  text: string;
  ts: number;
}

export interface ClassParticipant {
  userId: number;
  username: string;
  fullName?: string | null;
}

export interface ClassHandRaiseUpdate {
  userId: number;
  username: string;
  raised: boolean;
}

export const classRoom = {
  join(classId: number) {
    getSocket().emit('class:join', { classId });
  },
  heartbeat(classId: number) {
    getSocket().emit('class:heartbeat', { classId });
  },
  leave(classId: number) {
    getSocket().emit('class:leave', { classId });
  },
  sendChat(classId: number, text: string) {
    getSocket().emit('class:chat-message', { classId, text });
  },
  raiseHand(classId: number, raised: boolean) {
    getSocket().emit('class:hand-raise', { classId, raised });
  },
  end(classId: number) {
    getSocket().emit('class:end', { classId });
  },
};
