'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Topbar } from '@/components/dashboard/Topbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (!user) return;

    const isAdmin = user.role === 'super_admin' || user.role === 'admin';
    const isTeacher = user.role === 'teacher';

    if (pathname.startsWith('/dashboard/admin') && !isAdmin) {
      router.replace(isTeacher ? '/dashboard/teacher' : '/dashboard/student');
    } else if (pathname.startsWith('/dashboard/teacher') && !isTeacher && !isAdmin) {
      router.replace('/dashboard/student');
    }
  }, [hasHydrated, isAuthenticated, user, pathname, router]);

  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">
        Loading…
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // Live class room owns the full viewport — no sidebar / topbar / padding
  const isFullscreenRoute = /^\/dashboard\/classes\/\d+/.test(pathname);
  if (isFullscreenRoute) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
