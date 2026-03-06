import { describe, it, expect } from "vitest";
import {
  users,
  fundraisers,
  donations,
  communities,
  leaderboardEntries,
  highlights,
  causes,
  activities,
  getUserById,
  getFundraiserBySlug,
  getDonationsByFundraiserId,
  getCommunityBySlug,
  getHighlightsByUserId,
  getLeaderboardByCommunitySlug,
  getActivitiesByUserId,
  getFundraiserById,
} from "@/lib/data/mock";

describe("Users data integrity", () => {
  it("all users have required fields", () => {
    for (const user of users) {
      expect(user.id).toBeTruthy();
      expect(user.email).toBeTruthy();
      expect(user.username).toBeTruthy();
      expect(user.displayName).toBeTruthy();
      expect(typeof user.followerCount).toBe("number");
      expect(typeof user.followingCount).toBe("number");
      expect(typeof user.inspiredCount).toBe("number");
      expect(user.createdAt).toBeTruthy();
    }
  });

  it("all user IDs are unique", () => {
    const ids = users.map((u) => u.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all usernames are unique", () => {
    const usernames = users.map((u) => u.username);
    expect(new Set(usernames).size).toBe(usernames.length);
  });
});

describe("Fundraisers data integrity", () => {
  it("all fundraisers have required fields", () => {
    for (const f of fundraisers) {
      expect(f.id).toBeTruthy();
      expect(f.slug).toBeTruthy();
      expect(f.organizerId).toBeTruthy();
      expect(f.organizer).toBeTruthy();
      expect(f.title).toBeTruthy();
      expect(f.description).toBeTruthy();
      expect(typeof f.goalAmount).toBe("number");
      expect(f.goalAmount).toBeGreaterThan(0);
      expect(typeof f.raisedAmount).toBe("number");
      expect(typeof f.donationCount).toBe("number");
      expect(f.category).toBeTruthy();
      expect(f.status).toBeTruthy();
      expect(typeof f.isTaxDeductible).toBe("boolean");
      expect(f.coverImageUrl).toBeTruthy();
      expect(Array.isArray(f.images)).toBe(true);
      expect(f.createdAt).toBeTruthy();
      expect(f.updatedAt).toBeTruthy();
    }
  });

  it("all fundraiser organizer IDs reference valid users", () => {
    for (const f of fundraisers) {
      const user = getUserById(f.organizerId);
      expect(user).toBeDefined();
      expect(user!.displayName).toBe(f.organizer.displayName);
    }
  });

  it("all fundraiser slugs are unique", () => {
    const slugs = fundraisers.map((f) => f.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("Donations data integrity", () => {
  it("all donations have required fields", () => {
    for (const d of donations) {
      expect(d.id).toBeTruthy();
      expect(d.fundraiserId).toBeTruthy();
      expect(typeof d.amount).toBe("number");
      expect(d.amount).toBeGreaterThan(0);
      expect(typeof d.tipAmount).toBe("number");
      expect(typeof d.isAnonymous).toBe("boolean");
      expect(d.displayName).toBeTruthy();
      expect(d.createdAt).toBeTruthy();
    }
  });

  it("all donation fundraiser IDs reference valid fundraisers", () => {
    for (const d of donations) {
      const fundraiser = getFundraiserById(d.fundraiserId);
      expect(fundraiser).toBeDefined();
    }
  });

  it("donations with donorId reference valid users", () => {
    const donationsWithDonors = donations.filter((d) => d.donorId !== null);
    for (const d of donationsWithDonors) {
      const user = getUserById(d.donorId!);
      expect(user).toBeDefined();
    }
  });

  it("anonymous donations have null donor or displayName 'Anonymous'", () => {
    const anonDonations = donations.filter((d) => d.isAnonymous);
    for (const d of anonDonations) {
      expect(d.displayName).toBe("Anonymous");
    }
  });
});

describe("Communities data integrity", () => {
  it("all communities have required fields", () => {
    for (const c of communities) {
      expect(c.id).toBeTruthy();
      expect(c.slug).toBeTruthy();
      expect(c.name).toBeTruthy();
      expect(c.description).toBeTruthy();
      expect(typeof c.followerCount).toBe("number");
      expect(typeof c.totalRaised).toBe("number");
      expect(typeof c.totalDonations).toBe("number");
      expect(typeof c.totalFundraisers).toBe("number");
      expect(c.createdAt).toBeTruthy();
    }
  });
});

describe("Leaderboard entries", () => {
  it("entries are sorted by rank (ascending)", () => {
    for (let i = 1; i < leaderboardEntries.length; i++) {
      expect(leaderboardEntries[i].rank).toBeGreaterThan(
        leaderboardEntries[i - 1].rank
      );
    }
  });

  it("entries are sorted by raisedAmount descending", () => {
    for (let i = 1; i < leaderboardEntries.length; i++) {
      expect(leaderboardEntries[i].raisedAmount).toBeLessThanOrEqual(
        leaderboardEntries[i - 1].raisedAmount
      );
    }
  });

  it("all entries have required fields", () => {
    for (const entry of leaderboardEntries) {
      expect(typeof entry.rank).toBe("number");
      expect(entry.userId).toBeTruthy();
      expect(entry.user).toBeTruthy();
      expect(entry.user.displayName).toBeTruthy();
      expect(entry.fundraiserId).toBeTruthy();
      expect(entry.fundraiserTitle).toBeTruthy();
      expect(entry.fundraiserSlug).toBeTruthy();
      expect(typeof entry.raisedAmount).toBe("number");
      expect(entry.raisedAmount).toBeGreaterThan(0);
    }
  });
});

describe("Highlights data integrity", () => {
  it("all highlights have required fields", () => {
    for (const h of highlights) {
      expect(h.id).toBeTruthy();
      expect(h.fundraiserId).toBeTruthy();
      expect(h.fundraiser).toBeTruthy();
      expect(h.fundraiser.title).toBeTruthy();
      expect(h.fundraiser.slug).toBeTruthy();
      expect(typeof h.displayOrder).toBe("number");
    }
  });

  it("highlights are ordered by displayOrder", () => {
    for (let i = 1; i < highlights.length; i++) {
      expect(highlights[i].displayOrder).toBeGreaterThan(
        highlights[i - 1].displayOrder
      );
    }
  });
});

describe("Causes data integrity", () => {
  it("all causes have required fields", () => {
    for (const c of causes) {
      expect(c.type).toBeTruthy();
      expect(c.label).toBeTruthy();
      expect(c.iconBgColor).toBeTruthy();
    }
  });

  it("all cause types are unique", () => {
    const types = causes.map((c) => c.type);
    expect(new Set(types).size).toBe(types.length);
  });
});

describe("Lookup functions", () => {
  it("getFundraiserBySlug returns correct fundraiser", () => {
    const result = getFundraiserBySlug("la-wildfire-alerts-and-recovery");
    expect(result).toBeDefined();
    expect(result!.id).toBe("fund-1");
    expect(result!.title).toBe("LA Wildfire Alerts & Recovery Fund");
  });

  it("getFundraiserBySlug returns undefined for unknown slug", () => {
    expect(getFundraiserBySlug("nonexistent")).toBeUndefined();
  });

  it("getDonationsByFundraiserId returns correct donations", () => {
    const result = getDonationsByFundraiserId("fund-1");
    expect(result.length).toBeGreaterThan(0);
    for (const d of result) {
      expect(d.fundraiserId).toBe("fund-1");
    }
  });

  it("getDonationsByFundraiserId returns empty array for unknown id", () => {
    expect(getDonationsByFundraiserId("nonexistent")).toEqual([]);
  });

  it("getUserById returns correct user", () => {
    const result = getUserById("user-1");
    expect(result).toBeDefined();
    expect(result!.username).toBe("janahan");
  });

  it("getUserById returns undefined for unknown id", () => {
    expect(getUserById("nonexistent")).toBeUndefined();
  });

  it("getCommunityBySlug returns correct community", () => {
    const result = getCommunityBySlug("watch-duty");
    expect(result).toBeDefined();
    expect(result!.name).toBe("Watch Duty");
  });

  it("getCommunityBySlug returns undefined for unknown slug", () => {
    expect(getCommunityBySlug("nonexistent")).toBeUndefined();
  });

  it("getHighlightsByUserId returns highlights", () => {
    const result = getHighlightsByUserId("user-1");
    expect(result.length).toBeGreaterThan(0);
  });

  it("getLeaderboardByCommunitySlug returns entries", () => {
    const result = getLeaderboardByCommunitySlug("watch-duty");
    expect(result.length).toBeGreaterThan(0);
  });

  it("getActivitiesByUserId returns activities for known user", () => {
    const result = getActivitiesByUserId("user-1");
    expect(result.length).toBeGreaterThan(0);
    for (const a of result) {
      expect(a.userId).toBe("user-1");
    }
  });

  it("getActivitiesByUserId returns empty array for unknown user", () => {
    expect(getActivitiesByUserId("nonexistent")).toEqual([]);
  });

  it("getFundraiserById returns correct fundraiser", () => {
    const result = getFundraiserById("fund-1");
    expect(result).toBeDefined();
    expect(result!.slug).toBe("la-wildfire-alerts-and-recovery");
  });

  it("getFundraiserById returns undefined for unknown id", () => {
    expect(getFundraiserById("nonexistent")).toBeUndefined();
  });
});

describe("Activities data integrity", () => {
  it("all activities have required fields", () => {
    for (const a of activities) {
      expect(a.id).toBeTruthy();
      expect(a.userId).toBeTruthy();
      expect(a.user).toBeTruthy();
      expect(a.type).toBeTruthy();
      expect(["donation", "fundraiser_created", "fundraiser_update", "comment"]).toContain(a.type);
      expect(typeof a.likeCount).toBe("number");
      expect(typeof a.commentCount).toBe("number");
      expect(a.createdAt).toBeTruthy();
    }
  });

  it("all activity user IDs reference valid users", () => {
    for (const a of activities) {
      const user = getUserById(a.userId);
      expect(user).toBeDefined();
    }
  });

  it("donation activities have a donationAmount", () => {
    const donationActivities = activities.filter((a) => a.type === "donation");
    for (const a of donationActivities) {
      expect(a.donationAmount).not.toBeNull();
      expect(a.donationAmount).toBeGreaterThan(0);
    }
  });
});
