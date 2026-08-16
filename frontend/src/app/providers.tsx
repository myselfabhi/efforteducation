'use client';

import { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { makeQueryClient } from '@/lib/queryClient';
import { useAuthStore } from '@/lib/stores/authStore';
import { useNotificationStore } from '@/lib/stores/notificationStore';
import { getUserSocket } from '@/lib/userSocket';
import { api, type Notification } from '@/lib/api';
import { AuthModal } from '@/components/auth/AuthModal';

function AuthHydrator() {
  const hydrate = useAuthStore((s) => s.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  return null;
}

function NotificationsBootstrap() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setItems = useNotificationStore((s) => s.setItems);
  const prepend = useNotificationStore((s) => s.prepend);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;

    api.notifications
      .list(50)
      .then((r) => {
        const data = r as { items: Notification[]; unread: number };
        if (!cancelled) setItems(data.items, data.unread);
      })
      .catch(() => {});

    const socket = getUserSocket();
    // UserHub sends { type: 'notification:new', notification: <row> }.
    const handler = (msg: { notification: Notification }) => prepend(msg.notification);
    socket.on('notification:new', handler);

    return () => {
      cancelled = true;
      socket.off('notification:new', handler);
    };
  }, [isAuthenticated, setItems, prepend]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => makeQueryClient());
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={client}>
        <AuthHydrator />
        <NotificationsBootstrap />
        {children}
        <AuthModal />
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
