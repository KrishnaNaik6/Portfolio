import { useMemo } from 'react';

const ContributionHeatmap = () => {
  const days = useMemo(() => Array.from({ length: 140 }, () => Math.floor(Math.random() * 5)), []);
  return (
    <div className="grid grid-flow-col grid-rows-7 gap-1.5 h-full max-h-[140px]">
      {days.map((level, i) => (
        <div 
          key={i} 
          className={`w-3 h-3 rounded-[2px] transition-all duration-300 hover:scale-150 hover:z-20 ${
            level === 0 ? 'bg-slate-800/50' : 
            level === 1 ? 'bg-cyan-900/40' : 
            level === 2 ? 'bg-cyan-700/60' : 
            level === 3 ? 'bg-cyan-500/80' : 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]'
          }`}
        />
      ))}
    </div>
  );
};

export default ContributionHeatmap;