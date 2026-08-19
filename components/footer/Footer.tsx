'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Github, Linkedin, Instagram, Mail, ArrowUpRight } from 'lucide-react';
import AnchorLink from '../ui/AnchorLink';

import { ContactInfo } from '@/lib/types';

interface FooterProps {
  contact?: ContactInfo;
}

const Footer: React.FC<FooterProps> = ({ contact }) => {
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [year, setYear] = useState<number>(2026);

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    setYear(now.getFullYear());
    setCurrentDate(
      now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    );
  }, []);

  const navLinks = [
    { name: 'About', id: 'about' },
    { name: 'Education', id: 'education' },
    { name: 'Experience', id: 'experience' },
    { name: 'Projects', id: 'projects' },
    { name: 'Skills', id: 'skills' },
    { name: 'Git Stats', id: 'git-stats' },
    { name: 'Contact', id: 'contact' },
  ];

  const githubUrl = contact?.follow?.Github || 'https://github.com/KrishnaNaik6';
  const linkedinUrl = contact?.follow?.Linkedin;
  const instagramUrl = contact?.follow?.Instagram;
  const email = contact?.msg?.Mail;

  const socialLinks = [
    ...(githubUrl ? [{ name: 'GitHub', href: githubUrl, icon: Github }] : []),
    ...(linkedinUrl ? [{ name: 'LinkedIn', href: linkedinUrl, icon: Linkedin }] : []),
    ...(instagramUrl ? [{ name: 'Instagram', href: instagramUrl, icon: Instagram }] : []),
    ...(email ? [{ name: 'Email', href: `mailto:${email}`, icon: Mail }] : []),
  ];

  return (
    <footer
      id="footer"
      className="relative z-10 border-t border-border-color bg-card-bg/60 backdrop-blur-xl mt-12 md:mt-20 pt-10 md:pt-14 pb-28 md:pb-32 font-inter"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-10">
        {/* Top Footer Section: Brand Info + Quick Links + Connect */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 items-start justify-between">
          {/* Brand Info */}
          <div className="sm:col-span-2 lg:col-span-6 flex flex-col space-y-3">
            <AnchorLink
              to="about"
              className="text-xl sm:text-2xl font-black font-sora text-text-primary tracking-tight flex items-center gap-2.5 w-fit group"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-neon-indigo/15 border border-neon-indigo/30 flex items-center justify-center text-neon-indigo group-hover:scale-110 transition-transform">
                <Sparkles size={14} />
              </div>
              <span className="group-hover:text-neon-indigo transition-colors font-sora">
                KRISHNA NAIK
              </span>
            </AnchorLink>
            <p className="text-xs sm:text-sm text-text-secondary max-w-md leading-relaxed">
              Krishna Umesh Naik — Creative Full-Stack Developer & AI/ML Engineer based in Bengaluru, India. Building intelligent web systems, interactive 3D graphics, and high-performance applications.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-3 flex flex-col space-y-3">
            <h4 className="text-[11px] sm:text-xs font-mono font-bold text-neon-indigo uppercase tracking-widest">
              // Navigation
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:flex sm:flex-col sm:space-y-1.5">
              {navLinks.map((link) => (
                <AnchorLink
                  key={link.id}
                  to={link.id}
                  className="text-xs font-mono text-text-secondary hover:text-neon-cyan transition-colors w-fit flex items-center gap-1 group py-0.5"
                >
                  <span className="text-neon-indigo/60 group-hover:text-neon-cyan">/</span>
                  <span>{link.name}</span>
                </AnchorLink>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="lg:col-span-3 flex flex-col space-y-3">
            <h4 className="text-[11px] sm:text-xs font-mono font-bold text-neon-indigo uppercase tracking-widest">
              // Connect
            </h4>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((s) => {
                const IconComponent = s.icon;
                return (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-950/40 border border-border-color text-xs font-mono text-text-secondary hover:text-text-primary hover:border-neon-indigo/40 transition-all group"
                  >
                    <IconComponent size={13} className="text-neon-indigo group-hover:scale-110 transition-transform" />
                    <span>{s.name}</span>
                    <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tech Stack Badges Bar */}
        <div className="pt-6 sm:pt-8 border-t border-border-color/60 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-mono text-text-secondary">
            <span className="uppercase tracking-wider mr-1 text-text-primary font-bold">Built With:</span>
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg bg-slate-950/40 border border-border-color text-neon-indigo font-bold">
              Next.js 15
            </span>
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg bg-slate-950/40 border border-border-color text-neon-cyan font-bold">
              React 19
            </span>
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg bg-slate-950/40 border border-border-color text-neon-purple font-bold">
              Three.js 3D
            </span>
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg bg-slate-950/40 border border-border-color text-emerald-400 font-bold">
              Tailwind CSS
            </span>
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg bg-slate-950/40 border border-border-color text-amber-400 font-bold">
              TypeScript
            </span>
          </div>

          {mounted && currentDate && (
            <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-mono text-text-secondary px-2.5 py-1 rounded-lg sm:rounded-xl bg-slate-950/40 border border-border-color">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SYSTEM_ONLINE</span>
              <span className="text-slate-600">//</span>
              <span className="text-neon-indigo font-bold">{currentDate}</span>
            </div>
          )}
        </div>

        {/* Copyright Bar */}
        <div className="pt-2 text-center">
          <p className="text-[11px] sm:text-xs font-mono text-text-secondary tracking-wider">
            © {year} <span className="text-text-primary font-semibold font-sora">Krishna Naik</span> (Krishna Umesh Naik). All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
