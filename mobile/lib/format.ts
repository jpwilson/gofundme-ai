/**
 * Converts a value in cents to a formatted dollar string.
 * e.g. 10000 -> "$100.00", 1050 -> "$10.50"
 */
export function formatCurrency(cents: number): string {
  const dollars = cents / 100;
  return dollars.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: dollars % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Converts a value in cents to a compact dollar string.
 * e.g. 389000 -> "$3.9K", 150000000 -> "$1.5M"
 */
export function formatCompactCurrency(cents: number): string {
  const dollars = cents / 100;
  if (dollars >= 1_000_000) {
    const value = dollars / 1_000_000;
    const formatted = value % 1 === 0 ? value.toString() : value.toFixed(1);
    return `$${formatted}M`;
  }
  if (dollars >= 1_000) {
    const value = dollars / 1_000;
    const formatted = value % 1 === 0 ? value.toString() : value.toFixed(1);
    return `$${formatted}K`;
  }
  return `$${dollars}`;
}

/**
 * Formats a date as a relative time string.
 * e.g. "7 d", "2 h", "5 min", "just now"
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = typeof date === "string" ? new Date(date) : date;
  const diffMs = now.getTime() - then.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 60) {
    return "just now";
  }

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes} min`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} h`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) {
    return `${diffDays} d`;
  }

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `${diffMonths} mo`;
  }

  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears} y`;
}

/**
 * Formats a number with comma separators.
 * e.g. 1000 -> "1,000", 1000000 -> "1,000,000"
 */
export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

/**
 * Calculates a percentage (0-100) of current relative to goal.
 * Capped at 100.
 */
export function formatPercentage(current: number, goal: number): number {
  if (goal <= 0) return 0;
  const percentage = Math.round((current / goal) * 100);
  return Math.min(percentage, 100);
}
