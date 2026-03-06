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
              className="flex gap-4 rounded-xl border border-gfm-border p-3 hover:shadow-md transition-shadow group bg-white"
            >
              {/* Thumbnail on the left */}
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gfm-bg">
                <img
                  src={fundraiser.coverImageUrl}
                  alt={fundraiser.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Content on the right */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <p className="text-xs text-gfm-secondary">
                    {fundraiser.donationCount} supporters
                  </p>
                  <h4 className="mt-0.5 text-sm font-semibold text-gfm-dark line-clamp-2 group-hover:text-gfm-green transition-colors">
                    {fundraiser.title}
                  </h4>
                </div>
                <div>
                  <ProgressBar
                    percentage={percentage}
                    height="sm"
                    className="mt-1.5"
                  />
                  <p className="mt-1 text-xs font-semibold text-gfm-dark">
                    {formatCurrency(fundraiser.raisedAmount)}{" "}
                    <span className="font-normal text-gfm-secondary">
                      raised of {formatCurrency(fundraiser.goalAmount)}
                    </span>
                  </p>
                </div>
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
