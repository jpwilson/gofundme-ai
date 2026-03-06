'use client';

import type { CauseType, GivingPledge } from '@/lib/types';
import { causes } from '@/lib/data/mock';

const geoLabels: Record<GivingPledge['geographicPreference'], string> = {
  local: 'Local (My City)',
  state: 'Regional (My State)',
  country: 'National',
  global: 'Global',
};

const strategyLabels: Record<GivingPledge['allocationStrategy'], { label: string; description: string }> = {
  even_split: { label: 'Even Split', description: 'Equal distribution across campaigns' },
  impact_weighted: { label: 'Impact Weighted', description: 'More to campaigns close to goals' },
  ai_optimized: { label: 'AI Optimized', description: 'Maximum impact potential' },
};

interface PledgeSummaryProps {
  monthlyAmount: number;
  selectedCauses: CauseType[];
  geographicPreference: GivingPledge['geographicPreference'];
  allocationStrategy: GivingPledge['allocationStrategy'];
  compact?: boolean;
}

export function PledgeSummary({
  monthlyAmount,
  selectedCauses,
  geographicPreference,
  allocationStrategy,
  compact = false,
}: PledgeSummaryProps) {
  const causeLabels = selectedCauses.map(
    (ct) => causes.find((c) => c.type === ct)?.label ?? ct
  );
  const strategy = strategyLabels[allocationStrategy];

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-[var(--gfm-green)]/10 px-3 py-1 text-sm font-semibold text-[var(--gfm-green)]">
          ${(monthlyAmount / 100).toFixed(0)}/mo
        </span>
        <span className="text-sm text-[var(--gfm-secondary)]">|</span>
        <span className="text-sm text-[var(--gfm-secondary)]">{strategy.label}</span>
        <span className="text-sm text-[var(--gfm-secondary)]">|</span>
        <span className="text-sm text-[var(--gfm-secondary)]">{geoLabels[geographicPreference]}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Monthly Amount */}
      <div className="rounded-2xl border border-[var(--gfm-border)] bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--gfm-secondary)]">Monthly Pledge</p>
            <p className="text-3xl font-bold text-[var(--gfm-dark)]">
              ${(monthlyAmount / 100).toFixed(0)}
              <span className="text-lg font-normal text-[var(--gfm-secondary)]">/month</span>
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--gfm-green)]/10">
            <svg className="h-6 w-6 text-[var(--gfm-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Causes */}
      <div className="rounded-2xl border border-[var(--gfm-border)] bg-white p-5">
        <p className="text-sm font-medium text-[var(--gfm-secondary)] mb-3">Causes</p>
        <div className="flex flex-wrap gap-2">
          {causeLabels.map((label) => (
            <span
              key={label}
              className="inline-flex items-center rounded-full bg-[var(--gfm-light-green)] px-3 py-1.5 text-sm font-medium text-[var(--gfm-dark-green)]"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Geography & Strategy */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[var(--gfm-border)] bg-white p-5">
          <p className="text-sm font-medium text-[var(--gfm-secondary)] mb-1">Geography</p>
          <p className="text-base font-semibold text-[var(--gfm-dark)]">{geoLabels[geographicPreference]}</p>
        </div>
        <div className="rounded-2xl border border-[var(--gfm-border)] bg-white p-5">
          <p className="text-sm font-medium text-[var(--gfm-secondary)] mb-1">Strategy</p>
          <p className="text-base font-semibold text-[var(--gfm-dark)]">{strategy.label}</p>
        </div>
      </div>
    </div>
  );
}
