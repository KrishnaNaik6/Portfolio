'use client';

import React from 'react';
import { Phone, Instagram, Linkedin, Mail, Github, FileText } from 'lucide-react';
import { ContactInfo } from '@/lib/types';
import SectionWrapper from '../ui/SectionWrapper';
import GlassCard from '../cards/GlassCard';

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
    <SectionWrapper ref={sectionRef} id="contact" title="Contact" terminalCommand="ssh reachout@krishna">
      <p className="text-center text-text-primary text-base md:text-lg mb-8 italic max-w-xl mx-auto font-medium">
        "Don't hesitate to say hello 👋. I enjoy networking and learning from people across the world."
      </p>

      <GlassCard className="p-8 md:p-12 max-w-2xl mx-auto text-center relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-500 ring-2 ring-neon-cyan/40 shadow-[0_0_30px_var(--shadow-cyan)]" />

        <h3 className="text-2xl md:text-3xl font-extrabold text-neon-cyan mb-4 font-sora border-b border-neon-cyan/40 pb-2 inline-block">
          Drop a message
        </h3>

        <p className="text-sm md:text-base text-text-secondary mb-8 leading-relaxed max-w-lg mx-auto">
          I'm always open to feedback, opportunities, and collaborations in tech, AI, and development. Feel free to drop a message below!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 text-left gap-8">
          {/* Column 1: Reach me anytime */}
          <div>
            <h4 className="text-base font-bold text-text-primary mb-4 uppercase tracking-wider font-mono">
              Reach me anytime
            </h4>
            <div className="space-y-4 text-sm">
              <a
                href={`mailto:${mail}`}
                className="flex items-center group text-text-primary hover:text-neon-cyan transition-colors"
              >
                <Mail className="w-4 h-4 mr-3 text-neon-cyan group-hover:text-neon-pink transition-colors" />
                <span>Say hello</span>
              </a>

              <a
                href={`tel:${phone}`}
                className="flex items-center group text-text-primary hover:text-neon-cyan transition-colors"
              >
                <Phone className="w-4 h-4 mr-3 text-neon-cyan group-hover:text-neon-pink transition-colors" />
                <span>Let's Talk</span>
              </a>

              <div className="flex items-center text-text-secondary pt-1">
                <Mail className="w-4 h-4 mr-3 text-neon-pink shrink-0" />
                <span className="text-xs font-mono break-all">{mail}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Follow me on */}
          <div>
            <h4 className="text-base font-bold text-text-primary mb-4 uppercase tracking-wider font-mono">
              Follow me on
            </h4>
            <div className="space-y-4 text-sm">
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center group text-text-primary hover:text-neon-pink transition-colors"
              >
                <Instagram className="w-4 h-4 mr-3 text-neon-pink" />
                <span>Instagram</span>
              </a>

              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center group text-text-primary hover:text-neon-cyan transition-colors"
              >
                <Linkedin className="w-4 h-4 mr-3 text-neon-cyan" />
                <span>LinkedIn</span>
              </a>

              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center group text-text-secondary hover:text-neon-cyan transition-colors"
              >
                <Github className="w-4 h-4 mr-3 text-text-secondary" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>

        <p className="text-xs text-text-secondary mt-10 italic">
          I usually reply within 24–48 hours
        </p>
      </GlassCard>

      {/* Resume Link */}
      <div className="text-center mt-8">
        <a
          href="/KrishnaNaik.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30 text-neon-cyan hover:text-white hover:bg-neon-cyan hover:border-transparent transition-all duration-300 shadow-lg group"
        >
          <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-sm">My Resume</span>
        </a>
      </div>
    </SectionWrapper>
  );
};

export default ContactSection;
