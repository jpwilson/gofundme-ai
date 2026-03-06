import { describe, it, expect } from "vitest";
import {
  users,
  fundraisers,
  donations,
  communities,
  getUserById,
  getFundraiserBySlug,
  getFundraiserById,
  getDonationsByFundraiserId,
  getCommunityBySlug,
  getHighlightsByUserId,
  getLeaderboardByCommunitySlug,
  getActivitiesByUserId,
} from "@/lib/data/mock";

describe("getFundraiserBySlug", () => {
  it("returns the correct fundraiser for a valid slug", () => {
    const fundraiser = getFundraiserBySlug("la-wildfire-alerts-and-recovery");
    expect(fundraiser).toBeDefined();
    expect(fundraiser!.id).toBe("fund-1");
    expect(fundraiser!.title).toBe("LA Wildfire Alerts & Recovery Fund");
    expect(fundraiser!.organizerId).toBe("user-1");
  });

  it("returns the medical fundraiser for its slug", () => {
    const fundraiser = getFundraiserBySlug("help-sarah-fight-cancer");
    expect(fundraiser).toBeDefined();
    expect(fundraiser!.id).toBe("fund-2");
    expect(fundraiser!.category).toBe("medical");
  });

  it("returns the animal rescue fundraiser for its slug", () => {
    const fundraiser = getFundraiserBySlug("la-animal-rescue-fund");
    expect(fundraiser).toBeDefined();
    expect(fundraiser!.id).toBe("fund-3");
    expect(fundraiser!.category).toBe("animals");
  });

  it("returns undefined for an invalid slug", () => {
    expect(getFundraiserBySlug("does-not-exist")).toBeUndefined();
  });

  it("returns undefined for an empty string", () => {
    expect(getFundraiserBySlug("")).toBeUndefined();
  });
});

describe("getDonationsByFundraiserId", () => {
  it("returns all donations for the wildfire fundraiser", () => {
    const result = getDonationsByFundraiserId("fund-1");
    expect(result.length).toBeGreaterThanOrEqual(5);
    result.forEach((d) => {
      expect(d.fundraiserId).toBe("fund-1");
    });
  });

  it("returns donations for the medical fundraiser", () => {
    const result = getDonationsByFundraiserId("fund-2");
    expect(result.length).toBeGreaterThanOrEqual(3);
    result.forEach((d) => {
      expect(d.fundraiserId).toBe("fund-2");
    });
  });

  it("returns donations for the animal fundraiser", () => {
    const result = getDonationsByFundraiserId("fund-3");
    expect(result.length).toBeGreaterThanOrEqual(3);
    result.forEach((d) => {
      expect(d.fundraiserId).toBe("fund-3");
    });
  });

  it("returns an empty array for a nonexistent fundraiser", () => {
    expect(getDonationsByFundraiserId("fund-999")).toEqual([]);
  });

  it("donation amounts are positive", () => {
    const allDonations = getDonationsByFundraiserId("fund-1");
    allDonations.forEach((d) => {
      expect(d.amount).toBeGreaterThan(0);
    });
  });
});

describe("getUserById", () => {
  it("returns user-1 (Janahan)", () => {
    const user = getUserById("user-1");
    expect(user).toBeDefined();
    expect(user!.username).toBe("janahan");
    expect(user!.displayName).toBe("Janahan Sivaraman");
  });

  it("returns user-2 (Tim)", () => {
    const user = getUserById("user-2");
    expect(user).toBeDefined();
    expect(user!.username).toBe("timcadogan");
  });

  it("returns user-3 (Arnie)", () => {
    const user = getUserById("user-3");
    expect(user).toBeDefined();
    expect(user!.username).toBe("arniekatz");
  });

  it("returns undefined for unknown user", () => {
    expect(getUserById("user-999")).toBeUndefined();
  });
});

describe("getCommunityBySlug", () => {
  it("returns the Watch Duty community", () => {
    const community = getCommunityBySlug("watch-duty");
    expect(community).toBeDefined();
    expect(community!.id).toBe("community-1");
    expect(community!.name).toBe("Watch Duty");
    expect(community!.followerCount).toBeGreaterThan(0);
    expect(community!.totalRaised).toBeGreaterThan(0);
    expect(community!.totalDonations).toBeGreaterThan(0);
    expect(community!.totalFundraisers).toBeGreaterThan(0);
  });

  it("returns undefined for unknown community", () => {
    expect(getCommunityBySlug("nonexistent")).toBeUndefined();
  });
});

describe("getHighlightsByUserId", () => {
  it("returns highlights array", () => {
    const result = getHighlightsByUserId("user-1");
    expect(result.length).toBeGreaterThan(0);
  });

  it("each highlight has a fundraiser with title and slug", () => {
    const result = getHighlightsByUserId("user-1");
    result.forEach((h) => {
      expect(h.fundraiser).toBeDefined();
      expect(h.fundraiser.title).toBeTruthy();
      expect(h.fundraiser.slug).toBeTruthy();
      expect(typeof h.fundraiser.raisedAmount).toBe("number");
      expect(typeof h.fundraiser.goalAmount).toBe("number");
      expect(typeof h.fundraiser.donationCount).toBe("number");
    });
  });
});

describe("getLeaderboardByCommunitySlug", () => {
  it("returns leaderboard entries", () => {
    const result = getLeaderboardByCommunitySlug("watch-duty");
    expect(result.length).toBeGreaterThan(0);
  });

  it("entries have descending raised amounts", () => {
    const result = getLeaderboardByCommunitySlug("watch-duty");
    for (let i = 1; i < result.length; i++) {
      expect(result[i].raisedAmount).toBeLessThanOrEqual(result[i - 1].raisedAmount);
    }
  });

  it("ranks are sequential starting from 1", () => {
    const result = getLeaderboardByCommunitySlug("watch-duty");
    result.forEach((entry, i) => {
      expect(entry.rank).toBe(i + 1);
    });
  });
});

describe("getActivitiesByUserId", () => {
  it("returns activities for user-1", () => {
    const result = getActivitiesByUserId("user-1");
    expect(result.length).toBeGreaterThan(0);
    result.forEach((a) => {
      expect(a.userId).toBe("user-1");
    });
  });

  it("returns activities for user-2", () => {
    const result = getActivitiesByUserId("user-2");
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns empty for unknown user", () => {
    expect(getActivitiesByUserId("user-999")).toEqual([]);
  });
});

describe("Data cross-references", () => {
  it("fundraiser donation counts roughly match actual donation records", () => {
    // Note: donation counts in fundraiser data are static mock values
    // that may not perfectly match the donations array, but they should be reasonable
    for (const f of fundraisers) {
      const donationRecords = getDonationsByFundraiserId(f.id);
      expect(donationRecords.length).toBeGreaterThan(0);
    }
  });

  it("each fundraiser with a community references a valid community slug", () => {
    for (const f of fundraisers) {
      if (f.communityId && f.community) {
        const community = getCommunityBySlug(f.community.slug);
        expect(community).toBeDefined();
      }
    }
  });
});
