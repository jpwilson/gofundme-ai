import { NextRequest, NextResponse } from 'next/server';
import { aiComplete } from '@/lib/ai/provider';

export async function POST(request: NextRequest) {
  try {
    const { communityName, activities, stats } = await request.json();

    const response = await aiComplete('community_digest', {
      messages: [
        {
          role: 'system',
          content: `You are a community_digest generator for GoFundMe communities. Create an engaging, well-formatted weekly digest summarizing community activity. Include highlights, top contributors, trending causes, and community health. Use markdown formatting.`,
        },
        {
          role: 'user',
          content: `Generate a weekly digest for the "${communityName}" community.

Recent activities:
${JSON.stringify(activities, null, 2)}

Community stats:
${JSON.stringify(stats, null, 2)}`,
        },
      ],
      maxTokens: 1024,
      temperature: 0.7,
    });

    return NextResponse.json({ data: response });
  } catch (error) {
    console.error('[Community Digest] Error:', error);
    return NextResponse.json(
      { error: 'Community digest generation failed' },
      { status: 500 }
    );
  }
}
