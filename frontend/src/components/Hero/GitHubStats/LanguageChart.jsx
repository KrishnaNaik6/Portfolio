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
import { Pie, Bar, Radar } from 'react-chartjs-2';
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
  Zap // Fixed: Added missing import
} from 'lucide-react';

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

const LanguageChart = ({ languages }) => {
  const chartData = {
    labels: Object.keys(languages).slice(0, 5),
    datasets: [{
      label: 'Distribution',
      data: Object.values(languages).slice(0, 5),
      backgroundColor: 'rgba(168, 85, 247, 0.2)',
      borderColor: '#a855f7',
      pointBackgroundColor: '#a855f7',
      borderWidth: 2,
    }]
  };

  const options = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255,255,255,0.05)' },
        grid: { color: 'rgba(255,255,255,0.05)' },
        pointLabels: { color: '#94a3b8', font: { size: 10, family: 'monospace' } },
        ticks: { display: false }
      }
    },
    plugins: { legend: { display: false } }
  };

  return (
    <div className="h-full flex items-center justify-center py-4">
      <Radar data={chartData} options={options} />
    </div>
  );
};

export default LanguageChart;