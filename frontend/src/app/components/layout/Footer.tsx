'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import Logo from '../common/Logo';

const WHATSAPP = '+919355103155';

const COMPANY_LINKS = [
  { href: '/about', label: 'About us' },
  { href: '/courses', label: 'Programs' },
  { href: '/young-scholar', label: 'Young Scholar' },
  { href: '/contact', label: 'Contact' },
];

const PROGRAM_LINKS = [
  { href: '/courses/bank-po-so', label: 'Bank PO / SO' },
  { href: '/courses/ugc-net-jrf', label: 'UGC NET / JRF' },
  { href: '/courses/cuet', label: 'CUET (UG)' },
  { href: '/courses/dsssb', label: 'DSSSB' },
  { href: '/courses/interview-prep', label: 'Interview prep' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <Logo className="text-3xl" />
              <span className="text-lg font-black tracking-tight">Effort Education</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
              Precision coaching for competitive exams and young learners — live and online,
              since 1991.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-border bg-background text-sm font-semibold hover:border-primary/40 hover:text-primary transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-success" />
              Chat with a counsellor
            </a>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary">Company</h4>
            <nav className="mt-4 grid gap-3">
              {COMPANY_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary">Programs</h4>
            <nav className="mt-4 grid gap-3">
              {PROGRAM_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {year} Effort Education Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
