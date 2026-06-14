import React from 'react';

export default function GoldenRule({ className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-primary/50" />
      <div className="w-1.5 h-1.5 rotate-45 bg-primary/60" />
      <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-primary/50" />
    </div>
  );
}