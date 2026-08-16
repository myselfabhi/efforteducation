'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Play, Users, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuthStore, dashboardHomeFor } from '@/lib/stores/authStore';
import { getQuizSocket } from '@/lib/quizSocket';
import { api } from '@/lib/api';
import LeaderboardScreen from '@/app/quiz/components/LeaderboardScreen';

export default function LiveQuizDashboard() {
  const router = useRouter();
  const params = useParams();
  const quizId = Number(params.id);
  const { hydrate, isAuthenticated, hasHydrated, user } = useAuthStore();

  const [connected, setConnected] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [startLoading, setStartLoading] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
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
    if (!hasHydrated) return;
    if (!isAuthenticated || !user || !['admin', 'super_admin', 'teacher'].includes(user.role)) {
      router.push('/login');
      return;
    }

    api.quizzes.get(quizId).then((q) => setQuizTitle(q.title)).catch(() => {});

    const socket = getQuizSocket(quizId);

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('error', (err: { message: string }) => {
      setStartLoading(false);
      toast.error('Quiz error', { description: err.message });
    });

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

    socket.on('question:end', () => {
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
      socket.off('error');
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
  }, [hasHydrated, isAuthenticated, user, quizId, router, hydrate]);

  const handleStartQuiz = useCallback(() => {
    setStartLoading(true);
    const socket = getQuizSocket(quizId);
    socket.emit('quiz:start', { quizId });
    socket.once('quiz:starting', () => setStartLoading(false));
  }, [quizId]);

  const dashboardHref = user ? `${dashboardHomeFor(user.role)}/quizzes` : '/dashboard/admin/quizzes';

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">Live console</p>
            <h1 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">{quizTitle || 'Quiz'}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className={`inline-block w-2 h-2 rounded-full ${connected ? 'bg-success' : 'bg-destructive'}`} />
              <span className="text-sm text-muted-foreground">{connected ? 'Connected' : 'Disconnected'}</span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{participantCount} participants</span>
            </div>
          </div>
          <button
            onClick={() => router.push(dashboardHref)}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg border border-border bg-card text-sm font-semibold text-foreground hover:bg-secondary/40 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Dashboard
          </button>
        </div>

        {/* Lobby */}
        {phase === 'lobby' && !quizStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-card rounded-2xl border border-border"
          >
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Waiting for participants</h2>
            <p className="text-muted-foreground mb-8">{participantCount} joined so far</p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStartQuiz}
              disabled={startLoading}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-3 rounded-xl text-base disabled:opacity-70 hover:bg-primary/90 transition-colors"
            >
              {startLoading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                  Starting…
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Start Quiz Now
                </>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Question in progress */}
        {phase === 'question' && currentQuestion && (
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-primary/10 text-primary">
                Q{currentQuestion.questionIndex + 1}/{currentQuestion.totalQuestions}
              </span>
              <span className="text-success text-sm font-semibold">
                {answerCount}/{participantCount} answered
              </span>
            </div>
            <p className="text-foreground text-lg font-medium leading-relaxed">{currentQuestion.questionText}</p>
            <div className="mt-4 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-success rounded-full transition-all"
                style={{ width: `${participantCount > 0 ? (answerCount / participantCount) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        {/* Answer revealed */}
        {phase === 'answer' && (
          <div className="text-center py-10 bg-card rounded-2xl border border-border">
            <div className="mx-auto h-12 w-12 rounded-full bg-success/10 text-success flex items-center justify-center mb-3">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="text-foreground font-semibold">Answer revealed</p>
            <p className="text-muted-foreground text-sm mt-1">Leaderboard coming up…</p>
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
