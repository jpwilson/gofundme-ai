import { NextRequest, NextResponse } from 'next/server';
import { aiComplete } from '@/lib/ai/provider';
import { getMetrics } from '@/lib/observability/langfuse';

// POST /api/ai - Execute an AI feature
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { feature, messages, maxTokens, temperature } = body;

    if (!feature || !messages) {
      return NextResponse.json(
        { error: 'Missing required fields: feature, messages' },
        { status: 400 }
      );
    }

    const response = await aiComplete(feature, {
      messages,
      maxTokens,
      temperature,
    });

    return NextResponse.json({ data: response });
  } catch (error) {
    console.error('[AI API] Error:', error);
    return NextResponse.json(
      { error: 'AI request failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET /api/ai - Get AI metrics for analytics dashboard
export async function GET() {
  const metrics = getMetrics();
  return NextResponse.json({ data: metrics });
}
