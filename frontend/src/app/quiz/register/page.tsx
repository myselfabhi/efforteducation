'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function QuizRegisterRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/register');
  }, [router]);
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-sm text-muted-foreground">
      Redirecting…
    </div>
  );
}
