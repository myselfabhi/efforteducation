'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/authStore';

interface Quiz {
  id: number;
  title: string;
  description: string;
  status: string;
  question_count: string;
  creator_name: string;
  scheduled_at: string | null;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, hydrate, isAuthenticated, logout } = useAuthStore();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/quiz/login');
      return;
    }
    fetchQuizzes();
  }, [isAuthenticated, router]);

  const fetchQuizzes = async () => {
    try {
      const data = await api.quizzes.list();
      setQuizzes(data);
    } catch (err) {
      console.error('Failed to fetch quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
      UPCOMING: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      LIVE: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 animate-pulse',
      COMPLETED: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    };
    return colors[status] || colors.DRAFT;
  };

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Quiz Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome, {user?.username}</p>
          </div>
          <div className="flex items-center gap-3">
            {user?.role === 'admin' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/quiz/admin/create')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium px-5 py-2.5 rounded-lg text-sm"
              >
                + Create Quiz
              </motion.button>
            )}
            <button
              onClick={() => { logout(); router.push('/quiz/login'); }}
              className="bg-white/5 border border-white/10 text-gray-300 hover:text-white px-4 py-2.5 rounded-lg text-sm transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Quiz list */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-gray-400 text-lg">No quizzes available</p>
            {user?.role === 'admin' && (
              <button
                onClick={() => router.push('/quiz/admin/create')}
                className="mt-4 text-purple-400 hover:text-purple-300 text-sm"
              >
                Create your first quiz →
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {quizzes.map((quiz, index) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/[0.07] transition cursor-pointer"
                onClick={() => {
                  if (quiz.status === 'LIVE') {
                    router.push(`/quiz/${quiz.id}/lobby`);
                  } else if (quiz.status === 'COMPLETED') {
                    router.push(`/quiz/${quiz.id}/results`);
                  } else if (user?.role === 'admin') {
                    router.push(`/quiz/admin/${quiz.id}/preview`);
                  }
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{quiz.title}</h3>
                    {quiz.description && (
                      <p className="text-gray-400 text-sm mt-1 line-clamp-2">{quiz.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span>{quiz.question_count} questions</span>
                      <span>By {quiz.creator_name}</span>
                    </div>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(quiz.status)}`}>
                    {quiz.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
