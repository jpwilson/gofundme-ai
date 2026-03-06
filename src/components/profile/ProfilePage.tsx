"use client";

import { useState } from "react";
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
