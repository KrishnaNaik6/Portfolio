'use client';

export default function Loading() {
  return (
    <main
      aria-label="Loading portfolio"
      className="min-h-screen bg-bg-main text-text-primary flex items-center justify-center px-6"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div
          aria-hidden="true"
          className="h-10 w-10 rounded-full border-2 border-neon-indigo/20 border-t-neon-indigo animate-spin"
        />
        <p className="font-mono text-xs tracking-[0.25em] uppercase text-text-secondary">
          Initializing portfolio...
        </p>
      </div>
    </main>
  );
}
