'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/stores/authStore';
import { getQuizSocket } from '@/lib/quizSocket';
import { api } from '@/lib/api';
import QuizFooter from '@/app/quiz/components/QuizFooter';
import {
  Clock,
  Lock,
  Zap,
  EyeOff,
  RotateCcw,
  Wifi,
  MessageSquareOff,
  CheckCircle2,
  Users,
  HelpCircle,
} from 'lucide-react';

const RULES = [
  {
    icon: Clock,
    title: '30 seconds per question',
    body: 'The class moves together. Every student sees each question for the same time window.',
    accent: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Lock,
    title: 'Tap to lock',
    body: 'First tap is your final answer. No second chances.',
    accent: 'text-info',
    bg: 'bg-info/10',
  },
  {
    icon: Zap,
    title: 'Speed bonus',
    body: 'Right answer + faster = more points. Wrong or late = 0.',
    accent: 'text-warning',
    bg: 'bg-warning/10',
  },
  {
    icon: EyeOff,
    title: 'Stay focused',
    body: 'Leaving this tab during a question forfeits that question. Two strikes auto-submit blank.',
    accent: 'text-destructive',
    bg: 'bg-destructive/10',
  },
  {
    icon: RotateCcw,
    title: 'One attempt only',
    body: 'No retakes once the quiz starts.',
    accent: 'text-muted-foreground',
    bg: 'bg-secondary',
  },
  {
    icon: Wifi,
    title: 'Network hiccups handled',
    body: "Lost internet? We'll reconnect you. Questions you missed offline = 0 pts.",
    accent: 'text-success',
    bg: 'bg-success/10',
  },
  {
    icon: MessageSquareOff,
    title: 'No chat during the quiz',
    body: 'Talk in the batch channel after.',
    accent: 'text-muted-foreground',
    bg: 'bg-secondary',
  },
];

export default function QuizLobby() {
  const router = useRouter();
  const params = useParams();
  const quizId = Number(params.id);
  const { hydrate, isAuthenticated, hasHydrated, user } = useAuthStore();

  const [participantCount, setParticipantCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [readyChecked, setReadyChecked] = useState(false);
  const [showFormula, setShowFormula] = useState(false);

  // Restore ready-checkbox from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`quiz_ready_${quizId}`);
    if (saved === '1') setReadyChecked(true);
  }, [quizId]);

  const { data: quiz } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: () => api.quizzes.get(quizId),
    enabled: Number.isFinite(quizId),
  });

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const socket = getQuizSocket(quizId);

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onError = (err: { message: string }) => toast.error('Quiz error', { description: err.message });
    const onLobby = (data: { participantCount: number }) => setParticipantCount(data.participantCount);
    const onParticipant = (data: { participantCount: number }) => setParticipantCount(data.participantCount);
    const onStarting = (data: { startsIn: number }) => {
      let count = data.startsIn;
      setCountdown(count);
      const interval = setInterval(() => {
        count -= 1;
        setCountdown(count);
        if (count <= 0) clearInterval(interval);
      }, 1000);
    };
    const onQuestion = () => router.push(`/quiz/${quizId}/play`);
    const onSync = () => router.push(`/quiz/${quizId}/play`);
    const onCompleted = () => router.push(`/quiz/${quizId}/results`);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('error', onError);
    socket.on('quiz:lobby', onLobby);
    socket.on('participant:joined', onParticipant);
    socket.on('quiz:starting', onStarting);
    socket.on('question:start', onQuestion);
    socket.on('quiz:sync', onSync);
    socket.on('quiz:completed', onCompleted);

    if (socket.connected) setConnected(true);
    socket.emit('quiz:join', { quizId });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('error', onError);
      socket.off('quiz:lobby', onLobby);
      socket.off('participant:joined', onParticipant);
      socket.off('quiz:starting', onStarting);
      socket.off('question:start', onQuestion);
      socket.off('quiz:sync', onSync);
      socket.off('quiz:completed', onCompleted);
    };
  }, [hasHydrated, isAuthenticated, quizId, router]);

  const totalQuestions = quiz?.questions?.length ?? quiz?.question_count ?? 0;
  const totalSeconds = quiz?.questions?.reduce((s, q) => s + (q.time_limit ?? 30), 0) ?? totalQuestions * 30;

  return (
    <div className="min-h-screen bg-background">
      {/* Background flair */}
      <div aria-hidden className="fixed inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[460px] bg-gradient-to-b from-primary-soft/40 via-background/0 to-background" />
        <div className="absolute top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      {/* Countdown overlay */}
      <AnimatePresence>
        {countdown !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/85 backdrop-blur-md"
          >
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
              Quiz starts in
            </p>
            <motion.div
              key={countdown}
              initial={{ scale: 1.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-[140px] sm:text-[200px] font-black leading-none bg-gradient-to-br from-primary via-primary-strong to-primary bg-clip-text text-transparent"
            >
              {countdown !== null && countdown > 0 ? countdown : 'Go!'}
            </motion.div>
            <p className="mt-6 max-w-md text-center text-muted-foreground">
              Take a breath. Read every option. Trust your prep.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto max-w-6xl px-6 pt-24 pb-16">
        {/* Top status row */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border/60 text-xs ${
              connected ? 'text-success' : 'text-destructive'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full rounded-full ${
                  connected ? 'bg-success/40 animate-ping' : 'bg-destructive/50'
                }`}
              />
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  connected ? 'bg-success' : 'bg-destructive'
                }`}
              />
            </span>
            {connected ? 'Connected · ready' : 'Reconnecting…'}
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-border/60 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span className="font-semibold text-foreground">{participantCount}</span>
            in lobby
          </div>
          {user?.username && (
            <div className="ml-auto text-xs text-muted-foreground">
              Signed in as <span className="font-semibold text-foreground">{user.username}</span>
            </div>
          )}
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left — quiz meta */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl border border-border bg-card p-8"
            >
              <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">
                Live quiz · waiting room
              </p>
              <h1 className="mt-2 text-3xl md:text-4xl font-black tracking-tight leading-[1.1]">
                {quiz?.title ?? 'Loading quiz…'}
              </h1>
              {quiz?.description && (
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {quiz.description}
                </p>
              )}

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-secondary/30 p-3">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                    Questions
                  </div>
                  <div className="mt-0.5 text-xl font-bold tabular-nums">
                    {totalQuestions || '—'}
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-secondary/30 p-3">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                    Est. duration
                  </div>
                  <div className="mt-0.5 text-xl font-bold tabular-nums">
                    {totalSeconds ? `${Math.ceil(totalSeconds / 60)} min` : '—'}
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-secondary/30 p-3 col-span-2">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                    Faculty
                  </div>
                  <div className="mt-0.5 text-base font-semibold">
                    {quiz?.creator_name ?? '—'}
                  </div>
                </div>
              </div>

              {/* Ready toggle */}
              <button
                type="button"
                onClick={() => {
                  const next = !readyChecked;
                  setReadyChecked(next);
                  localStorage.setItem(`quiz_ready_${quizId}`, next ? '1' : '0');
                }}
                className={`mt-6 w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl border text-sm font-semibold transition-all ${
                  readyChecked
                    ? 'bg-success/10 text-success border-success/30'
                    : 'bg-card text-foreground border-border hover:border-primary/40'
                }`}
              >
                {readyChecked ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    You&rsquo;re ready
                  </>
                ) : (
                  <>I&rsquo;ve read the rules</>
                )}
              </button>
              <p className="mt-2 text-xs text-muted-foreground text-center">
                The host will start the quiz when everyone is ready.
              </p>
            </motion.div>

            {/* Participant avatars */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="rounded-3xl border border-border bg-card p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
                  Joined
                </p>
                <span className="text-xs font-semibold text-foreground">
                  {participantCount}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: Math.min(participantCount, 24) }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.03, duration: 0.25 }}
                    className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/30 to-info/30 border-2 border-card text-xs font-bold flex items-center justify-center text-foreground/80"
                  >
                    {String.fromCharCode(65 + (i % 26))}
                  </motion.div>
                ))}
                {participantCount > 24 && (
                  <div className="h-9 px-3 rounded-full bg-secondary border-2 border-card text-xs font-bold flex items-center justify-center text-muted-foreground">
                    +{participantCount - 24}
                  </div>
                )}
                {participantCount === 0 && (
                  <p className="text-sm text-muted-foreground">No one yet — be the first.</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right — rules card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-7 rounded-3xl border border-border bg-card p-8 lg:p-10"
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">
                  Rules of engagement
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  Read this once. Play with confidence.
                </h2>
              </div>
            </div>

            <ol className="space-y-3">
              {RULES.map((r, i) => {
                const Icon = r.icon;
                return (
                  <motion.li
                    key={r.title}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.04, duration: 0.3 }}
                    className="flex items-start gap-4 rounded-2xl border border-border/60 bg-secondary/20 p-4"
                  >
                    <div
                      className={`h-9 w-9 shrink-0 rounded-lg ${r.bg} ${r.accent} flex items-center justify-center`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={2.2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold tabular-nums">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <h3 className="text-sm font-bold tracking-tight">{r.title}</h3>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                        {r.body}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </ol>

            {/* Speed-bonus formula tooltip */}
            <div className="mt-5 pt-5 border-t border-border">
              <button
                type="button"
                onClick={() => setShowFormula((v) => !v)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                Why does my score depend on speed?
              </button>
              <AnimatePresence initial={false}>
                {showFormula && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 rounded-xl bg-secondary/40 border border-border/60 p-4 text-xs">
                      <code className="font-mono text-foreground">
                        points = base + ⌈base × remainingMs / totalMs⌉
                      </code>
                      <p className="mt-2 text-muted-foreground leading-relaxed">
                        A correct answer at the buzzer = base only. A correct answer in the first
                        second = up to 2× base. The formula rewards confident, fast recall.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Waiting for the host to start the quiz…
        </p>
      </div>

      <QuizFooter />
    </div>
  );
}
