'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg-main text-text-primary flex flex-col items-center justify-center p-6 text-center font-sora">
      <h1 className="text-4xl font-black text-neon-rose mb-4">System Anomaly</h1>
      <p className="text-text-secondary text-sm font-mono max-w-md mb-8">
        An unexpected exception occurred in the execution matrix.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 rounded-full bg-neon-indigo text-white font-semibold text-sm hover:bg-neon-indigo/90 transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)]"
      >
        Re-Initialize Pathway
      </button>
    </div>
  );
}
