'use client';

import { useEffect, useState } from 'react';
import { Menu, X, ArrowRight, LogIn } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '../common/Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthModal } from '@/lib/stores/authModalStore';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/courses', label: 'Programs' },
  { href: '/young-scholar', label: 'Young Scholar' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const openAuth = useAuthModal((s) => s.openModal);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-border/60 shadow-[0_1px_0_rgba(0,0,0,0.02)]'
            : 'bg-background/40 backdrop-blur-md border-b border-transparent'
        }`}
      >
        <nav className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group"
              aria-label="Effort Education — home"
            >
              <Logo className="text-2xl transition-transform duration-300 group-hover:scale-105" />
              <span className="hidden sm:inline-flex items-baseline gap-1 text-base font-bold tracking-tight">
                <span className="text-foreground">Effort</span>
                <span className="bg-gradient-to-br from-primary via-primary-strong to-primary bg-clip-text text-transparent">
                  Education
                </span>
              </span>
            </Link>

            {/* Desktop Nav — pill style with active background */}
            <div className="hidden lg:flex items-center gap-1 rounded-full border border-border/60 bg-card/60 backdrop-blur p-1">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                      active
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-primary/10"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {/* Login (text link, hidden on small) */}
              <button
                type="button"
                onClick={() => openAuth('login')}
                className="hidden md:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              >
                <LogIn className="h-3.5 w-3.5" />
                Sign in
              </button>

              {/* Enroll CTA */}
              <button
                type="button"
                onClick={() => openAuth('register')}
                className="hidden md:inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors group"
              >
                Enroll
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg text-foreground hover:bg-secondary/60 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] lg:hidden"
          >
            {/* Backdrop */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
              className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            />

            {/* Sheet */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="absolute inset-y-0 right-0 w-full max-w-sm bg-background border-l border-border flex flex-col"
            >
              {/* Sheet header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-border">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <Logo className="text-2xl" />
                  <span className="text-base font-bold tracking-tight">
                    Effort{' '}
                    <span className="bg-gradient-to-br from-primary via-primary-strong to-primary bg-clip-text text-transparent">
                      Education
                    </span>
                  </span>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-lg text-foreground hover:bg-secondary/60 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Nav links */}
              <div className="flex-1 overflow-y-auto px-3 py-4">
                <div className="space-y-1">
                  {NAV_ITEMS.map((item, i) => {
                    const active = isActive(item.href);
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.25 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                            active
                              ? 'bg-primary/10 text-primary'
                              : 'text-foreground hover:bg-secondary/60'
                          }`}
                        >
                          {item.label}
                          <ArrowRight
                            className={`h-4 w-4 transition-opacity ${
                              active ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Footer actions */}
                <div className="mt-8 pt-6 border-t border-border space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      openAuth('login');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                  >
                    <LogIn className="h-4 w-4" />
                    Already a student? Sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      openAuth('register');
                    }}
                    className="group w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Enroll now
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
