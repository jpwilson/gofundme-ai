import type {
  Fundraiser,
  Donation,
  Community,
  User,
  Activity,
  LeaderboardEntry,
  Highlight,
} from '@/lib/types';

// ---------------------------------------------------------------------------
// Base configuration
// ---------------------------------------------------------------------------

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface ApiResponse<T> {
  data: T;
  meta?: { total: number; limit: number; offset: number };
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, (body as { error?: string }).error || res.statusText);
  }

  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// ---------------------------------------------------------------------------
// Fundraisers
// ---------------------------------------------------------------------------

export interface ListFundraisersParams {
  category?: string;
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export async function listFundraisers(
  params?: ListFundraisersParams
): Promise<{ data: Fundraiser[]; meta: { total: number; limit: number; offset: number } }> {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.status) query.set('status', params.status);
  if (params?.search) query.set('search', params.search);
  if (params?.limit !== undefined) query.set('limit', String(params.limit));
  if (params?.offset !== undefined) query.set('offset', String(params.offset));

  const qs = query.toString();
  return apiFetch<{ data: Fundraiser[]; meta: { total: number; limit: number; offset: number } }>(
    `/api/fundraisers${qs ? `?${qs}` : ''}`
  );
}

export interface CreateFundraiserInput {
  title: string;
  description: string;
  goalAmount: number;
  category: string;
  coverImageUrl?: string;
  organizerId?: string;
}

export async function createFundraiser(input: CreateFundraiserInput): Promise<Fundraiser> {
  const res = await apiFetch<ApiResponse<Fundraiser>>('/api/fundraisers', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return res.data;
}

export async function getFundraiser(slug: string): Promise<Fundraiser> {
  const res = await apiFetch<ApiResponse<Fundraiser>>(`/api/fundraisers/${encodeURIComponent(slug)}`);
  return res.data;
}

// ---------------------------------------------------------------------------
// Donations
// ---------------------------------------------------------------------------

export async function getDonations(
  slug: string,
  sort?: 'recent' | 'top'
): Promise<Donation[]> {
  const qs = sort ? `?sort=${sort}` : '';
  const res = await apiFetch<ApiResponse<Donation[]>>(
    `/api/fundraisers/${encodeURIComponent(slug)}/donations${qs}`
  );
  return res.data;
}

export interface CreateDonationInput {
  amount: number;
  tipAmount?: number;
  isAnonymous?: boolean;
  displayName?: string;
  message?: string;
}

export async function createDonation(
  slug: string,
  input: CreateDonationInput
): Promise<Donation> {
  const res = await apiFetch<ApiResponse<Donation>>(
    `/api/fundraisers/${encodeURIComponent(slug)}/donations`,
    { method: 'POST', body: JSON.stringify(input) }
  );
  return res.data;
}

// ---------------------------------------------------------------------------
// Communities
// ---------------------------------------------------------------------------

export async function listCommunities(): Promise<Community[]> {
  const res = await apiFetch<ApiResponse<Community[]>>('/api/communities');
  return res.data;
}

export async function getCommunity(slug: string): Promise<Community> {
  const res = await apiFetch<ApiResponse<Community>>(
    `/api/communities/${encodeURIComponent(slug)}`
  );
  return res.data;
}

export async function getCommunityLeaderboard(slug: string): Promise<LeaderboardEntry[]> {
  const res = await apiFetch<ApiResponse<LeaderboardEntry[]>>(
    `/api/communities/${encodeURIComponent(slug)}/leaderboard`
  );
  return res.data;
}

export async function getCommunityActivities(
  slug: string,
  sort?: 'latest' | 'popular'
): Promise<Activity[]> {
  const qs = sort ? `?sort=${sort}` : '';
  const res = await apiFetch<ApiResponse<Activity[]>>(
    `/api/communities/${encodeURIComponent(slug)}/activities${qs}`
  );
  return res.data;
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export async function getUser(username: string): Promise<User> {
  const res = await apiFetch<ApiResponse<User>>(
    `/api/users/${encodeURIComponent(username)}`
  );
  return res.data;
}

export async function getUserActivities(username: string): Promise<Activity[]> {
  const res = await apiFetch<ApiResponse<Activity[]>>(
    `/api/users/${encodeURIComponent(username)}/activities`
  );
  return res.data;
}

export async function getUserHighlights(username: string): Promise<Highlight[]> {
  const res = await apiFetch<ApiResponse<Highlight[]>>(
    `/api/users/${encodeURIComponent(username)}/highlights`
  );
  return res.data;
}

export async function followUser(
  username: string
): Promise<{ following: boolean; followerCount: number }> {
  const res = await apiFetch<ApiResponse<{ following: boolean; followerCount: number }>>(
    `/api/users/${encodeURIComponent(username)}/follow`,
    { method: 'POST' }
  );
  return res.data;
}

export async function unfollowUser(
  username: string
): Promise<{ following: boolean; followerCount: number }> {
  const res = await apiFetch<ApiResponse<{ following: boolean; followerCount: number }>>(
    `/api/users/${encodeURIComponent(username)}/follow`,
    { method: 'DELETE' }
  );
  return res.data;
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export interface SearchParams {
  q?: string;
  category?: string;
  sort?: 'relevance' | 'newest' | 'most_funded' | 'closest_to_goal';
}

export async function searchFundraisers(params: SearchParams): Promise<Fundraiser[]> {
  const query = new URLSearchParams();
  if (params.q) query.set('q', params.q);
  if (params.category) query.set('category', params.category);
  if (params.sort) query.set('sort', params.sort);

  const qs = query.toString();
  const res = await apiFetch<ApiResponse<Fundraiser[]>>(`/api/search?${qs}`);
  return res.data;
}
