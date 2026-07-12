/**
 * Premium Web Audio API synthesizer for interactive audio effects.
 * Synthesizes high-fidelity sounds on-the-fly without needing asset files.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    // Avoid creating AudioContext on page load to respect browser autoplay policies.
    // It will be initialized on first user interaction.
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  
  // Resume context if suspended (common in browser security models)
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  return audioCtx;
}

// Keep track of the last play time to prevent overlapping noise or flooding
let lastClickTime = 0;
let lastHoverTime = 0;

/**
 * Plays a premium, soft mechanical glass-digital click sound.
 * Volumed at around 15-20% as requested.
 */
export function playClickSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Prevent overlaps/flooding of sounds within 50ms
  if (now - lastClickTime < 0.05) return;
  lastClickTime = now;

  try {
    // Master Volume node
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.16, now); // 16% volume
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    // High frequency glass chime/click
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1400, now);
    osc1.frequency.exponentialRampToValueAtTime(800, now + 0.08);

    // Dynamic gain for chime
    const gain1 = ctx.createGain();
    gain1.gain.setValueAtTime(0.6, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    // Low-frequency body click (wood/mechanical feel)
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(320, now);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.4, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    // Connect nodes
    osc1.connect(gain1);
    gain1.connect(masterGain);

    osc2.connect(gain2);
    gain2.connect(masterGain);

    masterGain.connect(ctx.destination);

    // Start & Stop
    osc1.start(now);
    osc1.stop(now + 0.12);

    osc2.start(now);
    osc2.stop(now + 0.05);
  } catch (error) {
    console.warn('Audio click playback failed:', error);
  }
}

/**
 * Plays a very soft, futuristic sweeping hover sound.
 * Volume is set very low (around 3-5%) so it remains subtle and premium.
 */
export function playHoverSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Prevent flood of hover sounds (debounce 80ms)
  if (now - lastHoverTime < 0.08) return;
  lastHoverTime = now;

  try {
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.035, now); // Extremely quiet 3.5% volume
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(1050, now + 0.15); // futuristic slide-up sweep

    // Low-pass filter to make it softer and less "buzzy"
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);

    // Connect nodes
    osc.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  } catch (error) {
    console.warn('Audio hover playback failed:', error);
  }
}
