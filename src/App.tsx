import React from 'react';
import { Header } from './components/Header';
import { ThreeHeroLogo } from './components/ThreeHeroLogo';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { PortfolioSection } from './components/PortfolioSection';
import { TechnologiesSection } from './components/TechnologiesSection';
import { YoutubeShowcase } from './components/YoutubeShowcase';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { StatCounter } from './components/StatCounter';
import { ArrowRight, Cpu, Zap, Bot, Sparkles, Phone, Mail } from 'lucide-react';

export default function App() {
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Header offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white font-sans selection:bg-emerald-500/20 selection:text-emerald-400 overflow-x-hidden relative" id="nexora-app-root">
      {/* Background Circuit Patterns (Dark Emerald Theme) */}
      <div className="absolute inset-0 opacity-25 pointer-events-none z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(16,185,129,0.08)" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <circle cx="200" cy="200" r="300" fill="url(#emerald-glow)" filter="blur(120px)" />
          <circle cx="800" cy="600" r="250" fill="url(#gold-glow)" filter="blur(120px)" />
          <defs>
            <radialGradient id="emerald-glow"><stop offset="0%" stopColor="#10B981" stopOpacity="0.15" /><stop offset="100%" stopColor="#0B0F14" stopOpacity="0" /></radialGradient>
            <radialGradient id="gold-glow"><stop offset="0%" stopColor="#F59E0B" stopOpacity="0.08" /><stop offset="100%" stopColor="#0B0F14" stopOpacity="0" /></radialGradient>
          </defs>
        </svg>
      </div>

      {/* Sticky Top Header */}
      <Header />

      {/* Hero Section */}
      <section
        id="hero"
        className="min-h-screen pt-28 md:pt-36 flex flex-col justify-center relative overflow-hidden bg-[#0B0F14] pb-16"
      >
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Block: Technical copy (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left animate-fade-in group/hero" id="hero-text-block">
            {/* Tagline Indicator */}
            <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-950/40 border border-emerald-500/30 mb-6 relative overflow-hidden group select-none transition-all duration-300 group-hover/hero:border-emerald-400 group-hover/hero:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <div className="w-2 h-2 rounded-full bg-[#4CAF50] animate-pulse" />
              <span className="text-[10px] md:text-xs font-bold tracking-[0.35em] text-emerald-400 uppercase font-mono">
                Engineering the Next Era
              </span>
            </div>

            {/* Main Title Heading */}
            <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tighter text-white mb-2 font-display select-none transition-all duration-300">
              NEXORA
            </h1>

            {/* Subtitle */}
            <p className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.3em] text-emerald-400 mb-6 font-extrabold leading-tight transition-all duration-300 group-hover/hero:text-emerald-300">
              Engineering • CAD • Product Design • Creative Studio
            </p>

            {/* Description Paragraph */}
            <p className="text-gray-400 text-sm leading-relaxed max-w-xl mb-6">
              I am <strong className="text-white font-extrabold">Somil Bansal</strong>, a Mechanical Engineer, CAD Designer, Electrical Designer, and Creative Designer with <strong className="text-white font-semibold">4+ years of professional experience</strong>. I provide high-quality engineering and creative design services for students, startups, businesses, and professionals.
            </p>

            {/* Highlights Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 mb-8 text-xs font-mono text-gray-300 bg-emerald-500/5 p-5 border border-white/10 w-full max-w-xl transition-all duration-300 group-hover/hero:border-emerald-500/30 group-hover/hero:bg-emerald-500/[0.08]">
              <div className="flex items-center gap-2">✅ 4+ Years of Experience</div>
              <div className="flex items-center gap-2">✅ 1500+ Projects Completed</div>
              <div className="flex items-center gap-2">✅ Professional CAD Services</div>
              <div className="flex items-center gap-2 font-semibold text-emerald-400">🎓 30% Student Discount</div>
              <div className="flex items-center gap-2">🚀 Fast Delivery</div>
              <div className="flex items-center gap-2">💬 24/7 Support</div>
            </div>

            {/* Dynamic CTA Triggers - "Hire Me", "Get a Quote", "Contact Now" */}
            <div className="flex flex-wrap items-center gap-4 w-full mb-10">
              <button
                onClick={() => handleScrollTo('contact')}
                className="flex items-center justify-center gap-2.5 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold uppercase tracking-[0.25em] transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] focus:outline-none border border-emerald-600"
              >
                Hire Me
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>

              <button
                onClick={() => handleScrollTo('contact')}
                className="flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#101419] border border-emerald-500/30 text-emerald-400 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-emerald-950/20 hover:text-emerald-300 transition-all cursor-pointer focus:outline-none shadow-[0_0_15px_rgba(16,185,129,0.15)]"
              >
                Get a Quote
              </button>

              <button
                onClick={() => handleScrollTo('contact')}
                className="flex items-center justify-center gap-2 px-6 py-3.5 border border-white/10 hover:border-emerald-500/30 text-gray-300 hover:text-emerald-400 text-[11px] font-bold uppercase tracking-[0.25em] transition-all cursor-pointer bg-[#141A22] hover:bg-white/5 focus:outline-none"
              >
                Contact Now
              </button>
            </div>

            {/* Live stats row inside Hero - Count-Up Animations */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full pt-8 border-t border-white/10 bg-transparent">
              <StatCounter end={4} suffix="+" label="Years Experience" />
              <StatCounter end={1500} suffix="+" label="Projects Completed" />
              <StatCounter end={100} suffix="%" label="Client Satisfaction" />
              <StatCounter end={24} suffix="/7" label="Support Avail" />
            </div>
          </div>

          {/* Right Block: Rotating 3D WebGL Emblem Centerpiece (5 cols) */}
          <div className="lg:col-span-5 flex items-center justify-center relative w-full group" id="hero-3d-logo-block">
            {/* Decorative tech labels */}
            <div className="absolute top-4 right-4 p-2 border-l border-b border-emerald-500 text-[9px] text-emerald-400 font-mono select-none z-20">SYSTEM: ACTIVE</div>
            <div className="absolute bottom-10 left-[-20px] text-[9px] text-emerald-400 font-mono leading-tight select-none hidden md:block z-20">
              POS_X: 104.22<br/>
              POS_Y: 890.11<br/>
              VECTOR: 0.992
            </div>
            <ThreeHeroLogo />
          </div>

        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Services Section */}
      <ServicesSection />

      {/* Portfolio Section */}
      <PortfolioSection />

      {/* Technologies Section */}
      <TechnologiesSection />

      {/* YouTube Showcase Section */}
      <YoutubeShowcase />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
