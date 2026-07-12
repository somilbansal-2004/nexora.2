import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  animated?: boolean;
}

export const NexoraEmblem: React.FC<LogoProps> = ({
  className = '',
  size = 48,
  animated = false,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animated ? 'animate-pulse' : ''}`}
      id="nexora-emblem"
    >
      <defs>
        {/* Metallic Gold Gradient */}
        <linearGradient id="gold-metallic" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9A7B1C" />
          <stop offset="15%" stopColor="#D4AF37" />
          <stop offset="45%" stopColor="#F9E8A2" />
          <stop offset="55%" stopColor="#F1D26B" />
          <stop offset="80%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#785E10" />
        </linearGradient>

        {/* Tech Emerald-Teal Background Gradient */}
        <radialGradient id="emblem-bg" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="40%" stopColor="#0F766E" />
          <stop offset="75%" stopColor="#065F46" />
          <stop offset="100%" stopColor="#071311" />
        </radialGradient>

        {/* Emerald Glow Gradient */}
        <linearGradient id="emerald-glow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      {/* Main Circular Background */}
      <circle cx="256" cy="256" r="230" fill="url(#emblem-bg)" stroke="url(#gold-metallic)" strokeWidth="8" />

      {/* Inner Rim */}
      <circle cx="256" cy="256" r="218" stroke="#0F766E" strokeWidth="2" opacity="0.5" />

      {/* Left Half: Tech Circuit Board Traces */}
      <g stroke="url(#gold-metallic)" strokeWidth="6" strokeLinecap="round" opacity="0.95">
        {/* Track 1 (Top Left Outer) */}
        <path d="M 100 190 H 170 L 210 230 V 256" />
        <circle cx="100" cy="190" r="8" fill="url(#gold-metallic)" stroke="none" />
        
        {/* Track 2 (Mid Left Upper) */}
        <path d="M 90 230 H 150 L 190 270 H 225" />
        <circle cx="90" cy="230" r="8" fill="url(#gold-metallic)" stroke="none" />

        {/* Track 3 (Mid Left Lower) */}
        <path d="M 95 275 H 135 L 175 315 V 360 H 200" />
        <circle cx="95" cy="275" r="8" fill="url(#gold-metallic)" stroke="none" />

        {/* Track 4 (Bottom Left Outer) */}
        <path d="M 115 320 H 155 L 185 350 V 420" />
        <circle cx="115" cy="320" r="8" fill="url(#gold-metallic)" stroke="none" />

        {/* Circuit Intersect Dots / Nodes */}
        <circle cx="210" cy="230" r="5" fill="#14B8A6" stroke="url(#gold-metallic)" strokeWidth="1.5" />
        <circle cx="190" cy="270" r="5" fill="#14B8A6" stroke="url(#gold-metallic)" strokeWidth="1.5" />
        <circle cx="175" cy="315" r="5" fill="#14B8A6" stroke="url(#gold-metallic)" strokeWidth="1.5" />
        <circle cx="200" cy="360" r="7" fill="url(#gold-metallic)" stroke="none" />
        <circle cx="185" cy="420" r="7" fill="url(#gold-metallic)" stroke="none" />
        
        {/* Track 5 (Very Top Horizontal) */}
        <path d="M 160 145 H 250 L 270 165" />
        <circle cx="160" cy="145" r="8" fill="url(#gold-metallic)" stroke="none" />
        <circle cx="270" cy="165" r="6" fill="#14B8A6" stroke="url(#gold-metallic)" strokeWidth="2" />
      </g>

      {/* Right Half: Organic Leaf Shape with Veins */}
      <g fill="none" stroke="url(#gold-metallic)" strokeLinecap="round" strokeLinejoin="round">
        {/* Main Leaf Spine (Center stem) */}
        <path d="M 230 400 C 240 370 260 280 340 180 C 370 142 400 115 425 100" strokeWidth="8" />
        
        {/* Leaf Outline - Right Outer Edge */}
        <path d="M 230 400 C 330 390 430 330 425 100" strokeWidth="8" fill="none" />
        
        {/* Leaf Outline - Left Inner Edge */}
        <path d="M 230 400 C 220 310 260 210 340 180" strokeWidth="6" />

        {/* Leaf Vein 1 (Bottom Right) */}
        <path d="M 252 340 C 290 345 340 330 375 300" strokeWidth="5" />
        
        {/* Leaf Vein 2 (Mid Right) */}
        <path d="M 282 270 C 320 275 370 250 395 210" strokeWidth="5" />

        {/* Leaf Vein 3 (Top Right) */}
        <path d="M 315 210 C 345 205 385 185 405 145" strokeWidth="4" />

        {/* Leaf Vein 4 (Inner Left 1) */}
        <path d="M 265 295 C 255 280 250 250 265 230" strokeWidth="4" />

        {/* Leaf Vein 5 (Inner Left 2) */}
        <path d="M 295 235 C 285 215 285 195 305 180" strokeWidth="4" />
      </g>

      {/* Central Connector Overlay: Merging nature & machine */}
      <circle cx="230" cy="400" r="10" fill="url(#gold-metallic)" />
      <path d="M 185 350 L 230 400" stroke="url(#gold-metallic)" strokeWidth="5" />
    </svg>
  );
};

export const NexoraLogo: React.FC<LogoProps> = ({
  className = '',
  size = 48,
  showText = true,
  animated = false,
}) => {
  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`} id="nexora-full-logo">
      <NexoraEmblem size={size} animated={animated} />
      {showText && (
        <span className="font-sans font-bold tracking-[0.2em] text-2xl flex items-center">
          <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            NEX
          </span>
          <span className="bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent">
            ORA
          </span>
        </span>
      )}
    </div>
  );
};
