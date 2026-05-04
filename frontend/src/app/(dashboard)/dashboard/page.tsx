'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, dashboardHomeFor } from '@/lib/stores/authStore';

export default function DashboardIndex() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!user) {
      router.replace('/login');
    } else {
      router.replace(dashboardHomeFor(user.role));
    }
  }, [hasHydrated, user, router]);

  return <div className="text-sm text-muted-foreground">Redirecting…</div>;
}
