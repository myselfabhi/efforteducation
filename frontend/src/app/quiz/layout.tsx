import type { Metadata } from 'next';
import QuizHeader from './components/QuizHeader';

export const metadata: Metadata = {
  title: 'Quiz Platform',
  description: 'Real-time quiz platform',
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <QuizHeader />
      {children}
    </div>
  );
}
