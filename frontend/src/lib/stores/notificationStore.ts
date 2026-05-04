import { create } from 'zustand';
import type { Notification } from '../api';

interface NotificationState {
  items: Notification[];
  unread: number;
  setItems: (items: Notification[], unread: number) => void;
  prepend: (n: Notification) => void;
  markRead: (id: number) => void;
  markAllRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  items: [],
  unread: 0,
  setItems: (items, unread) => set({ items, unread }),
  prepend: (n) =>
    set((s) => ({
      items: [n, ...s.items].slice(0, 100),
      unread: n.read_at ? s.unread : s.unread + 1,
    })),
  markRead: (id) =>
    set((s) => {
      const items = s.items.map((n) => (n.id === id && !n.read_at ? { ...n, read_at: new Date().toISOString() } : n));
      const unread = items.filter((n) => !n.read_at).length;
      return { items, unread };
    }),
  markAllRead: () =>
    set((s) => ({
      items: s.items.map((n) => (n.read_at ? n : { ...n, read_at: new Date().toISOString() })),
      unread: 0,
    })),
}));
