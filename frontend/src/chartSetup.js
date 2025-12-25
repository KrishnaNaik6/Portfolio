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