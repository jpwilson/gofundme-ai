// ============================================================
// GoFundMe Clone - TypeScript Type Definitions (Mobile)
// Mirrors the web app's types from src/lib/types/index.ts
// ============================================================

// --- User ---
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  coverImageUrl: string | null;
  bio: string | null;
  location: string | null;
  followerCount: number;
  followingCount: number;
  inspiredCount: number;
  isFollowing?: boolean;
  isOwnProfile?: boolean;
  createdAt: string;
}

// --- Fundraiser ---
export interface Fundraiser {
  id: string;
  slug: string;
  organizerId: string;
  organizer: User;
  beneficiaryId: string | null;
  beneficiary: {
    name: string;
    avatarUrl: string | null;
    isVerified: boolean;
  } | null;
  communityId: string | null;
  community: {
    name: string;
    slug: string;
    iconUrl: string | null;
  } | null;
  title: string;
  description: string;
  goalAmount: number; // cents
  raisedAmount: number; // cents
  donationCount: number;
  category: string;
  status: "draft" | "active" | "completed" | "paused";
  isTaxDeductible: boolean;
  coverImageUrl: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

// --- Donation ---
export interface Donation {
  id: string;
  fundraiserId: string;
  donorId: string | null;
  donor: {
    displayName: string;
    avatarUrl: string | null;
  } | null;
  amount: number; // cents
  tipAmount: number;
  isAnonymous: boolean;
  displayName: string;
  message: string | null;
  createdAt: string;
}

// --- Community ---
export interface Community {
  id: string;
  slug: string;
  name: string;
  description: string;
  bannerImageUrl: string | null;
  iconUrl: string | null;
  followerCount: number;
  totalRaised: number; // cents
  totalDonations: number;
  totalFundraisers: number;
  isFollowing?: boolean;
  createdAt: string;
}

// --- Activity ---
export interface Activity {
  id: string;
  userId: string;
  user: User;
  type: "donation" | "fundraiser_created" | "fundraiser_update" | "comment";
  fundraiserId: string | null;
  fundraiser: Pick<
    Fundraiser,
    "title" | "slug" | "coverImageUrl" | "raisedAmount" | "goalAmount"
  > | null;
  communityId: string | null;
  community: Pick<Community, "name" | "slug" | "iconUrl"> | null;
  content: string | null;
  imageUrl: string | null;
  donationAmount: number | null; // cents, for donation type
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
  createdAt: string;
}

// --- LeaderboardEntry ---
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  user: Pick<User, "displayName" | "avatarUrl">;
  fundraiserId: string;
  fundraiserTitle: string;
  fundraiserSlug: string;
  raisedAmount: number; // cents
  isCurrentFundraiser?: boolean;
}

// --- Cause ---
export type CauseType =
  | "animals"
  | "arts_culture"
  | "environment"
  | "education"
  | "medical"
  | "emergency"
  | "community"
  | "faith"
  | "sports"
  | "business";

export interface Cause {
  type: CauseType;
  label: string;
  iconBgColor: string;
}

// --- Highlight ---
export interface Highlight {
  id: string;
  fundraiserId: string;
  fundraiser: Pick<
    Fundraiser,
    | "title"
    | "slug"
    | "coverImageUrl"
    | "raisedAmount"
    | "goalAmount"
    | "donationCount"
  >;
  displayOrder: number;
}

// --- GivingPledge ---
export interface GivingPledge {
  id: string;
  userId: string;
  monthlyAmount: number; // cents
  causes: CauseType[];
  geographicPreference: "local" | "state" | "country" | "global";
  allocationStrategy: "even_split" | "impact_weighted" | "ai_optimized";
  isActive: boolean;
  createdAt: string;
}
