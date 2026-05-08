'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { User, Mail, Phone, Lock, BookOpen, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { useAuthStore, dashboardHomeFor } from '@/lib/stores/authStore';

const CLASS_OPTIONS = [
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'Class 11 (Science)', 'Class 11 (Commerce)', 'Class 11 (Arts)',
  'Class 12 (Science)', 'Class 12 (Commerce)', 'Class 12 (Arts)',
  'Dropper / Repeater',
  'JEE Aspirant', 'NEET Aspirant', 'CUET (UG) Aspirant',
  'Other',
];

export default function RegisterPage() {
  const router = useRouter();
  const { login, isAuthenticated, hasHydrated, hydrate, user } = useAuthStore();

  const [form, setForm] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    class_grade: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { hydrate(); }, [hydrate]);

  // Redirect already-authenticated users
  useEffect(() => {
    if (!hasHydrated) return;
    if (isAuthenticated && user) {
      router.replace(dashboardHomeFor(user.role));
    }
  }, [hasHydrated, isAuthenticated, user, router]);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const r = await api.auth.register({
        username: form.username,
        email: form.email,
        password: form.password,
        full_name: form.full_name || undefined,
        phone: form.phone || undefined,
        class_grade: form.class_grade || undefined,
      });
      login(r.user, r.token);
      toast.success('Account created! Welcome aboard.');
      router.replace(dashboardHomeFor(r.user.role));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Sign-up failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Start your journey.</h1>
        <p className="text-sm text-muted-foreground">
          Create a free account to access classes, quizzes, and notes.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive px-3 py-2.5 rounded-lg text-sm">
            <span className="shrink-0">⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Full name */}
        <div>
          <label htmlFor="full_name" className="block text-xs font-semibold text-foreground mb-1.5">
            Full name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={2} />
            <input
              id="full_name"
              type="text"
              required
              value={form.full_name}
              onChange={(e) => set('full_name', e.target.value)}
              placeholder="Your full name"
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Username + Class */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="username" className="flex items-center justify-between text-xs font-semibold text-foreground mb-1.5">
              <span>Username</span>
              <span className="text-muted-foreground font-normal">Unique</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={2} />
              <input
                id="username"
                type="text"
                required
                value={form.username}
                onChange={(e) => set('username', e.target.value)}
                placeholder="@handle"
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>
          <div>
            <label htmlFor="class_grade" className="flex items-center justify-between text-xs font-semibold text-foreground mb-1.5">
              <span>Class / level</span>
              <span className="text-muted-foreground font-normal">Optional</span>
            </label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" strokeWidth={2} />
              <select
                id="class_grade"
                value={form.class_grade}
                onChange={(e) => set('class_grade', e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none cursor-pointer"
              >
                <option value="">Select…</option>
                {CLASS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-foreground mb-1.5">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={2} />
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="you@email.com"
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="flex items-center justify-between text-xs font-semibold text-foreground mb-1.5">
            <span>Phone</span>
            <span className="text-muted-foreground font-normal">Optional</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={2} />
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="flex items-center justify-between text-xs font-semibold text-foreground mb-1.5">
            <span>Password</span>
            <span className="text-muted-foreground font-normal">Min. 8 chars</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={2} />
            <input
              id="password"
              type={showPw ? 'text' : 'password'}
              required
              minLength={8}
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full h-10 pl-9 pr-10 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPw((p) => !p)}
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="group w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account…
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-primary hover:underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}
