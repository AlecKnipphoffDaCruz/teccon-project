import React from 'react';

export interface Step {
  key: string;
  label: string;
  icon: React.ReactNode;
}

interface StepIndicatorProps {
  steps: Step[];
  current: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, current }) => {
  return (
    <div className="flex items-center w-full">
      {steps.map((step, i) => {
        const isDone    = i < current;
        const isActive  = i === current;
        const isLast    = i === steps.length - 1;

        return (
          <React.Fragment key={step.key}>
            {/* Step circle */}
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  text-sm font-bold transition-all duration-300 border-2
                  ${isDone
                    ? 'bg-[#1A5FAD] border-[#1A5FAD] text-white'
                    : isActive
                    ? 'bg-white border-[#1A5FAD] text-[#1A5FAD] shadow-[0_0_0_4px_rgba(26,95,173,0.10)]'
                    : 'bg-white border-gray-200 text-gray-400'}
                `}
              >
                {isDone ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  step.icon
                )}
              </div>
              <span
                className={`
                  text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap
                  ${isActive ? 'text-[#1A5FAD]' : isDone ? 'text-gray-500' : 'text-gray-300'}
                `}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div className="flex-1 h-0.5 mx-3 mb-5 rounded-full transition-all duration-500"
                style={{ background: i < current ? '#1A5FAD' : '#E5E7EB' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;