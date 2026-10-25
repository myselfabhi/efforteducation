'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { X, ArrowRight, Mail, Lock, User, Phone, BookOpen, Eye, EyeOff, Loader2 } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { useAuthStore, dashboardHomeFor } from '@/lib/stores/authStore';
import { useAuthModal } from '@/lib/stores/authModalStore';
import { validateSignup, firstError, type SignupErrors } from '@/lib/validateSignup';
import { cn } from '@/lib/utils';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/app/components/ui/select';

const CLASS_OPTIONS = [
  'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'Class 11 (Science)', 'Class 11 (Commerce)', 'Class 11 (Arts)',
  'Class 12 (Science)', 'Class 12 (Commerce)', 'Class 12 (Arts)',
  'Dropper / Repeater',
  'JEE Aspirant', 'NEET Aspirant', 'CUET (UG) Aspirant',
  'Other',
];

const FIELD_ID: Record<string, string> = {
  full_name: 'signup-name', username: 'signup-username', class_grade: 'signup-class',
  email: 'signup-email', phone: 'signup-phone', password: 'signup-password',
};

export function AuthModal() {
  const open = useAuthModal((s) => s.open);
  const mode = useAuthModal((s) => s.mode);
  const setMode = useAuthModal((s) => s.setMode);
  const closeModal = useAuthModal((s) => s.closeModal);
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');
  const [signupErrors, setSignupErrors] = useState<SignupErrors>({});
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [showSignupPw, setShowSignupPw] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    full_name: '', username: '', email: '', password: '', phone: '', class_grade: '',
  });

  // Update a signup field and clear its error as the user fixes it.
  function setSignupField(key: keyof typeof signupForm, value: string) {
    setSignupForm((s) => ({ ...s, [key]: value }));
    setSignupErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  }

  useEffect(() => {
    setLoginError('');
    setSignupError('');
    setSignupErrors({});
  }, [mode]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeModal]);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!loginForm.email.trim() || !loginForm.password) {
      setLoginError('Please enter your email and password.');
      return;
    }
    setLoginError('');
    setSubmitting(true);
    try {
      const r = await api.auth.login(loginForm);
      login(r.user, r.token);
      toast.success(`Welcome back, ${r.user.full_name || r.user.username}`);
      closeModal();
      router.push(dashboardHomeFor(r.user.role));
    } catch (err) {
      setLoginError(err instanceof ApiError ? err.message : 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function onSignup(e: React.FormEvent) {
    e.preventDefault();
    setSignupError('');
    const errs = validateSignup(signupForm);
    if (Object.keys(errs).length > 0) {
      setSignupErrors(errs);
      const f = firstError(errs);
      if (f) document.getElementById(FIELD_ID[f])?.focus();
      return;
    }
    setSignupErrors({});
    setSubmitting(true);
    try {
      const r = await api.auth.register({
        username: signupForm.username.trim(),
        email: signupForm.email.trim(),
        password: signupForm.password,
        full_name: signupForm.full_name.trim() || undefined,
        phone: signupForm.phone.trim(),
        class_grade: signupForm.class_grade || undefined,
      });
      login(r.user, r.token);
      toast.success('Account created! Welcome aboard.');
      closeModal();
      router.push(dashboardHomeFor(r.user.role));
    } catch (err) {
      let msg = err instanceof ApiError ? err.message : 'Sign-up failed. Please try again.';
      if (/invalid request body/i.test(msg)) msg = 'Please check your details and try again.';
      setSignupError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeModal} aria-label="Close"
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md rounded-3xl border border-border bg-card shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            role="dialog" aria-modal="true"
            aria-label={mode === 'login' ? 'Sign in' : 'Create account'}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 inline-flex items-center justify-center h-9 w-9 rounded-lg text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="px-6 pt-6 pb-4 bg-gradient-to-b from-primary-soft/40 via-card to-card border-b border-border">
              <div className="flex items-center gap-1 p-1 rounded-full bg-secondary/60 w-fit">
                <button
                  onClick={() => setMode('login')}
                  className={`relative px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${mode === 'login' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {mode === 'login' && (
                    <motion.span layoutId="auth-mode-pill" className="absolute inset-0 rounded-full bg-card shadow-sm" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                  )}
                  <span className="relative">Sign in</span>
                </button>
                <button
                  onClick={() => setMode('register')}
                  className={`relative px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${mode === 'register' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {mode === 'register' && (
                    <motion.span layoutId="auth-mode-pill" className="absolute inset-0 rounded-full bg-card shadow-sm" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
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

            <div className="px-6 py-5 overflow-y-auto">
              <AnimatePresence mode="wait" initial={false}>
                {mode === 'login' ? (
                  <motion.form
                    key="login" noValidate
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.2 }} onSubmit={onLogin} className="space-y-4"
                  >
                    {loginError && <FormError>{loginError}</FormError>}
                    <Field icon={Mail} label="Email" id="login-email" type="email" autoComplete="email" value={loginForm.email} onChange={(v) => setLoginForm((s) => ({ ...s, email: v }))} placeholder="you@email.com" />
                    <Field icon={Lock} label="Password" id="login-password" type={showLoginPw ? 'text' : 'password'} autoComplete="current-password" value={loginForm.password} onChange={(v) => setLoginForm((s) => ({ ...s, password: v }))} placeholder="••••••••" showToggle showPassword={showLoginPw} onTogglePassword={() => setShowLoginPw((p) => !p)} />
                    <SubmitButton submitting={submitting} label="Sign in" pending="Signing in…" />
                    <p className="text-center text-xs text-muted-foreground">
                      New here?{' '}
                      <button type="button" onClick={() => setMode('register')} className="font-semibold text-primary hover:underline underline-offset-4">Create a student account</button>
                    </p>
                  </motion.form>
                ) : (
                  <motion.form
                    key="register" noValidate
                    initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.2 }} onSubmit={onSignup} className="space-y-4"
                  >
                    {signupError && <FormError>{signupError}</FormError>}
                    <Field icon={User} label="Full name" id="signup-name" value={signupForm.full_name} onChange={(v) => setSignupField('full_name', v)} placeholder="Your full name" error={signupErrors.full_name} />
                    <div className="grid grid-cols-2 gap-3">
                      <Field icon={User} label="Username" id="signup-username" value={signupForm.username} onChange={(v) => setSignupField('username', v)} placeholder="@handle" hint="Unique" error={signupErrors.username} />
                      <ClassSelect value={signupForm.class_grade} onChange={(v) => setSignupField('class_grade', v)} />
                    </div>
                    <Field icon={Mail} label="Email" id="signup-email" type="email" autoComplete="email" value={signupForm.email} onChange={(v) => setSignupField('email', v)} placeholder="you@email.com" error={signupErrors.email} />
                    <Field icon={Phone} label="Phone" id="signup-phone" type="tel" value={signupForm.phone} onChange={(v) => setSignupField('phone', v)} placeholder="+91 98765 43210" error={signupErrors.phone} />
                    <Field icon={Lock} label="Password" id="signup-password" type={showSignupPw ? 'text' : 'password'} autoComplete="new-password" value={signupForm.password} onChange={(v) => setSignupField('password', v)} placeholder="Min. 8 characters" hint="Min. 8 chars" error={signupErrors.password} showToggle showPassword={showSignupPw} onTogglePassword={() => setShowSignupPw((p) => !p)} />
                    <SubmitButton submitting={submitting} label="Create account" pending="Creating…" />
                    <p className="text-center text-xs text-muted-foreground">
                      Already have an account?{' '}
                      <button type="button" onClick={() => setMode('login')} className="font-semibold text-primary hover:underline underline-offset-4">Sign in</button>
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

function FormError({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive px-3 py-2.5 rounded-lg text-sm">
      <span className="shrink-0">⚠</span>
      <span>{children}</span>
    </div>
  );
}

function SubmitButton({ submitting, label, pending }: { submitting: boolean; label: string; pending: string }) {
  return (
    <button type="submit" disabled={submitting} className="group w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60">
      {submitting ? (
        <><Loader2 className="h-4 w-4 animate-spin" /> {pending}</>
      ) : (
        <>{label}<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></>
      )}
    </button>
  );
}

interface FieldProps {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  id: string;
  type?: string;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  showToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

function Field({
  icon: Icon, label, id, type = 'text', autoComplete, value, onChange,
  placeholder, hint, error, showToggle, showPassword, onTogglePassword,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="flex items-center justify-between text-xs font-semibold text-foreground mb-1.5">
        <span>{label}</span>
        {hint && <span className="text-muted-foreground font-normal">{hint}</span>}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={2} />
        <input
          id={id}
          type={type}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'w-full h-10 pl-9 pr-3 rounded-lg border bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 transition-all',
            error ? 'border-destructive focus:ring-destructive/30' : 'border-border focus:ring-primary/30 focus:border-primary',
          )}
          style={{ paddingRight: showToggle ? '2.5rem' : undefined }}
        />
        {showToggle && (
          <button type="button" onClick={onTogglePassword} tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" aria-label={showPassword ? 'Hide password' : 'Show password'}>
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function ClassSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label htmlFor="signup-class" className="flex items-center justify-between text-xs font-semibold text-foreground mb-1.5">
        <span>Class / level</span>
        <span className="text-muted-foreground font-normal">Optional</span>
      </label>
      <div className="relative">
        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-4 w-4 text-muted-foreground pointer-events-none" strokeWidth={2} />
        <Select value={value || undefined} onValueChange={onChange}>
          <SelectTrigger id="signup-class" className="h-10 w-full pl-9">
            <SelectValue placeholder="Select…" />
          </SelectTrigger>
          <SelectContent>
            {CLASS_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
