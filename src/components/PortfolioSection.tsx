import React, { useState } from 'react';
import { portfolioData } from '../data';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const PortfolioSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'mechanical' | 'electrical' | 'automation' | 'creative'>('all');

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'mechanical', label: 'Mechanical & CAD' },
    { id: 'electrical', label: 'Electrical & PCB' },
    { id: 'automation', label: 'Robotics & CNC' },
    { id: 'creative', label: 'Creative & Digital' },
  ] as const;

  const filteredProjects = portfolioData.filter(
    (project) => activeFilter === 'all' || project.category === activeFilter
  );

  return (
    <section id="portfolio" className="py-24 relative overflow-hidden bg-[#0B0F14]">
      {/* Decorative Blueprint Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F14]/40 via-transparent to-[#0B0F14]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-white/10 pb-8">
          <div>
            <span className="text-[10px] font-bold tracking-[0.4em] text-emerald-400 mb-3 uppercase block font-mono">
              03 / ENGINEERING IN ACTION
            </span>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white uppercase font-display">
              PORTFOLIO & <span className="text-emerald-400 italic font-extrabold">SYSTEMS</span>
            </h2>
          </div>
          <p className="text-gray-400 max-w-md mt-4 md:mt-0 leading-relaxed text-xs font-sans">
            Discover my high-precision physical models, solid assemblies, schematic layouts, and creative design portfolio completed for students and startups.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 md:gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold transition-all duration-300 border-2 focus:outline-none rounded-none ${
                activeFilter === filter.id
                  ? 'border-emerald-600 text-emerald-400 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                  : 'border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/5 bg-[#101419]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Project Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project, index) => {
            const isWide = index === 0 && activeFilter === 'all';
            
            return (
              <div
                key={project.id}
                className={`group rounded-none bg-[#101419] border border-white/10 hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.12)] overflow-hidden transition-all duration-300 flex flex-col relative ${
                  isWide ? 'lg:col-span-2' : ''
                }`}
                id={`portfolio-card-${project.id}`}
              >
                {/* Image Container with Zoom & Tint Hover Overlay */}
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  {/* Subtle fade overlay over images */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101419] via-transparent to-transparent z-10" />
                  
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />

                  {/* Top Category Badge */}
                  <div className="absolute top-6 left-6 z-20">
                    <span className="text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-none border-2 border-emerald-500/10 text-emerald-400 bg-emerald-950/40 shadow-sm font-mono">
                      {project.subtitle.split(' & ')[0]}
                    </span>
                  </div>

                  {/* Corner Accent Link */}
                  <div className="absolute top-6 right-6 z-20 translate-x-4 -translate-y-4 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-10 h-10 rounded-none border-2 border-emerald-500/15 bg-[#101419] flex items-center justify-center text-emerald-400 shadow-sm">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Info Container */}
                <div className="p-8 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors duration-300 font-display uppercase tracking-tight">
                      {project.title}
                    </h3>
                    <p className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase mb-4 font-mono">
                      {project.subtitle}
                    </p>
                    <p className="text-gray-400 text-xs leading-relaxed mb-6">
                      {project.description}
                    </p>
                  </div>

                  {/* Specs List Details */}
                  <div className="pt-6 border-t border-white/5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {project.specifications.map((spec, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span className="text-[10px] text-gray-500 font-mono tracking-wider">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hover line tracker */}
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-emerald-500 to-emerald-600 group-hover:w-full transition-all duration-500" />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
