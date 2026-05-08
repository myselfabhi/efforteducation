'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/authStore';

interface AddedQuestion {
  id: number;
  question_text: string;
  time_limit: number;
  options: Array<{ id: number; option_text: string; is_correct?: boolean }>;
}

export default function AddQuestionsPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = Number(params.id);
  const { hydrate, isAuthenticated, hasHydrated, user } = useAuthStore();

  const [questions, setQuestions] = useState<AddedQuestion[]>([]);
  const [form, setForm] = useState({
    question_text: '',
    time_limit: 30,
    explanation: '',
    options: [
      { option_text: '', is_correct: true },
      { option_text: '', is_correct: false },
      { option_text: '', is_correct: false },
      { option_text: '', is_correct: false },
    ],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadExisting = useCallback(async () => {
    try {
      const quiz = await api.quizzes.get(quizId);
      if (quiz.questions) setQuestions(quiz.questions);
    } catch (err) {
      console.error(err);
    }
  }, [quizId]);

  useEffect(() => { hydrate(); }, [hydrate]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated || !user || !['admin', 'super_admin', 'teacher'].includes(user.role)) {
      router.push('/login');
      return;
    }
    loadExisting();
  }, [hasHydrated, isAuthenticated, user, router, loadExisting]);

  const setCorrectOption = (index: number) => {
    setForm({
      ...form,
      options: form.options.map((o, i) => ({ ...o, is_correct: i === index })),
    });
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.options.some((o) => !o.option_text.trim())) {
      setError('All 4 options are required');
      return;
    }

    setLoading(true);
    try {
      const q = await api.quizzes.addQuestion(quizId, {
        question_text: form.question_text,
        time_limit: form.time_limit,
        explanation: form.explanation.trim() || undefined,
        options: form.options,
      });
      setQuestions([...questions, q]);
      setForm({
        question_text: '',
        time_limit: 30,
        explanation: '',
        options: [
          { option_text: '', is_correct: true },
          { option_text: '', is_correct: false },
          { option_text: '', is_correct: false },
          { option_text: '', is_correct: false },
        ],
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Add Questions</h1>
            <p className="text-muted-foreground text-sm mt-1">{questions.length} questions added</p>
          </div>
          {questions.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(`/quiz/admin/${quizId}/preview`)}
              className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-primary/90 transition"
            >
              Preview & Launch
              <ArrowRight className="h-3.5 w-3.5" />
            </motion.button>
          )}
        </div>

        {/* Existing questions */}
        {questions.length > 0 && (
          <div className="space-y-3 mb-8">
            {questions.map((q, i) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="text-xs text-muted-foreground">Q{i + 1} • {q.time_limit}s</span>
                    <p className="text-foreground font-medium mt-1 leading-relaxed">{q.question_text}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                      {q.options.map((o, oi) => (
                        <div
                          key={o.id}
                          className={`text-sm px-3 py-1.5 rounded-lg ${
                            o.is_correct
                              ? 'bg-success/10 border border-success/30 text-success'
                              : 'bg-secondary/30 border border-border text-muted-foreground'
                          }`}
                        >
                          {optionLabels[oi]}. {o.option_text}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add question form */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-semibold tracking-tight text-foreground mb-4">
            Question {questions.length + 1}
          </h2>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleAddQuestion} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Question Text</label>
              <textarea
                value={form.question_text}
                onChange={(e) => setForm({ ...form, question_text: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition resize-none"
                placeholder="Type your question here..."
                rows={2}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Time Limit (seconds)
              </label>
              <input
                type="number"
                value={form.time_limit}
                onChange={(e) => setForm({ ...form, time_limit: parseInt(e.target.value) || 30 })}
                className="w-32 bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
                min={5}
                max={120}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Explanation <span className="text-muted-foreground font-normal">(optional, shown on results page)</span>
              </label>
              <textarea
                value={form.explanation}
                onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition resize-none"
                placeholder="Why is this the correct answer? (helps students learn from the question)"
                rows={3}
                maxLength={2000}
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">
                Options (click radio to mark correct)
              </label>
              {form.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCorrectOption(i)}
                    className={`flex-shrink-0 w-10 h-10 rounded-lg font-bold flex items-center justify-center transition ${
                      opt.is_correct
                        ? 'bg-success text-success-foreground'
                        : 'bg-secondary text-muted-foreground hover:bg-secondary/70'
                    }`}
                  >
                    {optionLabels[i]}
                  </button>
                  <input
                    type="text"
                    value={opt.option_text}
                    onChange={(e) => {
                      const newOptions = [...form.options];
                      newOptions[i] = { ...newOptions[i], option_text: e.target.value };
                      setForm({ ...form, options: newOptions });
                    }}
                    className="flex-1 bg-background border border-border rounded-lg px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
                    placeholder={`Option ${optionLabels[i]}`}
                    required
                  />
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-1.5 bg-primary text-primary-foreground font-semibold py-3 rounded-lg disabled:opacity-50 hover:bg-primary/90 transition"
            >
              <Plus className="h-4 w-4" />
              {loading ? 'Adding...' : 'Add Question'}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}
