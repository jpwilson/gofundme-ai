import { NextRequest, NextResponse } from 'next/server';
import { aiComplete } from '@/lib/ai/provider';

// ---------------------------------------------------------------------------
// Fallback / mock data when AI is unavailable
// ---------------------------------------------------------------------------

function buildFallbackResponse(story: string, category: string, subcategory: string, goal: number) {
  const storyLower = story.toLowerCase();
  const wordCount = story.split(/\s+/).filter(Boolean).length;
  const paragraphCount = story.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;

  const included: string[] = [];
  const missing: string[] = [];

  // Check for specific dollar amounts
  if (/\$[\d,]+/.test(story)) included.push('specific_amounts');
  else missing.push('specific_amounts');

  // Check for personal connection
  if (/\b(my|our|i|we|me|us)\b/i.test(story)) included.push('personal_connection');
  else missing.push('personal_connection');

  // Check for timeline/urgency
  if (/\b(urgent|immediately|deadline|by\s+(january|february|march|april|may|june|july|august|september|october|november|december)|within\s+\d|asap|time.?sensitive)\b/i.test(story))
    included.push('timeline');
  else missing.push('timeline');

  // Check for fund breakdown
  if (/\b(will\s+(go|be\s+used)|breakdown|cover|pay\s+for|allocated|spend)\b/i.test(story))
    included.push('fund_breakdown');
  else missing.push('fund_breakdown');

  // Check for gratitude / emotional appeal
  if (/\b(thank|grateful|appreciate|bless|heart|hope|dream|love)\b/i.test(story))
    included.push('gratitude');
  else missing.push('gratitude');

  // Check for updates commitment
  if (/\b(update|keep\s+you\s+(posted|informed)|progress|share\s+(news|updates|how))\b/i.test(story))
    included.push('updates_commitment');
  else missing.push('updates_commitment');

  // Anti-patterns
  const antiPatterns: string[] = [];
  if (wordCount < 50) antiPatterns.push('too_short');
  if (wordCount > 20 && paragraphCount <= 1) antiPatterns.push('wall_of_text');
  if (/\b(you\s+must|you\s+should\s+feel|shame|guilt|how\s+dare)\b/i.test(storyLower))
    antiPatterns.push('guilt_tripping');
  if (wordCount > 10 && !/[A-Z][a-z]+,?\s+[A-Z]{2}/.test(story) && !/\b(city|town|state|county)\b/i.test(storyLower))
    antiPatterns.push('missing_location');

  // Niche-specific tips
  const nicheTips: string[] = [];
  const tipMap: Record<string, string[]> = {
    medical: [
      'Include diagnosis details and treatment plan',
      'Mention your insurance coverage status',
      'Add a treatment timeline with milestones',
      'Share the hospital or care facility name',
    ],
    emergency: [
      'Include the date the emergency occurred',
      'Describe the area or extent of damage',
      'Separate immediate needs from long-term recovery',
      'Mention any assistance already received (FEMA, insurance, etc.)',
    ],
    education: [
      'List specific costs (tuition, books, supplies)',
      'Mention the school or program name',
      'Share academic achievements or goals',
      'Include application deadlines if relevant',
    ],
    animals: [
      'Include the rescue organization if applicable',
      'Provide a detailed vet cost breakdown',
      'Describe the animal\'s story and current condition',
      'Mention before/after potential or recovery outlook',
    ],
    environment: [
      'Quantify the environmental impact',
      'Name specific organizations you\'re partnering with',
      'Include measurable goals (acres, species, tonnes)',
      'Share the project timeline and milestones',
    ],
    community: [
      'Describe how many people will benefit',
      'Mention local organizations backing the project',
      'Include a project timeline',
      'Share any matching fund opportunities',
    ],
    business: [
      'Include a brief business plan overview',
      'Mention jobs that will be created',
      'Share revenue projections or market validation',
      'Describe community impact',
    ],
    faith: [
      'Share the mission or ministry\'s purpose',
      'Include congregation size and involvement',
      'Describe the specific project or need',
      'Mention any matching donations from the organization',
    ],
  };
  const catKey = category.toLowerCase();
  if (tipMap[catKey]) {
    nicheTips.push(...tipMap[catKey]);
  } else {
    nicheTips.push('Be specific about how funds will be used', 'Include a timeline for your project');
  }

  // Calculate score
  const baseScore = 30;
  const includedBonus = included.length * 10;
  const antiPenalty = antiPatterns.length * 8;
  const lengthBonus = Math.min(15, Math.floor(wordCount / 20));
  const score = Math.min(100, Math.max(5, baseScore + includedBonus + lengthBonus - antiPenalty));

  // Goal benchmarks
  const benchmarks: Record<string, { median: number; top25: number }> = {
    medical: { median: 15000, top25: 35000 },
    emergency: { median: 10000, top25: 25000 },
    education: { median: 8000, top25: 20000 },
    animals: { median: 5000, top25: 12000 },
    environment: { median: 10000, top25: 30000 },
    community: { median: 7500, top25: 18000 },
    business: { median: 12000, top25: 30000 },
    faith: { median: 8000, top25: 20000 },
  };
  const bench = benchmarks[catKey] || { median: 10000, top25: 25000 };

  // Suggested titles
  const subLabel = subcategory || category;
  const suggestedTitles = [
    `Help Us ${subcategory ? subcategory.charAt(0).toUpperCase() + subcategory.slice(1) : 'Make a Difference'} — Every Dollar Counts`,
    `Support Our ${category.charAt(0).toUpperCase() + category.slice(1)} ${subLabel !== category ? subLabel.charAt(0).toUpperCase() + subLabel.slice(1) + ' ' : ''}Journey`,
    `Together We Can Overcome — ${category.charAt(0).toUpperCase() + category.slice(1)} Fund`,
  ];

  return {
    score,
    included,
    missing,
    antiPatterns,
    nicheTips,
    suggestedTitles,
    goalBenchmark: { median: bench.median, top25: bench.top25, category: catKey },
  };
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const { story, category, subcategory, location, goal } = await request.json();

    if (!story || story.trim().length < 10) {
      return NextResponse.json(buildFallbackResponse(story || '', category || '', subcategory || '', goal || 0));
    }

    const response = await aiComplete('campaign_score', {
      messages: [
        {
          role: 'system',
          content: `You are campaign_score — an expert fundraising analyst for GoFundMe. Given a campaign story, category, subcategory, location, and goal, analyze the story and return a JSON object with the following fields:

- "score": number 0-100 overall campaign quality score
- "included": string[] — items the story already includes. Use IDs from: specific_amounts, personal_connection, timeline, fund_breakdown, gratitude, updates_commitment
- "missing": string[] — items from the same list that are NOT yet in the story
- "antiPatterns": string[] — detected problems. Use IDs from: too_short, too_vague, wall_of_text, no_specific_ask, guilt_tripping, missing_location
- "nicheTips": string[] — 3-4 actionable tips specific to the category/subcategory
- "suggestedTitles": string[] — 3 compelling title suggestions for this campaign
- "goalBenchmark": { "median": number, "top25": number, "category": string } — dollar amounts (not cents) for typical campaigns in this category

Return ONLY valid JSON, no markdown code fences, no explanation.`,
        },
        {
          role: 'user',
          content: `Category: ${category || 'general'}
Subcategory: ${subcategory || 'none'}
Location: ${location || 'not specified'}
Goal: $${goal ? (goal / 100).toFixed(2) : '0'}

Story:
${story}`,
        },
      ],
      maxTokens: 1024,
      temperature: 0.5,
    });

    // Parse the AI response
    let parsed;
    try {
      let text = response.content.trim();
      // Strip markdown code fences if present
      text = text.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
      parsed = JSON.parse(text);
    } catch {
      // If AI response isn't valid JSON, fall back to rule-based
      console.warn('[Campaign Score] Failed to parse AI response, using fallback');
      parsed = buildFallbackResponse(story, category || '', subcategory || '', goal || 0);
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('[Campaign Score] Error:', error);
    // Return fallback data on any error
    return NextResponse.json(
      buildFallbackResponse('', '', '', 0),
    );
  }
}
