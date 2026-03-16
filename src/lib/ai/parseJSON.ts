/**
 * Parse JSON from AI responses, stripping markdown code fences if present.
 * Claude sometimes wraps JSON in ```json ... ``` blocks.
 */
export function parseAIJSON(content: string): unknown {
  // Strip markdown code fences
  let cleaned = content.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }
  return JSON.parse(cleaned);
}
