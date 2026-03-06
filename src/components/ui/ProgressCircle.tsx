interface ProgressCircleProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ProgressCircle({
  percentage,
  size = 80,
  strokeWidth = 6,
  className = "",
}: ProgressCircleProps) {
  const clamped = Math.min(100, Math.max(0, percentage));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const center = size / 2;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-label={`${Math.round(clamped)}% progress`}
        role="img"
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--gfm-border)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--gfm-green)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
      <span className="absolute text-sm font-bold text-gfm-dark">
        {Math.round(clamped)}%
      </span>
    </div>
  );
}

export type { ProgressCircleProps };
