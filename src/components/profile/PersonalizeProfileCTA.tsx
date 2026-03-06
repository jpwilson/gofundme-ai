import { Avatar } from "@/components/ui/Avatar";

export function PersonalizeProfileCTA() {
  return (
    <div className="relative overflow-hidden rounded-card bg-gradient-to-r from-gfm-bg to-[#e8f5e2] p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gfm-dark leading-snug">
            Show what matters most to you by personalizing your profile.
          </p>
          <a
            href="#"
            className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-gfm-green hover:underline"
          >
            See your profile
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>

        {/* Decorative avatars */}
        <div className="shrink-0 flex items-end gap-1">
          <div className="opacity-60">
            <Avatar name="Alice" size="sm" />
          </div>
          <div className="opacity-80">
            <Avatar name="Bob" size="md" />
          </div>
          <div className="opacity-60">
            <Avatar name="Carol" size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
