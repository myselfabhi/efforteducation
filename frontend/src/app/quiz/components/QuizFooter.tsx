import Link from 'next/link';
import Logo from '@/app/components/common/Logo';

export default function QuizFooter() {
  return (
    <footer className="border-t border-border/60 mt-12 py-8">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <Link href="/" className="flex items-center gap-2 hover:text-foreground transition-colors">
          <Logo className="text-base" />
          <span>
            <span className="font-semibold text-foreground">Effort</span>{' '}
            <span className="text-primary font-semibold">Education</span>
          </span>
        </Link>
        <div className="flex items-center gap-5">
          <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
          <Link href="/contact" className="hover:text-foreground transition-colors">Help</Link>
          <span className="hidden sm:inline">© {new Date().getFullYear()} Effort Education</span>
        </div>
      </div>
    </footer>
  );
}
