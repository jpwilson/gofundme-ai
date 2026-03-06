import { Avatar } from "@/components/ui/Avatar";

export function PersonalizeProfileCTA() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-gfm-bg via-[#e8f5e2] to-gfm-light-green p-5 border border-gfm-border">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-bold text-gfm-dark leading-snug">
            Show what matters most to you by personalizing your profile.
          </p>
          <p className="mt-1 text-xs text-gfm-secondary">
            Add a bio, cover photo, and highlight your favorite causes.
          </p>
          <a
            href="#"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-gfm-green hover:underline"
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
          <div className="opacity-50">
            <Avatar name="Alice" size="sm" />
          </div>
          <div className="opacity-70">
            <Avatar name="Bob" size="md" />
          </div>
          <div className="opacity-50">
            <Avatar name="Carol" size="sm" />
          </div>
        </div>
      </div>

      {/* Decorative corner accent */}
      <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-gfm-green/10" />
      <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-gfm-green/5" />
    </div>
  );
}
