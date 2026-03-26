import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quiz Platform',
  description: 'Real-time quiz platform',
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-x-hidden">
      {children}
    </div>
  );
}
