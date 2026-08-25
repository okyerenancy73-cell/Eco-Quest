import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string | null;
  hint?: string;
  icon?: React.ReactNode;
  isPassword?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ id, label, error, hint, icon, isPassword = false, type = 'text', className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    return (
      <div className="w-full space-y-1.5 text-left font-sans">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-[#1F2937]"
        >
          {label} {props.required && <span className="text-[#DC2626] font-bold">*</span>}
        </label>

        <div className="relative rounded-xl shadow-2xs transition-all duration-200">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#1F2937]/50">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            type={inputType}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={`
              w-full rounded-xl border bg-white text-[#1F2937] text-sm font-normal transition-all duration-200
              placeholder:text-[#1F2937]/40 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32]
              py-2.5 ${icon ? 'pl-10' : 'pl-3.5'} ${isPassword ? 'pr-11' : 'pr-3.5'}
              ${error ? 'border-[#DC2626] focus:ring-[#DC2626]/20 focus:border-[#DC2626]' : 'border-[#D9E6DD]'}
              ${className}
            `}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              id={`${id}-toggle-visibility`}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#1F2937]/50 hover:text-[#1F2937] focus:outline-none focus:text-[#2E7D32]"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={0}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>

        {hint && !error && (
          <p id={hintId} className="text-xs text-[#1F2937]/70">
            {hint}
          </p>
        )}

        {error && (
          <p id={errorId} role="alert" className="text-xs font-medium text-[#DC2626] flex items-center gap-1 mt-1">
            <span>•</span> {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
