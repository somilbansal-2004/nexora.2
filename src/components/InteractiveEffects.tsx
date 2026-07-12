import React, { useEffect, useRef, useState } from 'react';
import { playClickSound, playHoverSound } from '../utils/audio';

export const InteractiveEffects: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // References for direct DOM styling to achieve 60 FPS (bypassing React re-renders)
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  // Mouse state
  const mouse = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    // Eased positions
    ringX: 0,
    ringY: 0,
    spotX: 0,
    spotY: 0,
    isHoveringInteractive: false,
    isVisible: false,
  });

  useEffect(() => {
    // Check user preference for motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    motionQuery.addEventListener('change', handleMotionChange);
    return () => motionQuery.removeEventListener('change', handleMotionChange);
  }, []);

  useEffect(() => {
    // 1. SCROLL PROGRESS
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    // 2. MOUSE TRACKING & INTERACTIVE STATES
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.targetX = e.clientX;
      mouse.current.targetY = e.clientY;
      mouse.current.isVisible = true;

      // Update dot position instantly
      if (cursorDotRef.current && !prefersReducedMotion) {
        cursorDotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        cursorDotRef.current.style.opacity = '1';
      }
    };

    const handleMouseLeaveWindow = () => {
      mouse.current.isVisible = false;
      if (cursorDotRef.current) cursorDotRef.current.style.opacity = '0';
      if (cursorRingRef.current) cursorRingRef.current.style.opacity = '0';
    };

    const handleMouseEnterWindow = () => {
      mouse.current.isVisible = true;
      if (cursorDotRef.current) cursorDotRef.current.style.opacity = '1';
      if (cursorRingRef.current) cursorRingRef.current.style.opacity = '1';
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);

    // 3. GLOBAL CLICK & HOVER SOUND ENGINE
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Capture standard buttons, links, inputs, social icons, cards, navigation, or any elements with 'cursor-pointer'
      const interactive = target.closest(
        'button, a, [role="button"], input[type="submit"], input[type="button"], select, textarea, .service-card, .portfolio-card, .video-card-class, .nav-link-item, [onclick]'
      );
      if (interactive) {
        playClickSound();
      }
    };

    let lastHoveredElement: HTMLElement | null = null;
    const handleGlobalMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest(
        'button, a, [role="button"], input[type="submit"], input[type="button"], select, .service-card, .portfolio-card, .video-card-class, .nav-link-item, [onclick]'
      ) as HTMLElement | null;

      if (interactive) {
        if (interactive !== lastHoveredElement) {
          lastHoveredElement = interactive;
          playHoverSound();
          mouse.current.isHoveringInteractive = true;
          
          // Expand cursor and change glow style
          if (cursorRingRef.current) {
            cursorRingRef.current.classList.add('scale-150', 'border-emerald-400', 'bg-emerald-500/10');
            cursorRingRef.current.classList.remove('border-white/40');
          }
          if (cursorDotRef.current) {
            cursorDotRef.current.classList.add('bg-emerald-400', 'scale-125');
            cursorDotRef.current.classList.remove('bg-white');
          }
        }
      } else {
        if (lastHoveredElement !== null) {
          lastHoveredElement = null;
          mouse.current.isHoveringInteractive = false;
          
          // Restore original cursor appearance
          if (cursorRingRef.current) {
            cursorRingRef.current.classList.remove('scale-150', 'border-emerald-400', 'bg-emerald-500/10');
            cursorRingRef.current.classList.add('border-white/40');
          }
          if (cursorDotRef.current) {
            cursorDotRef.current.classList.remove('bg-emerald-400', 'scale-125');
            cursorDotRef.current.classList.add('bg-white');
          }
        }
      }
    };

    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('mouseover', handleGlobalMouseOver, { passive: true });

    // 4. ANIMATION FRAME LOOP FOR SMOOTH LERPING (60 FPS)
    let animationFrameId: number;
    
    const updateEasedPositions = () => {
      if (prefersReducedMotion) return;

      // Smooth lag interpolation (lerp) for cursor outer ring
      // ring moves slower (0.12 coefficient) to create beautiful floating tail
      mouse.current.ringX += (mouse.current.targetX - mouse.current.ringX) * 0.14;
      mouse.current.ringY += (mouse.current.targetY - mouse.current.ringY) * 0.14;

      // Ambient spotlight follows cursor even more slowly and softly
      mouse.current.spotX += (mouse.current.targetX - mouse.current.spotX) * 0.06;
      mouse.current.spotY += (mouse.current.targetY - mouse.current.spotY) * 0.06;

      // Update positions on DOM directly
      if (cursorRingRef.current && mouse.current.isVisible) {
        cursorRingRef.current.style.transform = `translate3d(${mouse.current.ringX}px, ${mouse.current.ringY}px, 0)`;
        cursorRingRef.current.style.opacity = '1';
      }
      
      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${mouse.current.spotX}px, ${mouse.current.spotY}px, 0)`;
        spotlightRef.current.style.opacity = '1';
      }

      // Update custom CSS variables on document root for reactive elements like cards & hero background
      document.documentElement.style.setProperty('--mouse-raw-x', `${mouse.current.targetX}`);
      document.documentElement.style.setProperty('--mouse-raw-y', `${mouse.current.targetY}`);
      document.documentElement.style.setProperty('--mouse-lerp-x', `${mouse.current.ringX}`);
      document.documentElement.style.setProperty('--mouse-lerp-y', `${mouse.current.ringY}`);

      animationFrameId = requestAnimationFrame(updateEasedPositions);
    };

    // Only start lerp loop if reduced motion is disabled
    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(updateEasedPositions);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('mouseover', handleGlobalMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReducedMotion]);

  return (
    <>
      {/* 1. ANIMATED TOP SCROLL PROGRESS BAR */}
      <div 
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 z-[100] transition-all duration-75 origin-left"
        style={{ width: `${scrollProgress}%` }}
        id="scroll-progress-bar"
      />

      {/* 2. SOFT INTERACTIVE SPOTLIGHT GLOW EFFECT */}
      {!prefersReducedMotion && (
        <div
          ref={spotlightRef}
          className="fixed -top-[300px] -left-[300px] w-[600px] h-[600px] rounded-full pointer-events-none z-0 mix-blend-screen opacity-0 transition-opacity duration-700"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(20, 184, 166, 0.03) 40%, transparent 70%)',
          }}
          id="spotlight-layer"
        />
      )}

      {/* 3. PREMIUM FLOATING CUSTOM GLOWING CURSOR */}
      {!prefersReducedMotion && (
        <>
          {/* Inner Sharp Dot */}
          <div
            ref={cursorDotRef}
            className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[1000] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out shadow-[0_0_8px_rgba(255,255,255,0.8)] opacity-0"
            id="custom-cursor-dot"
          />
          {/* Outer lag ring */}
          <div
            ref={cursorRingRef}
            className="fixed top-0 left-0 w-9 h-9 border border-white/40 rounded-full pointer-events-none z-[999] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out opacity-0 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.1)]"
            id="custom-cursor-ring"
          >
            {/* Extremely subtle interior radar circle */}
            <div className="w-1 h-1 rounded-full bg-emerald-500/10" />
          </div>
        </>
      )}
    </>
  );
};
