import React from 'react';

export default function Logo({ className = "" }: { className?: string }) {
  // If inverted is true (e.g. on a red background), we might want different colors.
  // But by default, we'll use Red and White.
  // Since the site is white, we'll give the white 'e' a subtle red outline or shadow.
  
  return (
    <div className={`relative flex items-center justify-center font-bold font-sans tracking-tighter select-none ${className}`}>
      {/* First 'e' - Tilted and behind */}
      {/* If inverted, maybe it's White. If not, it's Red? 
          The user said "red and white". 
          Let's make the tilted one Red and the straight one White (with a red border).
      */}
      <span 
        className="absolute -left-[0.35em] top-0 transform -rotate-[15deg] text-red-600 z-0"
      >
        e
      </span>
      {/* Second 'e' - Straight and in front */}
      <span 
        className="relative text-white z-10"
        style={{ 
          WebkitTextStroke: '1px #dc2626',
          paintOrder: 'stroke fill'
        }}
      >
        e
      </span>
    </div>
  );
}
