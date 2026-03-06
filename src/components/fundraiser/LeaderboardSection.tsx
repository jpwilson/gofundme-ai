"use client";

import { useState } from "react";
import type { LeaderboardEntry } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils/format";

interface LeaderboardSectionProps {
  entries: LeaderboardEntry[];
  currentFundraiserId: string;
}

const podiumColors: Record<number, string> = {
  1: "bg-[#b8e986]",
  2: "bg-[#a8d8ea]",
  3: "bg-[#ffc078]",
};

const podiumTextColors: Record<number, string> = {
  1: "text-[#2d5016]",
  2: "text-[#1a4a5c]",
  3: "text-[#5c3300]",
};

const podiumRankLabels: Record<number, string> = {
  1: "1st",
  2: "2nd",
  3: "3rd",
};

export function LeaderboardSection({
  entries,
  currentFundraiserId,
}: LeaderboardSectionProps) {
  const [showAll, setShowAll] = useState(false);

  const podium = entries.filter((e) => e.rank <= 3);
  const rest = entries.filter((e) => e.rank > 3);

  // Reorder podium for display: 2nd, 1st, 3rd
  const second = podium.find((e) => e.rank === 2);
  const first = podium.find((e) => e.rank === 1);
  const third = podium.find((e) => e.rank === 3);
  const podiumDisplay = [second, first, third].filter(Boolean) as LeaderboardEntry[];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-bold text-gfm-dark">Leaderboard</h2>
        <Badge variant="gray">{entries.length}</Badge>
      </div>

      {/* Podium */}
      <div className="flex items-end justify-center gap-3">
        {podiumDisplay.map((entry) => {
          const isFirst = entry.rank === 1;
          const isCurrent = entry.fundraiserId === currentFundraiserId;
          const bgColor = podiumColors[entry.rank] || "bg-gray-100";
          const textColor = podiumTextColors[entry.rank] || "text-gfm-dark";

          return (
            <div
              key={entry.rank}
              className={`
                flex flex-col items-center rounded-card p-4
                ${bgColor}
                ${isFirst ? "min-h-[220px] w-[140px]" : "min-h-[180px] w-[120px]"}
                justify-end text-center relative
              `}
            >
              {isCurrent && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2">
                  <Badge variant="green">THIS FUNDRAISER</Badge>
                </div>
              )}
              <span className={`text-xs font-bold uppercase mb-2 ${textColor}`}>
                {podiumRankLabels[entry.rank]}
              </span>
              <Avatar
                src={entry.user.avatarUrl}
                name={entry.user.displayName}
                size="md"
              />
              <p
                className={`mt-2 text-xs font-semibold leading-tight ${textColor} line-clamp-2`}
              >
                {entry.user.displayName}
              </p>
              <p
                className={`mt-1 text-[10px] leading-tight ${textColor} opacity-75 line-clamp-1`}
              >
                {entry.fundraiserTitle}
              </p>
              <p className={`mt-1 text-sm font-bold ${textColor}`}>
                {formatCurrency(entry.raisedAmount)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Remaining entries */}
      {rest.length > 0 && (
        <ul className="space-y-3">
          {(showAll ? rest : rest.slice(0, 3)).map((entry) => {
            const isCurrent = entry.fundraiserId === currentFundraiserId;
            return (
              <li
                key={entry.rank}
                className={`flex items-center gap-3 rounded-card border p-3 ${
                  isCurrent
                    ? "border-gfm-green bg-gfm-light-green/30"
                    : "border-gfm-border"
                }`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gfm-secondary">
                  {entry.rank}
                </span>
                <Avatar
                  src={entry.user.avatarUrl}
                  name={entry.user.displayName}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gfm-dark truncate">
                    {entry.user.displayName}
                  </p>
                  <p className="text-xs text-gfm-secondary truncate">
                    {entry.fundraiserTitle}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gfm-dark">
                    {formatCurrency(entry.raisedAmount)}
                  </p>
                </div>
                {isCurrent && (
                  <Badge variant="green" className="shrink-0">
                    THIS FUNDRAISER
                  </Badge>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* See all button */}
      {rest.length > 3 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full rounded-btn border border-gfm-border py-2.5 text-sm font-semibold text-gfm-dark hover:bg-gray-50 transition-colors"
        >
          See all
        </button>
      )}
    </div>
  );
}
