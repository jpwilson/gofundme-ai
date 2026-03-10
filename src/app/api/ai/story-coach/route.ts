import { NextRequest, NextResponse } from 'next/server';
import { aiComplete } from '@/lib/ai/provider';

export async function POST(request: NextRequest) {
  try {
    const { title, description, category, goalAmount, raisedAmount } = await request.json();

    const response = await aiComplete('story_coach', {
      messages: [
        {
          role: 'system',
          content: `You are a story_coach — an expert fundraising consultant for GoFundMe. Analyze the fundraiser description and provide specific, actionable suggestions to improve the story and increase donations. Focus on emotional connection, clarity, specificity, and urgency.`,
        },
        {
          role: 'user',
          content: `Please analyze this fundraiser and suggest improvements:

Title: ${title}
Category: ${category}
Goal: $${(goalAmount / 100).toFixed(2)}
Raised so far: $${(raisedAmount / 100).toFixed(2)}

Description:
${description}`,
        },
      ],
      maxTokens: 1024,
      temperature: 0.7,
    });

    return NextResponse.json({ data: response });
  } catch (error) {
    console.error('[Story Coach] Error:', error);
    return NextResponse.json(
      { error: 'Story coach request failed' },
      { status: 500 }
    );
  }
}
