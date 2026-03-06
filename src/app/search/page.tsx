'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo, useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { fundraisers } from '@/lib/data/mock';
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/utils/format';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Avatar } from '@/components/ui/Avatar';
import type { Fundraiser } from '@/lib/types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'medical', label: 'Medical' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'education', label: 'Education' },
  { value: 'animals', label: 'Animals' },
  { value: 'environment', label: 'Environment' },
  { value: 'community', label: 'Community' },
  { value: 'business', label: 'Business' },
  { value: 'faith', label: 'Faith' },
] as const;

type SortOption = 'trending' | 'most_funded' | 'recent';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'trending', label: 'Trending' },
  { value: 'most_funded', label: 'Most funded' },
  { value: 'recent', label: 'Recent' },
];

// ---------------------------------------------------------------------------
// Gradient placeholders for cover images
// ---------------------------------------------------------------------------

const GRADIENTS = [
  'from-emerald-400 to-cyan-500',
  'from-violet-500 to-purple-500',
  'from-rose-400 to-orange-400',
  'from-blue-400 to-indigo-500',
  'from-amber-400 to-yellow-500',
  'from-teal-400 to-green-500',
];

function gradientForIndex(i: number): string {
  return GRADIENTS[i % GRADIENTS.length];
}

// ---------------------------------------------------------------------------
// Search icon (inline SVG to avoid extra deps)
// ---------------------------------------------------------------------------

function SearchIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Fundraiser Card
// ---------------------------------------------------------------------------

function FundraiserCard({ fundraiser, index }: { fundraiser: Fundraiser; index: number }) {
  const percentage = formatPercentage(fundraiser.raisedAmount, fundraiser.goalAmount);

  return (
    <Link
      href={`/f/${fundraiser.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gfm-border bg-white transition-shadow hover:shadow-lg"
    >
      {/* Cover image / gradient placeholder */}
      <div
        className={`relative h-48 w-full bg-gradient-to-br ${gradientForIndex(index)}`}
      >
        <div className="absolute inset-0 bg-black/5 transition-opacity group-hover:bg-black/10" />
        {/* Donation count badge */}
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-gfm-dark shadow-sm backdrop-blur-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-3.5 w-3.5 text-gfm-green"
          >
            <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.837-2.12C3.8 12.573 2 10.328 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.828-1.8 5.073-3.63 6.6a22.045 22.045 0 01-3.999 2.802l-.019.01-.005.003h-.002a.723.723 0 01-.692 0h-.002z" />
          </svg>
          {formatNumber(fundraiser.donationCount)} donations
        </span>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Title */}
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-gfm-dark group-hover:text-gfm-green transition-colors">
          {fundraiser.title}
        </h3>

        {/* Organizer */}
        <div className="flex items-center gap-2">
          <Avatar
            src={fundraiser.organizer.avatarUrl}
            name={fundraiser.organizer.displayName}
            size="xs"
          />
          <span className="text-sm text-gfm-secondary truncate">
            {fundraiser.organizer.displayName}
          </span>
        </div>

        {/* Progress */}
        <div className="mt-auto flex flex-col gap-1.5">
          <ProgressBar percentage={percentage} height="sm" />
          <p className="text-sm">
            <span className="font-semibold text-gfm-dark">
              {formatCurrency(fundraiser.raisedAmount)}
            </span>
            <span className="text-gfm-secondary">
              {' '}raised of {formatCurrency(fundraiser.goalAmount)}
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Inner search page (needs useSearchParams inside Suspense)
// ---------------------------------------------------------------------------

function SearchPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read URL params
  const queryParam = searchParams.get('q') ?? '';
  const categoryParam = searchParams.get('category') ?? 'all';
  const sortParam = (searchParams.get('sort') as SortOption) ?? 'trending';

  // Local input state (kept in sync with URL on commit)
  const [inputValue, setInputValue] = useState(queryParam);

  // Build new URL and push
  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (!value || value === 'all' && key === 'category') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      // Clean up empty q
      if (!params.get('q')) params.delete('q');
      const qs = params.toString();
      router.push(`/search${qs ? `?${qs}` : ''}`, { scroll: false });
    },
    [searchParams, router],
  );

  // Handle typing — update URL as the user types for real-time filtering
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputValue(val);
      updateParams({ q: val });
    },
    [updateParams],
  );

  // Filtering + sorting
  const results = useMemo(() => {
    let filtered = [...fundraisers];

    // Text search
    if (queryParam) {
      const q = queryParam.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.title.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.organizer.displayName.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q),
      );
    }

    // Category filter
    if (categoryParam && categoryParam !== 'all') {
      filtered = filtered.filter(
        (f) => f.category.toLowerCase() === categoryParam.toLowerCase(),
      );
    }

    // Sort
    switch (sortParam) {
      case 'most_funded':
        filtered.sort((a, b) => b.raisedAmount - a.raisedAmount);
        break;
      case 'recent':
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case 'trending':
      default:
        // Trending: weighted combo of donations + recency
        filtered.sort((a, b) => {
          const scoreA =
            a.donationCount * 10 +
            (new Date(a.updatedAt).getTime() / 1e10);
          const scoreB =
            b.donationCount * 10 +
            (new Date(b.updatedAt).getTime() / 1e10);
          return scoreB - scoreA;
        });
        break;
    }

    return filtered;
  }, [queryParam, categoryParam, sortParam]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ---- Search Header ---- */}
      <div className="relative mb-6">
        <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gfm-secondary pointer-events-none" />
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search fundraisers..."
          className="w-full rounded-full border border-gfm-border bg-gfm-bg py-3.5 pl-12 pr-4 text-base text-gfm-dark placeholder:text-gfm-secondary outline-none transition-shadow focus:border-gfm-green focus:ring-2 focus:ring-gfm-green/20"
        />
      </div>

      {/* ---- Category Pills ---- */}
      <div className="mb-6 flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {CATEGORIES.map((cat) => {
          const isActive = categoryParam === cat.value || (!categoryParam && cat.value === 'all');
          return (
            <button
              key={cat.value}
              onClick={() => updateParams({ category: cat.value })}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gfm-green text-white'
                  : 'border border-gfm-border text-gfm-secondary hover:border-gfm-green hover:text-gfm-green'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* ---- Sort + Results Count Row ---- */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gfm-secondary">
          Showing{' '}
          <span className="font-semibold text-gfm-dark">
            {results.length}
          </span>{' '}
          fundraiser{results.length !== 1 ? 's' : ''}
        </p>

        <div className="relative">
          <select
            value={sortParam}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className="appearance-none rounded-full border border-gfm-border bg-white py-2 pl-4 pr-9 text-sm font-medium text-gfm-dark outline-none transition-shadow focus:border-gfm-green focus:ring-2 focus:ring-gfm-green/20"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {/* Chevron */}
          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gfm-secondary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>

      {/* ---- Results Grid or Empty State ---- */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((f, i) => (
            <FundraiserCard key={f.id} fundraiser={f} index={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gfm-border py-20 text-center">
          <svg
            className="mb-4 h-12 w-12 text-gfm-border"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <p className="text-base font-medium text-gfm-dark">
            No fundraisers found
          </p>
          <p className="mt-1 text-sm text-gfm-secondary">
            Try a different search term or category.
          </p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page export (wraps inner component in Suspense for useSearchParams)
// ---------------------------------------------------------------------------

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="h-12 w-full animate-pulse rounded-full bg-gfm-bg" />
          <div className="mt-6 flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-9 w-20 animate-pulse rounded-full bg-gfm-bg" />
            ))}
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-xl bg-gfm-bg" />
            ))}
          </div>
        </div>
      }
    >
      <SearchPageInner />
    </Suspense>
  );
}
