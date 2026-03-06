import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gfm-green text-white hover:bg-gfm-dark-green active:bg-gfm-dark-green",
  secondary:
    "bg-gfm-dark-green text-white hover:bg-[#015e30] active:bg-[#015e30]",
  outline:
    "border-2 border-gfm-green text-gfm-green bg-transparent hover:bg-gfm-green hover:text-white",
  ghost:
    "bg-transparent text-gfm-dark hover:bg-gfm-bg active:bg-gfm-border",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm rounded-[8px]",
  md: "h-10 px-5 text-sm rounded-[8px]",
  lg: "h-12 px-6 text-base rounded-[8px]",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      className = "",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center font-semibold transition-colors
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gfm-green
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `.trim()}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
