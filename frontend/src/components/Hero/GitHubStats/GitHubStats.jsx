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
  RadialLinearScale
} from 'chart.js';
import { Bar, Radar } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github,
  Star,
  Code2,
  GitFork,
  TrendingUp,
  Terminal,
  Cpu,
  Activity,
  Layers,
  Globe,
  Search,
  MapPin,
  ExternalLink,
  Zap,
  AlertCircle,
  Users,
  BookOpen,
  GitPullRequest,
  MessageSquare,
  RotateCcw,
  BarChart3,
  Sun,
  Moon
} from 'lucide-react';

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
import GlassCard from '../../Cards/GlassCard';
import MetricRow from './MetricRow';

const API_URL = import.meta.env.VITE_API_URL ?? "";

const GitHubStats = ({ initialUsername = 'KrishnaNaik6', className = "" }) => {
  const [username, setUsername] = useState(initialUsername);
  const [searchInput, setSearchInput] = useState('');
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [extraStats, setExtraStats] = useState({ commits: 0, prs: 0, issues: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );




  // Typewriter logic
  const [placeholder, setPlaceholder] = useState('');
  const phrases = useMemo(() => ["Switch Node Username...", "See Your Profile...", "Analyze Neural Stats..."], []);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(
        document.documentElement.getAttribute("data-theme") === "dark" ||
        document.documentElement.classList.contains("dark")
      );
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    return () => observer.disconnect();
  }, []);


  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < phrases[phraseIndex].length) {
        setCharIndex(prev => prev + 1);
      } else if (isDeleting && charIndex > 0) {
        setCharIndex(prev => prev - 1);
      } else if (!isDeleting && charIndex === phrases[phraseIndex].length) {
        setIsDeleting(true);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setPhraseIndex(prev => (prev + 1) % phrases.length);
      }
    }, isDeleting ? 40 : 80);
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex, phrases]);

  useEffect(() => {
    setPlaceholder(phrases[phraseIndex].substring(0, charIndex));
  }, [charIndex, phraseIndex, phrases]);

  const fetchData = async (targetUser) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/github/stats/${encodeURIComponent(targetUser.trim())}`);
      if (res.status === 403) throw new Error('API Rate Limit Exceeded.');
      if (res.status === 404) throw new Error('User node not found.');
      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      setUser(data.user);
      setRepos(Array.isArray(data.repos) ? data.repos : []);
      setExtraStats(data.extraStats || { commits: 0, prs: 0, issues: 0 });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(username); }, [username]);

  const stats = useMemo(() => {
    if (!repos.length) return { languages: {}, topRepos: [], totalStars: 0, totalForks: 0 };
    const languagesMap = {};
    let starCount = 0;
    let forkCount = 0;
    repos.forEach(r => {
      if (r.language) languagesMap[r.language] = (languagesMap[r.language] || 0) + 1;
      starCount += (r.stargazers_count || 0);
      forkCount += (r.forks_count || 0);
    });
    const sortedReposByStars = [...repos].sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
    return { languages: languagesMap, topRepos: sortedReposByStars, totalStars: starCount, totalForks: forkCount };
  }, [repos]);

  const visibleTopRepos = useMemo(() => {
    const starredRepos = stats.topRepos.filter(r => (r.stargazers_count || 0) > 0);
    return starredRepos.length > 0 ? starredRepos : stats.topRepos.slice(0, 5);
  }, [stats.topRepos]);

  const formatValue = (val) => val >= 1000 ? (val / 1000).toFixed(1) + 'k+' : val.toLocaleString();
  const totalReposCount = (user?.public_repos || 0) + (user?.total_private_repos || user?.owned_private_repos || 0);

  // Dynamic Chart Colors based on theme
  const chartLabelColor = isDark ? '#94a3b8' : '#64748b';
  const chartGridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  // console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~MODE Dark````````````````", isDark)


  if (loading && !user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        <div className="w-12 h-12 border-2 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin" />
        <span className="text-cyan-600 dark:text-cyan-400 font-mono text-xs tracking-[0.5em] uppercase">Syncing Node...</span>
      </div>
    );
  }

  return (
    <div className={`w-full flex flex-col gap-6 md:gap-8 ${className}`}>
      <nav className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="relative group shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur opacity-25 dark:opacity-40" />
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-white dark:bg-slate-950 p-1">
              <div className="w-full h-full rounded-full overflow-hidden border border-slate-200 dark:border-white/10">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-400"><Github size={24} /></div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-1 truncate">{user?.name || user?.login}</h2>
            <div className="flex items-center gap-3">
              <span className="text-[8px] md:text-[10px] text-cyan-600 dark:text-cyan-400 font-mono tracking-widest uppercase py-1 px-2 bg-cyan-100 dark:bg-cyan-400/10 rounded border border-cyan-200 dark:border-cyan-400/20 whitespace-nowrap">
                Active_Entity
              </span>
              <span className="text-[10px] md:text-xs text-slate-500 font-mono">ID: {user?.id}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full xl:w-auto">
          <form onSubmit={(e) => { e.preventDefault(); if (searchInput.trim()) { setUsername(searchInput.trim()); setSearchInput(''); } }} className="relative flex-1 sm:w-80 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400 transition-colors" size={16} />
            <input
              type="text"
              placeholder={placeholder}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 rounded-2xl py-3 md:py-4 pl-12 pr-6 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-sm"
            />
          </form>
          <button
            onClick={() => { setUsername(initialUsername); setSearchInput(''); }}
            className="flex items-center justify-center gap-2 px-6 py-3 md:py-4 rounded-2xl md:rounded-3xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-white hover:border-cyan-500/50 transition-all font-mono text-[10px] md:text-xs uppercase tracking-widest"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </nav>

      {error ? (
        <GlassCard className="items-center py-20 text-center">
          <AlertCircle className="text-red-500 mb-4" size={40} />
          <h2 className="text-lg md:text-xl font-bold text-red-500 uppercase font-mono tracking-widest">Protocol_Error</h2>
          <p className="text-slate-500 text-xs md:text-sm mb-8 font-mono">{error}</p>
          <button onClick={() => fetchData(initialUsername)} className="px-8 py-3 bg-slate-200 dark:bg-white/5 rounded-full text-xs font-mono uppercase hover:bg-slate-300 dark:hover:bg-white/10 transition-colors">Re-Initialize</button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">

          <GlassCard title="Neural Metrics Summary" icon={Activity} className="md:col-span-5 md:row-span-2">
            <div className="flex flex-col gap-1">
              <MetricRow label="Total Stars" value={formatValue(stats.totalStars)} icon={Star} colorClass="text-amber-500" />
              <MetricRow label="Total Commits" value={formatValue(extraStats.commits)} icon={Zap} colorClass="text-purple-600 dark:text-purple-400" />
              <MetricRow label="Total PRs" value={formatValue(extraStats.prs)} icon={GitPullRequest} colorClass="text-blue-600 dark:text-blue-400" />
              <MetricRow label="Total Issues" value={formatValue(extraStats.issues)} icon={MessageSquare} colorClass="text-emerald-600 dark:text-emerald-400" />
              <MetricRow label="Followers" value={formatValue(user?.followers || 0)} icon={Users} colorClass="text-cyan-600 dark:text-cyan-400" />
              <MetricRow label="Repositories" value={formatValue(totalReposCount)} icon={BookOpen} colorClass="text-pink-600 dark:text-pink-400" />
              <MetricRow label="Total Forks" value={formatValue(stats.totalForks)} icon={GitFork} colorClass="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="mt-6 md:mt-8 pt-6 border-t border-slate-100 dark:border-white/5">
              <p className="text-[8px] md:text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">Identity broadcast</p>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium italic">
                "{user?.bio || 'No broadcast bio available for this entity.'}"
              </p>
            </div>
          </GlassCard>

          <GlassCard title="Repository Influence" icon={TrendingUp} className="md:col-span-7 md:row-span-1"
            headerExtra={<div className="text-[8px] md:text-[10px] text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-400/5 px-2 py-1 rounded border border-cyan-100 dark:border-cyan-400/10 font-bold">Auto_Scaling: Active</div>}>
            <div className="h-full flex flex-col min-h-[250px] relative">
              <Bar
                data={{
                  labels: visibleTopRepos.map(r => r.name.length > 12 ? r.name.substring(0, 12) + '..' : r.name),
                  datasets: [{
                    data: visibleTopRepos.map(r => r.stargazers_count || 0),
                    backgroundColor: isDark ? 'rgba(34, 211, 238, 0.4)' : 'rgba(8, 145, 178, 0.6)',
                    borderColor: isDark ? '#22d3ee' : '#0891b2',
                    borderWidth: 1.5,
                    borderRadius: 8,
                  }]
                }}
                options={{
                  responsive: true, maintainAspectRatio: false,
                  scales: {
                    y: { display: false, beginAtZero: true },
                    x: { grid: { display: false }, ticks: { color: chartLabelColor, font: { family: 'monospace', size: 9 }, maxRotation: 45 } }
                  },
                  plugins: { legend: { display: false } }
                }}
              />
            </div>
          </GlassCard>

          <GlassCard title="Technological DNA" icon={Layers} className="md:col-span-4 md:row-span-1">
            <div className="h-full flex items-center justify-center min-h-[220px]">
              {Object.keys(stats.languages).length > 0 ? (
                <Radar
                  data={{
                    labels: Object.keys(stats.languages).slice(0, 8),
                    datasets: [{
                      data: Object.values(stats.languages).slice(0, 8),
                      backgroundColor: isDark ? 'rgba(168, 85, 247, 0.2)' : 'rgba(147, 51, 234, 0.1)',
                      borderColor: isDark ? '#a855f7' : '#9333ea',
                      borderWidth: 2,
                    }]
                  }}
                  options={{
                    responsive: true, maintainAspectRatio: false,
                    scales: {
                      r: {
                        angleLines: { color: chartGridColor },
                        grid: { color: chartGridColor },
                        pointLabels: { color: chartLabelColor, font: { size: 9, family: 'monospace', weight: 'bold' } },
                        ticks: { display: false }
                      }
                    },
                    plugins: { legend: { display: false } }
                  }}
                />
              ) : <div className="opacity-20 flex flex-col items-center"><Layers size={32} /><p className="text-[10px] font-mono mt-2">Null_Signal</p></div>}
            </div>
          </GlassCard>

          <GlassCard className="md:col-span-3 md:row-span-1 bg-gradient-to-br from-blue-500/10 to-transparent">
            <div className="flex flex-col justify-between h-full min-h-[120px]">
              <Globe className="text-blue-500 dark:text-blue-400" size={24} />
              <div className="py-2">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Coordinate</p>
                <h4 className="text-base md:text-xl font-black text-slate-900 dark:text-white truncate">{user?.location || 'Undisclosed'}</h4>
              </div>
              <a href={user?.html_url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                <span className="text-[10px] font-mono uppercase tracking-widest">Profile_Access</span>
                <ExternalLink size={12} />
              </a>
              <div className="mt-40 border-t border-white/5 py-12 flex justify-between items-center text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                <div className="flex gap-8">
                  <span>Status: Synchronized</span>
                  <span>Auth: Proxied</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default GitHubStats;