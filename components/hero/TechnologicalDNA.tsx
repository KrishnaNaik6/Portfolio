'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Layers, Dna, Cpu, Sparkles } from 'lucide-react';
import GlassCard from '../cards/GlassCard';
import { Radar } from 'react-chartjs-2';

interface TechnologicalDNAProps {
  languages: Record<string, number>;
  className?: string;
}

const LANGUAGE_COLORS: Record<string, string> = {
  Python: '#3572A5',
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  HTML: '#E34F26',
  CSS: '#563D7C',
  'C++': '#F34B7D',
  C: '#555555',
  Java: '#B07219',
  'Jupyter Notebook': '#DA5B0B',
  Go: '#00ADD8',
  Rust: '#DEA584',
  Shell: '#89E051',
  PHP: '#4F5D95',
};

export const TechnologicalDNA: React.FC<TechnologicalDNAProps> = ({ languages, className = '' }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [hoveredLang, setHoveredLang] = useState<string | null>(null);

  // Compute language metrics & percentages
  const { sortedLangs, totalCount, topLangs } = useMemo(() => {
    const entries = Object.entries(languages).sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((acc, [, val]) => acc + val, 0);
    return {
      sortedLangs: entries,
      totalCount: total,
      topLangs: entries.slice(0, 7),
    };
  }, [languages]);

  const chartLabelColor = isDark ? '#adbac7' : '#768390';
  const chartGridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
  const radarBorder = isDark ? '#bc8cff' : '#539bf5';
  const radarBg = isDark ? 'rgba(188, 140, 255, 0.25)' : 'rgba(83, 155, 245, 0.25)';

  const radarData = useMemo(() => {
    const labels = topLangs.map(([l]) => l);
    const dataVals = topLangs.map(([, v]) => v);

    return {
      labels,
      datasets: [
        {
          label: 'Repos',
          data: dataVals,
          backgroundColor: radarBg,
          borderColor: radarBorder,
          borderWidth: 2,
          pointBackgroundColor: topLangs.map(([l]) =>
            hoveredLang === l ? '#388bfd' : LANGUAGE_COLORS[l] || radarBorder
          ),
          pointBorderColor: '#ffffff',
          pointBorderWidth: 1.5,
          pointRadius: topLangs.map(([l]) => (hoveredLang === l ? 7 : 4)),
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#388bfd',
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 2,
        },
      ],
    };
  }, [topLangs, radarBg, radarBorder, hoveredLang]);

  return (
    <GlassCard className={`relative overflow-hidden ${className}`}>
      {/* Background Animated Glow Blurs */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-neon-purple/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-neon-cyan/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Header Bar */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-color relative z-10">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Layers className="w-5 h-5 text-neon-purple animate-pulse" />
            <Sparkles className="w-3 h-3 text-neon-cyan absolute -top-1 -right-1 animate-spin" />
          </div>
          <h4 className="text-base font-bold font-sora text-text-primary">Technological DNA</h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-neon-purple px-2 py-0.5 rounded bg-neon-purple/15 border border-neon-purple/30 font-bold tracking-wider animate-pulse flex items-center gap-1">
            <Dna size={12} className="animate-spin" />
            <span>DNA_SEQ_ACTIVE</span>
          </span>
        </div>
      </div>

      {sortedLangs.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-text-secondary opacity-50">
          <Cpu size={32} className="animate-bounce mb-2" />
          <p className="text-xs font-mono">No DNA language markers detected</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          {/* Radar Chart Column */}
          <div className="lg:col-span-7 h-60 relative flex items-center justify-center">
            {/* Animated Radar Scanning Overlay Circle */}
            <div className="absolute inset-2 rounded-full border border-neon-purple/10 pointer-events-none animate-ping opacity-20" />
            <Radar
              data={radarData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                  duration: 1200,
                  easing: 'easeOutQuart',
                },
                scales: {
                  r: {
                    angleLines: { color: chartGridColor },
                    grid: { color: chartGridColor },
                    pointLabels: {
                      color: chartLabelColor,
                      font: { size: 10, family: 'monospace', weight: 'bold' },
                    },
                    ticks: { display: false },
                  },
                },
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: '#161b22',
                    titleColor: '#58a6ff',
                    bodyColor: '#e6edf3',
                    borderColor: '#30363d',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: false,
                    callbacks: {
                      label: (ctx) => `${ctx.label}: ${ctx.raw} repositories`,
                    },
                  },
                },
              }}
            />
          </div>

          {/* Animated Language Sequence Bars Column */}
          <div className="lg:col-span-5 flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-text-secondary mb-1">
              <span>GENETIC_COMPOSITION</span>
              <span>{sortedLangs.length} MARKERS</span>
            </div>

            {topLangs.map(([lang, count], idx) => {
              const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
              const color = LANGUAGE_COLORS[lang] || '#2f81f7';
              const isHovered = hoveredLang === lang;

              return (
                <motion.div
                  key={lang}
                  onMouseEnter={() => setHoveredLang(lang)}
                  onMouseLeave={() => setHoveredLang(null)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className={`p-2 rounded-xl transition-all border cursor-pointer ${
                    isHovered
                      ? 'bg-slate-900/80 border-neon-indigo shadow-[0_0_15px_rgba(47,129,247,0.3)] scale-[1.02]'
                      : 'bg-slate-950/30 border-border-color hover:border-border-color/80'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                      <span className="font-bold text-text-primary">{lang}</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary text-[11px]">
                      <span>{count} repos</span>
                      <span className="font-bold text-neon-cyan">{pct}%</span>
                    </div>
                  </div>

                  {/* Animated Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(pct, 8)}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.2 + idx * 0.05 }}
                      className="h-full rounded-full relative"
                      style={{ backgroundColor: color }}
                    >
                      {/* Glow line animation inside progress bar */}
                      <div className="absolute inset-0 bg-white/30 animate-pulse" />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </GlassCard>
  );
};

export default TechnologicalDNA;
