interface ProgressBarProps {
  percentage: number;
  height?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const heightStyles: Record<NonNullable<ProgressBarProps["height"]>, string> = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

export function ProgressBar({
  percentage,
  height = "md",
  showLabel = false,
  className = "",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percentage));

  return (
    <div className={className}>
      <div
        className={`w-full overflow-hidden rounded-full bg-gfm-border ${heightStyles[height]}`}
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`${heightStyles[height]} rounded-full bg-gfm-green transition-[width] duration-500 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <p className="mt-1 text-xs font-medium text-gfm-secondary">
          {Math.round(clamped)}% funded
        </p>
      )}
    </div>
  );
}

export type { ProgressBarProps };
