"use client";

import { useState, useEffect } from "react";
import { Shield, Sparkles } from "lucide-react";
import type { Fundraiser, Donation, LeaderboardEntry } from "@/lib/types";
import { ImageCarousel } from "./ImageCarousel";
import { DonationSidebar } from "./DonationSidebar";
import { CampaignDescription } from "./CampaignDescription";
import { LeaderboardSection } from "./LeaderboardSection";
import { OrganizerSection } from "./OrganizerSection";
import { CauseSection } from "./CauseSection";

interface TrustScoreData {
  score: number;
  label: string;
}

interface SentimentData {
  overall: string;
  themes: string[];
  summary: string;
}

interface FundraiserPageProps {
  fundraiser: Fundraiser;
  donations: Donation[];
  leaderboard: LeaderboardEntry[];
}

function getTrustColor(score: number) {
  if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
  if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
  return "text-red-600 bg-red-50 border-red-200";
}

export function FundraiserPage({
  fundraiser,
  donations,
  leaderboard,
}: FundraiserPageProps) {
  const allImages = [fundraiser.coverImageUrl, ...fundraiser.images];

  const [trustScore, setTrustScore] = useState<TrustScoreData | null>(null);
  const [trustLoading, setTrustLoading] = useState(true);
  const [sentiment, setSentiment] = useState<SentimentData | null>(null);
  const [sentimentLoading, setSentimentLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ai/trust-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fundraiser,
        organizer: fundraiser.organizer,
        donations,
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        const parsed = json?.data?.parsed;
        if (parsed?.overallScore != null) {
          setTrustScore({ score: parsed.overallScore, label: parsed.label || '' });
        }
      })
      .catch(() => {})
      .finally(() => setTrustLoading(false));

    const donorMessages = donations
      .map((d) => d.message)
      .filter((m): m is string => !!m);

    if (donorMessages.length > 0) {
      fetch("/api/ai/sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: donorMessages }),
      })
        .then((r) => r.json())
        .then((json) => {
          const parsed = json?.data?.parsed;
          if (parsed) {
            setSentiment({
              overall: parsed.label || parsed.overall || 'Positive',
              summary: parsed.summary || '',
              themes: Array.isArray(parsed.themes) ? parsed.themes.map((t: { theme?: string } | string) => typeof t === 'string' ? t : t.theme || '') : [],
            });
          }
        })
        .catch(() => {})
        .finally(() => setSentimentLoading(false));
    } else {
      setSentimentLoading(false);
    }
  }, [fundraiser, donations]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
      {/* Title with AI Trust Badge */}
      <div className="mb-6 flex items-start gap-3">
        <h1 className="text-2xl font-bold text-gfm-dark md:text-3xl leading-tight">
          {fundraiser.title}
        </h1>
        {trustLoading ? (
          <div className="mt-1 h-6 w-24 shrink-0 animate-pulse rounded-full bg-gfm-bg" />
        ) : trustScore ? (
          <span
            className={`mt-1 inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${getTrustColor(trustScore.score)}`}
          >
            <Shield className="h-3.5 w-3.5" />
            Trust: {trustScore.score}/100
          </span>
        ) : null}
        <span id="tour-trust-badge" />
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left column - Main content (~60%) */}
        <div className="w-full space-y-8 lg:w-[60%]">
          <ImageCarousel images={allImages} alt={fundraiser.title} />

          <CampaignDescription fundraiser={fundraiser} />

          {/* AI Sentiment Summary */}
          <div id="tour-sentiment" />
          {sentimentLoading ? (
            <div className="animate-pulse rounded-lg border border-gfm-border bg-gfm-bg/30 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-4 w-4 rounded bg-gray-200" />
                <div className="h-4 w-36 rounded bg-gray-200" />
              </div>
              <div className="h-3 w-full rounded bg-gray-200 mb-2" />
              <div className="h-3 w-2/3 rounded bg-gray-200" />
            </div>
          ) : sentiment ? (
            <div className="rounded-lg border border-gfm-border bg-gfm-bg/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-gfm-green" />
                <span className="text-sm font-semibold text-gfm-dark">
                  Donor Sentiment
                </span>
                <span className="rounded-full bg-gfm-green/10 px-2 py-0.5 text-xs font-medium text-gfm-green">
                  {sentiment.overall}
                </span>
              </div>
              <p className="text-sm text-gfm-secondary leading-relaxed">
                {sentiment.summary}
              </p>
              {sentiment.themes.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {sentiment.themes.map((theme) => (
                    <span
                      key={theme}
                      className="rounded-full bg-white px-2 py-0.5 text-xs text-gfm-secondary border border-gfm-border"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : null}

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
