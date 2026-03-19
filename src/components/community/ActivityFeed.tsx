"use client";

import { useState } from "react";
import Image from "next/image";
import type { Activity } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { ProgressCircle } from "@/components/ui/ProgressCircle";
import {
  formatCurrency,
  formatRelativeTime,
  formatPercentage,
  formatNumber,
} from "@/lib/utils/format";

interface ActivityFeedProps {
  activities: Activity[];
}

type SortOption = "latest" | "popular";

function ActivityTypeLabel({ activity }: { activity: Activity }) {
  switch (activity.type) {
    case "donation":
      return (
        <span className="text-sm text-gfm-secondary">
          donated{" "}
          <span className="font-semibold text-gfm-dark">
            {activity.donationAmount ? formatCurrency(activity.donationAmount) : ""}
          </span>
          {activity.fundraiser && (
            <>
              {" "}to{" "}
              <a
                href={`/fundraisers/${activity.fundraiser.slug}`}
                className="font-semibold text-gfm-dark hover:underline"
              >
                {activity.fundraiser.title}
              </a>
            </>
          )}
        </span>
      );
    case "fundraiser_created":
      return (
        <span className="text-sm text-gfm-secondary">
          created a fundraiser
        </span>
      );
    case "fundraiser_update":
      return (
        <span className="text-sm text-gfm-secondary">
          posted a fundraiser update
        </span>
      );
    case "comment":
      return (
        <span className="text-sm text-gfm-secondary">
          commented on{" "}
          {activity.fundraiser && (
            <a
              href={`/fundraisers/${activity.fundraiser.slug}`}
              className="font-semibold text-gfm-dark hover:underline"
            >
              {activity.fundraiser.title}
            </a>
          )}
        </span>
      );
    default:
      return null;
  }
}

function ActivityCard({ activity }: { activity: Activity }) {
  const [isLiked, setIsLiked] = useState(activity.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(activity.likeCount);
  const [contentExpanded, setContentExpanded] = useState(false);

  const contentLimit = 180;
  const hasLongContent = activity.content ? activity.content.length > contentLimit : false;
  const displayContent =
    activity.content && !contentExpanded && hasLongContent
      ? activity.content.slice(0, contentLimit) + "..."
      : activity.content;

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((c) => (isLiked ? c - 1 : c + 1));
  };

  return (
    <article className="rounded-xl border border-gfm-border bg-white p-5 transition-shadow hover:shadow-sm">
      {/* Header row: avatar + name + time + menu */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar
            src={activity.user.avatarUrl}
            name={activity.user.displayName}
            size="md"
          />
          <div>
            <div className="flex items-center gap-2">
              <a
                href={`/profile/${activity.user.username}`}
                className="text-sm font-semibold text-gfm-dark hover:underline"
              >
                {activity.user.displayName}
              </a>
              <span className="text-xs text-gfm-secondary">
                {formatRelativeTime(activity.createdAt)}
              </span>
            </div>
            <ActivityTypeLabel activity={activity} />
          </div>
        </div>

        {/* Menu button */}
        <button
          aria-label="More options"
          className="flex h-8 w-8 items-center justify-center rounded-full text-gfm-secondary transition hover:bg-gray-100"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>
      </div>

      {/* Benefiting community */}
      {activity.community && (
        <div className="mb-3">
          <a
            href={`/communities/${activity.community.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gfm-secondary hover:underline"
          >
            {activity.community.iconUrl && (
              <Image src={activity.community.iconUrl} alt="" width={16} height={16} className="h-4 w-4 rounded-full" />
            )}
            Benefiting {activity.community.name}
          </a>
        </div>
      )}

      {/* Post text */}
      {activity.content && (
        <p className="mb-4 text-sm leading-relaxed text-gfm-dark">
          {displayContent}
          {hasLongContent && !contentExpanded && (
            <button
              onClick={() => setContentExpanded(true)}
              className="ml-1 font-medium text-gfm-dark hover:underline"
            >
              read more
            </button>
          )}
        </p>
      )}

      {/* Embedded fundraiser card */}
      {activity.fundraiser &&
        (activity.type === "fundraiser_created" || activity.type === "fundraiser_update") && (
          <a
            href={`/fundraisers/${activity.fundraiser.slug}`}
            className="mb-4 block overflow-hidden rounded-xl border border-gfm-border transition hover:shadow-md"
          >
            <div className="relative">
              <img
                src={activity.fundraiser.coverImageUrl}
                alt={activity.fundraiser.title}
                className="h-48 w-full object-cover"
              />
              {/* Overlay with title */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4">
                <h3 className="flex-1 text-base font-bold text-white leading-snug">
                  {activity.fundraiser.title}
                </h3>
                <div className="ml-3 shrink-0">
                  <ProgressCircle
                    percentage={formatPercentage(
                      activity.fundraiser.raisedAmount,
                      activity.fundraiser.goalAmount
                    )}
                    size={52}
                    strokeWidth={4}
                    className="[&_span]:text-[10px] [&_span]:text-white [&_svg_circle:first-child]:stroke-white/30"
                  />
                </div>
              </div>
            </div>
          </a>
        )}

      {/* Engagement row */}
      <div className="flex items-center gap-5 border-t border-gfm-border pt-3 mt-3">
        {/* Like */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm transition ${
            isLiked
              ? "font-semibold text-red-500"
              : "text-gfm-secondary hover:text-red-500"
          }`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={isLiked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {formatNumber(likeCount)}
        </button>

        {/* Comment */}
        <button className="flex items-center gap-1.5 text-sm text-gfm-secondary transition hover:text-gfm-dark">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {formatNumber(activity.commentCount)}
        </button>

        {/* Share */}
        <button
          aria-label="Share"
          className="flex items-center gap-1.5 text-sm text-gfm-secondary transition hover:text-gfm-dark"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </article>
  );
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const [sort, setSort] = useState<SortOption>("latest");

  const sorted = [...activities].sort((a, b) => {
    if (sort === "popular") {
      return b.likeCount - a.likeCount;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div>
      {/* Sort control */}
      <div className="mb-5 flex items-center gap-2">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gfm-secondary"
        >
          <line x1="4" y1="21" x2="4" y2="14" />
          <line x1="4" y1="10" x2="4" y2="3" />
          <line x1="12" y1="21" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12" y2="3" />
          <line x1="20" y1="21" x2="20" y2="16" />
          <line x1="20" y1="12" x2="20" y2="3" />
          <line x1="1" y1="14" x2="7" y2="14" />
          <line x1="9" y1="8" x2="15" y2="8" />
          <line x1="17" y1="16" x2="23" y2="16" />
        </svg>
        <span className="text-sm text-gfm-secondary">Sorting by:</span>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="rounded-md border-none bg-transparent text-sm font-semibold text-gfm-dark focus:outline-none cursor-pointer"
        >
          <option value="latest">Latest</option>
          <option value="popular">Popular</option>
        </select>
      </div>

      {/* Activity cards */}
      <div className="space-y-5">
        {sorted.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>

      {sorted.length === 0 && (
        <p className="py-12 text-center text-sm text-gfm-secondary">
          No activity yet.
        </p>
      )}
    </div>
  );
}
