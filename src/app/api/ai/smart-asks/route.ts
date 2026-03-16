import { NextRequest, NextResponse } from 'next/server';
import { aiComplete } from '@/lib/ai/provider';
import { parseAIJSON } from '@/lib/ai/parseJSON';

export async function POST(request: NextRequest) {
  try {
    const { title, category, goalAmount, raisedAmount, donationCount, averageDonation, medianDonation } = await request.json();

    const response = await aiComplete('smart_asks', {
      messages: [
        {
          role: 'system',
          content: `You are a donation optimization expert for GoFundMe. Suggest 4 optimal donation amounts based on campaign data. Each amount needs a short impact label (under 8 words). Return valid JSON only.`,
        },
        {
          role: 'user',
          content: `Suggest donation amounts for this campaign:

Campaign: ${title}
Category: ${category}
Goal: $${(goalAmount / 100).toFixed(0)}
Raised: $${(raisedAmount / 100).toFixed(0)}
Donors: ${donationCount}
Average donation: $${(averageDonation / 100).toFixed(0)}
Median donation: $${(medianDonation / 100).toFixed(0)}

Suggest 4 amounts:
1. Accessible entry amount (low barrier)
2. Near the current average
3. Aspirational but achievable
4. High-impact amount

JSON format:
{
  "amounts": [
    {"amount": 2500, "label": "Covers emergency supplies for one day"},
    {"amount": 5000, "label": "Most popular donation amount"},
    {"amount": 15000, "label": "Funds a week of temporary housing"},
    {"amount": 50000, "label": "Top 5% of donors — major impact"}
  ]
}

Return amounts in cents.`,
        },
      ],
      maxTokens: 512,
      temperature: 0.4,
    });

    let parsed;
    try {
      parsed = parseAIJSON(response.content);
    } catch {
      parsed = { raw: response.content };
    }

    return NextResponse.json({ data: { ...response, parsed } });
  } catch (error) {
    console.error('[Smart Asks] Error:', error);
    return NextResponse.json({ error: 'Smart asks generation failed' }, { status: 500 });
  }
}
