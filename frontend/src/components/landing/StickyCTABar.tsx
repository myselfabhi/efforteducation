'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, X, LogIn } from 'lucide-react';
import { useAuthModal } from '@/lib/stores/authModalStore';

const WHATSAPP_NUMBER = '+919355103155'; // brand placeholder
const PHONE_NUMBER = '+919876543210';

export function StickyCTABar() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const openAuth = useAuthModal((s) => s.openModal);

  useEffect(() => {
    function onScroll() {
      setShow(window.scrollY > 600);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && !dismissed && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 250 }}
          className="fixed inset-x-0 bottom-20 md:bottom-4 z-40 px-4 pointer-events-none"
        >
          <div className="mx-auto max-w-3xl pointer-events-auto rounded-2xl border border-border bg-card/95 backdrop-blur shadow-2xl flex items-center gap-2 p-2">
            <div className="hidden sm:block flex-1 px-3">
              <p className="text-sm font-semibold leading-tight">Talk to a counsellor</p>
              <p className="text-xs text-muted-foreground">Free guidance to pick the right course</p>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-success text-success-foreground hover:opacity-90 text-sm font-semibold transition-opacity"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary-strong text-sm font-semibold transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Call</span>
            </a>
            <button
              type="button"
              onClick={() => openAuth('login')}
              className="hidden md:inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl border border-border hover:bg-secondary text-sm font-semibold transition-colors"
            >
              <LogIn className="h-4 w-4" />
              Login
            </button>
            <button
              onClick={() => setDismissed(true)}
              aria-label="Dismiss"
              className="h-10 w-10 rounded-xl text-muted-foreground hover:bg-secondary flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
