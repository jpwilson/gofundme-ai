interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showOnline?: boolean;
}

const sizeMap: Record<NonNullable<AvatarProps["size"]>, { container: string; text: string; indicator: string }> = {
  xs: { container: "h-6 w-6", text: "text-[10px]", indicator: "h-2 w-2 border" },
  sm: { container: "h-8 w-8", text: "text-xs", indicator: "h-2.5 w-2.5 border" },
  md: { container: "h-10 w-10", text: "text-sm", indicator: "h-3 w-3 border-2" },
  lg: { container: "h-16 w-16", text: "text-xl", indicator: "h-4 w-4 border-2" },
  xl: { container: "h-24 w-24", text: "text-3xl", indicator: "h-5 w-5 border-2" },
};

const bgColors = [
  "bg-gfm-green",
  "bg-gfm-dark-green",
  "bg-[#4f46e5]",
  "bg-[#dc2626]",
  "bg-[#ea580c]",
  "bg-[#0891b2]",
  "bg-[#7c3aed]",
  "bg-[#db2777]",
];

function getColorIndex(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % bgColors.length;
}

function getInitial(name?: string): string {
  if (!name) return "?";
  return name.charAt(0).toUpperCase();
}

export function Avatar({
  src,
  alt,
  name,
  size = "md",
  showOnline,
}: AvatarProps) {
  const styles = sizeMap[size];
  const initial = getInitial(name);
  const bgColor = name ? bgColors[getColorIndex(name)] : bgColors[0];

  return (
    <div className={`relative inline-flex shrink-0 ${styles.container}`}>
      {src ? (
        <img
          src={src}
          alt={alt || name || "Avatar"}
          className={`${styles.container} rounded-full object-cover`}
        />
      ) : (
        <div
          className={`${styles.container} ${bgColor} flex items-center justify-center rounded-full`}
        >
          <span className={`${styles.text} font-semibold text-white leading-none`}>
            {initial}
          </span>
        </div>
      )}
      {showOnline && (
        <span
          className={`absolute bottom-0 right-0 ${styles.indicator} rounded-full border-white bg-gfm-green`}
        />
      )}
    </div>
  );
}

export type { AvatarProps };
