'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, dashboardHomeFor } from '@/lib/stores/authStore';

export default function QuizDashboardRedirect() {
  const router = useRouter();
  const { hydrate, hasHydrated, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated || !user) {
      router.replace('/login');
      return;
    }
    router.replace(`${dashboardHomeFor(user.role)}/quizzes`);
  }, [hasHydrated, isAuthenticated, user, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center text-sm text-muted-foreground">
      Redirecting…
    </div>
  );
}
