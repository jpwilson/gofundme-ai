'use client';

import { useState } from 'react';
import type { CauseType } from '@/lib/types';
import { causes } from '@/lib/data/mock';

const causeIcons: Record<CauseType, string> = {
  animals: 'M12 21c-1.5 0-3-.5-4.5-1.5C6 18.5 5 17 4.5 15.5 4 14 4 12.5 4.5 11c.5-1.5 1-2.5 2-3.5S8.5 6 10 5.5c1-.5 2-.5 2-.5s1 0 2 .5c1.5.5 2.5 1 3.5 2s1.5 2 2 3.5c.5 1.5.5 3 0 4.5S18 18.5 16.5 19.5 13.5 21 12 21z',
  arts_culture: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
  environment: 'M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75',
  education: 'M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z',
  medical: 'M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z',
  emergency: 'M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 5v2h2v-2h-2z',
  community: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
  faith: 'M11.5 2v4H9v2h2.5v14h2V8H16V6h-2.5V2h-2z',
  sports: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM5.61 16.78C4.6 15.45 4 13.8 4 12s.6-3.45 1.61-4.78a9.97 9.97 0 010 9.56zM12 20c-1.81 0-3.46-.61-4.79-1.61A8.002 8.002 0 0012 4c3.31 0 6.14 2.01 7.36 4.88A9.96 9.96 0 0120 12c0 1.8-.6 3.45-1.61 4.78A7.97 7.97 0 0112 20z',
  business: 'M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z',
};

interface CauseSelectorProps {
  selected: CauseType[];
  onChange: (selected: CauseType[]) => void;
}

export function CauseSelector({ selected, onChange }: CauseSelectorProps) {
  const toggle = (causeType: CauseType) => {
    if (selected.includes(causeType)) {
      onChange(selected.filter((c) => c !== causeType));
    } else {
      onChange([...selected, causeType]);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {causes.map((cause) => {
        const isSelected = selected.includes(cause.type);
        return (
          <button
            key={cause.type}
            type="button"
            onClick={() => toggle(cause.type)}
            className={`
              relative flex flex-col items-center gap-3 rounded-2xl border-2 p-5 transition-all duration-200
              ${
                isSelected
                  ? 'border-[var(--gfm-green)] bg-[var(--gfm-green)]/5 shadow-md shadow-[var(--gfm-green)]/10'
                  : 'border-[var(--gfm-border)] bg-white hover:border-[var(--gfm-green)]/40 hover:shadow-sm'
              }
            `}
          >
            {/* Checkmark */}
            {isSelected && (
              <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--gfm-green)]">
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {/* Icon */}
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-200"
              style={{ backgroundColor: cause.iconBgColor }}
            >
              <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={causeIcons[cause.type]} />
              </svg>
            </div>
            <span className={`text-sm font-semibold ${isSelected ? 'text-[var(--gfm-green)]' : 'text-[var(--gfm-dark)]'}`}>
              {cause.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
