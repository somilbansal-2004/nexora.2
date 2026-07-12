import React, { useState, useEffect } from 'react';

interface StatCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export const StatCounter: React.FC<StatCounterProps> = ({
  end,
  duration = 1800,
  prefix = '',
  suffix = '',
  label,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!isMounted) return;
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Calculate smooth count-up
      const currentCount = Math.floor(progress * end);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);

    return () => {
      isMounted = false;
    };
  }, [end, duration]);

  return (
    <div className="flex flex-col items-center justify-center p-5 bg-[#101419] border border-white/10 shadow-[0_0_15px_rgba(16,185,129,0.15)] rounded-none font-mono">
      <span className="text-2xl sm:text-3xl md:text-4xl font-black text-emerald-400 tracking-tight">
        {prefix}{count.toLocaleString()}{suffix}
      </span>
      <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-2 font-bold font-sans text-center leading-tight">
        {label}
      </span>
    </div>
  );
};
