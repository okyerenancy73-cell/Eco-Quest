import React from 'react';
import { VerificationStatus } from '../../types/verification';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Play, 
  HelpCircle 
} from 'lucide-react';

interface VerificationStatusBadgeProps {
  status: VerificationStatus | 'available' | 'completed';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const VerificationStatusBadge: React.FC<VerificationStatusBadgeProps> = ({
  status,
  size = 'md',
  showLabel = true,
}) => {
  let config = {
    label: 'Not Started',
    color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    icon: HelpCircle,
  };

  switch (status) {
    case 'not-started':
    case 'available':
      config = {
        label: 'Not Started',
        color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
        icon: HelpCircle,
      };
      break;

    case 'in-progress':
      config = {
        label: 'In Progress',
        color: 'bg-sky-50 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300 border-sky-300 dark:border-sky-800',
        icon: Play,
      };
      break;

    case 'awaiting-verification':
      config = {
        label: 'Awaiting Verification',
        color: 'bg-amber-50 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800 animate-pulse',
        icon: Clock,
      };
      break;

    case 'verified':
    case 'completed':
      config = {
        label: 'Verified & Awarded',
        color: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
        icon: CheckCircle2,
      };
      break;

    case 'needs-review':
      config = {
        label: 'Needs Review',
        color: 'bg-orange-50 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 border-orange-300 dark:border-orange-800',
        icon: AlertCircle,
      };
      break;

    case 'rejected':
      config = {
        label: 'Rejected',
        color: 'bg-rose-50 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800',
        icon: XCircle,
      };
      break;
  }

  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm gap-2 font-bold',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full border shadow-2xs ${config.color} ${sizeClasses}`}
    >
      <IconComponent className={iconSizes} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
};
