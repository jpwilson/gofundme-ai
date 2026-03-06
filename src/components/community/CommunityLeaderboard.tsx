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

const podiumOrder = [1, 0, 2]; // display order: 2nd, 1st, 3rd
const podiumHeights = ["h-28", "h-36", "h-24"];
const podiumRankColors = [
  "bg-yellow-400 text-yellow-900", // 1st
  "bg-gray-300 text-gray-700",     // 2nd
  "bg-amber-600 text-white",       // 3rd
];
const podiumCircleSizes = [
  "h-16 w-16", // 1st (center, tallest)
  "h-14 w-14", // 2nd
  "h-14 w-14", // 3rd
];

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
      <div className="flex items-end justify-center gap-4 pb-2">
        {podiumOrder.map((idx, displayIdx) => {
          const entry = top3[idx];
          if (!entry) return null;
          return (
            <div
              key={entry.userId}
              className="flex flex-col items-center"
            >
              {/* Avatar + rank badge */}
              <div className="relative mb-2">
                <Avatar
                  src={entry.user.avatarUrl}
                  name={entry.user.displayName}
                  size={idx === 0 ? "lg" : "md"}
                />
                <span
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${podiumRankColors[idx]}`}
                >
                  {entry.rank}
                </span>
              </div>

              {/* Name */}
              <p className="mb-0.5 max-w-[120px] truncate text-center text-sm font-semibold text-gfm-dark">
                {entry.user.displayName}
              </p>

              {/* Amount */}
              <p className="mb-2 text-xs font-medium text-gfm-secondary">
                {formatCompactCurrency(entry.raisedAmount)}
              </p>

              {/* Podium bar */}
              <div
                className={`${podiumHeights[displayIdx]} w-24 rounded-t-xl ${
                  idx === 0
                    ? "bg-gfm-green"
                    : idx === 1
                    ? "bg-gfm-green/70"
                    : "bg-gfm-green/50"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Remaining entries */}
      {showAll && rest.length > 0 && (
        <div className="mt-6 space-y-3">
          {rest.map((entry) => (
            <div
              key={entry.userId}
              className={`flex items-center gap-4 rounded-xl border border-gfm-border px-4 py-3 ${
                entry.isCurrentFundraiser ? "bg-gfm-light-green/30" : "bg-white"
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
              <span className="text-sm font-bold text-gfm-dark">
                {formatCompactCurrency(entry.raisedAmount)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* See all button */}
      {rest.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Button variant="outline" size="sm" onClick={() => setShowAll(!showAll)}>
            {showAll ? "Show less" : "See all"}
          </Button>
        </div>
      )}
    </section>
  );
}
