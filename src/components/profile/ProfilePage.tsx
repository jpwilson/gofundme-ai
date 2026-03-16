"use client";

import { useState, useEffect } from "react";
import { Brain, Sparkles, TrendingUp, ChevronDown, ChevronUp, Star, Zap, ArrowRight } from "lucide-react";
import { ProfileHeader } from "./ProfileHeader";
import { DiscoverPeople } from "./DiscoverPeople";
import { TopCauses } from "./TopCauses";
import { ProfileHighlights } from "./ProfileHighlights";
import { ProfileActivity } from "./ProfileActivity";
import { PersonalizeProfileCTA } from "./PersonalizeProfileCTA";
import { MarkdownContent } from "@/components/ui/MarkdownContent";
import {
  users,
  causes,
  getActivitiesByUserId,
  getHighlightsByUserId,
} from "@/lib/data/mock";
import type { User } from "@/lib/types";

interface ProfilePageProps {
  username: string;
}

export function ProfilePage({ username }: ProfilePageProps) {
  const user = users.find((u) => u.username === username);

  const [isOwnProfile, setIsOwnProfile] = useState<boolean>(
    user?.isOwnProfile ?? false
  );

  const [givingPersonality, setGivingPersonality] = useState<{
    type: string;
    description: string;
    color: string;
  } | null>(null);
  const [personalityLoading, setPersonalityLoading] = useState(!!user);

  // AI Impact Story
  const [impactStory, setImpactStory] = useState<string | null>(null);
  const [impactStoryLoading, setImpactStoryLoading] = useState(false);
  const [impactStoryOpen, setImpactStoryOpen] = useState(false);
  const [impactStoryFetched, setImpactStoryFetched] = useState(false);

  // Recommended Campaigns
  const [recommendations, setRecommendations] = useState<
    { slug: string; title: string; reason: string; urgency: string; matchScore: number }[]
  >([]);
  const [recsLoading, setRecsLoading] = useState(!!user);

  useEffect(() => {
    if (!user) {
      return;
    }
    const activities = getActivitiesByUserId(user.id);
    fetch("/api/ai/profile-insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        feature: "insights",
        user,
        activities,
        donations: [],
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        const parsed = json?.data?.parsed;
        const gp = parsed?.givingPersonality;
        if (gp?.type) {
          const colors: Record<string, string> = {
            'Crisis Responder': '#ea580c',
            'Champion Giver': '#2563eb',
            'Steady Supporter': '#059669',
            'Community Builder': '#7c3aed',
          };
          setGivingPersonality({
            type: gp.type,
            description: gp.description || '',
            color: colors[gp.type] || '#059669',
          });
        }
      })
      .catch(() => {})
      .finally(() => setPersonalityLoading(false));

    // Fetch recommendations on mount
    fetch("/api/ai/profile-insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        feature: "recommendations",
        user,
        activities,
        donations: [],
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        const recs = json?.data?.parsed?.recommendations;
        if (Array.isArray(recs)) {
          setRecommendations(recs.slice(0, 3));
        }
      })
      .catch(() => {})
      .finally(() => setRecsLoading(false));
  }, [user]);

  const fetchImpactStory = () => {
    if (impactStoryFetched || !user) return;
    setImpactStoryLoading(true);
    setImpactStoryOpen(true);
    const acts = getActivitiesByUserId(user.id);
    fetch("/api/ai/profile-insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        feature: "narrative",
        user,
        activities: acts,
        donations: [],
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        const content = json?.data?.content;
        if (content) {
          setImpactStory(content);
        }
      })
      .catch(() => {})
      .finally(() => {
        setImpactStoryLoading(false);
        setImpactStoryFetched(true);
      });
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-[680px] px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gfm-dark">User not found</h1>
        <p className="mt-2 text-sm text-gfm-secondary">
          The profile you are looking for does not exist.
        </p>
      </div>
    );
  }

  const activities = getActivitiesByUserId(user.id);
  const highlightsList = getHighlightsByUserId(user.id);

  // Suggested people: other users excluding the current profile
  const suggestedUsers: User[] = users.filter((u) => u.id !== user.id);

  // Select a subset of causes for this user
  const userCauses = causes.slice(0, 5);

  return (
    <div className="mx-auto max-w-[680px] px-4 pb-16">
      {/* Dev toggle for own-profile vs public view */}
      <div className="mb-2 flex justify-end pt-4">
        <label className="flex items-center gap-2 text-xs text-gfm-secondary cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isOwnProfile}
            onChange={() => setIsOwnProfile(!isOwnProfile)}
            className="accent-gfm-green"
          />
          View as own profile
        </label>
      </div>

      {/* Profile Header */}
      <ProfileHeader user={user} isOwnProfile={isOwnProfile} />

      {/* AI Giving Personality */}
      <div id="tour-ai-personality" className="mt-4">
        {personalityLoading ? (
          <div className="animate-pulse flex items-center gap-2 rounded-full bg-gfm-bg px-4 py-2 w-fit mx-auto">
            <div className="h-4 w-4 rounded bg-gray-200" />
            <div className="h-3 w-40 rounded bg-gray-200" />
          </div>
        ) : givingPersonality ? (
          <div className="flex items-center justify-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border"
              style={{
                backgroundColor: `${givingPersonality.color}15`,
                borderColor: `${givingPersonality.color}40`,
                color: givingPersonality.color,
              }}
            >
              <Brain className="h-3.5 w-3.5" />
              {givingPersonality.type}
            </span>
            <span className="text-xs text-gfm-secondary">
              {givingPersonality.description}
            </span>
          </div>
        ) : null}
      </div>

      {/* AI Impact Story */}
      <div className="mt-4">
        {!impactStoryFetched && !impactStoryLoading && (
          <div className="flex justify-center">
            <button
              onClick={fetchImpactStory}
              className="inline-flex items-center gap-1.5 rounded-full border border-gfm-green/30 bg-gfm-green/5 px-4 py-2 text-xs font-medium text-gfm-green transition-colors hover:bg-gfm-green/10"
            >
              <Sparkles className="h-3.5 w-3.5" />
              View AI Impact Story
            </button>
          </div>
        )}
        {impactStoryLoading && (
          <div className="rounded-xl border border-gfm-border bg-gfm-bg/30 p-4 space-y-2 animate-pulse">
            <div className="h-3 w-3/4 rounded bg-gray-200" />
            <div className="h-3 w-full rounded bg-gray-200" />
            <div className="h-3 w-5/6 rounded bg-gray-200" />
            <div className="h-3 w-2/3 rounded bg-gray-200" />
          </div>
        )}
        {impactStoryFetched && impactStory && (
          <div className="rounded-xl border border-gfm-green/20 bg-gradient-to-br from-gfm-green/5 to-transparent">
            <button
              onClick={() => setImpactStoryOpen(!impactStoryOpen)}
              className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-gfm-dark hover:bg-gfm-green/5 rounded-xl transition-colors"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-gfm-green" />
                AI Impact Story
              </span>
              {impactStoryOpen ? (
                <ChevronUp className="h-4 w-4 text-gfm-secondary" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gfm-secondary" />
              )}
            </button>
            {impactStoryOpen && (
              <div className="border-t border-gfm-green/10 px-4 py-3">
                <MarkdownContent content={impactStory} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Personalize CTA (own profile only) */}
      {isOwnProfile && (
        <div className="mt-6">
          <PersonalizeProfileCTA />
        </div>
      )}

      {/* Discover People */}
      <div className="mt-6">
        <DiscoverPeople suggestedUsers={suggestedUsers} />
      </div>

      {/* Top Causes */}
      <div className="mt-8">
        <TopCauses causes={userCauses} />
      </div>

      {/* Highlights */}
      <div className="mt-8">
        <ProfileHighlights
          highlights={highlightsList}
          isOwnProfile={isOwnProfile}
        />
      </div>

      {/* Activity */}
      <div className="mt-8">
        <ProfileActivity activities={activities} />
      </div>

      {/* Recommended Campaigns */}
      <div className="mt-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gfm-dark">
          <Sparkles className="h-5 w-5 text-gfm-green" />
          Recommended for You
        </h2>
        {recsLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border border-gfm-border bg-white p-4 space-y-3"
              >
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-full rounded bg-gray-200" />
                <div className="h-3 w-5/6 rounded bg-gray-200" />
                <div className="flex gap-2 mt-2">
                  <div className="h-5 w-16 rounded-full bg-gray-200" />
                  <div className="h-5 w-12 rounded-full bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {recommendations.map((rec, i) => (
              <a
                key={i}
                href={`/f/${rec.slug}`}
                className="group block rounded-xl border border-gfm-border bg-white p-4 transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <h3 className="text-sm font-semibold text-gfm-dark line-clamp-2 group-hover:text-gfm-green transition-colors">
                  {rec.title}
                </h3>
                <p className="mt-1.5 text-xs text-gfm-secondary line-clamp-2">
                  {rec.reason}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gfm-green/10 px-2 py-0.5 text-[10px] font-semibold text-gfm-green">
                    <Star className="h-3 w-3" />
                    {rec.matchScore}% match
                  </span>
                  {rec.urgency && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        rec.urgency === "high"
                          ? "bg-red-50 text-red-600"
                          : rec.urgency === "medium"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      <Zap className="h-3 w-3" />
                      {rec.urgency === "high"
                        ? "Urgent"
                        : rec.urgency === "medium"
                        ? "Moderate"
                        : "Low urgency"}
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        ) : null}
      </div>

      {/* Giving Agent Link */}
      {isOwnProfile && (
        <div className="mt-8">
          <a
            href="/giving-agent"
            className="group flex items-center justify-between rounded-xl border border-gfm-green/20 bg-gradient-to-r from-gfm-green/5 to-transparent p-4 transition-colors hover:from-gfm-green/10"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gfm-green/10">
                <Sparkles className="h-4 w-4 text-gfm-green" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gfm-dark">
                  Set up automated monthly giving
                </p>
                <p className="text-xs text-gfm-secondary">
                  Let AI optimize your donations across causes you care about
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-gfm-secondary group-hover:text-gfm-green transition-colors" />
          </a>
        </div>
      )}
    </div>
  );
}
