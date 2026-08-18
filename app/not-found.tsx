import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-main text-text-primary flex flex-col items-center justify-center p-6 text-center font-sora">
      <h1 className="text-6xl font-black text-neon-indigo mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-4">Page Node Not Found</h2>
      <p className="text-text-secondary text-sm font-mono max-w-md mb-8">
        The requested pathway does not exist in the cybernetic matrix.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-full bg-neon-indigo text-white font-semibold text-sm hover:bg-neon-indigo/90 transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)]"
      >
        Return to Core
      </Link>
    </div>
  );
}
