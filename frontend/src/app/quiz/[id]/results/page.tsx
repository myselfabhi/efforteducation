'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/authStore';
import LeaderboardScreen from '@/app/quiz/components/LeaderboardScreen';

interface ScoreData {
  total_score: number;
  total_time_ms: number;
  rank: number;
}

interface ResponseData {
  question_text: string;
  selected_option: string;
  is_correct: boolean;
  response_time_ms: number;
  score: number;
}

interface LeaderboardEntry {
  userId: number;
  username: string;
  totalScore: number;
  totalTimeMs: number;
  correctCount: number;
  rank: number;
}

export default function ResultsPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = Number(params.id);
  const { hydrate, isAuthenticated, user } = useAuthStore();

  const [score, setScore] = useState<ScoreData | null>(null);
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { hydrate(); }, [hydrate]);

  const loadResults = useCallback(async () => {
    try {
      const [resultData, leaderboardData] = await Promise.all([
        api.quizzes.results(quizId),
        api.quizzes.leaderboard(quizId),
      ]);
      setScore(resultData.score);
      setResponses(resultData.responses);
      setLeaderboard(leaderboardData.map((entry: { user_id: number; total_score: number; total_time_ms: number; rank?: number; username: string }, i: number) => ({
        userId: entry.user_id,
        username: entry.username,
        totalScore: entry.total_score,
        totalTimeMs: entry.total_time_ms,
        rank: entry.rank || i + 1,
        correctCount: 0,
      })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/quiz/login');
      return;
    }
    loadResults();
  }, [isAuthenticated, router, loadResults]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Score summary */}
        {score && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/20 rounded-2xl p-8 text-center"
          >
            <h1 className="text-2xl font-bold text-white mb-4">Your Results</h1>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                  #{score.rank}
                </p>
                <p className="text-gray-400 text-sm mt-1">Rank</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-white">{score.total_score}</p>
                <p className="text-gray-400 text-sm mt-1">Points</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-emerald-400">
                  {(score.total_time_ms / 1000).toFixed(1)}s
                </p>
                <p className="text-gray-400 text-sm mt-1">Total Time</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Response breakdown */}
        {responses.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Question Breakdown</h2>
            <div className="space-y-3">
              {responses.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`bg-white/5 border rounded-xl p-4 ${
                    r.is_correct ? 'border-emerald-500/30' : 'border-red-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-400">Q{i + 1}</p>
                      <p className="text-white font-medium mt-1">{r.question_text}</p>
                      <p className="text-sm mt-2">
                        <span className="text-gray-400">Your answer: </span>
                        <span className={r.is_correct ? 'text-emerald-300' : 'text-red-300'}>
                          {r.selected_option || 'No answer'}
                        </span>
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className={`text-lg font-bold ${r.is_correct ? 'text-emerald-400' : 'text-red-400'}`}>
                        +{r.score}
                      </p>
                      <p className="text-xs text-gray-500">{(r.response_time_ms / 1000).toFixed(1)}s</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Full leaderboard */}
        {leaderboard.length > 0 && (
          <LeaderboardScreen leaderboard={leaderboard} isFinal={true} />
        )}

        {/* Back button */}
        <div className="text-center">
          <button
            onClick={() => router.push('/quiz/dashboard')}
            className="bg-white/5 border border-white/10 text-gray-300 px-6 py-3 rounded-xl hover:bg-white/10 transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
