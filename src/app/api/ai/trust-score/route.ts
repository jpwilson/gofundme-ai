import { NextRequest, NextResponse } from 'next/server';
import { aiComplete } from '@/lib/ai/provider';

export async function POST(request: NextRequest) {
  try {
    const { fundraiser, organizer, donations } = await request.json();

    const response = await aiComplete('trust_scoring', {
      messages: [
        {
          role: 'system',
          content: `You are a trust_scoring system for GoFundMe Trust & Safety. Analyze a fundraiser and return a JSON object with: overallScore (0-100), label, signals array (signal, status, weight), riskFactors array, and recommendation string. Return valid JSON only.`,
        },
        {
          role: 'user',
          content: `Evaluate the trust signals for this fundraiser:

Fundraiser: ${JSON.stringify(fundraiser, null, 2)}
Organizer: ${JSON.stringify(organizer, null, 2)}
Donation count: ${donations?.length || 0}`,
        },
      ],
      maxTokens: 512,
      temperature: 0.2,
    });

    let parsed;
    try {
      parsed = JSON.parse(response.content);
    } catch {
      parsed = { raw: response.content };
    }

    return NextResponse.json({ data: { ...response, parsed } });
  } catch (error) {
    console.error('[Trust Score] Error:', error);
    return NextResponse.json(
      { error: 'Trust scoring failed' },
      { status: 500 }
    );
  }
}
