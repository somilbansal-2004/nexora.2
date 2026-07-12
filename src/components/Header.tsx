import React, { useState, useEffect } from 'react';
import { NexoraLogo } from './NexoraLogo';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      // Background change on scroll
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Detect active section
      const sections = ['hero', 'about', 'services', 'portfolio', 'technologies', 'videos', 'contact'];
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'technologies', label: 'Tech Matrix' },
    { id: 'videos', label: 'Videos' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Header height
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
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#0B0F14]/95 backdrop-blur-md border-b border-white/10 shadow-lg py-4'
          : 'bg-transparent border-b border-white/5 py-6'
      }`}
      id="nexora-header"
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('hero')}
          className="hover:opacity-90 transition-opacity focus:outline-none"
        >
          <NexoraLogo size={36} showText={true} />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-300 relative py-1 focus:outline-none ${
                activeSection === item.id
                  ? 'text-emerald-400'
                  : 'text-gray-400 hover:text-emerald-400'
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-emerald-400" />
              )}
            </button>
          ))}
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center">
          <button
            onClick={() => handleNavClick('contact')}
            className="flex items-center gap-1.5 px-6 py-2.5 border-2 border-white/10 text-gray-300 font-bold text-[11px] uppercase tracking-[0.25em] hover:border-emerald-500 hover:text-white hover:bg-emerald-950/20 transition-all duration-300"
          >
            CONNECT NOW
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-300 hover:text-emerald-400 transition-colors focus:outline-none p-1.5"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="fixed inset-0 top-[73px] bg-[#0B0F14]/98 backdrop-blur-lg z-40 md:hidden flex flex-col px-8 py-12 animate-fade-in border-t border-white/10">
          <div className="flex flex-col gap-6">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left text-lg font-bold tracking-widest py-2 border-b border-white/5 transition-all ${
                  activeSection === item.id
                    ? 'text-emerald-400 pl-2'
                    : 'text-gray-400 hover:text-emerald-400'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleNavClick('contact')}
            className="mt-12 flex items-center justify-center gap-2 px-6 py-4 text-xs font-bold tracking-[0.25em] text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none w-full uppercase"
          >
            CONNECT NOW
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
};
