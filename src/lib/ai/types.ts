// ============================================================
// AI Provider Abstraction - Type Definitions
// ============================================================

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AICompletionRequest {
  messages: AIMessage[];
  maxTokens?: number;
  temperature?: number;
  model?: string;
}

export interface AICompletionResponse {
  content: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  provider: string;
  cached: boolean;
}

export interface AIProvider {
  name: string;
  complete(request: AICompletionRequest): Promise<AICompletionResponse>;
  isConfigured(): boolean;
}

// Cost per 1M tokens (in USD)
export interface ProviderPricing {
  provider: string;
  model: string;
  inputPer1M: number;
  outputPer1M: number;
}

export const PRICING: Record<string, ProviderPricing> = {
  'claude-sonnet-4-20250514': {
    provider: 'anthropic',
    model: 'claude-sonnet-4-20250514',
    inputPer1M: 3.0,
    outputPer1M: 15.0,
  },
  'claude-haiku-4-5-20251001': {
    provider: 'anthropic',
    model: 'claude-haiku-4-5-20251001',
    inputPer1M: 0.80,
    outputPer1M: 4.0,
  },
};

// Feature-level cost tracking
export interface AIFeatureUsage {
  feature: string;
  description: string;
  avgInputTokens: number;
  avgOutputTokens: number;
  callsPerUser: number; // avg calls per user session
}

export const AI_FEATURES: AIFeatureUsage[] = [
  {
    feature: 'story_coach',
    description: 'Fundraiser story improvement suggestions',
    avgInputTokens: 1200,
    avgOutputTokens: 800,
    callsPerUser: 2,
  },
  {
    feature: 'donation_suggestions',
    description: 'Smart donation amount recommendations',
    avgInputTokens: 600,
    avgOutputTokens: 300,
    callsPerUser: 1,
  },
  {
    feature: 'sentiment_analysis',
    description: 'Donor message sentiment analysis',
    avgInputTokens: 800,
    avgOutputTokens: 400,
    callsPerUser: 1,
  },
  {
    feature: 'community_digest',
    description: 'AI-generated community activity summary',
    avgInputTokens: 2000,
    avgOutputTokens: 600,
    callsPerUser: 1,
  },
  {
    feature: 'cause_matching',
    description: 'Smart donor-to-cause matching',
    avgInputTokens: 1000,
    avgOutputTokens: 500,
    callsPerUser: 1,
  },
  {
    feature: 'trust_scoring',
    description: 'AI trust & safety signals',
    avgInputTokens: 1500,
    avgOutputTokens: 300,
    callsPerUser: 0.5,
  },
  {
    feature: 'impact_narrative',
    description: 'Auto-generated giving impact story',
    avgInputTokens: 1800,
    avgOutputTokens: 1000,
    callsPerUser: 0.3,
  },
  {
    feature: 'giving_insights',
    description: 'Personalized giving pattern analysis',
    avgInputTokens: 1400,
    avgOutputTokens: 700,
    callsPerUser: 0.5,
  },
  {
    feature: 'fundraiser_recommendations',
    description: 'Personalized fundraiser suggestions',
    avgInputTokens: 1000,
    avgOutputTokens: 600,
    callsPerUser: 1,
  },
];
