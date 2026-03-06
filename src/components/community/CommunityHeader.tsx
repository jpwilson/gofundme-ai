"use client";

import { useState } from "react";
import type { Community, User } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import {
  formatCompactCurrency,
  formatNumber,
} from "@/lib/utils/format";

interface CommunityHeaderProps {
  community: Community;
  followers?: Pick<User, "displayName" | "avatarUrl">[];
}

export function CommunityHeader({ community, followers = [] }: CommunityHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(community.isFollowing ?? false);
  const [descExpanded, setDescExpanded] = useState(false);

  const descriptionLimit = 140;
  const isLongDesc = community.description.length > descriptionLimit;
  const displayDesc = descExpanded || !isLongDesc
    ? community.description
    : community.description.slice(0, descriptionLimit) + "...";

  return (
    <section className="bg-gfm-bg">
      <div className="mx-auto max-w-6xl px-4">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-8 py-10 md:grid-cols-[1fr_1fr] lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left side */}
          <div className="flex flex-col justify-center gap-5">
            {/* Community label */}
            <div className="flex items-center gap-2">
              {community.iconUrl ? (
                <img
                  src={community.iconUrl}
                  alt=""
                  className="h-6 w-6 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gfm-green text-white text-xs font-bold">
                  {community.name.charAt(0)}
                </span>
              )}
              <span className="text-sm font-medium text-gfm-secondary">Community</span>
            </div>

            {/* Name */}
            <h1 className="text-3xl font-bold leading-tight text-gfm-dark md:text-4xl">
              {community.name}
            </h1>

            {/* Description */}
            <p className="text-base leading-relaxed text-gfm-secondary">
              {displayDesc}
              {isLongDesc && !descExpanded && (
                <button
                  onClick={() => setDescExpanded(true)}
                  className="ml-1 font-medium text-gfm-dark hover:underline"
                >
                  read more
                </button>
              )}
            </p>

            {/* Follower avatars */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {followers.slice(0, 3).map((f, i) => (
                  <div key={i} className="ring-2 ring-gfm-bg rounded-full">
                    <Avatar
                      src={f.avatarUrl}
                      name={f.displayName}
                      size="xs"
                    />
                  </div>
                ))}
                {followers.length === 0 && (
                  <>
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="ring-2 ring-gfm-bg rounded-full">
                        <Avatar name={`User${i}`} size="xs" />
                      </div>
                    ))}
                  </>
                )}
              </div>
              <button className="text-sm font-medium text-gfm-dark hover:underline">
                {formatNumber(community.followerCount)} followers
              </button>
            </div>

            {/* Follow + Share buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant={isFollowing ? "primary" : "outline"}
                size="md"
                onClick={() => setIsFollowing(!isFollowing)}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
              <button
                aria-label="Share"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gfm-border text-gfm-secondary transition hover:bg-gray-100"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
              </button>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-0 divide-x divide-gfm-border">
              <div className="pr-5">
                <span className="text-xl font-bold text-gfm-dark">
                  {formatCompactCurrency(community.totalRaised)}
                </span>
                <span className="ml-1.5 text-sm text-gfm-secondary">Raised</span>
              </div>
              <div className="px-5">
                <span className="text-xl font-bold text-gfm-dark">
                  {formatNumber(community.totalDonations)}
                </span>
                <span className="ml-1.5 text-sm text-gfm-secondary">Donations</span>
              </div>
              <div className="pl-5">
                <span className="text-xl font-bold text-gfm-dark">
                  {formatNumber(community.totalFundraisers)}
                </span>
                <span className="ml-1.5 text-sm text-gfm-secondary">Fundraisers</span>
              </div>
            </div>

            {/* Start a GoFundMe */}
            <div>
              <Button variant="primary" size="lg">
                Start a GoFundMe
              </Button>
            </div>
          </div>

          {/* Right side - Banner image */}
          <div className="flex items-center">
            {community.bannerImageUrl ? (
              <img
                src={community.bannerImageUrl}
                alt={`${community.name} banner`}
                className="h-full max-h-[420px] w-full rounded-2xl object-cover"
              />
            ) : (
              <div className="flex h-full min-h-[280px] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-gfm-green to-gfm-dark-green">
                <span className="text-6xl font-bold text-white/30">
                  {community.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
