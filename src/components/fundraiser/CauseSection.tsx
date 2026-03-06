import type { Fundraiser } from "@/lib/types";

interface CauseSectionProps {
  fundraiser: Fundraiser;
}

export function CauseSection({ fundraiser }: CauseSectionProps) {
  if (!fundraiser.community) return null;

  return (
    <div className="rounded-card border border-gfm-border p-5">
      <div className="flex items-center gap-3">
        {/* Fire / Community icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="text-orange-500"
          >
            <path
              d="M12 22c4.97 0 9-3.58 9-8 0-2.1-.82-4.06-2.18-5.64A16.7 16.7 0 0115 4a1 1 0 00-1.75-.66C12 5.13 11.2 7.3 11.2 7.3S10 5.5 10 3a1 1 0 00-1.8-.6C6.3 5.2 3 9.36 3 14c0 4.42 4.03 8 9 8z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gfm-dark">
            Fundraise for {fundraiser.community.name}
          </p>
          <a
            href={`/community/${fundraiser.community.slug}`}
            className="text-sm font-semibold text-gfm-green hover:underline"
          >
            View campaign
          </a>
        </div>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 text-gfm-secondary"
        >
          <path d="M7.5 5L12.5 10L7.5 15" />
        </svg>
      </div>
    </div>
  );
}
