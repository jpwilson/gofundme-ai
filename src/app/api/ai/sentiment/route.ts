import { NextRequest, NextResponse } from 'next/server';
import { aiComplete } from '@/lib/ai/provider';
import { parseAIJSON } from '@/lib/ai/parseJSON';

export async function POST(request: NextRequest) {
  try {
    const { messages: donorMessages } = await request.json();

    const response = await aiComplete('sentiment_analysis', {
      messages: [
        {
          role: 'system',
          content: `You are a sentiment_analysis engine for GoFundMe. Analyze donor messages and return a JSON object with: overall sentiment score (0-1), label, summary, themes array (theme, count, sentiment), and highlights array (message, sentiment, impact). Return valid JSON only.`,
        },
        {
          role: 'user',
          content: `Analyze the sentiment of these donor messages:\n\n${donorMessages
            .map((m: string, i: number) => `${i + 1}. "${m}"`)
            .join('\n')}`,
        },
      ],
      maxTokens: 1024,
      temperature: 0.3,
    });

    // Try to parse JSON from response, fall back to raw content
    let parsed;
    try {
      parsed = parseAIJSON(response.content);
    } catch {
      parsed = { raw: response.content };
    }

    return NextResponse.json({
      data: {
        ...response,
        parsed,
      },
    });
  } catch (error) {
    console.error('[Sentiment] Error:', error);
    return NextResponse.json(
      { error: 'Sentiment analysis failed' },
      { status: 500 }
    );
  }
}
