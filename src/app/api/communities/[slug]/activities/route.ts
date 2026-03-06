import { NextRequest, NextResponse } from 'next/server';
import { getCommunityBySlug, activities } from '@/lib/data/mock';

export async function GET(
  request: NextRequest,
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

  const sort = request.nextUrl.searchParams.get('sort') || 'latest';

  let communityActivities = activities.filter(
    (a) => a.communityId === community.id
  );

  if (sort === 'popular') {
    communityActivities = [...communityActivities].sort(
      (a, b) => b.likeCount - a.likeCount
    );
  } else {
    communityActivities = [...communityActivities].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  return NextResponse.json({ data: communityActivities });
}
