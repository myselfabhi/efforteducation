'use client';

import Link from 'next/link';
import { LogOut } from 'lucide-react';
import Logo from '@/app/components/common/Logo';
import { useAuthStore, dashboardHomeFor } from '@/lib/stores/authStore';

export default function QuizHeader() {
  const user = useAuthStore((s) => s.user);
  const exitHref = user ? dashboardHomeFor(user.role) : '/';

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-border/60">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 h-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group" aria-label="Effort Education — home">
          <Logo className="text-xl transition-transform duration-300 group-hover:scale-105" />
          <span className="hidden sm:inline-flex items-baseline gap-1 text-sm font-bold tracking-tight">
            <span className="text-foreground">Effort</span>
            <span className="bg-gradient-to-br from-primary via-primary-strong to-primary bg-clip-text text-transparent">
              Education
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {user && (
            <span className="hidden sm:inline-flex items-center gap-2 px-2.5 h-8 rounded-full bg-secondary/50 text-xs font-medium text-foreground">
              <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                {(user.full_name || user.username).slice(0, 1).toUpperCase()}
              </span>
              <span className="truncate max-w-[140px]">{user.full_name || user.username}</span>
            </span>
          )}
          <Link
            href={exitHref}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-secondary/40 transition-colors"
          >
            <LogOut className="h-3 w-3" strokeWidth={2.4} />
            Exit
          </Link>
        </div>
      </div>
    </header>
  );
}
