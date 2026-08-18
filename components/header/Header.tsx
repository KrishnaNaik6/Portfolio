'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
  Sparkles,
  User,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Code2,
  Compass,
  Activity,
  Mail,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import AnchorLink from '../ui/AnchorLink';

interface HeaderProps {
  activeSection: string;
}

const Header: React.FC<HeaderProps> = ({ activeSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { name: 'About', id: 'about', icon: User },
    { name: 'Education', id: 'education', icon: GraduationCap },
    { name: 'Experience', id: 'experience', icon: Briefcase },
    { name: 'Projects', id: 'projects', icon: FolderGit2 },
    { name: 'Skills', id: 'skills', icon: Code2 },
    { name: 'Interest', id: 'interest', icon: Compass },
    { name: 'Git Stats', id: 'git-stats', icon: Activity },
    { name: 'Contact', id: 'contact', icon: Mail },
  ];

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  const getThemeIcon = () => {
    if (theme === 'system') return <Monitor size={14} className="text-neon-cyan" />;
    if (resolvedTheme === 'dark') return <Moon size={14} className="text-neon-indigo" />;
    return <Sun size={14} className="text-neon-rose" />;
  };

  return (
    <>
      {/* Top Header Bar: Brand Logo + Clock + Theme Switcher + Mobile Menu Button */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className="fixed top-4 left-0 right-0 z-50 px-4 max-w-7xl mx-auto pointer-events-none"
      >
        <div className="pointer-events-auto backdrop-blur-2xl bg-card-bg border border-border-color rounded-full px-5 py-2.5 shadow-2xl flex justify-between items-center transition-all duration-300">
          {/* Logo Tag */}
          <AnchorLink
            to="about"
            className="text-xl md:text-2xl font-extrabold font-sora tracking-wider flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-full bg-neon-indigo/15 border border-neon-indigo/30 flex items-center justify-center text-neon-indigo group-hover:scale-110 transition-transform">
              <Sparkles size={15} />
            </div>
            <span className="text-text-primary group-hover:text-neon-indigo transition-colors font-sora">
              <span className="text-xs font-mono text-neon-indigo mr-1.5 font-normal">01 /</span>KRISHNA
            </span>
          </AnchorLink>

          {/* Top Controls: Clock + Theme Switcher + Mobile Menu Toggle */}
          <div className="flex items-center space-x-3">
            {mounted && currentTime && (
              <div className="hidden sm:flex items-center text-xs font-mono text-text-secondary bg-slate-950/20 dark:bg-slate-950/40 px-3.5 py-1.5 rounded-full border border-border-color">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2" />
                <span className="text-neon-indigo mr-1.5 font-bold">
                  {currentTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                  })}
                </span>
              </div>
            )}

            {/* Theme Toggle Button */}
            {mounted && (
              <button
                onClick={cycleTheme}
                aria-label={`Current theme: ${theme}. Click to switch theme.`}
                title={`Theme: ${theme?.toUpperCase()}`}
                className="p-2 rounded-full text-text-primary hover:text-neon-indigo transition-all bg-slate-950/20 dark:bg-slate-950/40 border border-border-color hover:border-neon-indigo/40 focus-visible:ring-2 focus-visible:ring-neon-indigo flex items-center gap-1.5 px-3"
              >
                <motion.div key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}>
                  {getThemeIcon()}
                </motion.div>
                <span className="text-[10px] font-mono uppercase text-text-secondary hidden md:inline font-semibold">
                  {theme}
                </span>
              </button>
            )}

            <button
              className="lg:hidden p-2.5 rounded-full text-text-primary hover:text-neon-indigo bg-slate-950/20 dark:bg-slate-950/40 border border-border-color focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Bottom Floating Navigation Dock (Centered Icons Only + Hover Tooltip) */}
      <div className="fixed bottom-6 left-0 right-0 z-50 pointer-events-none hidden lg:flex justify-center items-center">
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className="pointer-events-auto flex items-center gap-1.5 p-2 rounded-full backdrop-blur-2xl bg-card-bg/90 border border-border-color shadow-[0_10px_35px_rgba(0,0,0,0.5)]"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const IconComponent = item.icon;
            const isHovered = hoveredId === item.id;

            return (
              <AnchorLink key={item.id} to={item.id}>
                <div
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="relative flex items-center justify-center"
                >
                  {/* Floating Hover Tooltip showing Nav Item Name */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.85 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.85 }}
                        transition={{ duration: 0.15 }}
                        className="absolute -top-11 left-1/2 -translate-x-1/2 px-3 py-1 rounded-xl bg-slate-900 text-white text-[11px] font-mono font-bold shadow-2xl border border-white/20 whitespace-nowrap pointer-events-none z-50 flex items-center gap-1"
                      >
                        <span className="text-neon-cyan">/</span>
                        <span>{item.name}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Icon Button */}
                  <button
                    aria-label={item.name}
                    className={`relative p-3 rounded-full transition-all duration-300 flex items-center justify-center ${
                      isActive
                        ? 'bg-neon-indigo/20 text-neon-indigo border border-neon-indigo/40 scale-110 shadow-[0_0_20px_rgba(47,129,247,0.4)]'
                        : 'text-text-secondary hover:text-text-primary hover:bg-slate-800/40 hover:scale-105 border border-transparent'
                    }`}
                  >
                    <IconComponent size={19} />

                    {/* Active Indicator Dot */}
                    {isActive && (
                      <motion.span
                        layoutId="activeDockDot"
                        className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-neon-indigo shadow-[0_0_8px_#388bfd]"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                </div>
              </AnchorLink>
            );
          })}
        </motion.nav>
      </div>

      {/* Mobile Cybernetic Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-4 right-4 z-40 lg:hidden p-6 backdrop-blur-2xl bg-card-bg border border-border-color rounded-3xl shadow-2xl max-w-md mx-auto"
          >
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <AnchorLink
                    key={item.id}
                    to={item.id}
                    onClick={() => setIsOpen(false)}
                    className={`text-sm font-mono tracking-wider p-3.5 rounded-2xl transition-all flex items-center justify-between ${
                      activeSection === item.id
                        ? 'bg-neon-indigo/15 text-neon-indigo font-bold border border-neon-indigo/30'
                        : 'text-text-primary hover:text-neon-indigo hover:bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent size={18} />
                      <span>{item.name}</span>
                    </div>
                    <span className="text-xs text-text-secondary font-mono">/0{navItems.indexOf(item) + 1}</span>
                  </AnchorLink>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;


