"use client";

import { ActivityFeed } from "@/components/community/ActivityFeed";
import type { Activity } from "@/lib/types";

interface ProfileActivityProps {
  activities: Activity[];
}

export function ProfileActivity({ activities }: ProfileActivityProps) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-bold text-gfm-dark">Activity</h3>
      <ActivityFeed activities={activities} />
    </div>
  );
}
