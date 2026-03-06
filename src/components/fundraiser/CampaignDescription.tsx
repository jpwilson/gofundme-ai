"use client";

import { useState } from "react";
import Link from "next/link";
import type { Fundraiser } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface CampaignDescriptionProps {
  fundraiser: Fundraiser;
}

export function CampaignDescription({
  fundraiser,
}: CampaignDescriptionProps) {
  const [expanded, setExpanded] = useState(false);

  const shortDescription = fundraiser.description.slice(0, 280);
  const needsTruncation = fundraiser.description.length > 280;

  return (
    <div className="space-y-5">
      {/* Organizer line */}
      <div className="flex flex-wrap items-center gap-2">
        <Avatar
          src={fundraiser.organizer.avatarUrl}
          name={fundraiser.organizer.displayName}
          size="sm"
        />
        <span className="text-sm text-gfm-dark">
          <span className="font-semibold">
            {fundraiser.organizer.displayName}
          </span>
          {fundraiser.beneficiary && (
            <>
              {" "}
              is organizing for{" "}
              <span className="font-semibold">
                {fundraiser.beneficiary.name}
              </span>
              {fundraiser.beneficiary.isVerified && (
                <svg
                  className="ml-1 inline-block h-4 w-4 text-gfm-green"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </>
          )}
          {!fundraiser.beneficiary && (
            <span> is organizing this fundraiser</span>
          )}
        </span>
      </div>

      {/* Tax-deductible badge */}
      {fundraiser.isTaxDeductible && (
        <Badge variant="green">Tax-deductible</Badge>
      )}

      {/* Description */}
      <div className="text-sm leading-relaxed text-gfm-dark">
        {expanded ? (
          <div className="whitespace-pre-line">{fundraiser.description}</div>
        ) : (
          <div>
            {needsTruncation ? (
              <>
                {shortDescription}...
                <button
                  onClick={() => setExpanded(true)}
                  className="ml-1 font-semibold text-gfm-green hover:underline"
                >
                  Read more
                </button>
              </>
            ) : (
              <div className="whitespace-pre-line">
                {fundraiser.description}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reaction buttons row */}
      <div className="flex items-center gap-3 border-t border-b border-gfm-border py-3">
        <button className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-gfm-secondary hover:bg-gray-100 transition-colors">
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
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          React
        </button>
        <button className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-gfm-secondary hover:bg-gray-100 transition-colors">
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
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Inspire
        </button>
      </div>

      {/* Inline Donate / Share */}
      <div className="flex gap-3">
        <Button variant="primary" size="md" fullWidth>
          Donate now
        </Button>
        <Button variant="secondary" size="md" fullWidth>
          Share
        </Button>
      </div>

      {/* Nonprofit giving CTA - purple/pink gradient - visible on mobile below the description */}
      <div className="rounded-xl bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#ec4899] p-5 text-white lg:hidden">
        <div className="flex items-start gap-3">
          <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold leading-snug">
              Take your nonprofit giving to the next level
            </p>
            <p className="mt-1 text-xs text-white/80 leading-relaxed">
              Set up recurring giving or explore Giving Funds to maximize your impact.
            </p>
            <Link
              href="/giving-funds"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-white hover:underline"
            >
              Learn more
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
