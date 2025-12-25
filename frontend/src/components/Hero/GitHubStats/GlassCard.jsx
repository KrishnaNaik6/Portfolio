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
import { motion } from 'framer-motion';

// Register ChartJS components
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


const GlassCard = ({ children, title, icon: Icon, delay = 0, className = "", headerExtra = null }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
    className={`group relative overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200 dark:border-white/5 p-5 md:p-8 flex flex-col shadow-xl shadow-slate-200/50 dark:shadow-none ${className}`}
  >
    <div className="absolute -inset-px bg-gradient-to-br from-cyan-500/5 dark:from-cyan-500/10 via-transparent to-purple-500/5 dark:to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    {title && (
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-cyan-600 dark:text-cyan-400">
            {Icon && <Icon size={18} />}
          </div>
          <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          {headerExtra}
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 animate-pulse hidden sm:block" />
        </div>
      </div>
    )}
    <div className="relative z-10 flex-1">{children}</div>
  </motion.div>
);

export default GlassCard;