'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Github, Linkedin, Instagram, Mail, ArrowUpRight } from 'lucide-react';
import AnchorLink from '../ui/AnchorLink';

const Footer: React.FC = () => {
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

  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/KrishnaNaik6', icon: Github },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/krishna-naik-b94723277', icon: Linkedin },
    { name: 'Instagram', href: 'https://www.instagram.com/krishna_naik_6/', icon: Instagram },
    { name: 'Email', href: 'mailto:krishanaik1110@gmail.com', icon: Mail },
  ];

  return (
    <footer
      id="footer"
      className="relative z-10 border-t border-border-color bg-card-bg/60 backdrop-blur-xl mt-20 pt-16 pb-32 md:pb-36 font-inter"
    >
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* Top Footer Section: Brand Info + Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start justify-between">
          {/* Brand Info */}
          <div className="md:col-span-6 flex flex-col space-y-4">
            <AnchorLink
              to="about"
              className="text-2xl font-black font-sora text-text-primary tracking-tight flex items-center gap-2.5 w-fit group"
            >
              <div className="w-8 h-8 rounded-full bg-neon-indigo/15 border border-neon-indigo/30 flex items-center justify-center text-neon-indigo group-hover:scale-110 transition-transform">
                <Sparkles size={15} />
              </div>
              <span className="group-hover:text-neon-indigo transition-colors font-sora">
                KRISHNA NAIK
              </span>
            </AnchorLink>
            <p className="text-xs md:text-sm text-text-secondary max-w-md leading-relaxed">
              Krishna Umesh Naik — Creative Full-Stack Developer & AI/ML Engineer based in Bengaluru, India. Building intelligent web systems, interactive 3D graphics, and high-performance applications.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 flex flex-col space-y-3">
            <h4 className="text-xs font-mono font-bold text-neon-indigo uppercase tracking-widest">
              // Navigation
            </h4>
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <AnchorLink
                  key={link.id}
                  to={link.id}
                  className="text-xs font-mono text-text-secondary hover:text-neon-cyan transition-colors w-fit flex items-center gap-1 group"
                >
                  <span>/ {link.name}</span>
                </AnchorLink>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="md:col-span-3 flex flex-col space-y-3">
            <h4 className="text-xs font-mono font-bold text-neon-indigo uppercase tracking-widest">
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
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/40 border border-border-color text-xs font-mono text-text-secondary hover:text-text-primary hover:border-neon-indigo/40 transition-all group"
                  >
                    <IconComponent size={14} className="text-neon-indigo group-hover:scale-110 transition-transform" />
                    <span>{s.name}</span>
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tech Stack Badges Bar */}
        <div className="pt-8 border-t border-border-color/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-text-secondary">
            <span className="uppercase tracking-wider mr-1 text-text-primary font-bold">Built With:</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950/40 border border-border-color text-neon-indigo font-bold">
              Next.js 15
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950/40 border border-border-color text-neon-cyan font-bold">
              React 19
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950/40 border border-border-color text-neon-purple font-bold">
              Three.js 3D
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950/40 border border-border-color text-emerald-400 font-bold">
              Tailwind CSS
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950/40 border border-border-color text-amber-400 font-bold">
              TypeScript
            </span>
          </div>

          {mounted && currentDate && (
            <div className="inline-flex items-center gap-2 text-[11px] font-mono text-text-secondary px-3 py-1 rounded-xl bg-slate-950/40 border border-border-color">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SYSTEM_ONLINE</span>
              <span className="text-slate-600">//</span>
              <span className="text-neon-indigo font-bold">{currentDate}</span>
            </div>
          )}
        </div>

        {/* Copyright Bar */}
        <div className="pt-4 text-center">
          <p className="text-xs font-mono text-text-secondary tracking-wider">
            © {year} <span className="text-text-primary font-semibold font-sora">Krishna Naik</span> (Krishna Umesh Naik). All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
