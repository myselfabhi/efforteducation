'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/stores/authStore';
import { getSocket } from '@/lib/socket';
import LeaderboardScreen from '@/app/quiz/components/LeaderboardScreen';
import { CheckCircle2, XCircle, Clock, AlertTriangle, Wifi, WifiOff } from 'lucide-react';

interface LeaderboardEntry {
  userId: number;
  username: string;
  totalScore: number;
  totalTimeMs: number;
  correctCount: number;
  rank: number;
}

type Phase = 'waiting' | 'question' | 'answer' | 'leaderboard' | 'completed';

interface QuestionData {
  questionId: number;
  questionIndex: number;
  totalQuestions: number;
  questionText: string;
  options: Array<{ id: number; option_text: string; option_index: number }>;
  timeLimit: number;
  startTime: number;
  endTime: number;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function QuizPlayScreen() {
  const router = useRouter();
  const params = useParams();
  const quizId = Number(params.id);
  const { hydrate, isAuthenticated, hasHydrated } = useAuthStore();

  const [phase, setPhase] = useState<Phase>('waiting');
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [correctOptionId, setCorrectOptionId] = useState<number | null>(null);
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [answerCount, setAnswerCount] = useState(0);
  const [participantCount, setParticipantCount] = useState(0);
  const [connection, setConnection] = useState<'live' | 'reconnecting' | 'offline'>('live');
  const [violationCount, setViolationCount] = useState(0);
  // 🔥 client-only streak — increments on consecutive correct answers, resets on wrong/skip.
  const [streak, setStreak] = useState(0);

  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const violationsRef = useRef(0);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Anti-cheat: tab visibility detection during the active question phase
  useEffect(() => {
    function onVisibilityChange() {
      if (document.visibilityState === 'visible') return;
      if (phaseRef.current !== 'question') return;
      const socket = getSocket();
      socket.emit('quiz:focus_lost', {
        quizId,
        questionId: question?.questionId,
      });
      const next = violationsRef.current + 1;
      violationsRef.current = next;
      setViolationCount(next);
      if (next === 1) {
        toast.warning('Tab switching detected', {
          description: 'One more strike will auto-submit your current question.',
        });
      } else if (next >= 2) {
        toast.error('Auto-submitted blank for this question', {
          description: 'Multiple focus losses detected.',
        });
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [quizId, question?.questionId]);

  // Anti-cheat: disable right-click on the play surface
  useEffect(() => {
    function onContext(e: MouseEvent) {
      if (phaseRef.current === 'question') e.preventDefault();
    }
    document.addEventListener('contextmenu', onContext);
    return () => document.removeEventListener('contextmenu', onContext);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const socket = getSocket();

    const onConnect = () => setConnection('live');
    const onDisconnect = () => setConnection('reconnecting');

    let offlineTimer: ReturnType<typeof setTimeout> | null = null;
    const onConnectError = () => {
      setConnection('reconnecting');
      if (offlineTimer) clearTimeout(offlineTimer);
      offlineTimer = setTimeout(() => setConnection('offline'), 5000);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);

    if (socket.connected) setConnection('live');
    socket.emit('quiz:join', { quizId });

    // If quiz hasn't started yet, go back to lobby instead of showing spinner forever
    socket.on('quiz:lobby', () => {
      router.push(`/quiz/${quizId}/lobby`);
    });

    socket.on('error', (err: { message: string }) => {
      toast.error('Quiz error', { description: err.message });
    });

    socket.on('question:start', (data: QuestionData) => {
      setQuestion(data);
      setPhase('question');
      setSelectedOptionId(null);
      setCorrectOptionId(null);
      setAlreadyAnswered(false);
      setAnswerCount(0);
    });

    socket.on('answer:accepted', (data) => {
      setSelectedOptionId(data.selectedOptionId);
      setAlreadyAnswered(true);
    });

    socket.on('answer:rejected', (data) => {
      toast.error('Answer rejected', { description: data.reason });
    });

    socket.on('answer:count', (data: { answerCount: number; participantCount: number }) => {
      setAnswerCount(data.answerCount);
      setParticipantCount(data.participantCount);
    });

    socket.on('question:end', (data) => {
      setCorrectOptionId(data.correctOptionId);
      setPhase('answer');
      // Streak update — compare your selection (state at the time of the listener
      // closure may be stale, so read via setter callback).
      setSelectedOptionId((sel) => {
        setStreak((s) => (sel != null && sel === data.correctOptionId ? s + 1 : 0));
        return sel;
      });
    });

    socket.on(
      'leaderboard:update',
      (data: { leaderboard: LeaderboardEntry[]; isLastQuestion: boolean }) => {
        setLeaderboard(data.leaderboard);
        setIsLastQuestion(data.isLastQuestion);
        setPhase('leaderboard');
      },
    );

    socket.on('quiz:end', (data) => {
      setLeaderboard(data.leaderboard);
      setPhase('completed');
    });

    socket.on('quiz:sync', (data) => {
      if (data.currentQuestion) {
        setQuestion(data.currentQuestion);
        setAlreadyAnswered(data.alreadyAnswered || false);
        setPhase('question');
      }
      if (data.leaderboard) setLeaderboard(data.leaderboard);
      if (data.state?.status === 'SHOWING_LEADERBOARD') {
        if (data.isLastQuestion !== undefined) setIsLastQuestion(data.isLastQuestion);
        setPhase('leaderboard');
      }
      if (data.state?.status === 'COMPLETED') setPhase('completed');
    });

    socket.on('quiz:completed', () => {
      router.push(`/quiz/${quizId}/results`);
    });

    return () => {
      if (offlineTimer) clearTimeout(offlineTimer);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('quiz:lobby');
      socket.off('error');
      socket.off('question:start');
      socket.off('answer:accepted');
      socket.off('answer:rejected');
      socket.off('answer:count');
      socket.off('question:end');
      socket.off('leaderboard:update');
      socket.off('quiz:end');
      socket.off('quiz:sync');
      socket.off('quiz:completed');
    };
  }, [hasHydrated, isAuthenticated, quizId, router]);

  const handleAnswer = useCallback(
    (optionId: number) => {
      if (alreadyAnswered || !question) return;
      setSelectedOptionId(optionId);
      setAlreadyAnswered(true); // optimistic lock
      const socket = getSocket();
      socket.emit('answer:submit', {
        quizId,
        questionId: question.questionId,
        selectedOptionId: optionId,
      });
    },
    [alreadyAnswered, question, quizId],
  );

  const progressPct = question
    ? ((question.questionIndex + 1) / question.totalQuestions) * 100
    : 0;

  return (
    <div
      className="min-h-screen bg-background select-none"
      style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
    >
      {/* Background flair */}
      <div aria-hidden className="fixed inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[460px] bg-gradient-to-b from-primary-soft/40 via-background/0 to-background" />
      </div>

      {/* Top header — progress + connection + answered count */}
      <header className="sticky top-0 z-20 bg-background/85 backdrop-blur border-b border-border/60">
        <div className="container mx-auto max-w-4xl px-6 py-3 flex items-center gap-4">
          <div className="flex-1 min-w-0">
            {question && phase !== 'completed' && (
              <>
                <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
                  <span>
                    Q
                    <span className="text-foreground tabular-nums">
                      {question.questionIndex + 1}
                    </span>{' '}
                    / {question.totalQuestions}
                  </span>
                  {phase === 'question' && participantCount > 0 && (
                    <span>
                      <span className="text-foreground tabular-nums">{answerCount}</span> /{' '}
                      {participantCount} answered
                    </span>
                  )}
                </div>
                <div className="mt-1.5 h-1 w-full rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {streak >= 2 && (
                <motion.span
                  key={streak}
                  initial={{ opacity: 0, scale: 0.6, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-1 rounded-full bg-warning/10 text-warning border border-warning/30 px-2.5 py-1 text-xs font-bold tabular-nums"
                  aria-label={`${streak} correct in a row`}
                >
                  🔥 {streak} in a row
                </motion.span>
              )}
            </AnimatePresence>
            {phase !== 'completed' && <ConnectionPill state={connection} />}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto max-w-3xl px-6 py-10">
        <AnimatePresence mode="wait">
          {/* Waiting */}
          {phase === 'waiting' && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="mx-auto h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <p className="mt-6 text-sm text-muted-foreground">
                Waiting for the next question…
              </p>
            </motion.div>
          )}

          {/* Question phase */}
          {phase === 'question' && question && (
            <motion.div
              key={`q-${question.questionId}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <CircularTimer
                key={`timer-${question.questionId}`}
                endTime={question.endTime}
                totalTime={question.timeLimit}
              />

              <h2 className="mt-8 text-2xl md:text-3xl font-bold tracking-tight leading-snug">
                {question.questionText}
              </h2>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                {question.options.map((opt, idx) => (
                  <OptionButton
                    key={opt.id}
                    label={OPTION_LABELS[idx]}
                    text={opt.option_text}
                    isSelected={selectedOptionId === opt.id}
                    isCorrect={null}
                    disabled={alreadyAnswered}
                    onClick={() => handleAnswer(opt.id)}
                  />
                ))}
              </div>

              {alreadyAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/30 text-success text-xs font-semibold"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Locked. Waiting for the timer.
                </motion.div>
              )}

              {violationCount === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/30 text-warning text-xs font-semibold"
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  One focus loss recorded. Stay on this tab.
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Answer reveal */}
          {phase === 'answer' && question && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ResultBanner
                state={
                  selectedOptionId == null
                    ? 'timeout'
                    : selectedOptionId === correctOptionId
                      ? 'correct'
                      : 'wrong'
                }
              />

              <h2 className="mt-6 text-2xl md:text-3xl font-bold tracking-tight leading-snug">
                {question.questionText}
              </h2>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                {question.options.map((opt, idx) => (
                  <OptionButton
                    key={opt.id}
                    label={OPTION_LABELS[idx]}
                    text={opt.option_text}
                    isSelected={selectedOptionId === opt.id}
                    isCorrect={
                      correctOptionId === opt.id
                        ? true
                        : selectedOptionId === opt.id
                          ? false
                          : null
                    }
                    disabled
                    onClick={() => {}}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Leaderboard */}
          {phase === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <LeaderboardScreen
                leaderboard={leaderboard}
                questionIndex={question?.questionIndex}
                totalQuestions={question?.totalQuestions}
              />
              {!isLastQuestion && (
                <p className="mt-6 text-center text-xs uppercase tracking-widest text-muted-foreground font-semibold animate-pulse">
                  Next question coming up…
                </p>
              )}
            </motion.div>
          )}

          {/* Completed */}
          {phase === 'completed' && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <LeaderboardScreen leaderboard={leaderboard} isFinal />
              <div className="text-center">
                <button
                  onClick={() => router.push(`/quiz/${quizId}/results`)}
                  className="group inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  View detailed results
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function ConnectionPill({ state }: { state: 'live' | 'reconnecting' | 'offline' }) {
  const cfg = {
    live: {
      icon: Wifi,
      label: 'Live',
      bg: 'bg-success/10',
      text: 'text-success',
      border: 'border-success/30',
      pulse: true,
    },
    reconnecting: {
      icon: Wifi,
      label: 'Reconnecting',
      bg: 'bg-warning/10',
      text: 'text-warning',
      border: 'border-warning/30',
      pulse: true,
    },
    offline: {
      icon: WifiOff,
      label: 'Offline',
      bg: 'bg-destructive/10',
      text: 'text-destructive',
      border: 'border-destructive/30',
      pulse: false,
    },
  }[state];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] uppercase tracking-widest font-semibold ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      <Icon className={`h-3 w-3 ${cfg.pulse ? 'animate-pulse' : ''}`} strokeWidth={2.4} />
      {cfg.label}
    </span>
  );
}

function CircularTimer({ endTime, totalTime }: { endTime: number; totalTime: number }) {
  const [remaining, setRemaining] = useState(totalTime);
  const [pct, setPct] = useState(100);

  useEffect(() => {
    const tick = () => {
      const ms = Math.max(0, endTime - Date.now());
      setRemaining(Math.ceil(ms / 1000));
      setPct(Math.max(0, (ms / (totalTime * 1000)) * 100));
    };
    tick();
    const t = setInterval(tick, 100);
    return () => clearInterval(t);
  }, [endTime, totalTime]);

  const r = 28;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct / 100);
  const color =
    pct > 60 ? 'text-success' : pct > 30 ? 'text-warning' : 'text-destructive';
  const urgent = remaining <= 5;

  return (
    <div className="flex items-center gap-4">
      <div className={`relative h-16 w-16 shrink-0 ${urgent ? 'animate-pulse' : ''}`}>
        <svg
          aria-hidden
          viewBox="0 0 64 64"
          className={`h-16 w-16 -rotate-90 ${color} transition-colors`}
        >
          <circle
            cx="32"
            cy="32"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.15"
            strokeWidth="5"
          />
          <circle
            cx="32"
            cy="32"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.1s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            key={remaining}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className={`text-xl font-bold tabular-nums ${color}`}
          >
            {remaining}
          </motion.span>
        </div>
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
          Time left
        </div>
        <div className="mt-0.5 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" /> Tap an option to lock your answer
        </div>
      </div>
    </div>
  );
}

function ResultBanner({ state }: { state: 'correct' | 'wrong' | 'timeout' }) {
  const cfg = {
    correct: {
      icon: CheckCircle2,
      label: 'Correct!',
      bg: 'bg-success/10',
      text: 'text-success',
      border: 'border-success/30',
    },
    wrong: {
      icon: XCircle,
      label: 'Not quite',
      bg: 'bg-destructive/10',
      text: 'text-destructive',
      border: 'border-destructive/30',
    },
    timeout: {
      icon: Clock,
      label: "Time's up — 0 pts",
      bg: 'bg-secondary',
      text: 'text-muted-foreground',
      border: 'border-border',
    },
  }[state];
  const Icon = cfg.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border} text-sm font-semibold`}
    >
      <Icon className="h-4 w-4" strokeWidth={2.2} />
      {cfg.label}
    </motion.div>
  );
}

function OptionButton({
  label,
  text,
  isSelected,
  isCorrect,
  disabled,
  onClick,
}: {
  label: string;
  text: string;
  isSelected: boolean;
  isCorrect: boolean | null;
  disabled: boolean;
  onClick: () => void;
}) {
  const stateClass =
    isCorrect === true
      ? 'border-success/60 bg-success/10 text-success-foreground'
      : isCorrect === false
        ? 'border-destructive/60 bg-destructive/10 text-destructive-foreground line-through opacity-80'
        : isSelected
          ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
          : 'border-border bg-card hover:border-primary/40 hover:bg-secondary/40';

  return (
    <motion.button
      whileTap={!disabled ? { scale: 0.985 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`group flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition-colors ${stateClass} ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      <span
        className={`flex-shrink-0 h-9 w-9 rounded-lg flex items-center justify-center text-sm font-bold ${
          isCorrect === true
            ? 'bg-success/20 text-success'
            : isCorrect === false
              ? 'bg-destructive/20 text-destructive'
              : isSelected
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground'
        }`}
      >
        {label}
      </span>
      <span className="text-base font-medium leading-relaxed">{text}</span>
    </motion.button>
  );
}
