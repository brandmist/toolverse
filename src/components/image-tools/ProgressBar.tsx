import React from 'react';

interface ProgressBarProps {
  progress: number;
  statusText?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, statusText }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-medium text-text-primary">
          {statusText || 'Processing...'}
        </span>
        <span className="text-xs font-semibold text-text-primary">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="w-full bg-card border border-border rounded-full h-2.5 overflow-hidden">
        <div 
          className="bg-card border border-border h-2.5 rounded-full transition-all duration-300 ease-out relative"
          style={{ width: `${progress}%` }}
        >
          {/* Animated shimmer effect */}
          <div className="absolute top-0 right-0 bottom-0 left-0 from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite] -translate-x-full"></div>
        </div>
      </div>
    </div>
  );
};
