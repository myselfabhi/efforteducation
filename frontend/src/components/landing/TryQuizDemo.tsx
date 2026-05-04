'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Zap, ArrowRight, RotateCcw, Trophy } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useAuthModal } from '@/lib/stores/authModalStore';

interface Question {
  id: string;
  category: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 'q1',
    category: 'Quantitative Aptitude',
    text: 'A trader marks his goods 40% above the cost price and gives a 25% discount. His profit percent is:',
    options: ['5%', '10%', '12%', '15%'],
    correctIndex: 0,
    explanation:
      'CP = ₹100 → MP = ₹140. After 25% discount: SP = 140 × 0.75 = ₹105. Profit = ₹5 = 5%.',
  },
  {
    id: 'q2',
    category: 'English',
    text: 'Choose the correctly spelled word:',
    options: ['Occurence', 'Occurance', 'Occurrence', 'Occurence'],
    correctIndex: 2,
    explanation: '"Occurrence" — two c\'s and two r\'s.',
  },
  {
    id: 'q3',
    category: 'Reasoning',
    text: 'If RAIN is coded as UDLQ, how is CLOUD coded?',
    options: ['FORXG', 'FOROG', 'FNRXG', 'FORXH'],
    correctIndex: 0,
    explanation: 'Each letter shifts +3: C→F, L→O, O→R, U→X, D→G.',
  },
];

const QUESTION_SECONDS = 30;

export function TryQuizDemo() {
  const [step, setStep] = useState<'intro' | 'quiz' | 'done'>('intro');
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [reveal, setReveal] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(QUESTION_SECONDS);
  const [score, setScore] = useState(0);
  const openAuth = useAuthModal((s) => s.openModal);

  const q = QUESTIONS[idx];

  // Per-question countdown
  useEffect(() => {
    if (step !== 'quiz' || reveal) return;
    setSecondsLeft(QUESTION_SECONDS);
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          setReveal(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [idx, step, reveal]);

  function pick(i: number) {
    if (reveal) return;
    setChosen(i);
    setReveal(true);
    if (i === q.correctIndex) {
      // Score: 100 base + speed bonus up to 100
      const bonus = Math.round((secondsLeft / QUESTION_SECONDS) * 100);
      setScore((s) => s + 100 + bonus);
    }
  }

  function next() {
    if (idx + 1 >= QUESTIONS.length) {
      setStep('done');
    } else {
      setIdx(idx + 1);
      setChosen(null);
      setReveal(false);
    }
  }

  function reset() {
    setStep('intro');
    setIdx(0);
    setChosen(null);
    setReveal(false);
    setScore(0);
  }

  const progressPct = ((idx + (reveal ? 1 : 0)) / QUESTIONS.length) * 100;

  return (
    <section id="try-quiz" className="py-20 bg-gradient-to-b from-background via-primary-soft/40 to-background">
      <div className="container mx-auto max-w-3xl px-6">
        <div className="text-center mb-8">
          <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">Try it now</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
            A 30-second taste of our live quiz.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Three questions across Quant, English and Reasoning. Speed counts.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card shadow-xl overflow-hidden">
          {/* Progress bar */}
          <div className="h-1 bg-muted">
            <motion.div
              className="h-full bg-primary"
              animate={{ width: `${step === 'done' ? 100 : progressPct}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {step === 'intro' && (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="text-center py-8"
                >
                  <div className="h-16 w-16 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Zap className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold">Ready when you are.</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    No login. No sign-up. Just hit start.
                  </p>
                  <Button size="lg" className="mt-6" onClick={() => setStep('quiz')}>
                    Start the quiz
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </motion.div>
              )}

              {step === 'quiz' && (
                <motion.div
                  key={`q-${idx}`}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">
                      Q{idx + 1} of {QUESTIONS.length} · {q.category}
                    </span>
                    <span
                      className={`font-mono font-semibold ${
                        secondsLeft <= 5 ? 'text-destructive' : 'text-muted-foreground'
                      }`}
                    >
                      ⏱ {secondsLeft}s
                    </span>
                  </div>

                  <h3 className="text-lg md:text-xl font-semibold leading-snug">{q.text}</h3>

                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt, i) => {
                      const isCorrect = i === q.correctIndex;
                      const isPicked = chosen === i;
                      const showCorrect = reveal && isCorrect;
                      const showWrong = reveal && isPicked && !isCorrect;
                      return (
                        <button
                          key={i}
                          onClick={() => pick(i)}
                          disabled={reveal}
                          className={`relative text-left rounded-xl border px-4 py-3 transition-all
                            ${
                              showCorrect
                                ? 'border-success bg-success/10'
                                : showWrong
                                  ? 'border-destructive bg-destructive/10'
                                  : reveal
                                    ? 'border-border opacity-70'
                                    : 'border-border hover:border-primary hover:bg-primary/5'
                            }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium">{opt}</span>
                            {showCorrect && <Check className="h-4 w-4 text-success" />}
                            {showWrong && <X className="h-4 w-4 text-destructive" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {reveal && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl bg-secondary p-4 text-sm"
                    >
                      <p className="font-semibold text-foreground mb-1">
                        {chosen === q.correctIndex ? 'Correct!' : chosen === null ? 'Time up!' : 'Not quite.'}
                      </p>
                      <p className="text-muted-foreground">{q.explanation}</p>
                    </motion.div>
                  )}

                  {reveal && (
                    <div className="flex justify-end">
                      <Button onClick={next}>
                        {idx + 1 >= QUESTIONS.length ? 'See your score' : 'Next question'}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}

              {step === 'done' && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="text-center py-6 space-y-4"
                >
                  <div className="h-16 w-16 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Trophy className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold">You scored {score} pts</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    On the real platform you&rsquo;d see a live leaderboard, batchmate ranks, and a per-question breakdown.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center pt-2">
                    <Button onClick={() => openAuth('register')}>
                      Create a free account
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    <Button variant="outline" onClick={reset}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Try again
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
