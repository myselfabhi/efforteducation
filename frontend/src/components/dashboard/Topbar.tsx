'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun, Menu } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { useUiStore } from '@/lib/stores/uiStore';
import { NotificationBell } from './NotificationBell';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';

function initials(s?: string | null) {
  if (!s) return '?';
  return s
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const user = useAuthStore((s) => s.user);
  const toggle = useUiStore((s) => s.toggleSidebar);
  const toggleMobile = useUiStore((s) => s.toggleMobileSidebar);

  if (!user) return null;
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobile}
          className="md:hidden p-2 rounded-md hover:bg-secondary"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <p className="text-sm text-muted-foreground hidden md:block">
          Welcome back, <span className="font-medium text-foreground">{user.full_name || user.username}</span>
        </p>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <NotificationBell />
        <Avatar className="h-8 w-8 ml-2">
          <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
            {initials(user.full_name || user.username)}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
