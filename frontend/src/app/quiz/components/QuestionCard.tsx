'use client';

import { motion } from 'framer-motion';

interface QuizOption {
  id: number;
  option_text: string;
  option_index: number;
}

interface QuestionCardProps {
  questionText: string;
  options: QuizOption[];
  questionIndex: number;
  totalQuestions: number;
  selectedOptionId: number | null;
  correctOptionId: number | null;
  disabled: boolean;
  onSelect: (optionId: number) => void;
}

const optionLabels = ['A', 'B', 'C', 'D'];
const optionColors = [
  'from-blue-600 to-blue-500',
  'from-emerald-600 to-emerald-500',
  'from-amber-600 to-amber-500',
  'from-pink-600 to-pink-500',
];

export default function QuestionCard({
  questionText,
  options,
  questionIndex,
  totalQuestions,
  selectedOptionId,
  correctOptionId,
  disabled,
  onSelect,
}: QuestionCardProps) {
  const getOptionStyle = (optionId: number, index: number) => {
    const isSelected = selectedOptionId === optionId;
    const isCorrect = correctOptionId === optionId;
    const isRevealed = correctOptionId !== null;

    if (isRevealed) {
      if (isCorrect) return 'bg-emerald-500/20 border-emerald-500 ring-2 ring-emerald-500/30';
      if (isSelected && !isCorrect) return 'bg-red-500/20 border-red-500 ring-2 ring-red-500/30';
      return 'bg-white/5 border-white/10 opacity-50';
    }

    if (isSelected) return `bg-gradient-to-r ${optionColors[index]} border-transparent text-white`;
    return 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Question number */}
      <div className="text-center mb-4">
        <span className="inline-block bg-purple-500/20 border border-purple-500/30 text-purple-300 px-4 py-1 rounded-full text-sm font-medium">
          Question {questionIndex + 1} of {totalQuestions}
        </span>
      </div>

      {/* Question text */}
      <h2 className="text-xl md:text-2xl font-bold text-center mb-8 leading-relaxed">
        {questionText}
      </h2>

      {/* Options grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, index) => (
          <motion.button
            key={option.id}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            onClick={() => !disabled && onSelect(option.id)}
            disabled={disabled}
            className={`relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${getOptionStyle(option.id, index)} ${
              disabled ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center font-bold text-lg">
              {optionLabels[index]}
            </span>
            <span className="text-base font-medium">{option.option_text}</span>

            {/* Correct / Wrong indicator */}
            {correctOptionId !== null && correctOptionId === option.id && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute right-4 text-emerald-400 text-xl"
              >
                ✓
              </motion.span>
            )}
            {correctOptionId !== null && selectedOptionId === option.id && correctOptionId !== option.id && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute right-4 text-red-400 text-xl"
              >
                ✗
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
