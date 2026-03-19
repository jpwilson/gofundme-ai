import { NextRequest, NextResponse } from 'next/server';
import { aiComplete } from '@/lib/ai/provider';

const MOCK_PROFILE = {
  organization: {
    name: 'Community Food Bank',
    tagline: 'Eliminating hunger, one family at a time',
    location: 'Greater Metro Area',
    yearFounded: 2008,
    type: 'Food Bank / Hunger Relief',
  },
  mission:
    'To eliminate hunger by providing nutritious food and resources to those in need, ensuring every family in the greater metro area has access to healthy meals.',
  vision:
    'A community where no family goes hungry and every person has the nutrition they need to thrive.',
  programs: [
    {
      name: 'Weekly Food Distribution',
      description:
        'Operating at 12 locations across the metro area, providing fresh produce, proteins, and pantry staples to families in need every week.',
      impactMetric: '15,000 families served annually',
    },
    {
      name: 'Mobile Pantry',
      description:
        'Bringing food directly to underserved rural communities that lack access to traditional food banks and grocery stores.',
      impactMetric: '2,400 rural households reached',
    },
    {
      name: 'Childhood Hunger Prevention',
      description:
        'Partnering with local schools to provide weekend meal packs and summer feeding programs for children who rely on school meals.',
      impactMetric: '3,200 children enrolled',
    },
    {
      name: 'Nutrition Education',
      description:
        'Offering cooking classes and nutrition workshops to help families make the most of the food they receive and build healthy habits.',
      impactMetric: '800 class participants per year',
    },
  ],
  impactStats: {
    peopleServed: '15,000+',
    foodDistributed: '2M lbs',
    yearsActive: '16',
    volunteers: '500+',
  },
  suggestedCampaigns: [
    {
      title: 'Summer Meals for Kids 2024',
      goalAmountCents: 2500000,
      category: 'Childhood Hunger',
      description:
        'Help us feed 3,200 children during summer break when school meals are unavailable. Your donation provides nutritious breakfast and lunch packs for 10 weeks.',
    },
    {
      title: 'Mobile Pantry Expansion Fund',
      goalAmountCents: 5000000,
      category: 'Infrastructure',
      description:
        'We need a second refrigerated truck to double our mobile pantry reach into rural communities. Help us bring fresh food to 4,800 more households.',
    },
    {
      title: 'Annual Food Drive Match Campaign',
      goalAmountCents: 1000000,
      category: 'General Operations',
      description:
        'Every dollar donated is matched 2:1 by our corporate partners. Help us stock our shelves and serve 30% more families this year.',
    },
  ],
  recommendedIntegrations: [
    {
      name: 'Salesforce Nonprofit Cloud',
      reason: 'Track donors, volunteers, and program participants in one CRM',
      icon: 'database',
    },
    {
      name: 'Mailchimp',
      reason: 'Send donor updates, impact reports, and campaign newsletters',
      icon: 'mail',
    },
    {
      name: 'QuickBooks',
      reason: 'Manage nonprofit accounting, grants, and tax-exempt reporting',
      icon: 'calculator',
    },
    {
      name: 'VolunteerHub',
      reason: 'Coordinate your 500+ volunteers with shift scheduling and tracking',
      icon: 'users',
    },
  ],
};

export async function POST(request: NextRequest) {
  try {
    const { content, url } = await request.json();

    if (!content && !url) {
      return NextResponse.json(
        { error: 'Please provide organization content or a URL' },
        { status: 400 }
      );
    }

    const inputText = content || `Website URL: ${url}`;

    const response = await aiComplete('npo_onboard', {
      messages: [
        {
          role: 'system',
          content: `You are an expert nonprofit consultant for GoFundMe Pro. Given information about a nonprofit organization, extract and generate a complete profile. Return ONLY valid JSON (no markdown fences) with this exact structure:

{
  "organization": {
    "name": "string",
    "tagline": "string (compelling one-liner)",
    "location": "string",
    "yearFounded": number,
    "type": "string (e.g. Food Bank, Animal Rescue, Education)"
  },
  "mission": "string (1-2 sentences)",
  "vision": "string (1-2 sentences, aspirational)",
  "programs": [
    {
      "name": "string",
      "description": "string (2-3 sentences)",
      "impactMetric": "string (specific number + what it measures)"
    }
  ],
  "impactStats": {
    "peopleServed": "string (with + or comma formatting)",
    "foodDistributed": "string (or relevant primary metric)",
    "yearsActive": "string",
    "volunteers": "string"
  },
  "suggestedCampaigns": [
    {
      "title": "string (compelling campaign title)",
      "goalAmountCents": number (realistic goal in cents),
      "category": "string",
      "description": "string (2-3 sentences, donor-facing)"
    }
  ],
  "recommendedIntegrations": [
    {
      "name": "string (real product name)",
      "reason": "string (why it helps this specific org)",
      "icon": "string (one of: database, mail, calculator, users, globe, heart)"
    }
  ]
}

Generate 3-4 programs, exactly 4 impact stats, exactly 3 campaigns, and 3-4 integrations. Make campaigns specific, timely, and compelling. Use realistic goal amounts.`,
        },
        {
          role: 'user',
          content: `Please analyze this nonprofit information and generate a complete GoFundMe Pro profile:\n\n${inputText}`,
        },
      ],
      maxTokens: 2048,
      temperature: 0.7,
    });

    // Try to parse the AI response as JSON
    let profileData;
    try {
      let text = response.content.trim();
      // Strip markdown code fences if present
      if (text.startsWith('```')) {
        text = text.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
      }
      profileData = JSON.parse(text);
    } catch {
      // If parsing fails, return mock data
      console.warn('[NPO Onboard] Failed to parse AI response, using mock data');
      profileData = MOCK_PROFILE;
    }

    return NextResponse.json({ data: profileData });
  } catch (error) {
    console.error('[NPO Onboard] Error:', error);
    // Return mock data as fallback
    return NextResponse.json({ data: MOCK_PROFILE });
  }
}
