'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { api, type QuizResponseRow, type QuizScore } from '@/lib/api';
import { useAuthStore, dashboardHomeFor } from '@/lib/stores/authStore';
import QuizFooter from '@/app/quiz/components/QuizFooter';
import {
  Trophy,
  Target,
  Clock,
  ArrowLeft,
  Share2,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface LeaderboardEntry {
  user_id: number;
  username: string;
  total_score: number;
  total_time_ms: number;
  rank: number | null;
}

const PODIUM_GRADIENTS = [
  'from-amber-300 to-yellow-500', // 1
  'from-slate-300 to-slate-500', // 2
  'from-orange-300 to-orange-500', // 3
];

export default function ResultsPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = Number(params.id);
  const { hydrate, isAuthenticated, hasHydrated, user } = useAuthStore();

  const [score, setScore] = useState<QuizScore | null>(null);
  const [responses, setResponses] = useState<QuizResponseRow[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openExplanations, setOpenExplanations] = useState<Set<number>>(new Set());

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const loadResults = useCallback(async () => {
    try {
      const [resultData, leaderboardData] = await Promise.all([
        api.quizzes.results(quizId),
        api.quizzes.leaderboard(quizId),
      ]);
      setScore(resultData.score);
      setResponses(resultData.responses);
      setTotalQuestions(resultData.total_questions ?? resultData.responses.length);
      setLeaderboard(leaderboardData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadResults();
  }, [hasHydrated, isAuthenticated, router, loadResults]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // Student who never participated (no score, no responses)
  if (!score && responses.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 px-6 text-center">
        <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
          <Trophy className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">No results yet</h2>
          <p className="mt-2 text-muted-foreground">
            You didn&apos;t participate in this quiz or results haven&apos;t been saved yet.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => router.push(user ? `${dashboardHomeFor(user.role)}/quizzes` : '/login')}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-border bg-card text-sm font-semibold hover:bg-secondary/40 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  const correctCount = responses.filter((r) => r.is_correct).length;
  const denominator = totalQuestions || responses.length;
  const accuracy = denominator ? Math.round((correctCount / denominator) * 100) : 0;
  const avgMs = responses.length
    ? Math.round(responses.reduce((s, r) => s + r.response_time_ms, 0) / responses.length)
    : 0;
  const totalParticipants = leaderboard.length;
  const podium = leaderboard.slice(0, 3);

  function shareToWhatsApp() {
    const text = score
      ? `I scored ${score.total_score} pts and ranked #${score.rank} of ${totalParticipants} on Effort Education's live quiz! 🎯`
      : 'I just took a quiz on Effort Education!';
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function toggleExplanation(idx: number) {
    setOpenExplanations((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div aria-hidden className="fixed inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[460px] bg-gradient-to-b from-primary-soft/40 via-background/0 to-background" />
        <div className="absolute top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="container mx-auto max-w-4xl px-6 pt-16 pb-20">
        {/* Hero — score summary */}
        {score && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-border bg-gradient-to-br from-primary-soft/50 via-card to-card p-8 md:p-10"
          >
            <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">
              Quiz complete
            </p>
            <h1 className="mt-2 text-3xl md:text-4xl font-black tracking-tight">
              Nice work, {user?.full_name?.split(' ')[0] ?? user?.username ?? 'aspirant'}.
            </h1>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
              <Stat
                icon={Trophy}
                label="Rank"
                value={`#${score.rank}`}
                hint={`of ${totalParticipants}`}
                accent="text-warning"
                bg="bg-warning/10"
              />
              <Stat
                icon={Sparkles}
                label="Points"
                value={score.total_score.toLocaleString()}
                accent="text-primary"
                bg="bg-primary/10"
              />
              <Stat
                icon={Target}
                label="Accuracy"
                value={`${accuracy}%`}
                hint={`${correctCount}/${denominator} correct`}
                accent="text-success"
                bg="bg-success/10"
              />
              <Stat
                icon={Clock}
                label="Avg time"
                value={`${(avgMs / 1000).toFixed(1)}s`}
                accent="text-info"
                bg="bg-info/10"
              />
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              <button
                onClick={shareToWhatsApp}
                className="group inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-success text-success-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <Share2 className="h-3.5 w-3.5" />
                Share on WhatsApp
              </button>
              <button
                onClick={() => router.push(user ? `${dashboardHomeFor(user.role)}/quizzes` : '/login')}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-border bg-card text-sm font-semibold hover:bg-secondary/40 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to dashboard
              </button>
              <button
                onClick={() => router.push(user ? `${dashboardHomeFor(user.role)}/quizzes` : '/login')}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Take another quiz →
              </button>
            </div>
          </motion.div>
        )}

        {/* Podium */}
        {podium.length >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-8"
          >
            <p className="text-[11px] uppercase tracking-widest text-primary font-semibold mb-4">
              Top of the class
            </p>
            <div className="grid grid-cols-3 gap-3 items-end">
              {/* render in podium order: 2 / 1 / 3 */}
              {[1, 0, 2].map((podiumIdx) => {
                const entry = podium[podiumIdx];
                if (!entry) return <div key={podiumIdx} />;
                const heights = ['h-28', 'h-36', 'h-24'];
                const heightForRank = heights[podiumIdx];
                return (
                  <motion.div
                    key={entry.user_id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + podiumIdx * 0.08, duration: 0.4 }}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`h-14 w-14 rounded-full bg-gradient-to-br ${PODIUM_GRADIENTS[podiumIdx]} text-foreground/80 text-base font-bold flex items-center justify-center mb-2 shadow-md`}
                    >
                      {entry.username.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="text-sm font-semibold truncate max-w-full px-1">
                      {entry.username}
                    </div>
                    <div className="text-xs tabular-nums text-muted-foreground">
                      {entry.total_score.toLocaleString()} pts
                    </div>
                    <div
                      className={`mt-2 w-full rounded-t-2xl border border-border bg-card flex items-start justify-center pt-3 ${heightForRank}`}
                    >
                      <span
                        className={`text-2xl font-black bg-gradient-to-br ${PODIUM_GRADIENTS[podiumIdx]} bg-clip-text text-transparent`}
                      >
                        #{podiumIdx + 1}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Per-question breakdown */}
        {responses.length > 0 && (
          <div className="mt-12">
            <p className="text-[11px] uppercase tracking-widest text-primary font-semibold mb-2">
              Question by question
            </p>
            <h2 className="text-2xl font-bold tracking-tight">Review your answers.</h2>

            <div className="mt-6 space-y-3">
              {responses.map((r, i) => {
                const isOpen = openExplanations.has(i);
                const isTimeout = r.selected_option == null;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.3 }}
                    className="rounded-2xl border border-border bg-card overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold tabular-nums">
                            Q{String(i + 1).padStart(2, '0')}
                          </span>
                          {r.is_correct ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-semibold">
                              <CheckCircle2 className="h-3 w-3" /> Correct
                            </span>
                          ) : isTimeout ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-[10px] font-semibold">
                              <Clock className="h-3 w-3" /> No answer
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-[10px] font-semibold">
                              <XCircle className="h-3 w-3" /> Wrong
                            </span>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <div
                            className={`text-base font-bold tabular-nums ${
                              r.is_correct ? 'text-success' : 'text-muted-foreground'
                            }`}
                          >
                            +{r.score}
                          </div>
                          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                            {(r.response_time_ms / 1000).toFixed(1)}s
                          </div>
                        </div>
                      </div>

                      <p className="text-base font-medium leading-relaxed">
                        {r.question_text}
                      </p>

                      <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold w-20 shrink-0 mt-0.5">
                            Your pick
                          </span>
                          <span
                            className={`flex-1 ${
                              r.is_correct
                                ? 'text-success font-semibold'
                                : isTimeout
                                  ? 'text-muted-foreground italic'
                                  : 'text-destructive line-through'
                            }`}
                          >
                            {r.selected_option ?? 'No answer'}
                          </span>
                        </div>
                        {!r.is_correct && r.correct_option && (
                          <div className="flex items-start gap-2">
                            <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold w-20 shrink-0 mt-0.5">
                              Correct
                            </span>
                            <span className="flex-1 text-success font-semibold">
                              {r.correct_option}
                            </span>
                          </div>
                        )}
                      </div>

                      {r.explanation && (
                        <button
                          onClick={() => toggleExplanation(i)}
                          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                        >
                          {isOpen ? 'Hide explanation' : 'Why?'}
                          <ChevronDown
                            className={`h-3.5 w-3.5 transition-transform ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      )}
                    </div>
                    <AnimatePresence initial={false}>
                      {r.explanation && isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden border-t border-border"
                        >
                          <div className="p-5 bg-secondary/30 text-sm text-muted-foreground leading-relaxed">
                            {r.explanation}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Full leaderboard */}
        {leaderboard.length > 0 && (
          <div className="mt-12">
            <p className="text-[11px] uppercase tracking-widest text-primary font-semibold mb-2">
              Final standings
            </p>
            <h2 className="text-2xl font-bold tracking-tight">All {leaderboard.length} students.</h2>
            <div className="mt-6 rounded-2xl border border-border bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary/40 text-[10px] uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="text-left px-5 py-3 font-semibold w-12">Rank</th>
                    <th className="text-left px-5 py-3 font-semibold">Student</th>
                    <th className="text-right px-5 py-3 font-semibold">Points</th>
                    <th className="text-right px-5 py-3 font-semibold hidden sm:table-cell">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {leaderboard.map((entry, i) => {
                    const rank = entry.rank ?? i + 1;
                    const isMe = entry.user_id === user?.id;
                    return (
                      <tr
                        key={entry.user_id}
                        className={`transition-colors ${
                          isMe ? 'bg-primary/5' : ''
                        }`}
                      >
                        <td className="px-5 py-3 font-bold tabular-nums">
                          <span
                            className={
                              rank <= 3
                                ? 'text-primary'
                                : 'text-muted-foreground'
                            }
                          >
                            #{rank}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-medium">
                          {entry.username}
                          {isMe && (
                            <span className="ml-2 text-[10px] uppercase tracking-widest text-primary font-semibold">
                              You
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-right tabular-nums font-semibold">
                          {entry.total_score.toLocaleString()}
                        </td>
                        <td className="px-5 py-3 text-right tabular-nums text-muted-foreground hidden sm:table-cell">
                          {(entry.total_time_ms / 1000).toFixed(1)}s
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <QuizFooter />
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  hint,
  accent,
  bg,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
  hint?: string;
  accent: string;
  bg: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div
        className={`h-8 w-8 rounded-lg ${bg} ${accent} flex items-center justify-center mb-3`}
      >
        <Icon className="h-4 w-4" strokeWidth={2.2} />
      </div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
        {label}
      </div>
      <div className="mt-0.5 text-xl font-bold tracking-tight tabular-nums">{value}</div>
      {hint && <div className="mt-0.5 text-[11px] text-muted-foreground">{hint}</div>}
    </div>
  );
}
