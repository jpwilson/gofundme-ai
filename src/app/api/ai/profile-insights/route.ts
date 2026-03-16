import { NextRequest, NextResponse } from 'next/server';
import { aiComplete } from '@/lib/ai/provider';
import { parseAIJSON } from '@/lib/ai/parseJSON';

export async function POST(request: NextRequest) {
  try {
    const { feature: insightType, user, activities, donations } = await request.json();

    const featureMap: Record<string, string> = {
      narrative: 'impact_narrative',
      insights: 'giving_insights',
      recommendations: 'fundraiser_recommendations',
    };

    const aiFeature = featureMap[insightType] || 'impact_narrative';

    const systemPrompts: Record<string, string> = {
      impact_narrative: `You are an impact_narrative writer for GoFundMe profiles. Create a compelling, personalized narrative about this donor's giving journey. Use markdown formatting. Be warm and specific.`,
      giving_insights: `You are a giving_insights analyst for GoFundMe. Analyze this donor's giving patterns and return a JSON object with: givingPersonality (type, description, traits array), patterns (averageDonation, preferredTime, preferredDay, messageRate, shareRate), and suggestions array. Return valid JSON only.`,
      fundraiser_recommendations: `You are a fundraiser_recommendations engine for GoFundMe. Based on this user's profile and giving history, recommend fundraisers. Return a JSON object with recommendations array: slug, title, reason, urgency (high/medium/low), matchScore (0-100). Return valid JSON only.`,
    };

    const response = await aiComplete(aiFeature, {
      messages: [
        {
          role: 'system',
          content: systemPrompts[aiFeature],
        },
        {
          role: 'user',
          content: `Analyze this user's giving profile:

User: ${JSON.stringify(user, null, 2)}
Activities: ${JSON.stringify(activities?.slice(0, 10), null, 2)}
Donations: ${JSON.stringify(donations?.slice(0, 10), null, 2)}`,
        },
      ],
      maxTokens: 1024,
      temperature: aiFeature === 'impact_narrative' ? 0.8 : 0.4,
    });

    let parsed;
    if (aiFeature !== 'impact_narrative') {
      try {
        parsed = parseAIJSON(response.content);
      } catch {
        parsed = { raw: response.content };
      }
    }

    return NextResponse.json({
      data: {
        ...response,
        parsed: parsed || undefined,
      },
    });
  } catch (error) {
    console.error('[Profile Insights] Error:', error);
    return NextResponse.json(
      { error: 'Profile insights failed' },
      { status: 500 }
    );
  }
}
