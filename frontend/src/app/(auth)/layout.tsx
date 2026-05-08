import Link from 'next/link';
import Logo from '@/app/components/common/Logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary p-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 mb-8 hover:opacity-80 transition-opacity"
        >
          <Logo className="text-2xl" />
          <span className="text-2xl font-black">
            <span className="text-foreground">Effort</span>{' '}
            <span className="text-primary">Education</span>
          </span>
        </Link>
        <div className="bg-card border border-border rounded-2xl shadow-xl p-6 sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
