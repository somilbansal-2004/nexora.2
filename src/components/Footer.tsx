import React from 'react';
import { NexoraLogo } from './NexoraLogo';
import { contactData } from '../data';
import { Mail, MessageSquare, Linkedin, Award, Youtube, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
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

  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'technologies', label: 'Tech Matrix' },
    { id: 'videos', label: 'Videos' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <footer className="bg-[#0B0F14] border-t border-white/10 relative overflow-hidden py-16" id="nexora-footer">
      {/* Subtle Background Glows */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-5">
            <NexoraLogo size={36} showText={true} />
            <p className="text-[10px] font-bold tracking-[0.25em] text-emerald-400 uppercase font-mono">
              Engineering the Next Era
            </p>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm font-sans">
              I provide high-quality mechanical design, CAD modeling, hardware assemblies, PCB schematics, and elegant digital portfolio layouts for students, startups, and professionals.
            </p>
          </div>

          {/* Quick Links Map (3 cols) */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] font-bold tracking-[0.2em] text-white uppercase mb-5 font-mono">
              NAVIGATION MAP
            </h4>
            <div className="grid grid-cols-2 gap-y-3 gap-x-6">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className="text-left text-[11px] font-bold text-gray-400 hover:text-emerald-400 transition-all focus:outline-none uppercase tracking-wider"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Social / Direct Contacts (4 cols) */}
          <div className="md:col-span-4">
            <h4 className="text-[10px] font-bold tracking-[0.2em] text-white uppercase mb-5 font-mono">
              DIRECT CHANNELS
            </h4>
            <p className="text-[11px] text-gray-400 leading-relaxed mb-6 font-sans">
              Get in touch directly through any of our channels to discuss active projects, student discounts, or custom commissions.
            </p>
            
            {/* Quick action social bar */}
            <div className="flex items-center gap-3">
              {/* Mail */}
              <a
                href={`mailto:${contactData.email}`}
                className="w-10 h-10 rounded-none bg-[#101419] border border-white/10 hover:border-emerald-500/30 flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:bg-white/5 transition-all shadow-md"
                title="Send Email"
              >
                <Mail className="w-4 h-4" />
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/918939590511`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-none bg-[#101419] border border-white/10 hover:border-emerald-500/30 flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:bg-white/5 transition-all shadow-md"
                title="WhatsApp Direct"
              >
                <MessageSquare className="w-4 h-4" />
              </a>

              {/* LinkedIn */}
              <a
                href={contactData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-none bg-[#101419] border border-white/10 hover:border-emerald-500/30 flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:bg-white/5 transition-all shadow-md"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              {/* GrabCAD */}
              <a
                href={contactData.grabcad}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-none bg-[#101419] border border-white/10 hover:border-emerald-500/30 flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:bg-white/5 transition-all shadow-md"
                title="GrabCAD Models"
              >
                <Award className="w-4 h-4" />
              </a>

              {/* YouTube */}
              <a
                href={contactData.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-none bg-[#101419] border border-white/10 hover:border-emerald-500/30 flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:bg-white/5 transition-all shadow-md"
                title="YouTube Studio"
              >
                <Youtube className="w-4 h-4" />
              </a>

              {/* Instagram */}
              <a
                href={contactData.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-none bg-[#101419] border border-white/10 hover:border-emerald-500/30 flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:bg-white/5 transition-all shadow-md"
                title="Instagram Profile"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
          <p className="text-[10px] text-gray-500 font-mono tracking-wider uppercase">
            &copy; {currentYear} NEXORA STUDIO. All rights reserved.
          </p>
          <div className="flex gap-6 text-[10px] text-gray-500 font-mono tracking-wider uppercase">
            <span className="hover:text-emerald-400 cursor-pointer">TERMS_OF_SERVICE</span>
            <span className="hover:text-emerald-400 cursor-pointer">PRIVACY_POLICY</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
