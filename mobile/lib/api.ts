import Constants from "expo-constants";
import type {
  Fundraiser,
  Community,
  User,
  Activity,
  Donation,
} from "./types";

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl || "http://localhost:3000/api";

/**
 * Generic fetch wrapper that handles JSON parsing and errors.
 */
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "Unknown error");
    throw new Error(
      `API Error ${response.status}: ${response.statusText} - ${errorBody}`
    );
  }

  return response.json() as Promise<T>;
}

// ---- Fundraisers ----

export async function getFundraisers(params?: {
  category?: string;
  limit?: number;
  offset?: number;
}): Promise<Fundraiser[]> {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set("category", params.category);
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.offset) searchParams.set("offset", params.offset.toString());
  const query = searchParams.toString();
  return apiFetch<Fundraiser[]>(`/fundraisers${query ? `?${query}` : ""}`);
}

export async function getFundraiserBySlug(
  slug: string
): Promise<Fundraiser> {
  return apiFetch<Fundraiser>(`/fundraisers/${slug}`);
}

export async function getFundraiserDonations(
  fundraiserId: string
): Promise<Donation[]> {
  return apiFetch<Donation[]>(`/fundraisers/${fundraiserId}/donations`);
}

// ---- Communities ----

export async function getCommunities(): Promise<Community[]> {
  return apiFetch<Community[]>("/communities");
}

export async function getCommunityBySlug(
  slug: string
): Promise<Community> {
  return apiFetch<Community>(`/communities/${slug}`);
}

// ---- Users ----

export async function getUserByUsername(
  username: string
): Promise<User> {
  return apiFetch<User>(`/users/${username}`);
}

// ---- Activities ----

export async function getActivities(params?: {
  userId?: string;
  limit?: number;
}): Promise<Activity[]> {
  const searchParams = new URLSearchParams();
  if (params?.userId) searchParams.set("userId", params.userId);
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  const query = searchParams.toString();
  return apiFetch<Activity[]>(`/activities${query ? `?${query}` : ""}`);
}

// ---- Donations ----

export async function createDonation(data: {
  fundraiserId: string;
  amount: number;
  displayName: string;
  message?: string;
  isAnonymous?: boolean;
}): Promise<Donation> {
  return apiFetch<Donation>("/donations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
