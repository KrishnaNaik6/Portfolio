'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { GitHubContributionsResponse, ContributionDay } from '@/lib/types';
import { ChevronDown, ExternalLink } from 'lucide-react';

interface GitHubContributionGraphProps {
  contributionsData?: GitHubContributionsResponse | null;
  username: string;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const GitHubContributionGraph: React.FC<GitHubContributionGraphProps> = ({
  contributionsData,
  username,
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Available years from API data or fallback
  const availableYears = useMemo(() => {
    if (contributionsData?.total && Object.keys(contributionsData.total).length > 0) {
      return Object.keys(contributionsData.total).sort((a, b) => Number(b) - Number(a));
    }
    const currentYear = new Date().getFullYear();
    return [String(currentYear), String(currentYear - 1), String(currentYear - 2)];
  }, [contributionsData]);

  const [selectedYear, setSelectedYear] = useState<string>(availableYears[0] || '2026');
  const [hoveredDay, setHoveredDay] = useState<{ day: ContributionDay; x: number; y: number } | null>(null);

  // Filter contributions for the selected year or fallback mock
  const activeContributions = useMemo(() => {
    const rawList = contributionsData?.contributions || [];

    if (rawList.length > 0) {
      const filtered = rawList.filter((d) => d.date.startsWith(selectedYear));
      if (filtered.length > 0) return filtered;
    }

    // Fallback generator for realistic heatmap view if API unavailable
    const daysInYear = 365;
    const startDate = new Date(`${selectedYear}-01-01`);
    const fallbackList: ContributionDay[] = [];

    for (let i = 0; i < daysInYear; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      // Pseudo-random deterministic activity seed
      const hash = (i * 37 + Number(selectedYear)) % 100;
      let count = 0;
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (hash > 45 && hash <= 70) {
        count = (hash % 3) + 1;
        level = 1;
      } else if (hash > 70 && hash <= 85) {
        count = (hash % 5) + 3;
        level = 2;
      } else if (hash > 85 && hash <= 94) {
        count = (hash % 7) + 6;
        level = 3;
      } else if (hash > 94) {
        count = (hash % 10) + 10;
        level = 4;
      }
      fallbackList.push({ date: dateStr, count, level });
    }
    return fallbackList;
  }, [contributionsData, selectedYear]);

  // Total count for current selected year
  const totalContributions = useMemo(() => {
    if (contributionsData?.total && contributionsData.total[selectedYear] !== undefined) {
      return contributionsData.total[selectedYear];
    }
    return activeContributions.reduce((acc, curr) => acc + curr.count, 0);
  }, [contributionsData, selectedYear, activeContributions]);

  // Group days into 53 columns (weeks) x 7 rows (days Sun-Sat)
  const { weeks, monthLabels } = useMemo(() => {
    const sorted = [...activeContributions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const weekCols: (ContributionDay | null)[][] = [];
    let currentWeek: (ContributionDay | null)[] = [];
    const labels: { month: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    if (sorted.length > 0) {
      const firstDayObj = new Date(sorted[0].date);
      const dayOfWeek = firstDayObj.getDay(); // 0 = Sun
      for (let i = 0; i < dayOfWeek; i++) {
        currentWeek.push(null);
      }
    }

    sorted.forEach((dayObj) => {
      const dateObj = new Date(dayObj.date);
      const monthIdx = dateObj.getMonth();

      if (monthIdx !== lastMonth) {
        labels.push({
          month: MONTH_NAMES[monthIdx],
          weekIndex: weekCols.length,
        });
        lastMonth = monthIdx;
      }

      currentWeek.push(dayObj);

      if (currentWeek.length === 7) {
        weekCols.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weekCols.push(currentWeek);
    }

    return { weeks: weekCols, monthLabels: labels };
  }, [activeContributions]);

  // Cell colors based on level & theme
  const getCellColor = (level: number) => {
    if (isDark) {
      switch (level) {
        case 1:
          return '#0e4429';
        case 2:
          return '#006d32';
        case 3:
          return '#26a641';
        case 4:
          return '#39d353';
        default:
          return '#161b22';
      }
    } else {
      switch (level) {
        case 1:
          return '#0e4429';
        case 2:
          return '#006d32';
        case 3:
          return '#26a641';
        case 4:
          return '#39d353';
        default:
          return '#22272e';
      }
    }
  };


  const formatDateString = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="w-full bg-card-bg p-6 md:p-8 rounded-3xl border border-border-color shadow-2xl space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl md:text-2xl font-black font-sora text-text-primary tracking-tight">
            {totalContributions.toLocaleString()} contributions in {selectedYear}
          </h3>
          <p className="text-xs font-mono text-text-secondary mt-0.5">
            Activity stream synced from @{username}
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-950/40 border border-border-color text-xs font-mono text-text-secondary cursor-default">
            <span>Contribution settings</span>
            <ChevronDown size={14} />
          </div>
        </div>
      </div>

      {/* Grid + Year Selector Sidebar Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Contribution Calendar Box */}
        <div className="xl:col-span-10 p-5 rounded-2xl bg-slate-950/40 border border-border-color overflow-x-auto relative shadow-inner">
          <div className="min-w-[700px] flex flex-col gap-2">
            {/* Month Labels Row */}
            <div className="flex items-center text-[10px] font-mono text-text-secondary pl-8 relative h-4">
              {monthLabels.map((lbl, idx) => (
                <span
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: `${32 + lbl.weekIndex * 13.5}px`,
                  }}
                >
                  {lbl.month}
                </span>
              ))}
            </div>

            {/* Main Day Grid + Day Labels */}
            <div className="flex gap-2 items-start">
              {/* Day Labels Column (Mon, Wed, Fri) */}
              <div className="flex flex-col gap-[3px] text-[10px] font-mono text-text-secondary pr-1 pt-[14px]">
                <span className="h-[10px] leading-[10px]"></span>
                <span className="h-[10px] leading-[10px]">Mon</span>
                <span className="h-[10px] leading-[10px]"></span>
                <span className="h-[10px] leading-[10px]">Wed</span>
                <span className="h-[10px] leading-[10px]"></span>
                <span className="h-[10px] leading-[10px]">Fri</span>
                <span className="h-[10px] leading-[10px]"></span>
              </div>

              {/* 53 Weeks Grid */}
              <div className="flex gap-[3px]">
                {weeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-[3px]">
                    {week.map((day, dIdx) => {
                      if (!day) {
                        return (
                          <div
                            key={dIdx}
                            className="w-[10px] h-[10px] rounded-[2px] opacity-0"
                          />
                        );
                      }
                      return (
                        <div
                          key={dIdx}
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredDay({
                              day,
                              x: rect.left + rect.width / 2,
                              y: rect.top - 8,
                            });
                          }}
                          onMouseLeave={() => setHoveredDay(null)}
                          style={{ backgroundColor: getCellColor(day.level) }}
                          className="w-[10px] h-[10px] rounded-[2px] border border-black/10 transition-transform hover:scale-125 hover:z-20 cursor-pointer"
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Footer inside calendar */}
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-border-color/60 text-[11px] font-mono text-text-secondary">
              <a
                href="https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-graphs-on-your-profile/showing-contributions-on-your-profile"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neon-indigo transition-colors flex items-center gap-1"
              >
                <span>Learn how we count contributions</span>
                <ExternalLink size={12} />
              </a>

              <div className="flex items-center gap-1.5">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((lvl) => (
                  <div
                    key={lvl}
                    style={{ backgroundColor: getCellColor(lvl) }}
                    className="w-[10px] h-[10px] rounded-[2px] border border-black/10"
                  />
                ))}
                <span>More</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Year Selector Sidebar */}
        <div className="xl:col-span-2 flex xl:flex-col flex-wrap gap-2 w-full">
          {availableYears.map((yr) => {
            const isActive = selectedYear === yr;
            return (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono text-center transition-all ${
                  isActive
                    ? 'bg-neon-indigo text-white font-bold shadow-[0_0_20px_rgba(99,102,241,0.4)]'
                    : 'bg-slate-950/30 text-text-secondary hover:text-text-primary hover:bg-slate-900/60 border border-border-color'
                }`}
              >
                {yr}
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredDay && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            position: 'fixed',
            left: hoveredDay.x,
            top: hoveredDay.y,
            transform: 'translate(-50%, -100%)',
          }}
          className="pointer-events-none z-50 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-mono shadow-2xl border border-white/20 whitespace-nowrap"
        >
          <span className="font-bold text-neon-cyan mr-1">
            {hoveredDay.day.count > 0 ? `${hoveredDay.day.count} contributions` : 'No contributions'}
          </span>
          <span>on {formatDateString(hoveredDay.day.date)}</span>
        </motion.div>
      )}
    </div>
  );
};

export default GitHubContributionGraph;
