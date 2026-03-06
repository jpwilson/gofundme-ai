import { NextRequest, NextResponse } from 'next/server';
import { users } from '@/lib/data/mock';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const user = users.find((u) => u.username === username);

  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  // In a real app, this would persist the follow relationship.
  user.followerCount += 1;
  user.isFollowing = true;

  return NextResponse.json({
    data: { following: true, followerCount: user.followerCount },
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const user = users.find((u) => u.username === username);

  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  // In a real app, this would remove the follow relationship.
  user.followerCount = Math.max(0, user.followerCount - 1);
  user.isFollowing = false;

  return NextResponse.json({
    data: { following: false, followerCount: user.followerCount },
  });
}
