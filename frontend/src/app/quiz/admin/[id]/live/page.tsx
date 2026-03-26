'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/stores/authStore';
import { getSocket } from '@/lib/socket';
import LeaderboardScreen from '@/app/quiz/components/LeaderboardScreen';

export default function LiveQuizDashboard() {
  const router = useRouter();
  const params = useParams();
  const quizId = Number(params.id);
  const { hydrate, isAuthenticated, user } = useAuthStore();

  const [connected, setConnected] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<{
    questionText: string;
    questionIndex: number;
    totalQuestions: number;
  } | null>(null);
  const [answerCount, setAnswerCount] = useState(0);
  const [leaderboard, setLeaderboard] = useState<Array<{
    userId: number;
    username: string;
    totalScore: number;
    totalTimeMs: number;
    correctCount: number;
    rank: number;
  }>>([]);
  const [phase, setPhase] = useState<'lobby' | 'question' | 'answer' | 'leaderboard' | 'completed'>('lobby');

  useEffect(() => { hydrate(); }, [hydrate]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/quiz/login');
      return;
    }

    const socket = getSocket();

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.emit('quiz:join', { quizId });

    socket.on('participant:joined', (data) => {
      setParticipantCount(data.participantCount);
    });

    socket.on('quiz:lobby', (data) => {
      setParticipantCount(data.participantCount);
    });

    socket.on('quiz:starting', () => {
      setQuizStarted(true);
    });

    socket.on('question:start', (data) => {
      setCurrentQuestion(data);
      setPhase('question');
      setAnswerCount(0);
    });

    socket.on('answer:count', (data) => {
      setAnswerCount(data.answerCount);
    });

    socket.on('question:end', (data) => {
      setPhase('answer');
    });

    socket.on('leaderboard:update', (data) => {
      setLeaderboard(data.leaderboard);
      setPhase('leaderboard');
    });

    socket.on('quiz:end', (data) => {
      setLeaderboard(data.leaderboard);
      setPhase('completed');
    });

    socket.on('quiz:sync', (data) => {
      if (data.leaderboard) setLeaderboard(data.leaderboard);
      if (data.state) {
        if (data.state.status === 'IN_PROGRESS') setPhase('question');
        if (data.state.status === 'SHOWING_LEADERBOARD') setPhase('leaderboard');
        if (data.state.status === 'COMPLETED') setPhase('completed');
      }
      if (data.currentQuestion) setCurrentQuestion(data.currentQuestion);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('participant:joined');
      socket.off('quiz:lobby');
      socket.off('quiz:starting');
      socket.off('question:start');
      socket.off('answer:count');
      socket.off('question:end');
      socket.off('leaderboard:update');
      socket.off('quiz:end');
      socket.off('quiz:sync');
    };
  }, [isAuthenticated, user, quizId, router, hydrate]);

  const handleStartQuiz = useCallback(() => {
    const socket = getSocket();
    socket.emit('quiz:start', { quizId });
  }, [quizId]);

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Live Dashboard</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className={`inline-block w-2 h-2 rounded-full ${connected ? 'bg-emerald-400' : 'bg-red-400'}`} />
              <span className="text-sm text-gray-400">{connected ? 'Connected' : 'Disconnected'}</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-400">{participantCount} participants</span>
            </div>
          </div>
          <button
            onClick={() => router.push('/quiz/dashboard')}
            className="bg-white/5 border border-white/10 text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition"
          >
            ← Dashboard
          </button>
        </div>

        {/* Lobby */}
        {phase === 'lobby' && !quizStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white/5 rounded-2xl border border-white/10"
          >
            <div className="text-5xl mb-4">👥</div>
            <h2 className="text-xl font-bold text-white mb-2">Waiting for participants</h2>
            <p className="text-gray-400 mb-8">{participantCount} joined so far</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartQuiz}
              disabled={participantCount === 0}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold px-8 py-3 rounded-xl text-lg disabled:opacity-50"
            >
              ▶ Start Quiz Now
            </motion.button>
          </motion.div>
        )}

        {/* Question in progress */}
        {phase === 'question' && currentQuestion && (
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                Q{currentQuestion.questionIndex + 1}/{currentQuestion.totalQuestions}
              </span>
              <span className="text-emerald-400 text-sm font-medium">
                {answerCount}/{participantCount} answered
              </span>
            </div>
            <p className="text-white text-lg font-medium">{currentQuestion.questionText}</p>
            <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${participantCount > 0 ? (answerCount / participantCount) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        {/* Answer revealed */}
        {phase === 'answer' && (
          <div className="text-center py-8 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-white font-medium">Answer revealed</p>
            <p className="text-gray-400 text-sm mt-1">Leaderboard coming up...</p>
          </div>
        )}

        {/* Leaderboard */}
        {(phase === 'leaderboard' || phase === 'completed') && (
          <LeaderboardScreen
            leaderboard={leaderboard}
            isFinal={phase === 'completed'}
            questionIndex={currentQuestion?.questionIndex}
            totalQuestions={currentQuestion?.totalQuestions}
          />
        )}
      </div>
    </div>
  );
}
