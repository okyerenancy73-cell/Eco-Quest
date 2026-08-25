import React from 'react';
import { evaluatePasswordStrength } from '../../utils/validation';
import { Check, X } from 'lucide-react';

export interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  if (!password) return null;

  const result = evaluatePasswordStrength(password);

  const requirementList = [
    { label: 'At least 8 characters', met: result.checks.hasMinLength },
    { label: 'At least one uppercase letter (A-Z)', met: result.checks.hasUppercase },
    { label: 'At least one lowercase letter (a-z)', met: result.checks.hasLowercase },
    { label: 'At least one number (0-9)', met: result.checks.hasNumber },
    { label: 'Special symbol (!@#$%^&*)', met: result.checks.hasSpecialChar },
  ];

  return (
    <div className="space-y-2.5 pt-1 text-left">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400 font-medium">Password strength:</span>
        <span className="font-semibold text-slate-700 dark:text-slate-200">{result.label}</span>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-full rounded-full transition-all duration-300 ${
              result.score >= step ? result.color : 'bg-slate-200 dark:bg-slate-800'
            }`}
          />
        ))}
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
        {requirementList.map((req, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${
              req.met ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {req.met ? (
              <Check className="w-3 h-3 text-emerald-600 shrink-0" />
            ) : (
              <X className="w-3 h-3 text-slate-300 dark:text-slate-600 shrink-0" />
            )}
            <span>{req.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
