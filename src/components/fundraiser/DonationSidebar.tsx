"use client";

import { useState } from "react";
import Link from "next/link";
import type { Fundraiser, Donation } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { ProgressCircle } from "@/components/ui/ProgressCircle";
import {
  formatCurrency,
  formatCompactCurrency,
  formatRelativeTime,
  formatPercentage,
} from "@/lib/utils/format";

interface DonationSidebarProps {
  fundraiser: Fundraiser;
  donations: Donation[];
}

export function DonationSidebar({
  fundraiser,
  donations,
}: DonationSidebarProps) {
  const [showAll, setShowAll] = useState(false);

  const percentage = formatPercentage(
    fundraiser.raisedAmount,
    fundraiser.goalAmount
  );

  const sortedByAmount = [...donations].sort((a, b) => b.amount - a.amount);
  const sortedByRecent = [...donations].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const displayDonations = showAll ? sortedByAmount : sortedByRecent;
  const visibleDonations = displayDonations.slice(0, 5);

  const organizerFirstName =
    fundraiser.organizer.displayName.split(" ")[0];

  return (
    <div className="sticky top-20 space-y-4">
      {/* Green CTA banner */}
      <div className="rounded-xl bg-gfm-green px-5 py-2.5">
        <p className="text-sm font-semibold text-white text-center leading-snug">
          Help {organizerFirstName} climb the leaderboard, donate today!
        </p>
      </div>

      {/* Main card */}
      <div className="rounded-xl border border-gfm-border bg-white p-6 shadow-sm space-y-5">
        {/* Leaderboard link */}
        {fundraiser.community && (
          <Link
            href={`/community/${fundraiser.community.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gfm-green hover:underline"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            See how this fundraiser ranks
          </Link>
        )}

        {/* Progress */}
        <div className="flex items-center gap-4">
          <ProgressCircle percentage={percentage} size={64} strokeWidth={5} />
          <div>
            <p className="text-2xl font-bold text-gfm-dark leading-tight">
              {formatCurrency(fundraiser.raisedAmount)}
            </p>
            <p className="text-sm text-gfm-secondary mt-0.5">
              raised of {formatCompactCurrency(fundraiser.goalAmount)} goal
            </p>
            <p className="text-xs text-gfm-secondary mt-0.5">
              {fundraiser.donationCount.toLocaleString()} donation
              {fundraiser.donationCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-2">
          <Link href={`/f/${fundraiser.slug}/donate`}>
            <Button variant="primary" size="md" fullWidth>
              Donate now
            </Button>
          </Link>
          <Button variant="outline" size="md" fullWidth>
            Share
          </Button>
        </div>

        {/* Donors list */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAll(false)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                !showAll
                  ? "bg-gfm-dark text-white"
                  : "bg-gray-100 text-gfm-secondary hover:bg-gray-200"
              }`}
            >
              See all
            </button>
            <button
              onClick={() => setShowAll(true)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                showAll
                  ? "bg-gfm-dark text-white"
                  : "bg-gray-100 text-gfm-secondary hover:bg-gray-200"
              }`}
            >
              See top
            </button>
          </div>

          <ul className="space-y-3">
            {visibleDonations.map((donation) => (
              <li key={donation.id} className="flex items-center gap-3">
                <Avatar
                  src={donation.donor?.avatarUrl}
                  name={donation.displayName}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gfm-dark truncate">
                    {donation.displayName}
                  </p>
                  <p className="text-xs text-gfm-secondary">
                    {formatCurrency(donation.amount)}
                    <span className="mx-1">&middot;</span>
                    {formatRelativeTime(donation.createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {donations.length > 5 && (
            <button className="w-full rounded-lg border border-gfm-border py-2.5 text-sm font-semibold text-gfm-dark hover:bg-gfm-bg transition-colors">
              See all donations
            </button>
          )}
        </div>
      </div>

      {/* Nonprofit giving CTA - purple/pink gradient */}
      <div className="rounded-xl bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#ec4899] p-5 text-white">
        <div className="flex items-start gap-3">
          <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold leading-snug">
              Take your nonprofit giving to the next level
            </p>
            <p className="mt-1 text-xs text-white/80 leading-relaxed">
              Set up recurring giving or explore Giving Funds to maximize your impact.
            </p>
            <Link
              href="/giving-funds"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-white hover:underline"
            >
              Learn more
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
