import { NextRequest, NextResponse } from 'next/server';
import {
  getFundraiserBySlug,
  getDonationsByFundraiserId,
  donations as allDonations,
  fundraisers,
} from '@/lib/data/mock';
import type { Donation } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const fundraiser = getFundraiserBySlug(slug);

  if (!fundraiser) {
    return NextResponse.json(
      { error: 'Fundraiser not found' },
      { status: 404 }
    );
  }

  const sort = request.nextUrl.searchParams.get('sort') || 'recent';
  let result = getDonationsByFundraiserId(fundraiser.id);

  if (sort === 'top') {
    result = [...result].sort((a, b) => b.amount - a.amount);
  } else {
    result = [...result].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  return NextResponse.json({ data: result });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const fundraiser = getFundraiserBySlug(slug);

  if (!fundraiser) {
    return NextResponse.json(
      { error: 'Fundraiser not found' },
      { status: 404 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const { amount, tipAmount, isAnonymous, displayName, message } = body as {
    amount?: number;
    tipAmount?: number;
    isAnonymous?: boolean;
    displayName?: string;
    message?: string;
  };

  if (!amount || amount <= 0) {
    return NextResponse.json(
      { error: 'A positive donation amount is required' },
      { status: 400 }
    );
  }

  const newDonation: Donation = {
    id: `don-${Date.now()}`,
    fundraiserId: fundraiser.id,
    donorId: null,
    donor: isAnonymous
      ? null
      : { displayName: displayName || 'Generous Donor', avatarUrl: null },
    amount,
    tipAmount: tipAmount || 0,
    isAnonymous: isAnonymous || false,
    displayName: isAnonymous ? 'Anonymous' : (displayName || 'Generous Donor'),
    message: message || null,
    createdAt: new Date().toISOString(),
  };

  // Update in-memory data
  allDonations.push(newDonation);
  fundraiser.raisedAmount += amount;
  fundraiser.donationCount += 1;

  return NextResponse.json({ data: newDonation }, { status: 201 });
}
