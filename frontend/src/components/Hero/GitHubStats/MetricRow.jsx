
const MetricRow = ({ label, value, icon: Icon, colorClass = "text-cyan-600 dark:text-cyan-400" }) => (
  <div className="flex items-center justify-between group/row py-2 md:py-3 border-b border-slate-100 dark:border-white/5 last:border-0">
    <div className="flex items-center gap-3">
      <div className={`p-1.5 md:p-2 rounded-lg bg-slate-50 dark:bg-white/5 ${colorClass}`}>
        <Icon size={14} className="md:w-4 md:h-4" />
      </div>
      <span className="text-[10px] md:text-sm font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover/row:text-slate-900 dark:group-hover/row:text-slate-200 transition-colors">
        {label}
      </span>
    </div>
    <span className="text-sm md:text-lg font-black text-slate-900 dark:text-white font-mono group-hover/row:text-cyan-600 dark:group-hover/row:text-cyan-400 transition-colors">
      {value}
    </span>
  </div>
);

export default MetricRow;