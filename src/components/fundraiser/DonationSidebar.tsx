"use client";

import { useState } from "react";
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
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const displayDonations = showAll ? sortedByAmount : sortedByRecent;
  const visibleDonations = displayDonations.slice(0, 5);

  const organizerFirstName =
    fundraiser.organizer.displayName.split(" ")[0];

  return (
    <div className="sticky top-24 space-y-4">
      {/* Main card */}
      <div className="rounded-card border border-gfm-border bg-white p-6 space-y-5">
        {/* Leaderboard link */}
        {fundraiser.community && (
          <button className="text-sm font-semibold text-gfm-green hover:underline">
            See how this fundraiser ranks
          </button>
        )}

        {/* Progress */}
        <div className="flex items-center gap-4">
          <ProgressCircle percentage={percentage} size={64} strokeWidth={5} />
          <div>
            <p className="text-xl font-bold text-gfm-dark">
              {formatCurrency(fundraiser.raisedAmount)}{" "}
              <span className="text-sm font-normal text-gfm-secondary">
                raised of {formatCompactCurrency(fundraiser.goalAmount)}
              </span>
            </p>
            <p className="text-sm text-gfm-secondary">
              {fundraiser.donationCount} donation
              {fundraiser.donationCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <Button variant="primary" size="lg" fullWidth>
            Donate now
          </Button>
          <Button variant="secondary" size="lg" fullWidth>
            Share
          </Button>
        </div>

        {/* Donors list */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAll(false)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                !showAll
                  ? "bg-gfm-dark text-white"
                  : "bg-gray-100 text-gfm-secondary hover:bg-gray-200"
              }`}
            >
              See all
            </button>
            <button
              onClick={() => setShowAll(true)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
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
                    {formatCurrency(donation.amount)}{" "}
                    <span className="mx-1">&middot;</span>
                    {formatRelativeTime(donation.createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Green banner */}
      <div className="rounded-card bg-gfm-light-green p-4 text-center">
        <p className="text-sm font-semibold text-gfm-dark-green">
          Help {organizerFirstName} climb the leaderboard, donate today!
        </p>
      </div>
    </div>
  );
}
