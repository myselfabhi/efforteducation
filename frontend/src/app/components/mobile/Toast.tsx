'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
}

export default function Toast({ 
  message, 
  type = 'success', 
  duration = 3000,
  onClose 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 200);
  };

  if (!isVisible) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const colors = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-blue-600 text-white',
  };

  return (
    <div
      className={`
        fixed top-20 left-1/2 -translate-x-1/2 z-[100] max-w-md w-[90%] sm:w-auto
        ${isExiting ? 'toast-exit' : 'toast-enter'}
      `}
    >
      <div className={`
        flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl
        ${colors[type]}
        backdrop-blur-lg
      `}>
        <div className="flex-shrink-0">
          {icons[type]}
        </div>
        <p className="flex-1 font-medium text-sm sm:text-base">{message}</p>
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors btn-press"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Toast Manager Hook
export function useToast() {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: number }>>([]);

  const showToast = (props: ToastProps) => {
    const id = Date.now();
    setToasts(prev => [...prev, { ...props, id }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, props.duration || 3000);
  };

  return { toasts, showToast };
}
