import React from 'react';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, subtitle, icon, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 ${className}`}>
      <div className="flex items-start gap-3 mb-5">
        {icon && (
          <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 text-[#1A5FAD]">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-sm font-bold text-gray-800 tracking-tight"
              style={{ fontFamily: "'Sora', sans-serif" }}>
            {title}
          </h3>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
};

export default SectionCard;