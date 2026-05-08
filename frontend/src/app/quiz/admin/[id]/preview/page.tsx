'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Rocket, Activity, Plus, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/authStore';

interface Quiz {
  id: number;
  title: string;
  description: string | null;
  status: string;
  questions: Array<{
    id: number;
    question_text: string;
    time_limit: number;
    order_index: number;
    options: Array<{ id: number; option_text: string; is_correct?: boolean; option_index: number }>;
  }>;
}

export default function PreviewPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = Number(params.id);
  const { hydrate, isAuthenticated, hasHydrated, user } = useAuthStore();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [launching, setLaunching] = useState(false);
  const [error, setError] = useState('');

  const loadQuiz = useCallback(async () => {
    try {
      const data = await api.quizzes.get(quizId);
      setQuiz(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }, [quizId]);

  useEffect(() => { hydrate(); }, [hydrate]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated || !user || !['admin', 'super_admin', 'teacher'].includes(user.role)) {
      router.push('/login');
      return;
    }
    loadQuiz();
  }, [hasHydrated, isAuthenticated, user, router, loadQuiz]);

  const handleLaunch = async () => {
    setLaunching(true);
    setError('');
    try {
      await api.quizzes.launch(quizId);
      router.push(`/quiz/admin/${quizId}/live`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLaunching(false);
    }
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  if (!quiz) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const isLaunched = quiz.status === 'LIVE' || quiz.status === 'COMPLETED';

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{quiz.title}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {quiz.questions.length} questions • Status: {quiz.status}
            </p>
          </div>
          <div className="flex gap-3">
            {!isLaunched && (
              <button
                onClick={() => router.push(`/quiz/admin/${quizId}/questions`)}
                className="inline-flex items-center gap-1.5 bg-card border border-border text-foreground px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-secondary/40 transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Questions
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Questions preview */}
        <div className="space-y-4 mb-8">
          {quiz.questions.map((q, i) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-xl p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                  Q{i + 1}
                </span>
                <span className="text-xs text-muted-foreground">{q.time_limit}s</span>
              </div>
              <p className="text-foreground font-medium mb-4 leading-relaxed">{q.question_text}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((o, oi) => (
                  <div
                    key={o.id}
                    className={`text-sm px-3 py-2 rounded-lg flex items-center gap-2 ${
                      o.is_correct
                        ? 'bg-success/10 border border-success/30 text-success'
                        : 'bg-secondary/30 border border-border text-muted-foreground'
                    }`}
                  >
                    <span className="font-semibold">{optionLabels[oi]}.</span>
                    <span className="flex-1 truncate">{o.option_text}</span>
                    {o.is_correct && <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Launch button */}
        {!isLaunched && quiz.questions.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLaunch}
            disabled={launching}
            className="w-full inline-flex items-center justify-center gap-2 bg-success text-success-foreground font-bold py-4 rounded-xl text-base disabled:opacity-50 hover:opacity-90 transition"
          >
            <Rocket className="h-4 w-4" />
            {launching ? 'Launching...' : 'Launch Quiz'}
          </motion.button>
        )}

        {isLaunched && quiz.status === 'LIVE' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(`/quiz/admin/${quizId}/live`)}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-4 rounded-xl text-base hover:bg-primary/90 transition"
          >
            <Activity className="h-4 w-4" />
            Go to Live Console
          </motion.button>
        )}
      </div>
    </div>
  );
}
