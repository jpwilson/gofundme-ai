import { Flame, TrendingUp, Clock } from "lucide-react";
import type { Fundraiser } from "@/lib/types";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Avatar } from "@/components/ui/Avatar";
import {
  formatCurrency,
  formatPercentage,
} from "@/lib/utils/format";

function getSmartTags(fundraiser: Fundraiser) {
  const tags: { label: string; color: string; icon: "flame" | "trending" | "clock" }[] = [];
  const pctToGoal = fundraiser.goalAmount > 0
    ? (fundraiser.raisedAmount / fundraiser.goalAmount) * 100
    : 0;

  const createdDate = new Date(fundraiser.createdAt);
  const now = new Date();
  const daysSinceCreation = Math.max(1, Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)));
  const isNew = daysSinceCreation <= 14;
  const isNearGoal = pctToGoal >= 70 && pctToGoal < 100;

  // Velocity: raised per day (in cents)
  const velocity = fundraiser.raisedAmount / daysSinceCreation;
  // "Most urgent" = near goal with high velocity
  const isUrgent = isNearGoal && velocity > 5000; // > $50/day

  if (isUrgent) {
    tags.push({ label: "Most urgent", color: "red", icon: "flame" });
  } else if (isNearGoal) {
    tags.push({ label: "Almost there", color: "amber", icon: "trending" });
  }

  if (isNew) {
    tags.push({ label: "New", color: "blue", icon: "clock" });
  }

  return tags;
}

function SmartTagIcon({ icon }: { icon: "flame" | "trending" | "clock" }) {
  if (icon === "flame") return <Flame className="h-3 w-3" />;
  if (icon === "trending") return <TrendingUp className="h-3 w-3" />;
  return <Clock className="h-3 w-3" />;
}

interface FundraisersListProps {
  fundraisers: Fundraiser[];
}

function FundraiserCard({ fundraiser }: { fundraiser: Fundraiser }) {
  const pct = formatPercentage(fundraiser.raisedAmount, fundraiser.goalAmount);
  const tags = getSmartTags(fundraiser);

  const colorMap: Record<string, { bg: string; text: string }> = {
    red: { bg: "bg-red-50", text: "text-red-600" },
    amber: { bg: "bg-amber-50", text: "text-amber-600" },
    blue: { bg: "bg-blue-50", text: "text-blue-600" },
  };

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
        {/* Smart campaign tags overlay */}
        {tags.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {tags.map((tag) => {
              const colors = colorMap[tag.color] || colorMap.blue;
              return (
                <span
                  key={tag.label}
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm backdrop-blur-sm ${colors.bg} ${colors.text}`}
                >
                  <SmartTagIcon icon={tag.icon} />
                  {tag.label}
                </span>
              );
            })}
          </div>
        )}
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
