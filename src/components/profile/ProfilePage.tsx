"use client";

import { useState, useEffect } from "react";
import { Brain } from "lucide-react";
import { ProfileHeader } from "./ProfileHeader";
import { DiscoverPeople } from "./DiscoverPeople";
import { TopCauses } from "./TopCauses";
import { ProfileHighlights } from "./ProfileHighlights";
import { ProfileActivity } from "./ProfileActivity";
import { PersonalizeProfileCTA } from "./PersonalizeProfileCTA";
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
  }, [user]);

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
    </div>
  );
}
