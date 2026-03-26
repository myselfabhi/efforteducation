'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/authStore';

interface AddedQuestion {
  id: number;
  question_text: string;
  time_limit: number;
  options: Array<{ id: number; option_text: string; is_correct: boolean }>;
}

export default function AddQuestionsPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = Number(params.id);
  const { hydrate, isAuthenticated, user } = useAuthStore();

  const [questions, setQuestions] = useState<AddedQuestion[]>([]);
  const [form, setForm] = useState({
    question_text: '',
    time_limit: 30,
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
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/quiz/login');
      return;
    }
    loadExisting();
  }, [isAuthenticated, user, router, loadExisting]);

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
        options: form.options,
      });
      setQuestions([...questions, q]);
      setForm({
        question_text: '',
        time_limit: 30,
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
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Add Questions</h1>
            <p className="text-gray-400 text-sm mt-1">{questions.length} questions added</p>
          </div>
          {questions.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(`/quiz/admin/${quizId}/preview`)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium px-5 py-2.5 rounded-lg text-sm"
            >
              Preview & Launch →
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
                className="bg-white/5 border border-white/10 rounded-xl p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="text-xs text-gray-500">Q{i + 1} • {q.time_limit}s</span>
                    <p className="text-white font-medium mt-1">{q.question_text}</p>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {q.options.map((o, oi) => (
                        <div
                          key={o.id}
                          className={`text-sm px-3 py-1.5 rounded-lg ${
                            o.is_correct
                              ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                              : 'bg-white/5 border border-white/10 text-gray-400'
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
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Question {questions.length + 1}
          </h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleAddQuestion} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Question Text</label>
              <textarea
                value={form.question_text}
                onChange={(e) => setForm({ ...form, question_text: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition resize-none"
                placeholder="Type your question here..."
                rows={2}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Time Limit (seconds)
              </label>
              <input
                type="number"
                value={form.time_limit}
                onChange={(e) => setForm({ ...form, time_limit: parseInt(e.target.value) || 30 })}
                className="w-32 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
                min={5}
                max={120}
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">
                Options (click radio to mark correct)
              </label>
              {form.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCorrectOption(i)}
                    className={`flex-shrink-0 w-10 h-10 rounded-lg font-bold flex items-center justify-center transition ${
                      opt.is_correct
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white/10 text-gray-400 hover:bg-white/20'
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
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
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
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Adding...' : '+ Add Question'}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}
