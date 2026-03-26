'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/stores/authStore';
import { getSocket } from '@/lib/socket';
import QuestionCard from '@/app/quiz/components/QuestionCard';
import TimerComponent from '@/app/quiz/components/TimerComponent';
import LeaderboardScreen from '@/app/quiz/components/LeaderboardScreen';

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

export default function QuizPlayScreen() {
  const router = useRouter();
  const params = useParams();
  const quizId = Number(params.id);
  const { hydrate, isAuthenticated } = useAuthStore();

  const [phase, setPhase] = useState<Phase>('waiting');
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [correctOptionId, setCorrectOptionId] = useState<number | null>(null);
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLastQuestion, setIsLastQuestion] = useState(false);

  useEffect(() => { hydrate(); }, [hydrate]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/quiz/login');
      return;
    }

    const socket = getSocket();

    // Join the quiz room
    socket.emit('quiz:join', { quizId });

    // New question
    socket.on('question:start', (data: QuestionData) => {
      setQuestion(data);
      setPhase('question');
      setSelectedOptionId(null);
      setCorrectOptionId(null);
      setAlreadyAnswered(false);
    });

    // Answer accepted
    socket.on('answer:accepted', (data) => {
      setSelectedOptionId(data.selectedOptionId);
      setAlreadyAnswered(true);
    });

    // Answer rejected
    socket.on('answer:rejected', (data) => {
      console.warn('Answer rejected:', data.reason);
    });

    // Question ended — show correct answer
    socket.on('question:end', (data) => {
      setCorrectOptionId(data.correctOptionId);
      setPhase('answer');
    });

    // Leaderboard
    socket.on('leaderboard:update', (data: { leaderboard: LeaderboardEntry[]; isLastQuestion: boolean }) => {
      setLeaderboard(data.leaderboard);
      setIsLastQuestion(data.isLastQuestion);
      setPhase('leaderboard');
    });

    // Quiz ended
    socket.on('quiz:end', (data) => {
      setLeaderboard(data.leaderboard);
      setPhase('completed');
    });

    // Reconnect sync
    socket.on('quiz:sync', (data) => {
      if (data.currentQuestion) {
        setQuestion(data.currentQuestion);
        setAlreadyAnswered(data.alreadyAnswered || false);
        setPhase('question');
      }
      if (data.leaderboard) {
        setLeaderboard(data.leaderboard);
      }
      if (data.state?.status === 'SHOWING_LEADERBOARD') {
        setPhase('leaderboard');
      }
      if (data.state?.status === 'COMPLETED') {
        setPhase('completed');
      }
    });

    socket.on('quiz:completed', () => {
      router.push(`/quiz/${quizId}/results`);
    });

    return () => {
      socket.off('question:start');
      socket.off('answer:accepted');
      socket.off('answer:rejected');
      socket.off('question:end');
      socket.off('leaderboard:update');
      socket.off('quiz:end');
      socket.off('quiz:sync');
      socket.off('quiz:completed');
    };
  }, [isAuthenticated, quizId, router, hydrate]);

  const handleAnswer = useCallback((optionId: number) => {
    if (alreadyAnswered || !question) return;
    setSelectedOptionId(optionId);
    const socket = getSocket();
    socket.emit('answer:submit', {
      quizId,
      questionId: question.questionId,
      selectedOptionId: optionId,
    });
  }, [alreadyAnswered, question, quizId]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {/* Waiting */}
          {phase === 'waiting' && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-400">Waiting for the next question...</p>
            </motion.div>
          )}

          {/* Question */}
          {phase === 'question' && question && (
            <motion.div
              key={`question-${question.questionId}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <TimerComponent
                endTime={question.endTime}
                totalTime={question.timeLimit}
              />

              <QuestionCard
                questionText={question.questionText}
                options={question.options}
                questionIndex={question.questionIndex}
                totalQuestions={question.totalQuestions}
                selectedOptionId={selectedOptionId}
                correctOptionId={null}
                disabled={alreadyAnswered}
                onSelect={handleAnswer}
              />

              {alreadyAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <span className="inline-block bg-purple-500/20 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-full text-sm">
                    ✓ Answer submitted — waiting for timer...
                  </span>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Answer Revealed */}
          {phase === 'answer' && question && (
            <motion.div
              key="answer-reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <QuestionCard
                questionText={question.questionText}
                options={question.options}
                questionIndex={question.questionIndex}
                totalQuestions={question.totalQuestions}
                selectedOptionId={selectedOptionId}
                correctOptionId={correctOptionId}
                disabled={true}
                onSelect={() => {}}
              />

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center"
              >
                {selectedOptionId === correctOptionId ? (
                  <span className="inline-block bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-6 py-3 rounded-full text-lg font-semibold">
                    🎉 Correct!
                  </span>
                ) : selectedOptionId ? (
                  <span className="inline-block bg-red-500/20 border border-red-500/30 text-red-300 px-6 py-3 rounded-full text-lg font-semibold">
                    ❌ Wrong answer
                  </span>
                ) : (
                  <span className="inline-block bg-gray-500/20 border border-gray-500/30 text-gray-300 px-6 py-3 rounded-full text-lg font-semibold">
                    ⏰ Time&apos;s up!
                  </span>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* Leaderboard */}
          {phase === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <LeaderboardScreen
                leaderboard={leaderboard}
                questionIndex={question?.questionIndex}
                totalQuestions={question?.totalQuestions}
              />
              {!isLastQuestion && (
                <p className="text-center text-gray-500 text-sm mt-6 animate-pulse">
                  Next question coming up...
                </p>
              )}
            </motion.div>
          )}

          {/* Completed */}
          {phase === 'completed' && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <LeaderboardScreen leaderboard={leaderboard} isFinal={true} />
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push(`/quiz/${quizId}/results`)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-8 py-3 rounded-xl"
                >
                  View Detailed Results →
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
