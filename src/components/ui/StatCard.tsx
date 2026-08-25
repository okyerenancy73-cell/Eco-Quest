import React from 'react';

interface StatCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  icon: React.ReactNode;
  iconBgColor?: string;
  badge?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  subtitle,
  trend,
  icon,
  iconBgColor = 'bg-[#2E7D32]/10 text-[#2E7D32]',
  badge,
  onClick,
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`p-5 rounded-2xl bg-white border border-[#D9E6DD] shadow-xs hover:shadow-sm transition-all duration-200 text-left font-sans ${
        onClick ? 'cursor-pointer hover:border-[#2E7D32]' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1F2937]/70">
            {title}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1F2937]">
              {value}
            </span>
            {badge && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2E7D32]/10 text-[#2E7D32] border border-[#2E7D32]/20">
                {badge}
              </span>
            )}
          </div>
        </div>

        <div className={`p-3 rounded-xl shrink-0 ${iconBgColor}`}>
          {icon}
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-[#D9E6DD] flex items-center justify-between text-xs">
          {subtitle && <span className="text-[#1F2937]/70">{subtitle}</span>}
          {trend && (
            <span
              className={`font-semibold ${
                trend.isPositive !== false
                  ? 'text-[#2E7D32]'
                  : 'text-[#DC2626]'
              }`}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
