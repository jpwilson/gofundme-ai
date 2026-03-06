"use client";

import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatPercentage } from "@/lib/utils/format";
import type { Highlight } from "@/lib/types";

interface ProfileHighlightsProps {
  highlights: Highlight[];
  isOwnProfile: boolean;
}

export function ProfileHighlights({ highlights, isOwnProfile }: ProfileHighlightsProps) {
  if (highlights.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-bold text-gfm-dark">Highlights</h3>
      <div className="mt-3 space-y-3">
        {highlights.map((highlight) => {
          const { fundraiser } = highlight;
          const percentage = formatPercentage(
            fundraiser.raisedAmount,
            fundraiser.goalAmount
          );

          return (
            <a
              key={highlight.id}
              href={`/f/${fundraiser.slug}`}
              className="flex items-start gap-3 rounded-card border border-gfm-border p-3 hover:shadow-sm transition-shadow group"
            >
              {/* Thumbnail */}
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gfm-bg">
                <img
                  src={fundraiser.coverImageUrl}
                  alt={fundraiser.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gfm-secondary">
                  {fundraiser.donationCount} supporters
                </p>
                <h4 className="mt-0.5 text-sm font-semibold text-gfm-dark line-clamp-2 group-hover:underline">
                  {fundraiser.title}
                </h4>
                <ProgressBar
                  percentage={percentage}
                  height="sm"
                  className="mt-2"
                />
                <p className="mt-1 text-xs font-semibold text-gfm-dark">
                  {formatCurrency(fundraiser.raisedAmount)}{" "}
                  <span className="font-normal text-gfm-secondary">
                    raised of {formatCurrency(fundraiser.goalAmount)}
                  </span>
                </p>
              </div>

              {/* Follow button on public view */}
              {!isOwnProfile && (
                <div className="shrink-0 self-center">
                  <Button variant="primary" size="sm">
                    Follow
                  </Button>
                </div>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}
