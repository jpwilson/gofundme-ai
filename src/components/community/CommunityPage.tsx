"use client";

import { useState, useEffect } from "react";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import {
  getCommunityBySlug,
  getLeaderboardByCommunitySlug,
  activities as allActivities,
  fundraisers as allFundraisers,
  users,
} from "@/lib/data/mock";
import { CommunityHeader } from "./CommunityHeader";
import { CommunityLeaderboard } from "./CommunityLeaderboard";
import { CommunityTabs } from "./CommunityTabs";
import { ActivityFeed } from "./ActivityFeed";
import { FundraisersList } from "./FundraisersList";

interface CommunityPageProps {
  slug: string;
}

export function CommunityPage({ slug }: CommunityPageProps) {
  const [activeTab, setActiveTab] = useState("activity");
  const [digest, setDigest] = useState<{ summary: string } | null>(null);
  const [digestLoading, setDigestLoading] = useState(true);
  const [digestOpen, setDigestOpen] = useState(false);

  const community = getCommunityBySlug(slug);

  useEffect(() => {
    if (!community) {
      setDigestLoading(false);
      return;
    }
    fetch("/api/ai/community-digest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ community }),
    })
      .then((r) => r.json())
      .then((data) => setDigest(data))
      .catch(() => {})
      .finally(() => setDigestLoading(false));
  }, [community]);

  if (!community) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-gfm-dark">Community not found</h1>
          <p className="text-gfm-secondary">
            The community you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  const leaderboard = getLeaderboardByCommunitySlug(slug);

  // Filter activities for this community
  const communityActivities = allActivities.filter(
    (a) => a.communityId === community.id
  );

  // Filter fundraisers for this community
  const communityFundraisers = allFundraisers.filter(
    (f) => f.communityId === community.id
  );

  // Sample followers (use existing users as stand-ins)
  const sampleFollowers = users.map((u) => ({
    displayName: u.displayName,
    avatarUrl: u.avatarUrl,
  }));

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <CommunityHeader community={community} followers={sampleFollowers} />

      {/* AI Community Digest */}
      <div className="mx-auto max-w-6xl px-4 mt-4">
        {digestLoading ? (
          <div className="animate-pulse rounded-lg border border-gfm-border bg-gfm-bg/30 p-3">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-gray-200" />
              <div className="h-3 w-32 rounded bg-gray-200" />
            </div>
          </div>
        ) : digest ? (
          <div id="tour-ai-digest" className="rounded-lg border border-gfm-border bg-gfm-bg/30">
            <button
              onClick={() => setDigestOpen(!digestOpen)}
              className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-gfm-dark hover:bg-gfm-bg/50 rounded-lg transition-colors"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-gfm-green" />
                View AI digest
              </span>
              {digestOpen ? (
                <ChevronUp className="h-4 w-4 text-gfm-secondary" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gfm-secondary" />
              )}
            </button>
            {digestOpen && (
              <div className="border-t border-gfm-border px-4 py-3">
                <p className="text-sm leading-relaxed text-gfm-secondary whitespace-pre-line">
                  {digest.summary}
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Leaderboard */}
      <CommunityLeaderboard entries={leaderboard} />

      {/* Tabs */}
      <CommunityTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab content */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        {activeTab === "activity" && (
          <ActivityFeed activities={communityActivities} />
        )}

        {activeTab === "fundraisers" && (
          <FundraisersList fundraisers={communityFundraisers} />
        )}

        {activeTab === "about" && (
          <div className="max-w-2xl">
            <h2 className="mb-4 text-xl font-bold text-gfm-dark">
              About {community.name}
            </h2>
            <p className="whitespace-pre-line text-base leading-relaxed text-gfm-secondary">
              {community.description}
            </p>
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gfm-secondary"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span className="text-gfm-secondary">
                  Created{" "}
                  {new Date(community.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
