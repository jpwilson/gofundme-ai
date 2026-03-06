import type { Fundraiser } from "@/lib/types";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Avatar } from "@/components/ui/Avatar";
import {
  formatCurrency,
  formatPercentage,
} from "@/lib/utils/format";

interface FundraisersListProps {
  fundraisers: Fundraiser[];
}

function FundraiserCard({ fundraiser }: { fundraiser: Fundraiser }) {
  const pct = formatPercentage(fundraiser.raisedAmount, fundraiser.goalAmount);

  return (
    <a
      href={`/fundraisers/${fundraiser.slug}`}
      className="group block overflow-hidden rounded-xl border border-gfm-border bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
    >
      {/* Cover image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
        <img
          src={fundraiser.coverImageUrl}
          alt={fundraiser.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-2 text-sm font-semibold leading-snug text-gfm-dark line-clamp-2">
          {fundraiser.title}
        </h3>

        {/* Organizer */}
        <div className="mb-3 flex items-center gap-2">
          <Avatar
            src={fundraiser.organizer.avatarUrl}
            name={fundraiser.organizer.displayName}
            size="xs"
          />
          <span className="text-xs text-gfm-secondary">
            by {fundraiser.organizer.displayName}
          </span>
        </div>

        {/* Progress */}
        <ProgressBar percentage={pct} height="sm" className="mb-2" />

        <div className="flex items-baseline justify-between">
          <span className="text-sm font-bold text-gfm-dark">
            {formatCurrency(fundraiser.raisedAmount)}
          </span>
          <span className="text-xs text-gfm-secondary">
            raised of {formatCurrency(fundraiser.goalAmount)}
          </span>
        </div>
      </div>
    </a>
  );
}

export function FundraisersList({ fundraisers }: FundraisersListProps) {
  if (fundraisers.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-gfm-secondary">
        No fundraisers yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {fundraisers.map((f) => (
        <FundraiserCard key={f.id} fundraiser={f} />
      ))}
    </div>
  );
}
