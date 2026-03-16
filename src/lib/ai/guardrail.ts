// ============================================================
// Chat Guardrail — lightweight topic check for AI responses
// ============================================================

// Keywords that are safe to match as substrings (long / specific enough)
const SUBSTRING_KEYWORDS = [
  'gofundme',
  'fundrais',
  'donat',
  'campaign',
  'community',
  'sentiment',
  'analytics',
  'dashboard',
  'claude',
  'next.js',
  'architecture',
  'digest',
];

// Short keywords that need word-boundary matching to avoid false positives
// (e.g. "ai" in "capital", "api" in "capital", "demo" in "demolish")
const WORD_BOUNDARY_KEYWORDS = [
  'ai',
  'api',
  'demo',
  'agent',
  'coach',
  'trust',
  'metric',
  'feature',
  'profile',
  'project',
  'explore',
];

// Pre-compiled regex for word-boundary keywords (case-insensitive)
const WORD_BOUNDARY_RE = new RegExp(
  WORD_BOUNDARY_KEYWORDS.map((kw) => `\\b${kw}`).join('|'),
  'i'
);

export const FALLBACK_MESSAGE =
  "I'm here to help you explore the GoFundMe AI demo! I can answer questions about the features, architecture, metrics, or AI capabilities. What would you like to know?";

/**
 * Check whether an AI response is on-topic by looking for
 * at least one project-related keyword (case-insensitive).
 */
export function isOnTopic(response: string): boolean {
  const lower = response.toLowerCase();

  // Check substring keywords first (fast path)
  if (SUBSTRING_KEYWORDS.some((kw) => lower.includes(kw))) {
    return true;
  }

  // Check word-boundary keywords via regex
  return WORD_BOUNDARY_RE.test(response);
}
