import { NextRequest, NextResponse } from 'next/server';
import { users, getHighlightsByUserId } from '@/lib/data/mock';

export async function GET(
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

  const userHighlights = getHighlightsByUserId(user.id);

  return NextResponse.json({ data: userHighlights });
}
