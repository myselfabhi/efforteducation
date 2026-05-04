'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { X, ArrowRight, Mail, Lock, User, Phone, BookOpen } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { useAuthStore, dashboardHomeFor } from '@/lib/stores/authStore';
import { useAuthModal } from '@/lib/stores/authModalStore';

export function AuthModal() {
  const open = useAuthModal((s) => s.open);
  const mode = useAuthModal((s) => s.mode);
  const setMode = useAuthModal((s) => s.setMode);
  const closeModal = useAuthModal((s) => s.closeModal);
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [submitting, setSubmitting] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    class_grade: '',
  });

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // ESC closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeModal]);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const r = await api.auth.login(loginForm);
      login(r.user, r.token);
      toast.success(`Welcome back, ${r.user.full_name || r.user.username}`);
      closeModal();
      router.push(dashboardHomeFor(r.user.role));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  async function onSignup(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const r = await api.auth.register({
        username: signupForm.username,
        email: signupForm.email,
        password: signupForm.password,
        full_name: signupForm.full_name || undefined,
        phone: signupForm.phone || undefined,
        class_grade: signupForm.class_grade || undefined,
      });
      login(r.user, r.token);
      toast.success('Account created!');
      closeModal();
      router.push(dashboardHomeFor(r.user.role));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Sign-up failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            aria-label="Close"
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md rounded-3xl border border-border bg-card shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label={mode === 'login' ? 'Sign in' : 'Create account'}
          >
            {/* Close */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 inline-flex items-center justify-center h-9 w-9 rounded-lg text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header — mode tabs */}
            <div className="px-6 pt-6 pb-4 bg-gradient-to-b from-primary-soft/40 via-card to-card border-b border-border">
              <div className="flex items-center gap-1 p-1 rounded-full bg-secondary/60 w-fit">
                <button
                  onClick={() => setMode('login')}
                  className={`relative px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                    mode === 'login'
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {mode === 'login' && (
                    <motion.span
                      layoutId="auth-mode-pill"
                      className="absolute inset-0 rounded-full bg-card shadow-sm"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative">Sign in</span>
                </button>
                <button
                  onClick={() => setMode('register')}
                  className={`relative px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                    mode === 'register'
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {mode === 'register' && (
                    <motion.span
                      layoutId="auth-mode-pill"
                      className="absolute inset-0 rounded-full bg-card shadow-sm"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative">Create account</span>
                </button>
              </div>

              <h2 className="mt-5 text-2xl font-bold tracking-tight">
                {mode === 'login' ? 'Welcome back.' : 'Start your journey.'}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {mode === 'login'
                  ? 'Sign in to continue your prep where you left off.'
                  : 'Create a free account to access classes, quizzes, and notes.'}
              </p>
            </div>

            {/* Body — forms */}
            <div className="px-6 py-5 overflow-y-auto">
              <AnimatePresence mode="wait" initial={false}>
                {mode === 'login' ? (
                  <motion.form
                    key="login"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={onLogin}
                    className="space-y-4"
                  >
                    <Field
                      icon={Mail}
                      label="Email"
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={loginForm.email}
                      onChange={(v) => setLoginForm((s) => ({ ...s, email: v }))}
                      placeholder="you@email.com"
                    />
                    <Field
                      icon={Lock}
                      label="Password"
                      id="login-password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={loginForm.password}
                      onChange={(v) => setLoginForm((s) => ({ ...s, password: v }))}
                      placeholder="••••••••"
                    />

                    <button
                      type="submit"
                      disabled={submitting}
                      className="group w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
                    >
                      {submitting ? 'Signing in…' : 'Sign in'}
                      {!submitting && (
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      )}
                    </button>

                    <p className="text-center text-xs text-muted-foreground">
                      New here?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('register')}
                        className="font-semibold text-primary hover:underline underline-offset-4"
                      >
                        Create a student account
                      </button>
                    </p>
                  </motion.form>
                ) : (
                  <motion.form
                    key="register"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={onSignup}
                    className="space-y-4"
                  >
                    <Field
                      icon={User}
                      label="Full name"
                      id="signup-name"
                      required
                      value={signupForm.full_name}
                      onChange={(v) => setSignupForm((s) => ({ ...s, full_name: v }))}
                      placeholder="Your full name"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Field
                        icon={User}
                        label="Username"
                        id="signup-username"
                        required
                        value={signupForm.username}
                        onChange={(v) => setSignupForm((s) => ({ ...s, username: v }))}
                        placeholder="@handle"
                      />
                      <Field
                        icon={BookOpen}
                        label="Class / level"
                        id="signup-class"
                        value={signupForm.class_grade}
                        onChange={(v) => setSignupForm((s) => ({ ...s, class_grade: v }))}
                        placeholder="e.g. Class 8"
                      />
                    </div>
                    <Field
                      icon={Mail}
                      label="Email"
                      id="signup-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={signupForm.email}
                      onChange={(v) => setSignupForm((s) => ({ ...s, email: v }))}
                      placeholder="you@email.com"
                    />
                    <Field
                      icon={Phone}
                      label="Phone"
                      id="signup-phone"
                      type="tel"
                      value={signupForm.phone}
                      onChange={(v) => setSignupForm((s) => ({ ...s, phone: v }))}
                      placeholder="+91 …"
                      hint="Optional"
                    />
                    <Field
                      icon={Lock}
                      label="Password"
                      id="signup-password"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      value={signupForm.password}
                      onChange={(v) => setSignupForm((s) => ({ ...s, password: v }))}
                      placeholder="At least 8 characters"
                      hint="Min. 8 characters"
                    />

                    <button
                      type="submit"
                      disabled={submitting}
                      className="group w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
                    >
                      {submitting ? 'Creating…' : 'Create account'}
                      {!submitting && (
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      )}
                    </button>

                    <p className="text-center text-xs text-muted-foreground">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('login')}
                        className="font-semibold text-primary hover:underline underline-offset-4"
                      >
                        Sign in
                      </button>
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface FieldProps {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  minLength?: number;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
}

function Field({
  icon: Icon,
  label,
  id,
  type = 'text',
  required,
  minLength,
  autoComplete,
  value,
  onChange,
  placeholder,
  hint,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-center justify-between text-xs font-semibold text-foreground mb-1.5"
      >
        <span>{label}</span>
        {hint && <span className="text-muted-foreground font-normal">{hint}</span>}
      </label>
      <div className="relative">
        <Icon
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          strokeWidth={2}
        />
        <input
          id={id}
          type={type}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
      </div>
    </div>
  );
}
