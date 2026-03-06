import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatCompactCurrency,
  formatRelativeTime,
  formatPercentage,
} from "@/lib/utils/format";

describe("formatCurrency edge cases", () => {
  it("handles zero cents", () => {
    expect(formatCurrency(0)).toBe("$0");
  });

  it("handles negative values", () => {
    const result = formatCurrency(-500);
    expect(result).toContain("-");
    expect(result).toContain("5");
  });

  it("handles very large numbers", () => {
    const result = formatCurrency(100000000); // $1,000,000
    expect(result).toBe("$1,000,000");
  });

  it("handles single cent", () => {
    expect(formatCurrency(1)).toBe("$0.01");
  });

  it("handles fractional display for non-whole dollars", () => {
    expect(formatCurrency(1234)).toBe("$12.34");
  });
});

describe("formatCompactCurrency edge cases", () => {
  it("handles 0 cents", () => {
    expect(formatCompactCurrency(0)).toBe("$0");
  });

  it("formats 999999 cents ($9999.99) as K", () => {
    const result = formatCompactCurrency(999999);
    // $9999.99 -> should show as K
    expect(result).toContain("K");
  });

  it("formats exactly 100000 cents ($1000) as $1K", () => {
    expect(formatCompactCurrency(100000)).toBe("$1K");
  });

  it("formats exactly 100000000 cents ($1,000,000) as $1M", () => {
    expect(formatCompactCurrency(100000000)).toBe("$1M");
  });

  it("formats values just under $1000 without suffix", () => {
    expect(formatCompactCurrency(99900)).toBe("$999");
  });

  it("formats 150000000 cents ($1,500,000) as $1.5M", () => {
    expect(formatCompactCurrency(150000000)).toBe("$1.5M");
  });

  it("formats values with trailing zero decimal in K range", () => {
    // $2000 = 200000 cents -> $2K (not $2.0K)
    expect(formatCompactCurrency(200000)).toBe("$2K");
  });
});

describe("formatRelativeTime edge cases", () => {
  it("returns 'just now' for 30 seconds ago", () => {
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);
    expect(formatRelativeTime(thirtySecondsAgo)).toBe("just now");
  });

  it("returns '1 min' for exactly 60 seconds ago", () => {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    expect(formatRelativeTime(oneMinuteAgo)).toBe("1 min");
  });

  it("returns '59 min' for 59 minutes ago", () => {
    const fiftyNineMinAgo = new Date(Date.now() - 59 * 60 * 1000);
    expect(formatRelativeTime(fiftyNineMinAgo)).toBe("59 min");
  });

  it("returns '1 h' for 60 minutes ago", () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    expect(formatRelativeTime(oneHourAgo)).toBe("1 h");
  });

  it("returns '23 h' for 23 hours ago", () => {
    const twentyThreeHoursAgo = new Date(Date.now() - 23 * 60 * 60 * 1000);
    expect(formatRelativeTime(twentyThreeHoursAgo)).toBe("23 h");
  });

  it("returns '1 d' for 24 hours ago", () => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(oneDayAgo)).toBe("1 d");
  });

  it("returns '29 d' for 29 days ago", () => {
    const twentyNineDaysAgo = new Date(Date.now() - 29 * 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(twentyNineDaysAgo)).toBe("29 d");
  });

  it("returns months for 30+ days ago", () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(thirtyDaysAgo)).toBe("1 mo");
  });

  it("returns months for 60+ days ago", () => {
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(sixtyDaysAgo)).toBe("2 mo");
  });

  it("returns years for 365+ days ago", () => {
    const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(oneYearAgo)).toBe("1 y");
  });

  it("returns years for 730+ days ago", () => {
    const twoYearsAgo = new Date(Date.now() - 730 * 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(twoYearsAgo)).toBe("2 y");
  });
});

describe("formatPercentage edge cases", () => {
  it("returns 100 when current exceeds goal (over 100%)", () => {
    expect(formatPercentage(200, 100)).toBe(100);
  });

  it("returns 0 when goal is 0", () => {
    expect(formatPercentage(50, 0)).toBe(0);
  });

  it("returns 0 when goal is negative", () => {
    expect(formatPercentage(50, -10)).toBe(0);
  });

  it("returns 0 when both are 0", () => {
    expect(formatPercentage(0, 0)).toBe(0);
  });

  it("rounds to nearest integer", () => {
    // 1/3 = 33.33...% -> 33
    expect(formatPercentage(1, 3)).toBe(33);
  });

  it("handles very small percentages", () => {
    expect(formatPercentage(1, 10000)).toBe(0);
  });

  it("returns exactly 100 when current equals goal", () => {
    expect(formatPercentage(500, 500)).toBe(100);
  });

  it("returns exactly 50 for half", () => {
    expect(formatPercentage(50, 100)).toBe(50);
  });
});
