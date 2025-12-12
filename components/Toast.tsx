
import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  onDismiss: (id: string) => void;
}

const icons = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />
};

const borderColors = {
  success: 'border-l-emerald-500',
  error: 'border-l-red-500',
  warning: 'border-l-amber-500',
  info: 'border-l-blue-500'
};

export const Toast: React.FC<ToastProps> = ({ id, type, title, message, duration = 4000, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(id);
    }, 300); // Match animation duration
  };

  return (
    <div 
      className={`
        relative overflow-hidden w-80 md:w-96 bg-white dark:bg-[#1c1c1c] 
        border border-gray-100 dark:border-[#333] border-l-4 ${borderColors[type]}
        shadow-lg rounded-md p-4 mb-3 flex items-start gap-3
        transition-all duration-300 ease-in-out transform
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0 animate-slide-in-right'}
      `}
      role="alert"
    >
      <div className="shrink-0 mt-0.5">
        {icons[type]}
      </div>
      
      <div className="flex-1 mr-2">
        {title && <h4 className="text-sm font-semibold text-gray-900 dark:text-[#ededed] mb-1">{title}</h4>}
        <p className="text-sm text-gray-600 dark:text-[#8b9092] leading-snug">{message}</p>
      </div>

      <button 
        onClick={handleDismiss}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-[#ededed] transition-colors shrink-0"
      >
        <X size={16} />
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-gray-100 dark:bg-[#333] w-full">
        <div 
          className={`h-full ${type === 'success' ? 'bg-emerald-500' : type === 'error' ? 'bg-red-500' : type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`}
          style={{ 
            width: '100%', 
            animation: `progress ${duration}ms linear forwards` 
          }} 
        />
      </div>
      
      <style>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export const ToastContainer: React.FC<{ toasts: ToastProps[], removeToast: (id: string) => void }> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <div className="pointer-events-auto">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onDismiss={removeToast} />
        ))}
      </div>
    </div>
  );
};
