'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TimerComponentProps {
  endTime: number;
  totalTime: number;
  onTimeUp?: () => void;
}

export default function TimerComponent({ endTime, totalTime, onTimeUp }: TimerComponentProps) {
  const [remaining, setRemaining] = useState(totalTime);
  const [percentage, setPercentage] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const remainMs = Math.max(0, endTime - now);
      const remainSec = Math.ceil(remainMs / 1000);
      const pct = (remainMs / (totalTime * 1000)) * 100;

      setRemaining(remainSec);
      setPercentage(Math.max(0, pct));

      if (remainMs <= 0) {
        clearInterval(interval);
        onTimeUp?.();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [endTime, totalTime, onTimeUp]);

  const getColor = () => {
    if (percentage > 60) return 'from-emerald-500 to-emerald-400';
    if (percentage > 30) return 'from-amber-500 to-yellow-400';
    return 'from-red-500 to-red-400';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-400">Time remaining</span>
        <motion.span
          key={remaining}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          className={`text-2xl font-bold tabular-nums ${
            percentage > 30 ? 'text-white' : 'text-red-400'
          }`}
        >
          {remaining}s
        </motion.span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${getColor()} rounded-full`}
          initial={{ width: '100%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.1, ease: 'linear' }}
        />
      </div>
    </div>
  );
}
