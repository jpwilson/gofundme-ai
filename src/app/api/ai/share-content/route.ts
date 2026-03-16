import { NextRequest, NextResponse } from 'next/server';
import { aiComplete } from '@/lib/ai/provider';
import { parseAIJSON } from '@/lib/ai/parseJSON';

export async function POST(request: NextRequest) {
  try {
    const { title, description, goalAmount, raisedAmount, organizer, url } = await request.json();

    const percentage = Math.round((raisedAmount / goalAmount) * 100);

    const response = await aiComplete('share_content', {
      messages: [
        {
          role: 'system',
          content: `You are a fundraising share content expert for GoFundMe. Generate compelling share messages for this campaign. Each message should be emotionally authentic (not salesy), include a call-to-action, and reference specific campaign details. Return valid JSON only.`,
        },
        {
          role: 'user',
          content: `Generate share messages for this GoFundMe campaign:

Campaign: ${title}
Story: ${(description || '').slice(0, 500)}
Goal: $${(goalAmount / 100).toFixed(0)}
Raised: $${(raisedAmount / 100).toFixed(0)} (${percentage}%)
Organizer: ${organizer}

Generate for each platform in JSON:
{
  "tweet": "under 280 chars, include campaign URL placeholder {url}",
  "instagram": "with emojis and hashtags",
  "email_subject": "compelling subject line",
  "email_body": "2-3 paragraph email to friends/family",
  "sms": "short personal text message"
}`,
        },
      ],
      maxTokens: 1024,
      temperature: 0.7,
    });

    let parsed;
    try {
      parsed = parseAIJSON(response.content);
    } catch {
      parsed = { raw: response.content };
    }

    return NextResponse.json({ data: { ...response, parsed } });
  } catch (error) {
    console.error('[Share Content] Error:', error);
    return NextResponse.json({ error: 'Share content generation failed' }, { status: 500 });
  }
}
