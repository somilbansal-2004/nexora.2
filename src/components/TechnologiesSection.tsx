import React, { useState } from 'react';
import { technologiesData } from '../data';
import { Cpu, Radio, Network, Lightbulb } from 'lucide-react';

export const TechnologiesSection: React.FC = () => {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  const categories = [
    {
      id: 'hardware',
      label: 'CAD & Hardware Design',
      icon: <Cpu className="w-5 h-5 text-emerald-400" />,
      items: technologiesData.filter((t) => t.category === 'hardware'),
      description: 'Parametric solid assemblies, structural FEA simulation, thermal analytics, and multi-layer PCB designs.',
    },
    {
      id: 'automation',
      label: 'Automation & CNC',
      icon: <Radio className="w-5 h-5 text-emerald-400" />,
      items: technologiesData.filter((t) => t.category === 'automation'),
      description: 'Multi-node sensor integration, real-time wireless telemetry, G-code execution, and mechanical axis control.',
    },
    {
      id: 'software',
      label: 'Software & AI Integration',
      icon: <Network className="w-5 h-5 text-emerald-400" />,
      items: technologiesData.filter((t) => t.category === 'software'),
      description: 'Advanced custom scripting, dynamic UI tools, embedded firmware, and interactive web tools.',
    },
    {
      id: 'creative',
      label: 'Creative & Media Synthesis',
      icon: <Lightbulb className="w-5 h-5 text-emerald-400" />,
      items: technologiesData.filter((t) => t.category === 'creative'),
      description: 'Cinematic video sequencing, high-fidelity brand design, vector layouts, and professional portfolio production.',
    },
  ];

  return (
    <section id="technologies" className="py-24 relative overflow-hidden bg-[#0B0F14]">
      {/* Interactive Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent" />
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-emerald-950/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Title */}
        <div className="flex flex-col mb-16 border-b border-white/10 pb-8">
          <span className="text-[10px] font-bold tracking-[0.4em] text-emerald-400 mb-3 uppercase font-mono">
            04 / TECHNOLOGY MATRIX
          </span>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white uppercase font-display">
            The Professional <span className="text-emerald-400 italic font-extrabold">Stack</span>
          </h2>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {categories.map((cat, cIdx) => (
            <div
              key={cat.id}
              className="p-8 rounded-none bg-[#101419] border border-white/10 hover:border-emerald-500/30 transition-all duration-300 shadow-xl relative"
            >
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-none bg-emerald-950/30 flex items-center justify-center border border-emerald-500/20">
                  {cat.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wider uppercase font-display">{cat.label}</h3>
                  <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase font-mono">Category {cIdx + 1}</span>
                </div>
              </div>

              <p className="text-gray-400 text-xs leading-relaxed mb-8 border-b border-white/5 pb-4 font-sans">
                {cat.description}
              </p>

              {/* Items Grid */}
              <div className="flex flex-col gap-5">
                {cat.items.map((tech) => {
                  const isHovered = hoveredTech === tech.name;
                  const barColor = 'bg-emerald-500';
                  const textColor = 'text-emerald-400';

                  return (
                    <div
                      key={tech.name}
                      className="group/item cursor-pointer"
                      onMouseEnter={() => setHoveredTech(tech.name)}
                      onMouseLeave={() => setHoveredTech(null)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {/* Code Abbreviation tag */}
                          <span className={`w-10 h-6 rounded-none flex items-center justify-center font-mono text-[9px] font-bold border transition-all duration-300 ${
                            isHovered 
                              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' 
                              : 'bg-[#141A22] border-white/5 text-gray-500'
                          }`}>
                            {tech.logoText}
                          </span>
                          <span className="text-xs font-bold text-gray-300 group-hover/item:text-emerald-400 transition-colors">
                            {tech.name}
                          </span>
                        </div>

                        {/* rating percentage */}
                        <span className={`font-mono text-[10px] font-bold ${textColor}`}>
                          {tech.rating}%
                        </span>
                      </div>

                      {/* Diagnostic Progress Bar */}
                      <div className="h-1.5 w-full bg-[#141A22] rounded-none overflow-hidden border border-white/5 relative">
                        <div
                          className={`h-full rounded-none ${barColor} transition-all duration-500 ease-out`}
                          style={{
                            width: isHovered ? `${tech.rating}%` : '20%',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
