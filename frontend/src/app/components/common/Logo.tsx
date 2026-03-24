import React from 'react';

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center font-bold font-sans tracking-tighter select-none ${className}`}>
      {/* First 'e' - Yellow, Tilted, Behind */}
      <span className="absolute -left-[0.35em] top-0 transform -rotate-[15deg] text-yellow-500 z-0">
        e
      </span>
      {/* Second 'e' - Red, Straight, Front */}
      <span className="relative text-red-600 z-10">
        e
      </span>
    </div>
  );
}
