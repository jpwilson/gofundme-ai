"use client";

import { useState } from "react";
import type { LeaderboardEntry } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCompactCurrency } from "@/lib/utils/format";

interface CommunityLeaderboardProps {
  entries: LeaderboardEntry[];
}

// Podium colors matching GoFundMe: 1st = yellow-green, 2nd = light blue, 3rd = orange
const podiumConfigs = [
  {
    // 1st place
    barColor: "bg-[#b8e986]",
    rankBg: "bg-[#4a7c10]",
    rankText: "text-white",
    height: "h-36",
    label: "1st",
  },
  {
    // 2nd place
    barColor: "bg-[#a8d8ea]",
    rankBg: "bg-[#2b6cb0]",
    rankText: "text-white",
    height: "h-28",
    label: "2nd",
  },
  {
    // 3rd place
    barColor: "bg-[#ffc078]",
    rankBg: "bg-[#c05621]",
    rankText: "text-white",
    height: "h-24",
    label: "3rd",
  },
];

// Display order: 2nd, 1st, 3rd
const podiumOrder = [1, 0, 2];

export function CommunityLeaderboard({ entries }: CommunityLeaderboardProps) {
  const [showAll, setShowAll] = useState(false);

  if (entries.length === 0) return null;

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      {/* Heading */}
      <div className="mb-8 flex items-center gap-3">
        <h2 className="text-2xl font-bold text-gfm-dark">Leaderboard</h2>
        <Badge variant="gray">{entries.length}</Badge>
      </div>

      {/* Podium */}
      <div className="flex items-end justify-center gap-3 sm:gap-4 pb-2">
        {podiumOrder.map((idx, displayIdx) => {
          const entry = top3[idx];
          if (!entry) return null;
          const config = podiumConfigs[idx];
          return (
            <div
              key={entry.userId}
              className="flex flex-col items-center"
            >
              {/* Avatar + rank badge */}
              <div className="relative mb-3">
                <Avatar
                  src={entry.user.avatarUrl}
                  name={entry.user.displayName}
                  size={idx === 0 ? "lg" : "md"}
                />
                <span
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${config.rankBg} ${config.rankText}`}
                >
                  {entry.rank}
                </span>
              </div>

              {/* Name */}
              <p className="mb-0.5 max-w-[120px] truncate text-center text-sm font-semibold text-gfm-dark">
                {entry.user.displayName}
              </p>

              {/* Amount */}
              <p className="mb-3 text-xs font-bold text-gfm-dark">
                {formatCompactCurrency(entry.raisedAmount)}
              </p>

              {/* Podium bar */}
              <div
                className={`${config.height} w-20 sm:w-24 rounded-t-xl ${config.barColor}`}
              />
            </div>
          );
        })}
      </div>

      {/* Remaining entries */}
      {showAll && rest.length > 0 && (
        <div className="mt-6 space-y-2">
          {rest.map((entry) => (
            <div
              key={entry.userId}
              className={`flex items-center gap-4 rounded-xl border px-4 py-3 transition-colors hover:bg-gfm-bg ${
                entry.isCurrentFundraiser
                  ? "border-gfm-green bg-gfm-light-green/30"
                  : "border-gfm-border bg-white"
              }`}
            >
              <span className="w-6 text-center text-sm font-bold text-gfm-secondary">
                {entry.rank}
              </span>
              <Avatar
                src={entry.user.avatarUrl}
                name={entry.user.displayName}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-gfm-dark">
                  {entry.user.displayName}
                </p>
                <p className="truncate text-xs text-gfm-secondary">
                  {entry.fundraiserTitle}
                </p>
              </div>
              <span className="text-sm font-bold text-gfm-dark shrink-0">
                {formatCompactCurrency(entry.raisedAmount)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* See all button */}
      {rest.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            size="md"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show less" : `See all ${entries.length} fundraisers`}
          </Button>
        </div>
      )}
    </section>
  );
}
