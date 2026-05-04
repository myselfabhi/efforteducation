'use client';

import { useAuthModal, type AuthMode } from '@/lib/stores/authModalStore';

interface AuthCTAProps {
  mode: AuthMode;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}

export function AuthCTA({ mode, className, children, ariaLabel }: AuthCTAProps) {
  const open = useAuthModal((s) => s.openModal);
  return (
    <button
      type="button"
      onClick={() => open(mode)}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
