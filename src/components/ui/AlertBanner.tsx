import React from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

export interface AlertBannerProps {
  id?: string;
  type: 'success' | 'error' | 'info';
  message: string;
  onClose?: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ id, type, message, onClose }) => {
  if (!message) return null;

  const styles = {
    success: {
      bg: 'bg-[#F8FCF8] border-[#16A34A]/40',
      text: 'text-[#16A34A]',
      icon: <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />,
    },
    error: {
      bg: 'bg-[#F8FCF8] border-[#DC2626]/40',
      text: 'text-[#DC2626]',
      icon: <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />,
    },
    info: {
      bg: 'bg-[#F8FCF8] border-[#1976D2]/40',
      text: 'text-[#1976D2]',
      icon: <CheckCircle2 className="w-4 h-4 text-[#1976D2] shrink-0 mt-0.5" />,
    },
  };

  const current = styles[type];

  return (
    <div
      id={id}
      role={type === 'error' ? 'alert' : 'status'}
      aria-live="polite"
      className={`w-full p-3.5 rounded-xl border flex items-start gap-3 transition-all duration-200 ${current.bg} ${current.text}`}
    >
      {current.icon}
      <div className="text-xs leading-relaxed font-medium flex-1 text-left">{message}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400"
          aria-label="Close message"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
