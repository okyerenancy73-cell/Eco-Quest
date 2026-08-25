import React from 'react';
import logoImg from '../../assets/images/ecoquest_logo_1787141216833.jpg';

interface EcoQuestLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtext?: boolean;
  showText?: boolean;
  className?: string;
  imageOnly?: boolean;
}

export const EcoQuestLogo: React.FC<EcoQuestLogoProps> = ({
  size = 'md',
  showSubtext = true,
  showText = true,
  className = '',
  imageOnly = false,
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-20 h-20',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Official EcoQuest Circular Logo Image */}
      <img
        src={logoImg}
        alt="EcoQuest Logo"
        referrerPolicy="no-referrer"
        className={`${iconSizes[size]} rounded-full object-cover shadow-xs ring-1 ring-[#D9E6DD] shrink-0 select-none`}
      />

      {/* Brand Name Typography */}
      {!imageOnly && showText && (
        <div className="text-left leading-none">
          <div className={`${textSizes[size]} font-extrabold tracking-tight font-sans text-[#1F2937]`}>
            <span className="text-[#2E7D32]">Eco</span>
            <span className="text-[#1976D2] relative inline-block mx-[0.5px]">
              Q
            </span>
            <span className="text-[#1F2937]">uest</span>
          </div>
          {showSubtext && (
            <span className="block text-[10px] font-bold tracking-widest text-[#2E7D32] uppercase mt-0.5">
              Climate & Sanitation
            </span>
          )}
        </div>
      )}
    </div>
  );
};


