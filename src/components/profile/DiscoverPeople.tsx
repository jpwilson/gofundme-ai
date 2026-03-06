"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import type { User } from "@/lib/types";

interface DiscoverPeopleProps {
  suggestedUsers: User[];
}

export function DiscoverPeople({ suggestedUsers }: DiscoverPeopleProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (suggestedUsers.length === 0) return null;

  return (
    <div className="rounded-xl bg-gfm-bg p-4 border border-gfm-border">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between text-left"
      >
        <h3 className="text-sm font-semibold text-gfm-dark">
          Discover more people
        </h3>
        <svg
          className={`h-5 w-5 text-gfm-secondary transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1 hide-scrollbar">
          {suggestedUsers.map((user) => (
            <a
              key={user.id}
              href={`/u/${user.username}`}
              className="flex flex-col items-center gap-1 shrink-0"
            >
              <Avatar
                src={user.avatarUrl}
                name={user.displayName}
                size="md"
              />
              <span className="text-[11px] text-gfm-secondary max-w-[48px] truncate">
                {user.displayName.split(" ")[0]}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
