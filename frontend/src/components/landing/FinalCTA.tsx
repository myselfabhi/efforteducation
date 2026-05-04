'use client';

import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useAuthModal } from '@/lib/stores/authModalStore';

export function FinalCTA() {
  const openAuth = useAuthModal((s) => s.openModal);
  return (
    <section className="py-20">
      <div className="container mx-auto max-w-5xl px-6">
        <div className="relative rounded-3xl overflow-hidden p-10 md:p-16 bg-gradient-to-br from-primary via-primary to-primary-strong text-primary-foreground">
          <div
            aria-hidden
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 20%, white 0, transparent 40%), radial-gradient(circle at 80% 60%, white 0, transparent 40%)',
            }}
          />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Your next selection starts today.
            </h2>
            <p className="mt-4 text-base md:text-lg opacity-90">
              Join thousands of aspirants already learning live with our faculty. Free demo class
              before you commit — no questions asked.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                variant="secondary"
                className="h-12 px-6 text-base font-semibold"
                onClick={() => openAuth('register')}
              >
                Create a free account
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 px-6 text-base bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link href="/contact">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Talk to a counsellor
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
