'use client';

import { useRef } from 'react';

interface ImpactCardProps {
  totalGiven: number;
  campaignsSupported: number;
  goalsHelped: number;
  topCause: string;
  monthsActive: number;
  impactPercentile: number;
  displayName: string;
}

export function ImpactCard({
  totalGiven,
  campaignsSupported,
  goalsHelped,
  topCause,
  monthsActive,
  impactPercentile,
  displayName,
}: ImpactCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      className="relative w-full max-w-sm overflow-hidden rounded-3xl"
      style={{
        background: 'linear-gradient(145deg, #02a95c 0%, #017a3e 50%, #015e30 100%)',
      }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="relative p-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="text-sm font-semibold uppercase tracking-wider opacity-90">Impact Report</span>
            </div>
            <p className="text-xl font-bold">{displayName}</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <span className="text-2xl font-bold">{impactPercentile}%</span>
          </div>
        </div>

        {/* Main stat */}
        <div className="mb-6 rounded-2xl bg-white/10 backdrop-blur-sm p-5">
          <p className="text-sm font-medium opacity-80 mb-1">Total Given</p>
          <p className="text-4xl font-bold tracking-tight">
            ${(totalGiven / 100).toLocaleString('en-US', { minimumFractionDigits: 0 })}
          </p>
          <p className="text-sm opacity-70 mt-1">across {monthsActive} months of giving</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl bg-white/10 backdrop-blur-sm p-3 text-center">
            <p className="text-2xl font-bold">{campaignsSupported}</p>
            <p className="text-[11px] font-medium opacity-70 mt-0.5">Campaigns</p>
          </div>
          <div className="rounded-xl bg-white/10 backdrop-blur-sm p-3 text-center">
            <p className="text-2xl font-bold">{goalsHelped}</p>
            <p className="text-[11px] font-medium opacity-70 mt-0.5">Goals Reached</p>
          </div>
          <div className="rounded-xl bg-white/10 backdrop-blur-sm p-3 text-center">
            <p className="text-2xl font-bold">Top {impactPercentile}%</p>
            <p className="text-[11px] font-medium opacity-70 mt-0.5">of Givers</p>
          </div>
        </div>

        {/* Top cause */}
        <div className="flex items-center justify-between rounded-xl bg-white/10 backdrop-blur-sm px-4 py-3">
          <span className="text-sm font-medium opacity-80">Top Cause</span>
          <span className="text-sm font-bold">{topCause}</span>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 opacity-60">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="text-xs font-semibold">GoFundMe Giving Agent</span>
          </div>
          <span className="text-xs opacity-50">gofundme.com/giving-agent</span>
        </div>
      </div>
    </div>
  );
}
