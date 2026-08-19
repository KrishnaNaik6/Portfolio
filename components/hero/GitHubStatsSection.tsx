'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  RadialLinearScale,
} from 'chart.js';
import { Bar, Radar } from 'react-chartjs-2';
import {
  Github,
  Star,
  GitFork,
  TrendingUp,
  Activity,
  Layers,
  Globe,
  Search,
  ExternalLink,
  Zap,
  AlertCircle,
  Users,
  BookOpen,
  GitPullRequest,
  MessageSquare,
  RotateCcw,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { GitHubUser, GitHubRepo, ExtraStats, GitHubContributionsResponse, GitHubStatsResponse } from '@/lib/types';
import SectionWrapper from '../ui/SectionWrapper';
import GlassCard from '../cards/GlassCard';
import GitHubContributionGraph from './GitHubContributionGraph';
import TechnologicalDNA from './TechnologicalDNA';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  RadialLinearScale
);

interface MetricRowProps {
  label: string;
  value: string | number;
  icon: any;
  colorClass: string;
}

const MetricRow: React.FC<MetricRowProps> = ({ label, value, icon: Icon, colorClass }) => (
  <div className="flex items-center justify-between py-2 border-b border-border-color last:border-0">
    <div className="flex items-center gap-3">
      <Icon className={`w-4 h-4 ${colorClass}`} />
      <span className="text-xs font-mono text-text-secondary uppercase tracking-wider">{label}</span>
    </div>
    <span className="text-sm font-mono font-bold text-text-primary">{value}</span>
  </div>
);

interface GitHubStatsSectionProps {
  initialUsername?: string;
  initialStats?: GitHubStatsResponse | null;
  sectionRef?: React.RefObject<HTMLElement | null>;
}

const GitHubStatsSection: React.FC<GitHubStatsSectionProps> = ({
  initialUsername = 'KrishnaNaik6',
  initialStats = null,
  sectionRef,
}) => {
  const [username, setUsername] = useState(initialUsername);
  const [searchInput, setSearchInput] = useState('');
  const [user, setUser] = useState<GitHubUser | null>(initialStats?.user || null);
  const [repos, setRepos] = useState<GitHubRepo[]>(initialStats?.repos || []);
  const [extraStats, setExtraStats] = useState<ExtraStats>(initialStats?.extraStats || { commits: 0, prs: 0, issues: 0 });
  const [contributionsData, setContributionsData] = useState<GitHubContributionsResponse | null>(initialStats?.contributionsData || null);
  const [loading, setLoading] = useState(!initialStats);
  const [error, setError] = useState<string | null>(null);

  const { resolvedTheme } = useTheme();

  // Typewriter logic for search placeholder
  const [placeholder, setPlaceholder] = useState('');
  const phrases = useMemo(
    () => ['Switch Node Username...', 'See Your Profile...', 'Analyze Neural Stats...'],
    []
  );
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        if (!isDeleting && charIndex < phrases[phraseIndex].length) {
          setCharIndex((prev) => prev + 1);
        } else if (isDeleting && charIndex > 0) {
          setCharIndex((prev) => prev - 1);
        } else if (!isDeleting && charIndex === phrases[phraseIndex].length) {
          setIsDeleting(true);
        } else if (isDeleting && charIndex === 0) {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      },
      isDeleting ? 40 : 80
    );
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex, phrases]);

  useEffect(() => {
    setPlaceholder(phrases[phraseIndex].substring(0, charIndex));
  }, [charIndex, phraseIndex, phrases]);

  const fetchData = async (targetUser: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/github/stats/${encodeURIComponent(targetUser.trim())}`);
      if (res.status === 403) throw new Error('API Rate Limit Exceeded.');
      if (res.status === 404) throw new Error('User node not found.');
      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      setUser(data.user);
      setRepos(Array.isArray(data.repos) ? data.repos : []);
      setExtraStats(data.extraStats || { commits: 0, prs: 0, issues: 0 });
      setContributionsData(data.contributionsData || null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch GitHub stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialStats && username === initialUsername) {
      setUser(initialStats.user);
      setRepos(initialStats.repos || []);
      setExtraStats(initialStats.extraStats || { commits: 0, prs: 0, issues: 0 });
      setContributionsData(initialStats.contributionsData || null);
      setLoading(false);
      return;
    }
    fetchData(username);
  }, [username, initialStats, initialUsername]);

  const stats = useMemo(() => {
    if (!repos.length) return { languages: {}, topRepos: [], totalStars: 0, totalForks: 0 };
    const languagesMap: Record<string, number> = {};
    let starCount = 0;
    let forkCount = 0;

    repos.forEach((r) => {
      if (r.language) languagesMap[r.language] = (languagesMap[r.language] || 0) + 1;
      starCount += r.stargazers_count || 0;
      forkCount += r.forks_count || 0;
    });

    const sortedReposByStars = [...repos].sort(
      (a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0)
    );
    return {
      languages: languagesMap,
      topRepos: sortedReposByStars,
      totalStars: starCount,
      totalForks: forkCount,
    };
  }, [repos]);

  const visibleTopRepos = useMemo(() => {
    const starredRepos = stats.topRepos.filter((r) => (r.stargazers_count || 0) > 0);
    return starredRepos.length > 0 ? starredRepos.slice(0, 5) : stats.topRepos.slice(0, 5);
  }, [stats.topRepos]);

  const formatValue = (val: number) =>
    val >= 1000 ? (val / 1000).toFixed(1) + 'k+' : val.toLocaleString();

  const totalReposCount =
    (user?.public_repos || 0) + (user?.total_private_repos || user?.owned_private_repos || 0);

  const isDark = resolvedTheme === 'dark';
  const chartLabelColor = isDark ? '#94a3b8' : '#475569';
  const chartGridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  return (
    <SectionWrapper ref={sectionRef} id="git-stats" title="GitHub Intelligence" terminalCommand="show $gitStats">
      <div className="w-full flex flex-col gap-6 md:gap-8">
        {/* Top User Bar & Search */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-card-bg p-6 rounded-3xl border border-border-color shadow-2xl">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative group shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-neon-indigo to-neon-cyan rounded-full blur opacity-40" />
              <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-slate-900 p-1">
                <div className="w-full h-full rounded-full overflow-hidden border border-border-color flex items-center justify-center">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <Github size={24} className="text-text-secondary" />
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="text-xl md:text-2xl font-black font-sora text-text-primary tracking-tight truncate">
                {user?.name || user?.login || username}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-neon-indigo font-mono tracking-widest uppercase py-0.5 px-2 bg-neon-indigo/15 rounded border border-neon-indigo/30">
                  Active_Entity
                </span>
                {user?.id && (
                  <span className="text-[11px] text-text-secondary font-mono">ID: {user.id}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchInput.trim()) {
                  setUsername(searchInput.trim());
                  setSearchInput('');
                }
              }}
              className="relative flex-1 sm:w-72"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
              <input
                type="text"
                placeholder={placeholder}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-slate-950/40 border border-border-color/50 rounded-2xl py-2.5 pl-11 pr-4 text-xs text-text-primary focus:outline-none focus:border-neon-indigo transition-all placeholder:text-text-secondary"
              />
            </form>
            <button
              onClick={() => {
                setUsername(initialUsername);
                setSearchInput('');
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-card-bg border border-border-color text-text-secondary hover:text-neon-indigo hover:border-neon-indigo transition-all font-mono text-xs uppercase tracking-wider"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>
        </div>

        {/* GitHub Contributions Activity Heatmap Grid */}
        <GitHubContributionGraph contributionsData={contributionsData} username={username} />

        {error ? (
          <GlassCard className="items-center py-16 text-center">
            <AlertCircle className="text-red-400 mb-3 mx-auto" size={36} />
            <h4 className="text-base font-bold text-red-400 font-mono tracking-widest uppercase mb-1">
              Protocol_Error
            </h4>
            <p className="text-text-secondary text-xs font-mono mb-6">{error}</p>
            <button
              onClick={() => fetchData(initialUsername)}
              className="px-6 py-2.5 bg-slate-800 rounded-full text-xs font-mono uppercase text-neon-indigo border border-neon-indigo/30 hover:bg-neon-indigo/10 transition-colors"
            >
              Re-Initialize
            </button>
          </GlassCard>
        ) : loading && !user ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-2 border-neon-indigo/20 border-t-neon-indigo rounded-full animate-spin" />
            <span className="text-neon-indigo font-mono text-xs tracking-widest uppercase">
              Syncing Neural Node...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* Neural Metrics Summary */}
            <GlassCard className="md:col-span-5 md:row-span-2">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-border-color">
                <Activity className="w-5 h-5 text-neon-indigo" />
                <h4 className="text-base font-bold font-sora text-text-primary">Neural Metrics Summary</h4>
              </div>
              <div className="flex flex-col gap-1">
                <MetricRow label="Total Stars" value={formatValue(stats.totalStars)} icon={Star} colorClass="text-amber-400" />
                <MetricRow label="Total Commits" value={formatValue(extraStats.commits)} icon={Zap} colorClass="text-neon-indigo" />
                <MetricRow label="Total PRs" value={formatValue(extraStats.prs)} icon={GitPullRequest} colorClass="text-neon-cyan" />
                <MetricRow label="Total Issues" value={formatValue(extraStats.issues)} icon={MessageSquare} colorClass="text-emerald-400" />
                <MetricRow label="Followers" value={formatValue(user?.followers || 0)} icon={Users} colorClass="text-neon-purple" />
                <MetricRow label="Repositories" value={formatValue(totalReposCount)} icon={BookOpen} colorClass="text-neon-rose" />
                <MetricRow label="Total Forks" value={formatValue(stats.totalForks)} icon={GitFork} colorClass="text-indigo-400" />
              </div>
              {user?.bio && (
                <div className="mt-6 pt-4 border-t border-border-color">
                  <p className="text-[10px] font-mono text-text-secondary uppercase tracking-widest mb-2">
                    Identity Broadcast
                  </p>
                  <p className="text-xs text-text-primary leading-relaxed font-medium italic">
                    "{user.bio}"
                  </p>
                </div>
              )}
            </GlassCard>

            {/* Repository Influence Bar Chart */}
            <GlassCard className="md:col-span-7">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-color">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-neon-rose" />
                  <h4 className="text-base font-bold font-sora text-text-primary">Repository Influence</h4>
                </div>
                <span className="text-[10px] font-mono text-neon-indigo px-2 py-0.5 rounded bg-neon-indigo/15 border border-neon-indigo/30 font-bold">
                  Top Stars
                </span>
              </div>
              <div className="h-56 relative">
                <Bar
                  data={{
                    labels: visibleTopRepos.map((r) =>
                      r.name.length > 12 ? r.name.substring(0, 12) + '..' : r.name
                    ),
                    datasets: [
                      {
                        data: visibleTopRepos.map((r) => r.stargazers_count || 0),
                        backgroundColor: isDark ? 'rgba(99, 102, 241, 0.4)' : 'rgba(67, 56, 202, 0.6)',
                        borderColor: isDark ? '#6366F1' : '#4338CA',
                        borderWidth: 1.5,
                        borderRadius: 6,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: { display: false, beginAtZero: true },
                      x: {
                        grid: { display: false },
                        ticks: { color: chartLabelColor, font: { family: 'monospace', size: 10 } },
                      },
                    },
                    plugins: { legend: { display: false } },
                  }}
                />
              </div>
            </GlassCard>

            {/* Technological DNA Animated Section */}
            <TechnologicalDNA languages={stats.languages} className="md:col-span-7 lg:col-span-8" />

            {/* Location & Links */}
            <GlassCard className="md:col-span-5 lg:col-span-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-neon-cyan" />
                  <span className="text-xs font-mono text-text-secondary uppercase tracking-widest">
                    Location Node
                  </span>
                </div>
                <h4 className="text-lg font-bold font-sora text-text-primary">
                  {user?.location || 'Bengaluru, India'}
                </h4>
              </div>

              <div className="mt-6 pt-4 border-t border-border-color">
                <a
                  href={user?.html_url || `https://github.com/${username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/40 text-text-primary hover:text-neon-indigo border border-border-color hover:border-neon-indigo/30 transition-all text-xs font-mono uppercase tracking-wider"
                >
                  <span>Profile Access</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};

export default GitHubStatsSection;
