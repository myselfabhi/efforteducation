'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
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
  // Theme switching lives only in the dashboard. Force light everywhere else so a
  // dark preference toggled in the dashboard never leaks into the public/marketing
  // site (which is designed light-only). usePathname resolves during SSR, so
  // next-themes bakes the forced theme into its pre-hydration script — no flash.
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard') ?? false;
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      forcedTheme={isDashboard ? undefined : 'light'}
    >
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
