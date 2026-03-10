import { NextRequest, NextResponse } from 'next/server';
import { aiComplete } from '@/lib/ai/provider';

export async function POST(request: NextRequest) {
  try {
    const { userProfile, givingHistory, availableFundraisers } = await request.json();

    const response = await aiComplete('cause_matching', {
      messages: [
        {
          role: 'system',
          content: `You are a cause_matching engine for GoFundMe. Match donors to fundraisers they'd care about based on their giving history, interests, and location. Return a JSON array of matches with: fundraiserSlug, title, matchScore (0-100), and reasons array. Return valid JSON only.`,
        },
        {
          role: 'user',
          content: `Match this donor to the best fundraisers:

Donor profile:
${JSON.stringify(userProfile, null, 2)}

Giving history:
${JSON.stringify(givingHistory, null, 2)}

Available fundraisers:
${JSON.stringify(availableFundraisers, null, 2)}`,
        },
      ],
      maxTokens: 1024,
      temperature: 0.4,
    });

    let parsed;
    try {
      parsed = JSON.parse(response.content);
    } catch {
      parsed = { raw: response.content };
    }

    return NextResponse.json({ data: { ...response, parsed } });
  } catch (error) {
    console.error('[Cause Matching] Error:', error);
    return NextResponse.json(
      { error: 'Cause matching failed' },
      { status: 500 }
    );
  }
}
