import { create } from 'zustand';

interface QuizOption {
  id: number;
  option_text: string;
  option_index: number;
}

interface CurrentQuestion {
  questionId: number;
  questionIndex: number;
  totalQuestions: number;
  questionText: string;
  options: QuizOption[];
  timeLimit: number;
  startTime: number;
  endTime: number;
}

interface LeaderboardEntry {
  userId: number;
  username: string;
  totalScore: number;
  totalTimeMs: number;
  correctCount: number;
  rank: number;
}

type QuizPhase =
  | 'IDLE'
  | 'LOBBY'
  | 'STARTING'
  | 'QUESTION'
  | 'ANSWER_REVEALED'
  | 'LEADERBOARD'
  | 'COMPLETED';

interface QuizState {
  phase: QuizPhase;
  quizId: number | null;
  currentQuestion: CurrentQuestion | null;
  correctOptionId: number | null;
  leaderboard: LeaderboardEntry[];
  participantCount: number;
  selectedOptionId: number | null;
  alreadyAnswered: boolean;
  answerAccepted: boolean;
  answerCount: number;
  isLastQuestion: boolean;

  setPhase: (phase: QuizPhase) => void;
  setQuizId: (id: number) => void;
  setCurrentQuestion: (q: CurrentQuestion) => void;
  setCorrectOption: (id: number) => void;
  setLeaderboard: (lb: LeaderboardEntry[]) => void;
  setParticipantCount: (count: number) => void;
  selectOption: (id: number) => void;
  setAlreadyAnswered: (val: boolean) => void;
  setAnswerAccepted: (val: boolean) => void;
  setAnswerCount: (count: number) => void;
  setIsLastQuestion: (val: boolean) => void;
  resetQuestion: () => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  phase: 'IDLE',
  quizId: null,
  currentQuestion: null,
  correctOptionId: null,
  leaderboard: [],
  participantCount: 0,
  selectedOptionId: null,
  alreadyAnswered: false,
  answerAccepted: false,
  answerCount: 0,
  isLastQuestion: false,

  setPhase: (phase) => set({ phase }),
  setQuizId: (id) => set({ quizId: id }),
  setCurrentQuestion: (q) => set({ currentQuestion: q }),
  setCorrectOption: (id) => set({ correctOptionId: id }),
  setLeaderboard: (lb) => set({ leaderboard: lb }),
  setParticipantCount: (count) => set({ participantCount: count }),
  selectOption: (id) => set({ selectedOptionId: id }),
  setAlreadyAnswered: (val) => set({ alreadyAnswered: val }),
  setAnswerAccepted: (val) => set({ answerAccepted: val }),
  setAnswerCount: (count) => set({ answerCount: count }),
  setIsLastQuestion: (val) => set({ isLastQuestion: val }),

  resetQuestion: () =>
    set({
      currentQuestion: null,
      correctOptionId: null,
      selectedOptionId: null,
      alreadyAnswered: false,
      answerAccepted: false,
      answerCount: 0,
    }),

  resetQuiz: () =>
    set({
      phase: 'IDLE',
      quizId: null,
      currentQuestion: null,
      correctOptionId: null,
      leaderboard: [],
      participantCount: 0,
      selectedOptionId: null,
      alreadyAnswered: false,
      answerAccepted: false,
      answerCount: 0,
      isLastQuestion: false,
    }),
}));
