'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/authStore';

interface Quiz {
  id: number;
  title: string;
  description: string;
  status: string;
  questions: Array<{
    id: number;
    question_text: string;
    time_limit: number;
    order_index: number;
    options: Array<{ id: number; option_text: string; is_correct: boolean; option_index: number }>;
  }>;
}

export default function PreviewPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = Number(params.id);
  const { hydrate, isAuthenticated, user } = useAuthStore();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [launching, setLaunching] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { hydrate(); }, [hydrate]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/quiz/login');
      return;
    }
    loadQuiz();
  }, [isAuthenticated, user, router]);

  const loadQuiz = async () => {
    try {
      const data = await api.quizzes.get(quizId);
      setQuiz(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLaunch = async () => {
    setLaunching(true);
    setError('');
    try {
      await api.quizzes.launch(quizId);
      router.push(`/quiz/admin/${quizId}/live`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLaunching(false);
    }
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const isLaunched = quiz.status === 'LIVE' || quiz.status === 'COMPLETED';

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">{quiz.title}</h1>
            <p className="text-gray-400 text-sm mt-1">
              {quiz.questions.length} questions • Status: {quiz.status}
            </p>
          </div>
          <div className="flex gap-3">
            {!isLaunched && (
              <button
                onClick={() => router.push(`/quiz/admin/${quizId}/questions`)}
                className="bg-white/5 border border-white/10 text-gray-300 px-4 py-2.5 rounded-lg text-sm hover:bg-white/10 transition"
              >
                + Add Questions
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
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
              className="bg-white/5 border border-white/10 rounded-xl p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-medium">
                  Q{i + 1}
                </span>
                <span className="text-xs text-gray-500">{q.time_limit}s</span>
              </div>
              <p className="text-white font-medium mb-4">{q.question_text}</p>
              <div className="grid grid-cols-2 gap-2">
                {q.options.map((o, oi) => (
                  <div
                    key={o.id}
                    className={`text-sm px-3 py-2 rounded-lg ${
                      o.is_correct
                        ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                        : 'bg-white/5 border border-white/10 text-gray-400'
                    }`}
                  >
                    <span className="font-medium">{optionLabels[oi]}.</span> {o.option_text}
                    {o.is_correct && <span className="ml-2 text-emerald-400">✓</span>}
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
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 rounded-xl text-lg disabled:opacity-50 transition"
          >
            {launching ? 'Launching...' : '🚀 Launch Quiz'}
          </motion.button>
        )}

        {isLaunched && quiz.status === 'LIVE' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(`/quiz/admin/${quizId}/live`)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl text-lg"
          >
            🎯 Go to Live Dashboard
          </motion.button>
        )}
      </div>
    </div>
  );
}
