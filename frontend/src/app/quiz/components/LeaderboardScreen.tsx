'use client';

import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/stores/authStore';

interface LeaderboardEntry {
  userId: number;
  username: string;
  totalScore: number;
  totalTimeMs: number;
  correctCount: number;
  rank: number;
}

interface LeaderboardScreenProps {
  leaderboard: LeaderboardEntry[];
  title?: string;
  isFinal?: boolean;
  questionIndex?: number;
  totalQuestions?: number;
}

const rankColors: Record<number, string> = {
  1: 'from-yellow-500 to-amber-400',
  2: 'from-gray-300 to-gray-400',
  3: 'from-orange-600 to-orange-500',
};

const rankEmojis: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

export default function LeaderboardScreen({
  leaderboard,
  title = 'Leaderboard',
  isFinal = false,
  questionIndex,
  totalQuestions,
}: LeaderboardScreenProps) {
  const { user } = useAuthStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        {isFinal ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <span className="text-5xl mb-4 block">🏆</span>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              Final Results
            </h2>
          </motion.div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            {questionIndex !== undefined && totalQuestions !== undefined && (
              <p className="text-gray-400 mt-1">
                After question {questionIndex + 1} of {totalQuestions}
              </p>
            )}
          </>
        )}
      </div>

      {/* Leaderboard entries */}
      <div className="space-y-3">
        {leaderboard.map((entry, index) => {
          const isCurrentUser = entry.userId === user?.id;
          const isTopThree = entry.rank <= 3;

          return (
            <motion.div
              key={entry.userId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                isCurrentUser
                  ? 'bg-purple-500/15 border-purple-500/40 ring-1 ring-purple-500/20'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              {/* Rank */}
              <div className="flex-shrink-0 w-12 text-center">
                {isTopThree ? (
                  <span className="text-2xl">{rankEmojis[entry.rank]}</span>
                ) : (
                  <span className="text-lg font-bold text-gray-400">#{entry.rank}</span>
                )}
              </div>

              {/* User info */}
              <div className="flex-1 min-w-0">
                <p className={`font-semibold truncate ${isCurrentUser ? 'text-purple-200' : 'text-white'}`}>
                  {entry.username}
                  {isCurrentUser && (
                    <span className="ml-2 text-xs bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full">
                      You
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-400">
                  {entry.correctCount} correct • {(entry.totalTimeMs / 1000).toFixed(1)}s total
                </p>
              </div>

              {/* Score */}
              <div className="flex-shrink-0 text-right">
                <p className={`text-xl font-bold ${
                  isTopThree
                    ? `bg-gradient-to-r ${rankColors[entry.rank] || 'from-white to-gray-200'} bg-clip-text text-transparent`
                    : 'text-white'
                }`}>
                  {entry.totalScore}
                </p>
                <p className="text-xs text-gray-500">points</p>
              </div>
            </motion.div>
          );
        })}

        {leaderboard.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p>No scores yet</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
