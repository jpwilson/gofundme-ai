import { NextRequest, NextResponse } from 'next/server';
import { fundraisers } from '@/lib/data/mock';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get('q');
  const category = searchParams.get('category');
  const sort = searchParams.get('sort') || 'relevance';

  if (!q && !category) {
    return NextResponse.json(
      { error: 'At least one of query (q) or category is required' },
      { status: 400 }
    );
  }

  let results = [...fundraisers];

  if (q) {
    const query = q.toLowerCase();
    results = results.filter(
      (f) =>
        f.title.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query) ||
        f.organizer.displayName.toLowerCase().includes(query)
    );
  }

  if (category) {
    results = results.filter((f) => f.category === category);
  }

  switch (sort) {
    case 'newest':
      results.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case 'most_funded':
      results.sort((a, b) => b.raisedAmount - a.raisedAmount);
      break;
    case 'closest_to_goal':
      results.sort(
        (a, b) =>
          b.raisedAmount / b.goalAmount - a.raisedAmount / a.goalAmount
      );
      break;
    case 'relevance':
    default:
      // Already in mock order which serves as relevance for now
      break;
  }

  return NextResponse.json({ data: results });
}
