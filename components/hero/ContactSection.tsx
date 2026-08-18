'use client';

import React from 'react';
import { Phone, Instagram, Linkedin, Mail, Github, FileText, Sparkles } from 'lucide-react';
import { ContactInfo } from '@/lib/types';
import SectionWrapper from '../ui/SectionWrapper';
import GlassCard from '../cards/GlassCard';
import dynamic from 'next/dynamic';

const Contact3DGlobe = dynamic(() => import('../3d/Contact3DGlobe'), {
  ssr: false,
});

interface ContactSectionProps {
  contact?: ContactInfo;
  sectionRef?: React.RefObject<HTMLElement | null>;
}

const ContactSection: React.FC<ContactSectionProps> = ({ contact, sectionRef }) => {
  const mail = contact?.msg?.Mail || 'krishnanaik7483@gmail.com';
  const phone = contact?.msg?.Phone || '+917483861214';
  const linkedin = contact?.follow?.Linkedin || 'https://www.linkedin.com/in/krishna-naik-b94723277';
  const instagram = contact?.follow?.Instagram || 'https://www.instagram.com/krishna_naik_6/';
  const github = contact?.follow?.Github || 'https://github.com/KrishnaNaik6';

  return (
    <SectionWrapper ref={sectionRef} id="contact" title="Get In Touch" terminalCommand="ssh reachout@krishna">
      <div className="max-w-4xl mx-auto space-y-10 relative">
        {/* Editorial Heading Banner */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-indigo/15 border border-neon-indigo/30 text-neon-indigo text-xs font-mono uppercase tracking-widest">
            <Sparkles size={14} />
            <span>Open to Opportunities & Collaborations</span>
          </div>

          <h3 className="text-3xl md:text-5xl lg:text-6xl font-black font-sora tracking-tight text-text-primary">
            LET'S CREATE SOMETHING <span className="text-neon-indigo text-glow-indigo">EXTRAORDINARY.</span>
          </h3>

          <p className="text-text-secondary text-base md:text-lg max-w-xl mx-auto font-medium">
            "Don't hesitate to say hello 👋. I enjoy networking and learning from people across the world."
          </p>
        </div>

        {/* Contact Glass Card with 3D Globe Background */}
        <GlassCard className="p-8 md:p-12 max-w-3xl mx-auto text-center relative overflow-hidden shadow-2xl border-neon-indigo/30">
          <Contact3DGlobe />
          <div className="absolute inset-0 rounded-3xl pointer-events-none transition-all duration-500 ring-1 ring-neon-indigo/40 shadow-[0_0_35px_var(--shadow-indigo)] z-20" />

          <p className="text-sm md:text-base text-text-secondary mb-10 leading-relaxed max-w-lg mx-auto relative z-20">
            I'm always open to feedback, opportunities, and collaborations in tech, AI, and development. Feel free to drop a message!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 text-left gap-8 relative z-20">
            {/* Column 1: Direct Communication */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-neon-indigo font-bold pb-2 border-b border-border-color">
                Reach Me Anytime
              </h4>
              <div className="space-y-3.5">
                <a
                  href={`mailto:${mail}`}
                  className="flex items-center group text-text-primary hover:text-neon-indigo transition-colors"
                >
                  <div className="p-2.5 rounded-xl bg-neon-indigo/10 border border-neon-indigo/30 text-neon-indigo group-hover:scale-110 transition-transform mr-3.5">
                    <Mail size={16} />
                  </div>
                  <span className="text-sm font-sora font-semibold">Say Hello</span>
                </a>

                <a
                  href={`tel:${phone}`}
                  className="flex items-center group text-text-primary hover:text-neon-indigo transition-colors"
                >
                  <div className="p-2.5 rounded-xl bg-neon-indigo/10 border border-neon-indigo/30 text-neon-indigo group-hover:scale-110 transition-transform mr-3.5">
                    <Phone size={16} />
                  </div>
                  <span className="text-sm font-sora font-semibold">Let's Talk</span>
                </a>

                <div className="flex items-center text-text-secondary pt-2">
                  <Mail size={16} className="text-neon-rose mr-3.5 shrink-0" />
                  <span className="text-xs font-mono break-all">{mail}</span>
                </div>
              </div>
            </div>

            {/* Column 2: Social Links */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-neon-rose font-bold pb-2 border-b border-border-color">
                Follow Me On
              </h4>
              <div className="space-y-3.5">
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center group text-text-primary hover:text-neon-rose transition-colors"
                >
                  <div className="p-2.5 rounded-xl bg-neon-rose/10 border border-neon-rose/30 text-neon-rose group-hover:scale-110 transition-transform mr-3.5">
                    <Instagram size={16} />
                  </div>
                  <span className="text-sm font-sora font-semibold">Instagram</span>
                </a>

                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center group text-text-primary hover:text-neon-cyan transition-colors"
                >
                  <div className="p-2.5 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan group-hover:scale-110 transition-transform mr-3.5">
                    <Linkedin size={16} />
                  </div>
                  <span className="text-sm font-sora font-semibold">LinkedIn</span>
                </a>

                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center group text-text-secondary hover:text-neon-indigo transition-colors"
                >
                  <div className="p-2.5 rounded-xl bg-slate-950/40 border border-border-color text-text-secondary group-hover:scale-110 transition-transform mr-3.5">
                    <Github size={16} />
                  </div>
                  <span className="text-sm font-sora font-semibold">GitHub Profile</span>
                </a>
              </div>
            </div>
          </div>

          <p className="text-xs text-text-secondary mt-10 italic font-mono relative z-20">
            Replies expected within 24–48 hours
          </p>
        </GlassCard>

        {/* Floating Resume Button */}
        <div className="text-center pt-2">
          <a
            href="/KrishnaNaik.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-neon-indigo via-neon-purple to-neon-indigo bg-[length:200%_auto] text-white font-bold text-sm font-sora hover:scale-105 transition-all shadow-[0_0_25px_rgba(99,102,241,0.4)] group"
          >
            <FileText className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Download Official Resume</span>
          </a>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default ContactSection;

