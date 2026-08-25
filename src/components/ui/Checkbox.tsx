import React from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: React.ReactNode;
  error?: string | null;
}

export const Checkbox: React.FC<CheckboxProps> = ({ id, label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1 text-left font-sans">
      <label htmlFor={id} className="inline-flex items-start gap-2.5 cursor-pointer group">
        <div className="relative flex items-center pt-0.5">
          <input
            id={id}
            type="checkbox"
            className={`
              w-4 h-4 rounded border-[#D9E6DD] text-[#2E7D32] accent-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 focus:ring-offset-0 transition duration-150 cursor-pointer
              ${error ? 'border-[#DC2626]' : 'border-[#D9E6DD] bg-white'}
              ${className}
            `}
            {...props}
          />
        </div>
        <span className="text-xs text-[#1F2937]/80 select-none group-hover:text-[#1F2937] transition-colors">
          {label}
        </span>
      </label>
      {error && (
        <p className="text-xs font-medium text-[#DC2626] pl-6">
          {error}
        </p>
      )}
    </div>
  );
};
