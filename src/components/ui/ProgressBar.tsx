import React from 'react';

interface ProgressBarProps {
  id?: string;
  value: number; // 0 - 100
  max?: number;
  label?: string;
  sublabel?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent' | 'success';
  inverted?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  id,
  value,
  max = 100,
  label,
  sublabel,
  showPercentage = true,
  size = 'md',
  color = 'primary',
  inverted = false,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }[size];

  const fillColors: Record<string, string> = {
    primary: inverted ? 'bg-white' : 'bg-[#2E7D32]',
    secondary: 'bg-[#1976D2]',
    accent: 'bg-[#66BB6A]',
    success: 'bg-[#16A34A]',
    emerald: inverted ? 'bg-white' : 'bg-[#2E7D32]',
    teal: 'bg-[#1976D2]',
    amber: 'bg-[#66BB6A]',
    gradient: inverted ? 'bg-white' : 'bg-[#2E7D32]',
  };

  return (
    <div id={id} className="w-full space-y-1.5 font-sans">
      {(label || showPercentage || sublabel) && (
        <div
          className={`flex items-center justify-between text-xs font-medium ${
            inverted ? 'text-white' : 'text-[#1F2937]'
          }`}
        >
          <div className="flex items-center gap-2">
            {label && <span>{label}</span>}
            {sublabel && (
              <span className={`${inverted ? 'text-white/80' : 'text-[#1F2937]/60'} text-[11px]`}>
                {sublabel}
              </span>
            )}
          </div>
          {showPercentage && (
            <span className={`font-bold ${inverted ? 'text-white' : 'text-[#2E7D32]'}`}>
              {percentage}%
            </span>
          )}
        </div>
      )}

      <div
        className={`w-full ${
          inverted ? 'bg-white/25' : 'bg-[#D9E6DD]/60'
        } rounded-full overflow-hidden p-0.5 ${sizeClasses}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            fillColors[color] || (inverted ? 'bg-white' : 'bg-[#2E7D32]')
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
