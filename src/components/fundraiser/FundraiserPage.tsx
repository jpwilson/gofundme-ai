"use client";

import { useState, useEffect } from "react";
import { Shield, Sparkles, Share2, Mail, MessageCircle, Copy, CheckCircle2, X } from "lucide-react";
import type { Fundraiser, Donation, LeaderboardEntry } from "@/lib/types";
import { ImageCarousel } from "./ImageCarousel";
import { DonationSidebar } from "./DonationSidebar";
import { CampaignDescription } from "./CampaignDescription";
import { LeaderboardSection } from "./LeaderboardSection";
import { OrganizerSection } from "./OrganizerSection";
import { CauseSection } from "./CauseSection";
import { MarkdownContent } from "@/components/ui/MarkdownContent";

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
  const [sentimentLoading, setSentimentLoading] = useState(
    () => donations.some((d) => !!d.message)
  );

  // Story Coach state
  const [storyFeedback, setStoryFeedback] = useState<string | null>(null);
  const [storyLoading, setStoryLoading] = useState(false);
  const [storyVisible, setStoryVisible] = useState(true);

  // Share Content state
  const [shareContent, setShareContent] = useState<{
    tweet: string;
    instagram: string;
    email_subject: string;
    email_body: string;
    sms: string;
  } | null>(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareTab, setShareTab] = useState<"twitter" | "instagram" | "email" | "sms">("twitter");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  function handleGetStoryFeedback() {
    setStoryLoading(true);
    setStoryVisible(true);
    fetch("/api/ai/story-coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: fundraiser.title,
        description: fundraiser.description,
        category: fundraiser.category,
        goalAmount: fundraiser.goalAmount,
        raisedAmount: fundraiser.raisedAmount,
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        const content = json?.data?.content;
        if (content) setStoryFeedback(content);
      })
      .catch(() => {})
      .finally(() => setStoryLoading(false));
  }

  function handleGenerateShare() {
    setShareLoading(true);
    setShareOpen(true);
    fetch("/api/ai/share-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: fundraiser.title,
        description: fundraiser.description,
        goalAmount: fundraiser.goalAmount,
        raisedAmount: fundraiser.raisedAmount,
        organizer: fundraiser.organizer.displayName,
        url: "",
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        const parsed = json?.data?.parsed;
        if (parsed) setShareContent(parsed);
      })
      .catch(() => {})
      .finally(() => setShareLoading(false));
  }

  function copyToClipboard(text: string, field: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  }

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

          {/* AI Story Coach */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleGetStoryFeedback}
                disabled={storyLoading}
                className="inline-flex items-center gap-2 rounded-full border border-gfm-border bg-white px-4 py-2 text-sm font-semibold text-gfm-dark hover:bg-gfm-bg transition-colors disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4 text-gfm-green" />
                {storyFeedback ? "Refresh AI Story Feedback" : "Get AI Story Feedback"}
              </button>
              <button
                onClick={handleGenerateShare}
                disabled={shareLoading}
                className="inline-flex items-center gap-2 rounded-full border border-gfm-border bg-white px-4 py-2 text-sm font-semibold text-gfm-dark hover:bg-gfm-bg transition-colors disabled:opacity-50"
              >
                <Share2 className="h-4 w-4 text-gfm-green" />
                Generate Share Messages
              </button>
            </div>

            {storyLoading && (
              <div className="animate-pulse rounded-lg border border-gfm-border bg-gfm-bg/30 p-4 space-y-2">
                <div className="h-4 w-48 rounded bg-gray-200" />
                <div className="h-3 w-full rounded bg-gray-200" />
                <div className="h-3 w-full rounded bg-gray-200" />
                <div className="h-3 w-2/3 rounded bg-gray-200" />
              </div>
            )}

            {storyFeedback && !storyLoading && (
              <div className="rounded-lg border border-gfm-border bg-gfm-bg/30 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-gfm-green" />
                    <span className="text-sm font-semibold text-gfm-dark">AI Story Feedback</span>
                  </div>
                  <button
                    onClick={() => setStoryVisible(!storyVisible)}
                    className="text-xs text-gfm-secondary hover:text-gfm-dark transition-colors underline"
                  >
                    {storyVisible ? "Hide feedback" : "Show feedback"}
                  </button>
                </div>
                {storyVisible && <MarkdownContent content={storyFeedback} />}
              </div>
            )}
          </div>

          {/* Share Content Modal */}
          {shareOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-gfm-green" />
                    <h3 className="text-lg font-bold text-gfm-dark">Share Messages</h3>
                  </div>
                  <button
                    onClick={() => setShareOpen(false)}
                    className="rounded-full p-1 hover:bg-gfm-bg transition-colors"
                  >
                    <X className="h-5 w-5 text-gfm-secondary" />
                  </button>
                </div>

                {shareLoading ? (
                  <div className="animate-pulse space-y-3 py-4">
                    <div className="h-4 w-32 rounded bg-gray-200" />
                    <div className="h-20 w-full rounded bg-gray-200" />
                  </div>
                ) : shareContent ? (
                  <>
                    <div className="flex gap-1 border-b border-gfm-border mb-4">
                      {(["twitter", "instagram", "email", "sms"] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setShareTab(tab)}
                          className={`px-3 py-2 text-sm font-semibold transition-colors border-b-2 ${
                            shareTab === tab
                              ? "border-gfm-green text-gfm-green"
                              : "border-transparent text-gfm-secondary hover:text-gfm-dark"
                          }`}
                        >
                          {tab === "twitter" ? "Twitter/X" : tab === "instagram" ? "Instagram" : tab === "email" ? "Email" : "SMS"}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-3">
                      {shareTab === "twitter" && (
                        <div className="space-y-2">
                          <div className="rounded-lg border border-gfm-border bg-gfm-bg/30 p-3">
                            <p className="text-sm text-gfm-dark whitespace-pre-wrap">{shareContent.tweet}</p>
                          </div>
                          <button
                            onClick={() => copyToClipboard(shareContent.tweet, "tweet")}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gfm-green hover:underline"
                          >
                            {copiedField === "tweet" ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            {copiedField === "tweet" ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      )}
                      {shareTab === "instagram" && (
                        <div className="space-y-2">
                          <div className="rounded-lg border border-gfm-border bg-gfm-bg/30 p-3">
                            <p className="text-sm text-gfm-dark whitespace-pre-wrap">{shareContent.instagram}</p>
                          </div>
                          <button
                            onClick={() => copyToClipboard(shareContent.instagram, "instagram")}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gfm-green hover:underline"
                          >
                            {copiedField === "instagram" ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            {copiedField === "instagram" ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      )}
                      {shareTab === "email" && (
                        <div className="space-y-2">
                          <div className="rounded-lg border border-gfm-border bg-gfm-bg/30 p-3">
                            <p className="text-xs font-semibold text-gfm-secondary mb-1">Subject</p>
                            <p className="text-sm text-gfm-dark mb-3">{shareContent.email_subject}</p>
                            <p className="text-xs font-semibold text-gfm-secondary mb-1">Body</p>
                            <p className="text-sm text-gfm-dark whitespace-pre-wrap">{shareContent.email_body}</p>
                          </div>
                          <button
                            onClick={() => copyToClipboard(`Subject: ${shareContent.email_subject}\n\n${shareContent.email_body}`, "email")}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gfm-green hover:underline"
                          >
                            {copiedField === "email" ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            {copiedField === "email" ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      )}
                      {shareTab === "sms" && (
                        <div className="space-y-2">
                          <div className="rounded-lg border border-gfm-border bg-gfm-bg/30 p-3">
                            <p className="text-sm text-gfm-dark whitespace-pre-wrap">{shareContent.sms}</p>
                          </div>
                          <button
                            onClick={() => copyToClipboard(shareContent.sms, "sms")}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gfm-green hover:underline"
                          >
                            {copiedField === "sms" ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            {copiedField === "sms" ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          )}

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
