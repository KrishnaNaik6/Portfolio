import React from 'react';

export default function ResumeLoading() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-pulse">
      {/* Top action bar skeleton */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-border-color">
        <div className="h-9 w-28 bg-bg-surface rounded-lg"></div>
        <div className="flex gap-3">
          <div className="h-9 w-32 bg-bg-surface rounded-lg"></div>
          <div className="h-9 w-36 bg-bg-surface rounded-lg"></div>
        </div>
      </div>

      {/* Resume paper container skeleton */}
      <div className="bg-bg-surface/50 border border-border-color rounded-2xl p-8 sm:p-12 space-y-8">
        {/* Header skeleton */}
        <div className="border-b border-border-color pb-6 space-y-3">
          <div className="h-8 w-64 bg-border-color/50 rounded"></div>
          <div className="h-5 w-48 bg-border-color/30 rounded"></div>
          <div className="flex flex-wrap gap-4 pt-2">
            <div className="h-4 w-32 bg-border-color/30 rounded"></div>
            <div className="h-4 w-40 bg-border-color/30 rounded"></div>
            <div className="h-4 w-28 bg-border-color/30 rounded"></div>
          </div>
        </div>

        {/* Summary skeleton */}
        <div className="space-y-2">
          <div className="h-5 w-32 bg-border-color/50 rounded"></div>
          <div className="h-4 w-full bg-border-color/20 rounded"></div>
          <div className="h-4 w-5/6 bg-border-color/20 rounded"></div>
        </div>

        {/* Skills skeleton */}
        <div className="space-y-3">
          <div className="h-5 w-24 bg-border-color/50 rounded"></div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-6 w-20 bg-border-color/30 rounded-full"></div>
            ))}
          </div>
        </div>

        {/* Experience skeleton */}
        <div className="space-y-4">
          <div className="h-5 w-36 bg-border-color/50 rounded"></div>
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2 pl-4 border-l-2 border-border-color">
              <div className="h-5 w-48 bg-border-color/40 rounded"></div>
              <div className="h-4 w-36 bg-border-color/20 rounded"></div>
              <div className="h-4 w-full bg-border-color/20 rounded"></div>
              <div className="h-4 w-4/5 bg-border-color/20 rounded"></div>
            </div>
          ))}
        </div>

        {/* Education skeleton */}
        <div className="space-y-4">
          <div className="h-5 w-28 bg-border-color/50 rounded"></div>
          <div className="space-y-2 pl-4 border-l-2 border-border-color">
            <div className="h-5 w-40 bg-border-color/40 rounded"></div>
            <div className="h-4 w-32 bg-border-color/20 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
