'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  User,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Code2,
  Compass,
  Activity,
  Mail,
  FileText,
  Copy,
  Check,
  Moon,
  Sun,
  ExternalLink,
  ArrowUp,
  CornerDownLeft,
  Sparkles,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { SectionConfig } from '@/lib/types';
import { normalizeSectionId, getOrderedBodySections } from '@/lib/sectionConfig';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  sections?: SectionConfig[] | null;
  contactEmail?: string;
  resumeUrl?: string;
}

interface PaletteAction {
  id: string;
  title: string;
  category: 'Navigation' | 'Actions';
  icon: any;
  shortcut?: string;
  run: () => void;
}

const sectionIcons: Record<string, any> = {
  about: User,
  education: GraduationCap,
  experience: Briefcase,
  projects: FolderGit2,
  skills: Code2,
  interest: Compass,
  interests: Compass,
  'git-stats': Activity,
  github: Activity,
  contact: Mail,
};

const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  sections,
  contactEmail = 'unkrishnanaik@gmail.com',
  resumeUrl = '/resume',
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const scrollToSection = useCallback((id: string) => {
    onClose();
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [onClose]);

  const copyEmail = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(contactEmail);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        onClose();
      }, 1200);
    }
  }, [contactEmail, onClose]);

  const cycleTheme = useCallback(() => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
    onClose();
  }, [theme, setTheme, onClose]);

  const actions = useMemo<PaletteAction[]>(() => {
    const list: PaletteAction[] = [];

    // Section links
    if (sections) {
      const ordered = getOrderedBodySections(sections);
      ordered.forEach((sec) => {
        const canonical = normalizeSectionId(sec.id);
        const domId =
          canonical === 'interests' ? 'interest' : canonical === 'github' ? 'git-stats' : canonical;
        const Icon = sectionIcons[canonical] || Sparkles;

        list.push({
          id: `sec-${domId}`,
          title: `Jump to ${sec.label || sec.id}`,
          category: 'Navigation',
          icon: Icon,
          shortcut: `Go to #${domId}`,
          run: () => scrollToSection(domId),
        });
      });
    } else {
      [
        { id: 'about', label: 'About', icon: User },
        { id: 'education', label: 'Education', icon: GraduationCap },
        { id: 'experience', label: 'Experience', icon: Briefcase },
        { id: 'projects', label: 'Projects', icon: FolderGit2 },
        { id: 'skills', label: 'Skills', icon: Code2 },
        { id: 'interest', label: 'Interests', icon: Compass },
        { id: 'git-stats', label: 'Git Stats', icon: Activity },
        { id: 'contact', label: 'Contact', icon: Mail },
      ].forEach((s) => {
        list.push({
          id: `sec-${s.id}`,
          title: `Jump to ${s.label}`,
          category: 'Navigation',
          icon: s.icon,
          shortcut: `Go to #${s.id}`,
          run: () => scrollToSection(s.id),
        });
      });
    }

    // Quick Actions
    list.push(
      {
        id: 'action-resume',
        title: 'View / Download Master Resume',
        category: 'Actions',
        icon: FileText,
        shortcut: 'Open /resume',
        run: () => {
          onClose();
          window.open(resumeUrl, '_blank');
        },
      },
      {
        id: 'action-copy-email',
        title: copied ? 'Email Copied to Clipboard!' : `Copy Email (${contactEmail})`,
        category: 'Actions',
        icon: copied ? Check : Copy,
        shortcut: 'Clipboard',
        run: copyEmail,
      },
      {
        id: 'action-theme',
        title: `Switch Theme (Current: ${resolvedTheme || theme || 'dark'})`,
        category: 'Actions',
        icon: resolvedTheme === 'dark' ? Sun : Moon,
        shortcut: 'Toggle',
        run: cycleTheme,
      },
      {
        id: 'action-github',
        title: 'Open GitHub Profile (KrishnaNaik6)',
        category: 'Actions',
        icon: ExternalLink,
        shortcut: 'github.com',
        run: () => {
          onClose();
          window.open('https://github.com/KrishnaNaik6', '_blank');
        },
      },
      {
        id: 'action-scroll-top',
        title: 'Scroll to Top of Page',
        category: 'Actions',
        icon: ArrowUp,
        shortcut: 'Top',
        run: () => {
          onClose();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
      }
    );

    return list;
  }, [
    sections,
    contactEmail,
    resumeUrl,
    copied,
    theme,
    resolvedTheme,
    scrollToSection,
    copyEmail,
    cycleTheme,
    onClose,
  ]);

  const filtered = useMemo(() => {
    if (!query.trim()) return actions;
    const q = query.toLowerCase().trim();
    return actions.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        (a.shortcut && a.shortcut.toLowerCase().includes(q))
    );
  }, [actions, query]);

  // Keep index within bounds
  useEffect(() => {
    if (selectedIndex >= filtered.length && filtered.length > 0) {
      setSelectedIndex(0);
    }
  }, [filtered.length, selectedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].run();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 sm:px-6">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl rounded-2xl bg-slate-900/95 border border-neon-cyan/40 shadow-[0_0_50px_rgba(88,166,255,0.25)] backdrop-blur-2xl overflow-hidden z-10"
          >
            {/* Search Header Bar */}
            <div className="relative flex items-center px-4 py-3.5 border-b border-border-color/60">
              <Search className="w-5 h-5 text-neon-cyan shrink-0 mr-3 animate-pulse" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type a command or search portfolio..."
                className="w-full bg-transparent text-sm sm:text-base font-mono text-text-primary placeholder:text-text-secondary focus:outline-none"
              />
              <div className="hidden sm:flex items-center gap-1.5 ml-2">
                <span className="text-[10px] font-mono text-text-secondary px-2 py-0.5 rounded bg-slate-800/80 border border-border-color">
                  ESC to close
                </span>
              </div>
            </div>

            {/* Results List */}
            <div ref={listRef} className="max-h-[380px] overflow-y-auto p-2 space-y-1">
              {filtered.length > 0 ? (
                filtered.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={item.run}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-left group cursor-pointer ${
                        isSelected
                          ? 'bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/40 shadow-[0_0_15px_rgba(88,166,255,0.2)]'
                          : 'text-text-primary hover:bg-slate-800/50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`p-2 rounded-lg transition-colors ${
                            isSelected
                              ? 'bg-neon-cyan/20 text-neon-cyan'
                              : 'bg-slate-800 text-text-secondary group-hover:text-neon-cyan'
                          }`}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-sora font-semibold truncate">
                            {item.title}
                          </p>
                          <p className="text-[10px] font-mono text-text-secondary">
                            {item.category}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.shortcut && (
                          <span className="text-[10px] font-mono text-text-secondary px-2 py-0.5 rounded bg-slate-800/60 border border-border-color/50 hidden sm:inline-block">
                            {item.shortcut}
                          </span>
                        )}
                        {isSelected && (
                          <CornerDownLeft size={13} className="text-neon-cyan animate-pulse" />
                        )}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="py-12 text-center text-text-secondary font-mono text-xs">
                  <p>No matching commands found for &quot;{query}&quot;</p>
                </div>
              )}
            </div>

            {/* Bottom Keyboard Hint Footer */}
            <div className="px-4 py-2.5 bg-slate-950/60 border-t border-border-color/40 flex items-center justify-between text-[11px] font-mono text-text-secondary">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-border-color text-[10px]">↑↓</kbd>{' '}
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-border-color text-[10px]">↵</kbd>{' '}
                  Select
                </span>
              </div>
              <span className="text-neon-cyan font-semibold flex items-center gap-1">
                <Sparkles size={11} />
                <span>Quick HUD</span>
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
