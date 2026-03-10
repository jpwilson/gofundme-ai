import type {
  User,
  Fundraiser,
  Donation,
  Community,
  Activity,
  LeaderboardEntry,
  Cause,
  Highlight,
  GivingPledge,
} from '../types';
import { IMAGES } from './images';

// ============================================================
// Users
// ============================================================

export const users: User[] = [
  {
    id: 'user-1',
    email: 'janahan@example.com',
    username: 'janahan',
    displayName: 'Janahan Sivaraman',
    avatarUrl: IMAGES.avatars.janahan,
    coverImageUrl: IMAGES.covers.janahan,
    bio: 'Passionate about community support and disaster relief. Proud organizer of several wildfire recovery fundraisers.',
    location: 'Los Angeles, CA',
    followerCount: 142,
    followingCount: 87,
    inspiredCount: 34,
    isOwnProfile: true,
    createdAt: '2023-06-15T08:00:00Z',
  },
  {
    id: 'user-2',
    email: 'tim@example.com',
    username: 'timcadogan',
    displayName: 'Tim Cadogan',
    avatarUrl: IMAGES.avatars.tim,
    coverImageUrl: IMAGES.covers.tim,
    bio: 'CEO of GoFundMe. Helping people help each other, one campaign at a time.',
    location: 'San Diego, CA',
    followerCount: 12400,
    followingCount: 530,
    inspiredCount: 4200,
    createdAt: '2020-01-10T12:00:00Z',
  },
  {
    id: 'user-3',
    email: 'arnie@example.com',
    username: 'arniekatz',
    displayName: 'Arnie Katz',
    avatarUrl: IMAGES.avatars.arnie,
    coverImageUrl: null,
    bio: 'Animal lover and wildlife advocate. Organizer of the LA Animal Rescue Fund.',
    location: 'Pasadena, CA',
    followerCount: 89,
    followingCount: 45,
    inspiredCount: 21,
    createdAt: '2024-02-20T10:30:00Z',
  },
];

// ============================================================
// Communities
// ============================================================

export const communities: Community[] = [
  {
    id: 'community-1',
    slug: 'watch-duty',
    name: 'Watch Duty',
    description:
      'Watch Duty is a nonprofit wildfire tracker providing real-time alerts and information to keep communities safe. We support fundraisers helping those affected by wildfires across the country.',
    bannerImageUrl: IMAGES.community.banner,
    iconUrl: IMAGES.community.icon,
    followerCount: 54300,
    totalRaised: 1_847_50000, // $18,475,000.00
    totalDonations: 98200,
    totalFundraisers: 312,
    createdAt: '2022-08-01T00:00:00Z',
  },
];

// ============================================================
// Fundraisers
// ============================================================

export const fundraisers: Fundraiser[] = [
  {
    id: 'fund-1',
    slug: 'la-wildfire-alerts-and-recovery',
    organizerId: 'user-1',
    organizer: users[0],
    beneficiaryId: null,
    beneficiary: null,
    communityId: 'community-1',
    community: {
      name: 'Watch Duty',
      slug: 'watch-duty',
      iconUrl: IMAGES.community.icon,
    },
    title: 'LA Wildfire Alerts & Recovery Fund',
    description:
      'The recent wildfires in Los Angeles have devastated families across our community. This fund supports real-time wildfire alert infrastructure through Watch Duty and provides direct aid to displaced families. Every dollar helps us keep our community informed and safe.\n\nFunds will be used for:\n- Maintaining and expanding real-time alert coverage\n- Emergency supplies for displaced families\n- Temporary housing assistance\n- Community rebuilding efforts',
    goalAmount: 300000, // $3,000.00
    raisedAmount: 210200, // $2,102.00
    donationCount: 14,
    category: 'emergency',
    status: 'active',
    isTaxDeductible: true,
    coverImageUrl: IMAGES.wildfire.cover,
    images: IMAGES.wildfire.gallery,
    createdAt: '2025-01-12T09:00:00Z',
    updatedAt: '2025-03-01T14:30:00Z',
  },
  {
    id: 'fund-2',
    slug: 'help-sarah-fight-cancer',
    organizerId: 'user-2',
    organizer: users[1],
    beneficiaryId: null,
    beneficiary: {
      name: 'Sarah Mitchell',
      avatarUrl: IMAGES.avatars.sarah,
      isVerified: true,
    },
    communityId: null,
    community: null,
    title: 'Help Sarah Fight Cancer',
    description:
      'Our dear friend Sarah was recently diagnosed with stage 3 breast cancer. She is a single mother of two young children and needs our support to cover treatment costs, childcare, and living expenses while she undergoes chemotherapy.\n\nSarah has always been the first to help others in need. Now it is her turn to receive that same kindness. Any contribution, no matter how small, makes a difference.',
    goalAmount: 5000000, // $50,000.00
    raisedAmount: 3245000, // $32,450.00
    donationCount: 187,
    category: 'medical',
    status: 'active',
    isTaxDeductible: false,
    coverImageUrl: IMAGES.medical.cover,
    images: IMAGES.medical.gallery,
    createdAt: '2025-02-01T12:00:00Z',
    updatedAt: '2025-03-04T08:15:00Z',
  },
  {
    id: 'fund-3',
    slug: 'la-animal-rescue-fund',
    organizerId: 'user-3',
    organizer: users[2],
    beneficiaryId: null,
    beneficiary: null,
    communityId: null,
    community: null,
    title: 'LA Animal Rescue Fund',
    description:
      'In the wake of the recent wildfires, hundreds of animals have been displaced, injured, or orphaned. Our rescue team has been working around the clock to find, treat, and shelter these animals.\n\nYour donations will go directly toward:\n- Veterinary care for injured animals\n- Emergency shelter and supplies\n- Foster family support\n- Reunification efforts with displaced owners',
    goalAmount: 1000000, // $10,000.00
    raisedAmount: 785000, // $7,850.00
    donationCount: 62,
    category: 'animals',
    status: 'active',
    isTaxDeductible: true,
    coverImageUrl: IMAGES.animals.cover,
    images: IMAGES.animals.gallery,
    createdAt: '2025-01-18T15:00:00Z',
    updatedAt: '2025-03-02T11:00:00Z',
  },
];

// ============================================================
// Donations
// ============================================================

export const donations: Donation[] = [
  // --- Wildfire fundraiser donations ---
  {
    id: 'don-1',
    fundraiserId: 'fund-1',
    donorId: 'user-2',
    donor: { displayName: 'Tim Cadogan', avatarUrl: IMAGES.avatars.tim },
    amount: 30000, // $300.00
    tipAmount: 4500,
    isAnonymous: false,
    displayName: 'Tim Cadogan',
    message: 'Stay strong, LA. We are all behind you.',
    createdAt: '2025-01-13T10:00:00Z',
  },
  {
    id: 'don-2',
    fundraiserId: 'fund-1',
    donorId: 'user-3',
    donor: { displayName: 'Arnie Katz', avatarUrl: IMAGES.avatars.arnie },
    amount: 15000, // $150.00
    tipAmount: 2250,
    isAnonymous: false,
    displayName: 'Arnie Katz',
    message: 'Anything to help the community recover.',
    createdAt: '2025-01-14T08:30:00Z',
  },
  {
    id: 'don-3',
    fundraiserId: 'fund-1',
    donorId: null,
    donor: null,
    amount: 10000, // $100.00
    tipAmount: 1500,
    isAnonymous: true,
    displayName: 'Anonymous',
    message: null,
    createdAt: '2025-01-15T14:20:00Z',
  },
  {
    id: 'don-4',
    fundraiserId: 'fund-1',
    donorId: null,
    donor: { displayName: 'Maria Gonzalez', avatarUrl: null },
    amount: 25000, // $250.00
    tipAmount: 3750,
    isAnonymous: false,
    displayName: 'Maria Gonzalez',
    message: 'My family was saved by the Watch Duty alerts. Thank you for this fund!',
    createdAt: '2025-01-20T09:45:00Z',
  },
  {
    id: 'don-5',
    fundraiserId: 'fund-1',
    donorId: null,
    donor: { displayName: 'David Park', avatarUrl: null },
    amount: 20000, // $200.00
    tipAmount: 3000,
    isAnonymous: false,
    displayName: 'David Park',
    message: 'Keep up the amazing work.',
    createdAt: '2025-02-02T16:00:00Z',
  },
  // --- Medical fundraiser donations ---
  {
    id: 'don-6',
    fundraiserId: 'fund-2',
    donorId: 'user-1',
    donor: { displayName: 'Janahan Sivaraman', avatarUrl: IMAGES.avatars.janahan },
    amount: 20000, // $200.00
    tipAmount: 3000,
    isAnonymous: false,
    displayName: 'Janahan Sivaraman',
    message: 'Sending love and strength to Sarah and her family.',
    createdAt: '2025-02-03T11:00:00Z',
  },
  {
    id: 'don-7',
    fundraiserId: 'fund-2',
    donorId: null,
    donor: { displayName: 'Rachel Kim', avatarUrl: null },
    amount: 50000, // $500.00
    tipAmount: 7500,
    isAnonymous: false,
    displayName: 'Rachel Kim',
    message: 'Sarah is one of the kindest people I know. Praying for a full recovery.',
    createdAt: '2025-02-05T19:30:00Z',
  },
  {
    id: 'don-8',
    fundraiserId: 'fund-2',
    donorId: null,
    donor: null,
    amount: 100000, // $1,000.00
    tipAmount: 15000,
    isAnonymous: true,
    displayName: 'Anonymous',
    message: 'You are not alone in this fight.',
    createdAt: '2025-02-10T07:00:00Z',
  },
  // --- Animal rescue donations ---
  {
    id: 'don-9',
    fundraiserId: 'fund-3',
    donorId: 'user-1',
    donor: { displayName: 'Janahan Sivaraman', avatarUrl: IMAGES.avatars.janahan },
    amount: 10000, // $100.00
    tipAmount: 1500,
    isAnonymous: false,
    displayName: 'Janahan Sivaraman',
    message: 'For the animals!',
    createdAt: '2025-01-19T13:00:00Z',
  },
  {
    id: 'don-10',
    fundraiserId: 'fund-3',
    donorId: 'user-2',
    donor: { displayName: 'Tim Cadogan', avatarUrl: IMAGES.avatars.tim },
    amount: 25000, // $250.00
    tipAmount: 3750,
    isAnonymous: false,
    displayName: 'Tim Cadogan',
    message: 'Great cause. These animals need us.',
    createdAt: '2025-01-22T17:45:00Z',
  },
  {
    id: 'don-11',
    fundraiserId: 'fund-3',
    donorId: null,
    donor: { displayName: 'Lisa Chen', avatarUrl: null },
    amount: 15000, // $150.00
    tipAmount: 2250,
    isAnonymous: false,
    displayName: 'Lisa Chen',
    message: null,
    createdAt: '2025-01-25T10:15:00Z',
  },
  {
    id: 'don-12',
    fundraiserId: 'fund-1',
    donorId: null,
    donor: { displayName: 'Kevin Nguyen', avatarUrl: null },
    amount: 10200, // $102.00
    tipAmount: 1530,
    isAnonymous: false,
    displayName: 'Kevin Nguyen',
    message: 'Every bit helps. Stay safe everyone.',
    createdAt: '2025-02-15T12:30:00Z',
  },
];

// ============================================================
// Activities
// ============================================================

export const activities: Activity[] = [
  {
    id: 'act-1',
    userId: 'user-1',
    user: users[0],
    type: 'fundraiser_created',
    fundraiserId: 'fund-1',
    fundraiser: {
      title: 'LA Wildfire Alerts & Recovery Fund',
      slug: 'la-wildfire-alerts-and-recovery',
      coverImageUrl: IMAGES.wildfire.cover,
      raisedAmount: 210200,
      goalAmount: 300000,
    },
    communityId: 'community-1',
    community: {
      name: 'Watch Duty',
      slug: 'watch-duty',
      iconUrl: IMAGES.community.icon,
    },
    content: 'Started a fundraiser for LA wildfire recovery through Watch Duty.',
    imageUrl: IMAGES.wildfire.cover,
    donationAmount: null,
    likeCount: 24,
    commentCount: 8,
    createdAt: '2025-01-12T09:00:00Z',
  },
  {
    id: 'act-2',
    userId: 'user-2',
    user: users[1],
    type: 'donation',
    fundraiserId: 'fund-1',
    fundraiser: {
      title: 'LA Wildfire Alerts & Recovery Fund',
      slug: 'la-wildfire-alerts-and-recovery',
      coverImageUrl: IMAGES.wildfire.cover,
      raisedAmount: 210200,
      goalAmount: 300000,
    },
    communityId: 'community-1',
    community: {
      name: 'Watch Duty',
      slug: 'watch-duty',
      iconUrl: IMAGES.community.icon,
    },
    content: null,
    imageUrl: null,
    donationAmount: 30000,
    likeCount: 56,
    commentCount: 3,
    createdAt: '2025-01-13T10:00:00Z',
  },
  {
    id: 'act-3',
    userId: 'user-2',
    user: users[1],
    type: 'fundraiser_created',
    fundraiserId: 'fund-2',
    fundraiser: {
      title: 'Help Sarah Fight Cancer',
      slug: 'help-sarah-fight-cancer',
      coverImageUrl: IMAGES.medical.cover,
      raisedAmount: 3245000,
      goalAmount: 5000000,
    },
    communityId: null,
    community: null,
    content: 'Organized a fundraiser to help Sarah Mitchell with her cancer treatment.',
    imageUrl: IMAGES.medical.cover,
    donationAmount: null,
    likeCount: 112,
    commentCount: 34,
    createdAt: '2025-02-01T12:00:00Z',
  },
  {
    id: 'act-4',
    userId: 'user-3',
    user: users[2],
    type: 'fundraiser_created',
    fundraiserId: 'fund-3',
    fundraiser: {
      title: 'LA Animal Rescue Fund',
      slug: 'la-animal-rescue-fund',
      coverImageUrl: IMAGES.animals.cover,
      raisedAmount: 785000,
      goalAmount: 1000000,
    },
    communityId: null,
    community: null,
    content: 'Launched a fund to rescue and care for animals displaced by the LA wildfires.',
    imageUrl: IMAGES.animals.cover,
    donationAmount: null,
    likeCount: 45,
    commentCount: 12,
    createdAt: '2025-01-18T15:00:00Z',
  },
  {
    id: 'act-5',
    userId: 'user-1',
    user: users[0],
    type: 'fundraiser_update',
    fundraiserId: 'fund-1',
    fundraiser: {
      title: 'LA Wildfire Alerts & Recovery Fund',
      slug: 'la-wildfire-alerts-and-recovery',
      coverImageUrl: IMAGES.wildfire.cover,
      raisedAmount: 210200,
      goalAmount: 300000,
    },
    communityId: 'community-1',
    community: {
      name: 'Watch Duty',
      slug: 'watch-duty',
      iconUrl: IMAGES.community.icon,
    },
    content:
      'Update: We have crossed $2,000 raised! Thank you all for your incredible generosity. The Watch Duty team has been able to expand alert coverage to three new neighborhoods. Keep sharing!',
    imageUrl: null,
    donationAmount: null,
    likeCount: 38,
    commentCount: 14,
    createdAt: '2025-02-28T18:00:00Z',
  },
  {
    id: 'act-6',
    userId: 'user-1',
    user: users[0],
    type: 'donation',
    fundraiserId: 'fund-3',
    fundraiser: {
      title: 'LA Animal Rescue Fund',
      slug: 'la-animal-rescue-fund',
      coverImageUrl: IMAGES.animals.cover,
      raisedAmount: 785000,
      goalAmount: 1000000,
    },
    communityId: null,
    community: null,
    content: null,
    imageUrl: null,
    donationAmount: 10000,
    likeCount: 9,
    commentCount: 1,
    createdAt: '2025-01-19T13:00:00Z',
  },
  {
    id: 'act-7',
    userId: 'user-3',
    user: users[2],
    type: 'comment',
    fundraiserId: 'fund-1',
    fundraiser: {
      title: 'LA Wildfire Alerts & Recovery Fund',
      slug: 'la-wildfire-alerts-and-recovery',
      coverImageUrl: IMAGES.wildfire.cover,
      raisedAmount: 210200,
      goalAmount: 300000,
    },
    communityId: 'community-1',
    community: {
      name: 'Watch Duty',
      slug: 'watch-duty',
      iconUrl: IMAGES.community.icon,
    },
    content:
      'This is such an important cause. Watch Duty alerts saved my neighbor\'s home last week. Everyone in the LA area should support this.',
    imageUrl: null,
    donationAmount: null,
    likeCount: 17,
    commentCount: 5,
    createdAt: '2025-02-20T09:30:00Z',
  },
];

// ============================================================
// Leaderboard Entries (for Watch Duty community)
// ============================================================

export const leaderboardEntries: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: 'user-ext-1',
    user: { displayName: 'Malibu Fire Relief', avatarUrl: null },
    fundraiserId: 'fund-ext-1',
    fundraiserTitle: 'Malibu Wildfire Family Assistance',
    fundraiserSlug: 'malibu-wildfire-family-assistance',
    raisedAmount: 4520000, // $45,200.00
  },
  {
    rank: 2,
    userId: 'user-ext-2',
    user: { displayName: 'Pacific Palisades United', avatarUrl: null },
    fundraiserId: 'fund-ext-2',
    fundraiserTitle: 'Palisades Community Rebuild',
    fundraiserSlug: 'palisades-community-rebuild',
    raisedAmount: 3870000, // $38,700.00
  },
  {
    rank: 3,
    userId: 'user-ext-3',
    user: { displayName: 'Altadena Strong', avatarUrl: null },
    fundraiserId: 'fund-ext-3',
    fundraiserTitle: 'Altadena Fire Recovery Fund',
    fundraiserSlug: 'altadena-fire-recovery-fund',
    raisedAmount: 2910000, // $29,100.00
  },
  {
    rank: 4,
    userId: 'user-1',
    user: { displayName: 'Janahan Sivaraman', avatarUrl: IMAGES.avatars.janahan },
    fundraiserId: 'fund-1',
    fundraiserTitle: 'LA Wildfire Alerts & Recovery Fund',
    fundraiserSlug: 'la-wildfire-alerts-and-recovery',
    raisedAmount: 210200, // $2,102.00
    isCurrentFundraiser: true,
  },
  {
    rank: 5,
    userId: 'user-ext-4',
    user: { displayName: 'Topanga Canyon Aid', avatarUrl: null },
    fundraiserId: 'fund-ext-4',
    fundraiserTitle: 'Topanga Families Relief Fund',
    fundraiserSlug: 'topanga-families-relief-fund',
    raisedAmount: 185000, // $1,850.00
  },
];

// ============================================================
// Causes
// ============================================================

export const causes: Cause[] = [
  { type: 'animals', label: 'Animals', iconBgColor: '#FDE68A' },
  { type: 'arts_culture', label: 'Arts & Culture', iconBgColor: '#C4B5FD' },
  { type: 'environment', label: 'Environment', iconBgColor: '#6EE7B7' },
  { type: 'education', label: 'Education', iconBgColor: '#93C5FD' },
  { type: 'medical', label: 'Medical', iconBgColor: '#FCA5A5' },
  { type: 'emergency', label: 'Emergency', iconBgColor: '#FDBA74' },
  { type: 'community', label: 'Community', iconBgColor: '#A5B4FC' },
  { type: 'faith', label: 'Faith', iconBgColor: '#D8B4FE' },
  { type: 'sports', label: 'Sports', iconBgColor: '#86EFAC' },
  { type: 'business', label: 'Business', iconBgColor: '#67E8F9' },
];

// ============================================================
// Highlights (Janahan's profile)
// ============================================================

export const highlights: Highlight[] = [
  {
    id: 'hl-1',
    fundraiserId: 'fund-1',
    fundraiser: {
      title: 'LA Wildfire Alerts & Recovery Fund',
      slug: 'la-wildfire-alerts-and-recovery',
      coverImageUrl: IMAGES.wildfire.cover,
      raisedAmount: 210200,
      goalAmount: 300000,
      donationCount: 14,
    },
    displayOrder: 1,
  },
  {
    id: 'hl-2',
    fundraiserId: 'fund-3',
    fundraiser: {
      title: 'LA Animal Rescue Fund',
      slug: 'la-animal-rescue-fund',
      coverImageUrl: IMAGES.animals.cover,
      raisedAmount: 785000,
      goalAmount: 1000000,
      donationCount: 62,
    },
    displayOrder: 2,
  },
];

// ============================================================
// Giving Pledges (AI Giving Agent)
// ============================================================

export const givingPledges: GivingPledge[] = [
  {
    id: 'pledge-1',
    userId: 'user-1',
    monthlyAmount: 5000, // $50.00
    causes: ['emergency', 'animals', 'environment'],
    geographicPreference: 'local',
    allocationStrategy: 'ai_optimized',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
  },
];

// ============================================================
// Helper lookup functions
// ============================================================

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function getFundraiserById(id: string): Fundraiser | undefined {
  return fundraisers.find((f) => f.id === id);
}

export function getFundraiserBySlug(slug: string): Fundraiser | undefined {
  return fundraisers.find((f) => f.slug === slug);
}

export function getDonationsByFundraiserId(fundraiserId: string): Donation[] {
  return donations.filter((d) => d.fundraiserId === fundraiserId);
}

export function getActivitiesByUserId(userId: string): Activity[] {
  return activities.filter((a) => a.userId === userId);
}

export function getCommunityBySlug(slug: string): Community | undefined {
  return communities.find((c) => c.slug === slug);
}

export function getLeaderboardByCommunitySlug(
  _communitySlug: string
): LeaderboardEntry[] {
  // In a real app this would filter by community; we only have one for now
  return leaderboardEntries;
}

export function getHighlightsByUserId(_userId: string): Highlight[] {
  // In a real app this would filter; returning all highlights for now
  return highlights;
}
