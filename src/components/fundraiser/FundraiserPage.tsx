"use client";

import type { Fundraiser, Donation, LeaderboardEntry } from "@/lib/types";
import { ImageCarousel } from "./ImageCarousel";
import { DonationSidebar } from "./DonationSidebar";
import { CampaignDescription } from "./CampaignDescription";
import { LeaderboardSection } from "./LeaderboardSection";
import { OrganizerSection } from "./OrganizerSection";
import { CauseSection } from "./CauseSection";

interface FundraiserPageProps {
  fundraiser: Fundraiser;
  donations: Donation[];
  leaderboard: LeaderboardEntry[];
}

export function FundraiserPage({
  fundraiser,
  donations,
  leaderboard,
}: FundraiserPageProps) {
  const allImages = [fundraiser.coverImageUrl, ...fundraiser.images];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
      {/* Title */}
      <h1 className="mb-6 text-2xl font-bold text-gfm-dark md:text-3xl leading-tight">
        {fundraiser.title}
      </h1>

      {/* Two-column layout */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left column - Main content (~60%) */}
        <div className="w-full space-y-8 lg:w-[60%]">
          <ImageCarousel images={allImages} alt={fundraiser.title} />

          <CampaignDescription fundraiser={fundraiser} />

          {/* Leaderboard (only if community exists) */}
          {fundraiser.community && leaderboard.length > 0 && (
            <div className="rounded-card border border-gfm-border p-6">
              <LeaderboardSection
                entries={leaderboard}
                currentFundraiserId={fundraiser.id}
              />
            </div>
          )}

          <OrganizerSection fundraiser={fundraiser} />

          <CauseSection fundraiser={fundraiser} />
        </div>

        {/* Right column - Donation sidebar (~40%) */}
        <div className="w-full lg:w-[40%]">
          <DonationSidebar fundraiser={fundraiser} donations={donations} />
        </div>
      </div>
    </div>
  );
}
