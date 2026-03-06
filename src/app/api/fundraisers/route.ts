import { NextRequest, NextResponse } from 'next/server';
import { fundraisers, donations, users } from '@/lib/data/mock';
import type { Fundraiser } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get('category');
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  let filtered = [...fundraisers];

  if (category) {
    filtered = filtered.filter((f) => f.category === category);
  }

  if (status) {
    filtered = filtered.filter((f) => f.status === status);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (f) =>
        f.title.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q)
    );
  }

  const total = filtered.length;
  const paginated = filtered.slice(offset, offset + limit);

  return NextResponse.json({
    data: paginated,
    meta: { total, limit, offset },
  });
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const { title, description, goalAmount, category, coverImageUrl, organizerId } = body as {
    title?: string;
    description?: string;
    goalAmount?: number;
    category?: string;
    coverImageUrl?: string;
    organizerId?: string;
  };

  if (!title || !description || !goalAmount || !category) {
    return NextResponse.json(
      { error: 'Missing required fields: title, description, goalAmount, category' },
      { status: 400 }
    );
  }

  const organizer = users.find((u) => u.id === (organizerId || 'user-1')) || users[0];

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const newFundraiser: Fundraiser = {
    id: `fund-${Date.now()}`,
    slug,
    organizerId: organizer.id,
    organizer,
    beneficiaryId: null,
    beneficiary: null,
    communityId: null,
    community: null,
    title,
    description,
    goalAmount,
    raisedAmount: 0,
    donationCount: 0,
    category,
    status: 'draft',
    isTaxDeductible: false,
    coverImageUrl: coverImageUrl || '/fundraisers/default-cover.jpg',
    images: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // In a real app, this would persist to a database.
  // For now we push to the in-memory array so subsequent reads see it.
  fundraisers.push(newFundraiser);

  return NextResponse.json({ data: newFundraiser }, { status: 201 });
}
