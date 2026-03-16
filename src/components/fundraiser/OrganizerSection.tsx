import Link from "next/link";
import { Shield } from "lucide-react";
import type { Fundraiser } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";

interface OrganizerSectionProps {
  fundraiser: Fundraiser;
}

export function OrganizerSection({ fundraiser }: OrganizerSectionProps) {
  const createdDate = new Date(fundraiser.createdAt).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  const categoryLabel =
    fundraiser.category.charAt(0).toUpperCase() +
    fundraiser.category.slice(1);

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-gfm-dark">Organizer</h2>

      <div className="flex items-center gap-4">
        {/* Organizer */}
        <div className="flex items-center gap-3">
          <Avatar
            src={fundraiser.organizer.avatarUrl}
            name={fundraiser.organizer.displayName}
            size="lg"
          />
          <div>
            <p className="font-semibold text-gfm-dark">
              {fundraiser.organizer.displayName}
            </p>
            <p className="text-sm text-gfm-secondary">Organizer</p>
            {fundraiser.organizer.location && (
              <p className="text-xs text-gfm-secondary">
                {fundraiser.organizer.location}
              </p>
            )}
          </div>
        </div>

        {/* Arrow */}
        {fundraiser.beneficiary && (
          <>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-gfm-secondary"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>

            {/* Beneficiary */}
            <div className="flex items-center gap-3">
              <Avatar
                src={fundraiser.beneficiary.avatarUrl}
                name={fundraiser.beneficiary.name}
                size="lg"
              />
              <div>
                <p className="font-semibold text-gfm-dark">
                  {fundraiser.beneficiary.name}
                </p>
                <p className="text-sm text-gfm-secondary">Beneficiary</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Contact button */}
      <Button variant="outline" size="sm">
        Contact
      </Button>

      {/* Meta info */}
      <div className="flex items-center gap-3 text-sm text-gfm-secondary">
        <span>Created {createdDate}</span>
        <span>&middot;</span>
        <span className="capitalize">{categoryLabel}</span>
      </div>

      {/* Report & Trust links */}
      <div className="flex items-center gap-4">
        <button className="text-xs text-gfm-secondary underline hover:text-gfm-dark transition-colors">
          Report fundraiser
        </button>
        <Link
          href="/fraud-detection"
          className="inline-flex items-center gap-1 text-xs text-gfm-secondary hover:text-gfm-dark transition-colors"
        >
          <Shield className="h-3.5 w-3.5" />
          View Trust &amp; Safety
        </Link>
      </div>
    </div>
  );
}
