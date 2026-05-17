'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore, dashboardHomeFor } from '@/lib/stores/authStore';

export default function CreateQuizPage() {
  const router = useRouter();
  const { hydrate, isAuthenticated, hasHydrated, user } = useAuthStore();
  const [form, setForm] = useState({
    title: '',
    description: '',
    scheduled_at: '',
    is_practice: true,
    answer_grace_period_ms: 3000,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { hydrate(); }, [hydrate]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user && !['admin', 'super_admin', 'teacher'].includes(user.role)) {
      router.push('/dashboard/student');
    }
  }, [hasHydrated, isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const quiz = await api.quizzes.create({
        title: form.title,
        description: form.description || undefined,
        scheduled_at: form.scheduled_at || undefined,
        is_practice: form.is_practice,
        answer_grace_period_ms: form.answer_grace_period_ms,
      });
      router.push(`/quiz/admin/${quiz.id}/questions`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const dashboardHref = user ? `${dashboardHomeFor(user.role)}/quizzes` : '/dashboard/admin/quizzes';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">Create New Quiz</h1>
          <p className="text-sm text-muted-foreground mb-6">Step 1 of 2 · Set the basics</p>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Quiz Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
                placeholder="e.g. JavaScript Fundamentals"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition resize-none"
                placeholder="Brief description of your quiz..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Schedule (optional)</label>
              <input
                type="datetime-local"
                value={form.scheduled_at}
                onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.is_practice}
                onChange={(e) => setForm({ ...form, is_practice: e.target.checked })}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              <span className="text-sm font-medium text-foreground">
                Practice quiz{' '}
                <span className="text-muted-foreground font-normal">(not tied to a batch)</span>
              </span>
            </label>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Answer-change grace
              </label>
              <select
                value={form.answer_grace_period_ms}
                onChange={(e) => setForm({ ...form, answer_grace_period_ms: Number(e.target.value) })}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
              >
                <option value={0}>Off — locks on first click (Kahoot-style)</option>
                <option value={2000}>2 seconds (fast)</option>
                <option value={3000}>3 seconds (recommended)</option>
                <option value={5000}>5 seconds (relaxed)</option>
                <option value={10000}>10 seconds (max)</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1.5">
                Time window after a player&apos;s first click during which they can change their selection.
                Time bonus uses the first click, so a change of mind doesn&apos;t lower their score.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push(dashboardHref)}
                className="flex-1 bg-card border border-border text-foreground py-3 rounded-lg font-medium hover:bg-secondary/40 transition"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-primary text-primary-foreground py-3 rounded-lg font-semibold disabled:opacity-50 hover:bg-primary/90 transition"
              >
                {loading ? 'Creating...' : (
                  <>
                    Next: Add Questions
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
