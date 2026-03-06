import { type ReactNode } from "react";

type BadgeVariant = "green" | "yellow" | "gray";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  green: "bg-gfm-light-green text-gfm-dark-green",
  yellow: "bg-amber-100 text-amber-800",
  gray: "bg-gray-100 text-gfm-secondary",
};

export function Badge({
  variant = "gray",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full px-2.5 py-0.5
        text-xs font-medium leading-tight
        ${variantStyles[variant]}
        ${className}
      `.trim()}
    >
      {children}
    </span>
  );
}

export type { BadgeProps, BadgeVariant };
