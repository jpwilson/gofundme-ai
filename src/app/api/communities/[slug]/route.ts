import { NextRequest, NextResponse } from 'next/server';
import { getCommunityBySlug } from '@/lib/data/mock';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const community = getCommunityBySlug(slug);

  if (!community) {
    return NextResponse.json(
      { error: 'Community not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: community });
}
