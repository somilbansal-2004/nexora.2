import React from 'react';
import { NexoraEmblem } from './NexoraLogo';
import { ShieldCheck, Target, Zap, Cpu } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const values = [
    {
      icon: <Cpu className="w-6 h-6 text-emerald-600" />,
      title: 'Parametric Rigor',
      description: 'Every micron, line, and circuit trace is engineered with strict mathematical logic and parametric discipline.',
    },
    {
      icon: <Zap className="w-6 h-6 text-emerald-600" />,
      title: 'Bio-Cybernetic Synergy',
      description: 'Fusing nature’s organic optimization (leaves) with electronic intelligence (circuit traces) for futuristic efficiency.',
    },
    {
      icon: <Target className="w-6 h-6 text-emerald-600" />,
      title: 'Precision-First Execution',
      description: 'Ensuring zero tolerance errors, strict standards compliance, and highly secure IoT/AI connectivity protocols.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      title: 'Production-Grade Quality',
      description: 'Deploying robust automation and durable structures engineered specifically to withstand heavy production lifecycles.',
    },
  ];

  const stats = [
    { value: '0.01mm', label: 'CAD Precision Tolerance' },
    { value: '1500+', label: 'Projects Completed' },
    { value: '4+ Years', label: 'Professional Exp.' },
    { value: '100%', label: 'Systems Integration Rate' },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-[#0B0F14]">
      {/* Background Decorative Patterns */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-950/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-emerald-950/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.05),rgba(0,0,0,0))]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Title */}
        <div className="flex flex-col mb-16 border-b border-white/10 pb-8">
          <span className="text-[10px] font-bold tracking-[0.4em] text-emerald-400 mb-3 uppercase font-mono">
            01 / BRAND IDENTITY
          </span>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white uppercase font-display">
            Fusing Organic & <span className="text-emerald-400 italic font-extrabold">Machine Precision</span>
          </h2>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-20">
          
          {/* Main Story (Left/Middle Column - 7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between p-8 md:p-12 rounded-none bg-[#101419] border border-white/10 hover:border-emerald-500/30 transition-all duration-500 shadow-xl relative group">
            <div className="absolute top-0 left-0 p-1.5 bg-emerald-600 text-[8px] font-mono text-white font-bold tracking-widest uppercase">MODULE: IDENTITY_CORE</div>
            
            <div className="mt-4">
              <p className="text-lg md:text-xl text-emerald-400 font-bold tracking-wide mb-6 leading-relaxed">
                NEXORA represents the absolute apex of multi-disciplinary technology and engineering craft.
              </p>
              
              <p className="text-gray-400 leading-relaxed mb-6 text-sm">
                Our design ethos is anchored by the perfect convergence of <strong>biological elegance</strong> and <strong>high-precision automation</strong>. Symbolized by our custom emblem, the right hemisphere draws inspiration from organic structures—employing the flawless efficiency, fluid curves, and structural integrity found in nature's foliage.
              </p>

              <p className="text-gray-400 leading-relaxed mb-8 text-sm">
                The left hemisphere completes this synthesis through <strong>digital cybernetics</strong>—employing high-density electronic copper traces, micro-controller nodes, and programmatic automation channels. Together, they form an uninterrupted loop of natural symmetry and high-fidelity machine precision.
              </p>
            </div>

            {/* Quick Core values badges */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 bg-emerald-500" />
                <span className="text-[9px] font-bold tracking-[0.25em] text-gray-400 uppercase font-mono">Mechanical Core</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 bg-emerald-500" />
                <span className="text-[9px] font-bold tracking-[0.25em] text-gray-400 uppercase font-mono">AI-Embedded</span>
              </div>
            </div>
          </div>

          {/* Large Emblem Showcase (Right Column - 5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 md:p-12 rounded-none bg-[#101419] border border-white/10 hover:border-emerald-500/30 transition-all duration-500 shadow-xl relative overflow-hidden group">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.04),transparent_65%)]" />
            
            {/* Floating Circuit Paths Graphic */}
            <div className="absolute top-0 right-0 p-1.5 bg-emerald-600 text-[8px] font-mono text-white font-bold tracking-widest uppercase">SYSTEM: ONLINE</div>

            <div className="relative z-10 flex flex-col items-center text-center mt-4">
              {/* Rotating Logo Emblem */}
              <div className="w-48 h-48 md:w-56 md:h-56 flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 rounded-full bg-emerald-500/5 blur-3xl group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 border border-emerald-500/10 rounded-full animate-[spin_40s_linear_infinite]" />
                <div className="absolute inset-4 border border-dashed border-emerald-500/15 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
                <NexoraEmblem size={160} className="relative z-10 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-105 text-emerald-400" />
              </div>

              <span className="text-[10px] font-bold tracking-[0.4em] text-emerald-400 uppercase mb-2 font-mono">
                NEXORA FUSION EMBLEM
              </span>
              <p className="text-[11px] text-gray-400 max-w-[280px] leading-snug">
                Synthesizing parametric hardware traces with organic fluid structures.
              </p>
            </div>
          </div>

        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-24">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className="p-6 md:p-8 rounded-none bg-[#101419] border border-white/10 hover:border-emerald-500/30 transition-all duration-300 text-center shadow-lg"
            >
              <div className="text-2xl md:text-3xl font-bold text-emerald-400 mb-2 tracking-tight font-display">
                {stat.value}
              </div>
              <div className="text-[9px] font-bold tracking-[0.2em] text-gray-500 uppercase font-mono">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Values Section */}
        <div className="border-t border-white/5 pt-20">
          <h3 className="text-xl md:text-2xl font-light text-center text-white mb-12 tracking-wide font-display uppercase">
            Our Core <span className="text-emerald-400 font-extrabold italic">Engineering Principles</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, i) => (
              <div 
                key={i}
                className="p-8 rounded-none bg-[#101419] border border-white/10 hover:border-emerald-500/30 hover:-translate-y-1 transition-all duration-300 shadow-xl"
              >
                <div className="w-12 h-12 rounded-none bg-emerald-950/30 flex items-center justify-center border border-emerald-500/20 mb-6">
                  {val.icon}
                </div>
                <h4 className="text-base font-bold text-white mb-3 uppercase tracking-wider font-mono text-xs text-emerald-400">
                  {val.title}
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
