const Footer = () => {
    const now = new Date();
    // Compact format: "Dec 25, 2025"
    const dateString = now.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });

    return (
        <footer className="py-10 border-t border-white/5 text-center font-inter mt-12">
            <div className="max-w-7xl mx-auto px-6 space-y-2">
                
                {/* Line 1: Copyright and Live Date */}
                <p className="text-xs uppercase tracking-widest text-slate-500 font-mono">
                    © {now.getFullYear()} <span className="text-slate-300">Krishna Naik</span> 
                    <span className="mx-3 text-slate-700">//</span> 
                    <span className="text-cyan-500/80">{dateString}</span>
                </p>

                {/* Line 2: Tech Stack Credits */}
                <p className="text-[11px] text-slate-500 uppercase tracking-[0.15em]">
                    Built with <span className="text-cyan-400/90">React + Vite</span> 
                    <span className="mx-2 text-slate-700">&</span> 
                    <span className="text-purple-400/90">Tailwind CSS</span>
                </p>

            </div>
        </footer>
    );
};

export default Footer;