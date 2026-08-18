'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import AnchorLink from '../ui/AnchorLink';

interface HeaderProps {
  activeSection: string;
}

const Header: React.FC<HeaderProps> = ({ activeSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [theme, setTheme] = useState<string>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { name: 'About', id: 'about' },
    { name: 'Education', id: 'education' },
    { name: 'Experience', id: 'experience' },
    { name: 'Projects', id: 'projects' },
    { name: 'Skills', id: 'skills' },
    { name: 'Interest', id: 'interest' },
    { name: 'Git Stats', id: 'git-stats' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className="fixed top-0 left-0 right-0 z-50 p-4 backdrop-blur-md bg-bg-main/90 shadow-lg border-b border-border-color/40"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center h-14 md:h-16">
          <AnchorLink
            to="about"
            className="text-2xl md:text-3xl font-extrabold font-sora tracking-widest hover:scale-105 transition-transform"
          >
            <span className="text-neon-cyan">K</span>RISHNA
          </AnchorLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 bg-card-bg backdrop-blur-sm rounded-full p-1.5 border border-glass shadow-xl">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <AnchorLink key={item.id} to={item.id}>
                  <div className="relative px-3.5 py-1.5 text-xs font-medium cursor-pointer rounded-full transition-colors">
                    <span
                      className={`relative z-10 transition-colors duration-300 ${
                        isActive
                          ? 'text-neon-cyan font-semibold'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {item.name}
                    </span>

                    {/* Active Section Underline */}
                    {isActive && (
                      <motion.span
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 left-2 right-2 h-[2px] bg-neon-cyan rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </div>
                </AnchorLink>
              );
            })}
          </div>

          {/* Clock + Theme Switcher + Mobile Toggle */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {mounted && currentTime && (
              <div className="hidden sm:flex items-center text-xs font-mono text-text-secondary bg-slate-800/40 px-3 py-1.5 rounded-full border border-white/5">
                <span className="text-neon-cyan mr-1 font-semibold">
                  {currentTime
                    .toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true,
                    })
                    .slice(0, 5)}
                </span>
                <span className="text-neon-pink uppercase font-semibold">
                  {currentTime
                    .toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      hour12: true,
                    })
                    .slice(5, 7)}
                </span>
              </div>
            )}

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className="p-2 rounded-full text-text-primary hover:text-neon-cyan transition-colors bg-card-bg border border-glass"
            >
              {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button
              className="lg:hidden p-2 rounded-lg text-text-primary hover:text-neon-cyan focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 lg:hidden p-4 bg-bg-main/95 backdrop-blur-xl border-b border-border-color/50 shadow-2xl"
          >
            <div className="flex flex-col space-y-2 max-w-md mx-auto">
              {navItems.map((item) => (
                <AnchorLink
                  key={item.id}
                  to={item.id}
                  onClick={() => setIsOpen(false)}
                  className={`text-base font-medium p-3 rounded-xl transition-all ${
                    activeSection === item.id
                      ? 'bg-neon-cyan/10 text-neon-cyan font-bold border border-neon-cyan/20'
                      : 'text-text-primary hover:text-neon-cyan hover:bg-card-bg'
                  }`}
                >
                  {item.name}
                </AnchorLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
