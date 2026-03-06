import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatCompactCurrency,
  formatRelativeTime,
  formatNumber,
  formatPercentage,
} from "@/lib/utils/format";

describe("formatCurrency", () => {
  it("converts cents to dollar display", () => {
    expect(formatCurrency(10000)).toBe("$100");
    expect(formatCurrency(1050)).toBe("$10.50");
    expect(formatCurrency(0)).toBe("$0");
    expect(formatCurrency(99)).toBe("$0.99");
  });

  it("handles large values", () => {
    expect(formatCurrency(1000000)).toBe("$10,000");
  });
});

describe("formatCompactCurrency", () => {
  it("formats values in the thousands", () => {
    expect(formatCompactCurrency(389000)).toBe("$3.9K");
    expect(formatCompactCurrency(100000)).toBe("$1K");
    expect(formatCompactCurrency(500000)).toBe("$5K");
  });

  it("formats values in the millions", () => {
    expect(formatCompactCurrency(150000000)).toBe("$1.5M");
    expect(formatCompactCurrency(100000000)).toBe("$1M");
  });

  it("formats values under 1000 dollars", () => {
    expect(formatCompactCurrency(5000)).toBe("$50");
    expect(formatCompactCurrency(100)).toBe("$1");
  });
});

describe("formatRelativeTime", () => {
  it("returns 'just now' for recent timestamps", () => {
    const now = new Date();
    expect(formatRelativeTime(now)).toBe("just now");
  });

  it("formats minutes", () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    expect(formatRelativeTime(fiveMinutesAgo)).toBe("5 min");
  });

  it("formats hours", () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    expect(formatRelativeTime(twoHoursAgo)).toBe("2 h");
  });

  it("formats days", () => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(sevenDaysAgo)).toBe("7 d");
  });

  it("accepts string dates", () => {
    const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(tenDaysAgo.toISOString())).toBe("10 d");
  });
});

describe("formatNumber", () => {
  it("adds comma separators", () => {
    expect(formatNumber(1000)).toBe("1,000");
    expect(formatNumber(1000000)).toBe("1,000,000");
    expect(formatNumber(999)).toBe("999");
    expect(formatNumber(0)).toBe("0");
  });
});

describe("formatPercentage", () => {
  it("calculates percentage", () => {
    expect(formatPercentage(50, 100)).toBe(50);
    expect(formatPercentage(75, 300)).toBe(25);
  });

  it("caps at 100", () => {
    expect(formatPercentage(200, 100)).toBe(100);
  });

  it("handles zero goal", () => {
    expect(formatPercentage(50, 0)).toBe(0);
  });

  it("handles zero current", () => {
    expect(formatPercentage(0, 100)).toBe(0);
  });
});
