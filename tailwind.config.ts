import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-main': 'var(--bg-main)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'border-color': 'var(--border-color)',
        'card-bg': 'var(--card-bg)',
        'neon-cyan': 'var(--neon-cyan)',
        'neon-purple': 'var(--neon-purple)',
        'neon-pink': 'var(--neon-pink)',
      },
      fontFamily: {
        sora: ['var(--font-sora)', 'Sora', 'sans-serif'],
        inter: ['var(--font-inter)', 'Inter', 'sans-serif'],
        mono: ['var(--font-mono)', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': 'var(--shadow-cyan)',
        'neon-purple': 'var(--shadow-purple)',
      },
    },
  },
  plugins: [],
};

export default config;
