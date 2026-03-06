import { NextRequest, NextResponse } from 'next/server';
import { getFundraiserBySlug } from '@/lib/data/mock';

export async function GET(
  _request: NextRequest,
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

  return NextResponse.json({ data: fundraiser });
}
