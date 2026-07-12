import React, { useState, useRef } from 'react';
import { servicesData } from '../data';
import * as Icons from 'lucide-react';

interface ServiceCardProps {
  service: typeof servicesData[0];
  renderIcon: (iconName: string) => React.ReactNode;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, renderIcon }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [glarePosition, setGlarePosition] = useState({ x: 0, y: 0 });
  const [showGlare, setShowGlare] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position inside element
    const y = e.clientY - rect.top;  // y position inside element
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Tilt angle max: 12 degrees
    const rotateX = ((centerY - y) / centerY) * 12;
    const rotateY = ((x - centerX) / centerX) * 12;
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025)`);
    setGlarePosition({ x, y });
    setShowGlare(true);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setShowGlare(false);
  };

  const isDigital = service.category === 'digital';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.3s, box-shadow 0.3s',
        transformStyle: 'preserve-3d',
      }}
      className="group p-8 rounded-none bg-[#101419] border border-white/10 hover:border-emerald-500/45 hover:shadow-[0_0_30px_rgba(16,185,129,0.12)] shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[290px] select-none"
    >
      {/* Glare effect inside the 3D card */}
      {showGlare && (
        <div 
          className="absolute pointer-events-none rounded-full blur-[60px] opacity-25 z-0"
          style={{
            width: '150px',
            height: '150px',
            background: 'radial-gradient(circle, #10b981 0%, transparent 70%)',
            left: `${glarePosition.x - 75}px`,
            top: `${glarePosition.y - 75}px`,
          }}
        />
      )}

      <div className="relative z-10">
        {/* Decorative Hover Corner Accents */}
        <div className="absolute top-[-24px] right-[-24px] p-1.5 bg-emerald-950/40 text-[7px] font-mono text-gray-500 group-hover:text-emerald-400 transition-colors">
          SEC_{service.id.toUpperCase().replace(/-/g, '_')}
        </div>

        {/* Service Category Tag & Icon */}
        <div className="mb-6 flex items-center justify-between" style={{ transform: 'translateZ(20px)' }}>
          <div className="w-12 h-12 rounded-none bg-emerald-950/20 flex items-center justify-center border border-emerald-500/20 group-hover:border-emerald-500/50 transition-all duration-300">
            {renderIcon(service.iconName)}
          </div>
          
          <span className={`text-[9px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-none border ${
            isDigital 
              ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' 
              : 'border-emerald-600/25 text-emerald-300 bg-emerald-600/5'
          }`}>
            {service.category === 'engineering' ? 'Engineering' : 'Creative'}
          </span>
        </div>

        {/* Service Information */}
        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors duration-300 font-display uppercase tracking-tight" style={{ transform: 'translateZ(30px)' }}>
          {service.title}
        </h3>
        
        <p className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300" style={{ transform: 'translateZ(10px)' }}>
          {service.description}
        </p>
      </div>

      {/* Tech Line Detail decoration */}
      <div className="w-0 h-[2px] bg-gradient-to-r from-emerald-500 to-emerald-600 absolute bottom-0 left-0 group-hover:w-full transition-all duration-500 z-10" />
    </div>
  );
};

export const ServicesSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'engineering' | 'digital'>('all');

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'engineering', label: 'Mechanical & Engineering' },
    { id: 'digital', label: 'Creative & Design' },
  ] as const;

  const filteredServices = servicesData.filter(
    (service) => activeCategory === 'all' || service.category === activeCategory
  );

  // Helper to dynamically render Lucide icons
  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    if (!IconComponent) return <Icons.HelpCircle className="w-6 h-6 text-emerald-400" />;
    return <IconComponent className="w-6 h-6 text-emerald-400 animate-pulse" />;
  };

  return (
    <section id="services" className="py-24 relative overflow-hidden bg-[#0B0F14]">
      {/* Background Radial Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-950/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-white/10 pb-8">
          <div>
            <span className="text-[10px] font-bold tracking-[0.4em] text-emerald-400 mb-3 uppercase block font-mono">
              02 / SERVICES
            </span>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white uppercase font-display">
              SPECIALIZED <span className="text-emerald-400 italic font-extrabold">CAPABILITIES</span>
            </h2>
          </div>
          <p className="text-gray-400 max-w-md mt-4 md:mt-0 leading-relaxed text-xs font-sans">
            Providing high-precision mechanical designs, SolidWorks & Fusion 360 parametric modeling, and advanced creative digital design services tailored for students and enterprises.
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap gap-2.5 mb-12 border-b border-white/10 pb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 focus:outline-none rounded-none border ${
                activeCategory === cat.id
                  ? 'text-white border-emerald-600 bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'text-gray-400 border-white/10 hover:text-white hover:bg-white/5 hover:border-white/20 bg-[#101419]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              renderIcon={renderIcon} 
            />
          ))}
        </div>

      </div>
    </section>
  );
};
