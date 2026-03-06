import type { Cause } from "@/lib/types";

interface TopCausesProps {
  causes: Cause[];
}

const causeEmojis: Record<string, string> = {
  animals: "🐱",
  arts_culture: "🎨",
  environment: "🌿",
  education: "📚",
  medical: "🏥",
  emergency: "🚨",
  community: "🤝",
  faith: "🙏",
  sports: "⚽",
  business: "💼",
};

export function TopCauses({ causes }: TopCausesProps) {
  if (causes.length === 0) return null;

  return (
    <div className="text-center">
      <h3 className="text-lg font-bold text-gfm-dark">Top causes</h3>
      <div className="mt-4 flex flex-wrap justify-center gap-6">
        {causes.map((cause) => (
          <div key={cause.type} className="flex flex-col items-center gap-2">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full text-2xl transition-transform duration-200 hover:scale-110"
              style={{ backgroundColor: cause.iconBgColor }}
            >
              {causeEmojis[cause.type] || "❤️"}
            </div>
            <span className="text-xs font-medium text-gfm-secondary">
              {cause.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
