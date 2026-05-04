import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center mb-8 text-2xl font-black text-primary">
          Effort Education
        </Link>
        <div className="bg-card border border-border rounded-2xl shadow-xl p-6 sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
