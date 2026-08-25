import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  id?: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  id = 'empty-state',
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = '',
}) => {
  return (
    <div
      id={id}
      className={`p-8 sm:p-12 text-center rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center ring-8 ring-emerald-500/5">
        {icon}
      </div>

      <div className="space-y-1.5 text-center max-w-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
      </div>

      {(actionLabel || secondaryActionLabel) && (
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5 w-full justify-center">
          {actionLabel && onAction && (
            <Button id={`${id}-btn-primary`} onClick={onAction} variant="primary" size="sm">
              {actionLabel}
            </Button>
          )}

          {secondaryActionLabel && onSecondaryAction && (
            <Button id={`${id}-btn-secondary`} onClick={onSecondaryAction} variant="outline" size="sm">
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
