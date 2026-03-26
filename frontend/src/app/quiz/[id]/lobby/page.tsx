'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/stores/authStore';
import { getSocket } from '@/lib/socket';

export default function QuizLobby() {
  const router = useRouter();
  const params = useParams();
  const quizId = Number(params.id);
  const { hydrate, isAuthenticated, user } = useAuthStore();

  const [participantCount, setParticipantCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => { hydrate(); }, [hydrate]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/quiz/login');
      return;
    }

    const socket = getSocket();

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.emit('quiz:join', { quizId });

    socket.on('quiz:lobby', (data) => {
      setParticipantCount(data.participantCount);
    });

    socket.on('participant:joined', (data) => {
      setParticipantCount(data.participantCount);
    });

    socket.on('quiz:starting', (data) => {
      let count = data.startsIn;
      setCountdown(count);
      const interval = setInterval(() => {
        count -= 1;
        setCountdown(count);
        if (count <= 0) {
          clearInterval(interval);
        }
      }, 1000);
    });

    socket.on('question:start', () => {
      router.push(`/quiz/${quizId}/play`);
    });

    // If quiz already in progress (reconnect/late join)
    socket.on('quiz:sync', () => {
      router.push(`/quiz/${quizId}/play`);
    });

    socket.on('quiz:completed', () => {
      router.push(`/quiz/${quizId}/results`);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('quiz:lobby');
      socket.off('participant:joined');
      socket.off('quiz:starting');
      socket.off('question:start');
      socket.off('quiz:sync');
      socket.off('quiz:completed');
    };
  }, [isAuthenticated, quizId, router, hydrate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        {countdown !== null ? (
          <motion.div
            key="countdown"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="space-y-4"
          >
            <p className="text-gray-400 text-lg">Quiz starting in</p>
            <motion.div
              key={countdown}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-8xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              {countdown}
            </motion.div>
          </motion.div>
        ) : (
          <>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-6xl mb-6"
            >
              ⏳
            </motion.div>

            <h1 className="text-3xl font-bold text-white mb-2">Quiz Lobby</h1>
            <p className="text-gray-400 mb-8">Waiting for the host to start...</p>

            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-6 py-3">
              <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400' : 'bg-red-400'}`} />
              <span className="text-gray-300 font-medium">{participantCount} participants</span>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {Array.from({ length: Math.min(participantCount, 20) }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold"
                >
                  {String.fromCharCode(65 + (i % 26))}
                </motion.div>
              ))}
            </div>

            <p className="text-gray-600 text-sm mt-8">
              Logged in as <span className="text-gray-400">{user?.username}</span>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
