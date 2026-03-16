import type { AIProvider, AICompletionRequest, AICompletionResponse } from './types';

// Intelligent mock responses that simulate real AI output
// Used when no API key is configured, so the demo always works

const MOCK_RESPONSES: Record<string, string> = {
  story_coach: `Here are suggestions to strengthen your fundraiser story:

**1. Lead with urgency** — Open with the immediate impact: "Right now, 47 families in our neighborhood are sleeping in shelters." Numbers create emotional resonance.

**2. Add a personal connection** — Share a specific moment: "When I saw the smoke from my kitchen window, I knew our community needed to act fast." Personal details build trust.

**3. Break down the goal** — Show donors exactly where money goes: "$50 provides a family emergency kit, $200 covers a week of temporary housing." Specificity increases average donation by 23%.

**4. Include a timeline** — "We need to raise $3,000 by March 15th to secure the emergency housing block." Deadlines create urgency.

**5. End with hope** — Close with the positive outcome: "Together, we can ensure every displaced family has a safe place to call home while they rebuild."`,

  donation_suggestions: JSON.stringify({
    suggestions: [
      { amount: 25, label: 'Covers emergency supplies for one person', popular: false },
      { amount: 50, label: 'Provides a family emergency kit', popular: true },
      { amount: 100, label: 'Funds one week of alert monitoring', popular: false },
      { amount: 250, label: 'Sponsors temporary housing for a family', popular: false },
    ],
    reasoning: 'Based on campaign goal, current progress, and donor patterns, $50 is the recommended sweet spot — it\'s meaningful yet accessible, and matches the most common donation tier for emergency fundraisers.',
  }),

  sentiment_analysis: JSON.stringify({
    overall: {
      score: 0.82,
      label: 'Very Positive',
      summary: 'Donor messages express strong community solidarity and personal connection to the cause.',
    },
    themes: [
      { theme: 'Community solidarity', count: 8, sentiment: 0.91 },
      { theme: 'Personal impact stories', count: 5, sentiment: 0.88 },
      { theme: 'Gratitude for organizer', count: 4, sentiment: 0.95 },
      { theme: 'Urgency and concern', count: 3, sentiment: 0.65 },
    ],
    highlights: [
      { message: 'My family was saved by the Watch Duty alerts. Thank you for this fund!', sentiment: 0.95, impact: 'high' },
      { message: 'Stay strong, LA. We are all behind you.', sentiment: 0.88, impact: 'medium' },
    ],
  }),

  community_digest: `## Watch Duty Community — Weekly Digest

**This week's highlights:**
- 3 new fundraisers launched, raising a combined $12,450 in their first 48 hours
- The LA Wildfire Alerts & Recovery Fund crossed the 70% mark — just $898 to go!
- 24 new community members joined, a 15% increase from last week

**Top contributor:** Tim Cadogan donated $300 to wildfire recovery efforts, inspiring 4 follow-on donations.

**Trending cause:** Emergency relief continues to dominate, with 78% of this week's donations going toward wildfire-related campaigns.

**Community health:** Engagement is strong — the average donor left a message of support, and 62% of donors shared the fundraiser on social media.`,

  cause_matching: JSON.stringify({
    matches: [
      {
        fundraiserSlug: 'la-wildfire-alerts-and-recovery',
        title: 'LA Wildfire Alerts & Recovery Fund',
        matchScore: 0.94,
        reasons: ['Matches your emergency relief interest', 'Local to your area', 'High community engagement'],
      },
      {
        fundraiserSlug: 'la-animal-rescue-fund',
        title: 'LA Animal Rescue Fund',
        matchScore: 0.87,
        reasons: ['Aligns with your animal welfare giving history', 'Connected to wildfire relief effort'],
      },
      {
        fundraiserSlug: 'help-sarah-fight-cancer',
        title: 'Help Sarah Fight Cancer',
        matchScore: 0.72,
        reasons: ['Medical causes in your top 5 interests', 'High urgency campaign'],
      },
    ],
  }),

  trust_scoring: JSON.stringify({
    overallScore: 92,
    label: 'Highly Trusted',
    signals: [
      { signal: 'Organizer verified identity', status: 'pass', weight: 25 },
      { signal: 'Consistent update cadence', status: 'pass', weight: 20 },
      { signal: 'Funds withdrawal pattern normal', status: 'pass', weight: 20 },
      { signal: 'Community endorsements', status: 'pass', weight: 15 },
      { signal: 'Description authenticity', status: 'pass', weight: 10 },
      { signal: 'Image originality check', status: 'pass', weight: 10 },
    ],
    riskFactors: [],
    recommendation: 'This fundraiser shows strong trust signals. The organizer has a verified identity, posts regular updates, and has community endorsements.',
  }),

  impact_narrative: `## Your Giving Story

Over the past year, you've made a meaningful difference in **3 communities** through **5 donations** totaling **$400**.

**Your biggest impact:** Your $200 donation to "Help Sarah Fight Cancer" was part of a wave of support that helped the campaign reach 65% of its goal. Sarah's family reported that the outpouring of generosity gave them hope during the most difficult period of their lives.

**Your giving pattern:** You tend to donate within the first week of a campaign launch — that's significant because early donors inspire 2.3x more follow-on donations on average. You're not just giving money; you're catalyzing community generosity.

**Causes you champion:** Emergency relief (40%), Medical (30%), Animal welfare (30%). Your giving aligns with causes that have immediate, tangible impact on people's lives.`,

  giving_insights: JSON.stringify({
    givingPersonality: {
      type: 'First Responder',
      description: 'You donate early in campaigns, helping build momentum that inspires others to give.',
      traits: ['Early donor', 'Local focus', 'Emergency-driven', 'Message writer'],
    },
    patterns: {
      averageDonation: 8000,
      preferredTime: 'Morning (9-11 AM)',
      preferredDay: 'Weekend',
      messageRate: 0.8,
      shareRate: 0.6,
    },
    suggestions: [
      'You haven\'t donated to an education cause yet — consider exploring local school fundraisers.',
      'Setting up a monthly giving pledge of $50 would increase your annual impact by 50%.',
      'Your donation messages inspire others — keep writing them!',
    ],
  }),

  share_content: JSON.stringify({
    "tweet": "Help LA families rebuild after the wildfires. Every dollar supports real-time alerts and direct aid. Please share \ud83d\ude4f {url}",
    "instagram": "I\u2019m supporting wildfire recovery in LA \ud83d\udd25\u2764\ufe0f This fund provides real-time alerts through Watch Duty and direct aid to displaced families. Every donation matters.\n\nLink in bio to donate \u2014 even $25 helps.\n\n#GoFundMe #LAWildfires #CommunitySupport #DisasterRelief",
    "email_subject": "Can you help LA wildfire families rebuild?",
    "email_body": "Hi,\n\nI wanted to share a fundraiser that\u2019s making a real difference for families affected by the LA wildfires. The fund supports real-time wildfire alert infrastructure through Watch Duty and provides direct aid to displaced families.\n\nThey\u2019ve already raised over $2,100 toward their $3,000 goal, but they still need help. Even a small donation makes a difference.\n\nHere\u2019s the link: {url}\n\nThanks for considering it.",
    "sms": "Hey \u2014 sharing this fundraiser for LA wildfire recovery. They\u2019re providing real-time alerts and helping displaced families. If you can chip in: {url}"
  }),

  smart_asks: JSON.stringify({
    "amounts": [
      {"amount": 2500, "label": "Provides emergency supplies for one day"},
      {"amount": 5000, "label": "Most common donation amount"},
      {"amount": 15000, "label": "Funds temporary housing for a week"},
      {"amount": 50000, "label": "Top 5% of donors \u2014 major impact"}
    ]
  }),

  fundraiser_recommendations: JSON.stringify({
    recommendations: [
      {
        slug: 'la-wildfire-alerts-and-recovery',
        title: 'LA Wildfire Alerts & Recovery Fund',
        reason: 'Based on your emergency relief giving history and local focus',
        urgency: 'high',
        matchScore: 94,
      },
      {
        slug: 'la-animal-rescue-fund',
        title: 'LA Animal Rescue Fund',
        reason: 'Combines your animal welfare interest with wildfire recovery',
        urgency: 'medium',
        matchScore: 87,
      },
      {
        slug: 'help-sarah-fight-cancer',
        title: 'Help Sarah Fight Cancer',
        reason: 'High-impact medical campaign trending in your network',
        urgency: 'high',
        matchScore: 72,
      },
    ],
  }),
};

export class MockAIProvider implements AIProvider {
  name = 'mock';

  isConfigured(): boolean {
    return true;
  }

  async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
    // Simulate network latency
    const latency = 200 + Math.random() * 300;
    await new Promise((resolve) => setTimeout(resolve, latency));

    // Determine which feature is being called from system message
    const systemMsg = request.messages.find((m) => m.role === 'system')?.content || '';
    let feature = 'story_coach';
    for (const key of Object.keys(MOCK_RESPONSES)) {
      if (systemMsg.toLowerCase().includes(key.replace('_', ' ')) || systemMsg.toLowerCase().includes(key)) {
        feature = key;
        break;
      }
    }

    const content = MOCK_RESPONSES[feature] || MOCK_RESPONSES.story_coach;

    return {
      content,
      model: 'mock-model',
      inputTokens: Math.round(request.messages.reduce((sum, m) => sum + m.content.length / 4, 0)),
      outputTokens: Math.round(content.length / 4),
      latencyMs: Math.round(latency),
      provider: 'mock',
      cached: false,
    };
  }
}
