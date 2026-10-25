'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { User, Mail, Phone, Lock, BookOpen, ArrowRight, Eye, EyeOff, Loader2, GraduationCap, Users } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { useAuthStore, dashboardHomeFor } from '@/lib/stores/authStore';
import { validateSignup, firstError, type SignupErrors } from '@/lib/validateSignup';
import { cn } from '@/lib/utils';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/app/components/ui/select';

type AccountType = 'student' | 'parent';

const CLASS_OPTIONS = [
  'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'Class 11 (Science)', 'Class 11 (Commerce)', 'Class 11 (Arts)',
  'Class 12 (Science)', 'Class 12 (Commerce)', 'Class 12 (Arts)',
  'Dropper / Repeater',
  'JEE Aspirant', 'NEET Aspirant', 'CUET (UG) Aspirant',
  'Other',
];

const inputCls = (hasError?: boolean) =>
  cn(
    'w-full h-10 pl-9 pr-3 rounded-lg border bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 transition-all',
    hasError ? 'border-destructive focus:ring-destructive/30' : 'border-border focus:ring-primary/30 focus:border-primary',
  );

export default function RegisterPage() {
  const router = useRouter();
  const { login, isAuthenticated, hasHydrated, hydrate, user } = useAuthStore();

  const [form, setForm] = useState({
    full_name: '', username: '', email: '', password: '', phone: '', class_grade: '',
  });
  const [accountType, setAccountType] = useState<AccountType>('student');
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<SignupErrors>({});
  const isParent = accountType === 'parent';

  useEffect(() => { hydrate(); }, [hydrate]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (isAuthenticated && user) router.replace(dashboardHomeFor(user.role));
  }, [hasHydrated, isAuthenticated, user, router]);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((s) => ({ ...s, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const errs = validateSignup(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const f = firstError(errs);
      if (f) document.getElementById(f)?.focus();
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const r = await api.auth.register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        full_name: form.full_name.trim() || undefined,
        phone: form.phone.trim(),
        class_grade: isParent ? undefined : (form.class_grade || undefined),
        account_type: accountType,
      });
      login(r.user, r.token);
      toast.success('Account created! Welcome aboard.');
      router.replace(dashboardHomeFor(r.user.role));
    } catch (err) {
      let msg = err instanceof ApiError ? err.message : 'Sign-up failed. Please try again.';
      if (/invalid request body/i.test(msg)) msg = 'Please check your details and try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          {isParent ? 'Create a parent account.' : 'Start your journey.'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isParent
            ? "Manage your child's classes, progress and schedule from one place."
            : 'Create a free account to access classes, quizzes, and notes.'}
        </p>
      </div>

      {/* Account type */}
      <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-secondary/50 border border-border">
        {(['student', 'parent'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setAccountType(t)}
            aria-pressed={accountType === t}
            className={cn(
              'flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-semibold transition-colors',
              accountType === t ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t === 'student' ? <GraduationCap className="h-4 w-4" /> : <Users className="h-4 w-4" />}
            {t === 'student' ? "I'm a student" : "I'm a parent"}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive px-3 py-2.5 rounded-lg text-sm">
            <span className="shrink-0">⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Full name */}
        <div>
          <label htmlFor="full_name" className="block text-xs font-semibold text-foreground mb-1.5">
            {isParent ? 'Your name' : 'Full name'}
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={2} />
            <input id="full_name" type="text" aria-invalid={!!errors.full_name} value={form.full_name} onChange={(e) => set('full_name', e.target.value)} placeholder={isParent ? 'Parent / guardian name' : 'Your full name'} className={inputCls(!!errors.full_name)} />
          </div>
          {errors.full_name && <p className="mt-1 text-xs text-destructive">{errors.full_name}</p>}
        </div>

        {/* Username (+ Class, students only) */}
        <div className={cn('grid gap-3', isParent ? 'grid-cols-1' : 'grid-cols-2')}>
          <div>
            <label htmlFor="username" className="flex items-center justify-between text-xs font-semibold text-foreground mb-1.5">
              <span>Username</span>
              <span className="text-muted-foreground font-normal">Unique</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={2} />
              <input id="username" type="text" aria-invalid={!!errors.username} value={form.username} onChange={(e) => set('username', e.target.value)} placeholder="@handle" className={inputCls(!!errors.username)} />
            </div>
            {errors.username && <p className="mt-1 text-xs text-destructive">{errors.username}</p>}
          </div>
          {!isParent && (
            <div>
              <label htmlFor="class_grade" className="flex items-center justify-between text-xs font-semibold text-foreground mb-1.5">
                <span>Class / level</span>
                <span className="text-muted-foreground font-normal">Optional</span>
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-4 w-4 text-muted-foreground pointer-events-none" strokeWidth={2} />
                <Select value={form.class_grade || undefined} onValueChange={(v) => set('class_grade', v)}>
                  <SelectTrigger id="class_grade" className="h-10 w-full pl-9">
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
          )}
        </div>

        {isParent && (
          <p className="flex items-start gap-2 text-xs text-muted-foreground bg-secondary/40 border border-border rounded-lg px-3 py-2.5">
            <Users className="h-4 w-4 shrink-0 mt-px text-primary" strokeWidth={2} />
            <span>After signing in, you&rsquo;ll add each child&rsquo;s profile from your dashboard.</span>
          </p>
        )}

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-foreground mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={2} />
            <input id="email" type="email" aria-invalid={!!errors.email} autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@email.com" className={inputCls(!!errors.email)} />
          </div>
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-xs font-semibold text-foreground mb-1.5">Phone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={2} />
            <input id="phone" type="tel" aria-invalid={!!errors.phone} value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 98765 43210" className={inputCls(!!errors.phone)} />
          </div>
          {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="flex items-center justify-between text-xs font-semibold text-foreground mb-1.5">
            <span>Password</span>
            <span className="text-muted-foreground font-normal">Min. 8 chars</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={2} />
            <input id="password" type={showPw ? 'text' : 'password'} aria-invalid={!!errors.password} autoComplete="new-password" value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="Min. 8 characters" className={cn(inputCls(!!errors.password), 'pr-10')} />
            <button type="button" onClick={() => setShowPw((p) => !p)} tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" aria-label={showPw ? 'Hide password' : 'Show password'}>
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
        </div>

        <button type="submit" disabled={submitting} className="group w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60">
          {submitting ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Creating account…</>
          ) : (
            <>Create account<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-primary hover:underline underline-offset-4">Sign in</Link>
      </p>
    </div>
  );
}
