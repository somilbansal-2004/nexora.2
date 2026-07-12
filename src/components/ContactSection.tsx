import React, { useState } from 'react';
import { contactData } from '../data';
import { Mail, MessageSquare, Linkedin, ExternalLink, Send, CheckCircle2, Copy, Youtube, Award, Instagram } from 'lucide-react';
import { AdminPanel } from './AdminPanel';
import { 
  addLeadSubmission, 
  appendSubmissionsToSheet, 
  getAccessToken, 
  getActiveSheetId,
  getLocalSubmissions,
  saveLocalSubmissions
} from '../lib/googleSheets';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [copiedType, setCopiedType] = useState<'email' | 'whatsapp' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    
    // Log the submission locally
    const newLead = addLeadSubmission({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    });

    const activeToken = getAccessToken();
    const activeSheetId = getActiveSheetId();

    const finishSubmit = () => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Auto close notification
      setTimeout(() => setSubmitSuccess(false), 5000);
    };

    if (activeToken && activeSheetId) {
      // Admin is authenticated, auto-append submission directly to Google Sheets!
      appendSubmissionsToSheet(activeToken, activeSheetId, [newLead])
        .then(() => {
          // Update local cache as synced
          const submissions = getLocalSubmissions();
          const updated = submissions.map(s => s.id === newLead.id ? { ...s, synced: true } : s);
          saveLocalSubmissions(updated);
          finishSubmit();
        })
        .catch(err => {
          console.error('Auto-sync to Google Sheet failed, cached locally:', err);
          finishSubmit();
        });
    } else {
      // Simulate high-end backend dispatch (stored in local database)
      setTimeout(() => {
        finishSubmit();
      }, 1000);
    }
  };

  const copyToClipboard = (text: string, type: 'email' | 'whatsapp') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[#0B0F14]">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-950/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-950/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col mb-16 border-b border-white/5 pb-8">
          <span className="text-[10px] font-bold tracking-[0.4em] text-[#D4AF37] mb-3 uppercase">
            05 / CONNECT WITH US
          </span>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white uppercase font-display">
            Initiate the <span className="font-extrabold italic text-[#D4AF37]">Next Build</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Handles & Channels (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-8 md:p-10 rounded-none bg-[#0B0F14]/90 border border-white/10 hover:border-emerald-500/20 transition-all duration-500 shadow-2xl relative">
            <div>
              <h3 className="text-sm font-bold text-white mb-2 tracking-wider uppercase font-display">
                Direct Contact <span className="text-[#D4AF37]">Rosters</span>
              </h3>
              <p className="text-white/40 text-xs leading-relaxed mb-8">
                Reach out directly via secure networks or browse our design credentials across various engineering communities.
              </p>

              {/* Direct channels list */}
              <div className="flex flex-col gap-5 mb-10">
                {/* Email Channel */}
                <div className="flex items-center justify-between p-4 rounded-none bg-[#0B0F14]/70 border border-white/5 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-none bg-[#0B0F14] flex items-center justify-center text-emerald-400 border border-white/10">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-white/40 tracking-wider uppercase font-mono">SECURE EMAIL</div>
                      <a href={`mailto:${contactData.email}`} className="text-xs font-semibold text-gray-300 hover:text-white transition-colors">
                        {contactData.email}
                      </a>
                    </div>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(contactData.email, 'email')}
                    className="p-2 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all focus:outline-none"
                    title="Copy to clipboard"
                  >
                    {copiedType === 'email' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* WhatsApp Channel */}
                <div className="flex items-center justify-between p-4 rounded-none bg-[#0B0F14]/70 border border-white/5 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-none bg-[#0B0F14] flex items-center justify-center text-[#D4AF37] border border-white/10">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-white/40 tracking-wider uppercase font-mono">WHATSAPP DIRECT</div>
                      <a href={`https://wa.me/918939590511`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-gray-300 hover:text-white transition-colors">
                        {contactData.whatsapp}
                      </a>
                    </div>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(contactData.whatsapp, 'whatsapp')}
                    className="p-2 text-gray-500 hover:text-amber-400 hover:bg-amber-500/5 transition-all focus:outline-none"
                    title="Copy to clipboard"
                  >
                    {copiedType === 'whatsapp' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Professional Handles and Communities */}
              <h4 className="text-[9px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase mb-5">
                CREATIVE & CAD NETWORKS
              </h4>

              <div className="flex flex-col gap-3">
                {/* LinkedIn */}
                <a
                  href={contactData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-none border border-white/5 hover:border-[#0F766E]/50 bg-white/2 hover:bg-white/5 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <Linkedin className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-gray-300 group-hover:text-white">LinkedIn Profile</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>

                {/* GrabCAD */}
                <a
                  href={contactData.grabcad}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-none border border-white/5 hover:border-[#D4AF37]/50 bg-white/2 hover:bg-white/5 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <Award className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-xs font-semibold text-gray-300 group-hover:text-white">GrabCAD CAD Models</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>

                {/* YouTube */}
                <a
                  href={contactData.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-none border border-white/5 hover:border-red-500/20 bg-white/2 hover:bg-white/5 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <Youtube className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-semibold text-gray-300 group-hover:text-white">Nexora YouTube Channel</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>

                {/* Instagram */}
                <a
                  href={contactData.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-none border border-white/5 hover:border-pink-500/20 bg-white/2 hover:bg-white/5 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <Instagram className="w-4 h-4 text-pink-400" />
                    <span className="text-xs font-semibold text-gray-300 group-hover:text-white">Nexora.Official</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              </div>
            </div>

            {/* Availability Badge */}
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-bold tracking-widest text-emerald-400 uppercase font-mono">
                Active for custom commissions
              </span>
            </div>
          </div>

          {/* Right Column: Luxurious Contact Form (7 cols) */}
          <div className="lg:col-span-7 p-8 md:p-10 rounded-none bg-[#0B0F14]/90 border border-white/10 hover:border-[#D4AF37]/30 transition-all duration-500 shadow-2xl relative">
            <h3 className="text-sm font-bold text-white mb-2 tracking-wider uppercase font-display">
              Transmit <span className="text-[#D4AF37]">Secure Brief</span>
            </h3>
            <p className="text-white/40 text-xs leading-relaxed mb-8">
              Fill out your project specifications below. Our diagnostic engine will process your details instantly.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Name & Email Group */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-[9px] font-bold text-white/40 tracking-widest uppercase font-mono">Name *</label>
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder="Somil Bansal"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="px-4 py-3 rounded-none bg-[#0B0F14] border border-white/10 focus:border-[#D4AF37] focus:ring-0 text-white placeholder-white/20 text-xs outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-[9px] font-bold text-white/40 tracking-widest uppercase font-mono">Email *</label>
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="client@enterprise.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="px-4 py-3 rounded-none bg-[#0B0F14] border border-white/10 focus:border-[#D4AF37] focus:ring-0 text-white placeholder-white/20 text-xs outline-none transition-all"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-[9px] font-bold text-white/40 tracking-widest uppercase font-mono">Subject</label>
                <input
                  type="text"
                  id="subject"
                  placeholder="CAD Assembly Commission / Automation Integration"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="px-4 py-3 rounded-none bg-[#0B0F14] border border-white/10 focus:border-[#D4AF37] focus:ring-0 text-white placeholder-white/20 text-xs outline-none transition-all"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-[9px] font-bold text-white/40 tracking-widest uppercase font-mono">Message Brief *</label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  placeholder="Describe your mechanical parameters, electronic inputs, or design guidelines..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="px-4 py-3 rounded-none bg-[#0B0F14] border border-white/10 focus:border-[#D4AF37] focus:ring-0 text-white placeholder-white/20 text-xs outline-none transition-all resize-none"
                />
              </div>

              {/* Inline Notifications */}
              {submitSuccess && (
                <div className="p-4 rounded-none bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 text-[10px] flex items-center gap-3 animate-fade-in font-mono tracking-wider">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <span className="font-bold block mb-0.5">TRANSMISSION ENCRYPTED & SUBMITTED</span>
                    Thank you! Your project parameters have been logged. We will contact you shortly.
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 flex items-center justify-center gap-2 px-6 py-3.5 rounded-none text-[11px] font-bold uppercase tracking-[0.25em] text-white bg-[#0F766E] hover:bg-[#115e59] focus:outline-none transition-all disabled:opacity-55 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    TRANSMITTING DATA...
                  </>
                ) : (
                  <>
                    TRANSMIT SECURE DATA
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Google Sheets Sync & Leads Command Center */}
        <AdminPanel />

      </div>
    </section>
  );
};
