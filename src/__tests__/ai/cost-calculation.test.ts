import { describe, it, expect } from 'vitest';
import { AI_FEATURES, PRICING } from '@/lib/ai/types';

describe('Cost Calculations', () => {
  const pricing = PRICING['claude-haiku-4-5-20251001'];

  const featureCost = (feature: (typeof AI_FEATURES)[number], userCount: number) => {
    const inputCost = (feature.avgInputTokens / 1_000_000) * pricing.inputPer1M;
    const outputCost = (feature.avgOutputTokens / 1_000_000) * pricing.outputPer1M;
    const costPerCall = inputCost + outputCost;
    return costPerCall * feature.callsPerUser * userCount;
  };

  it('should calculate cost for 1 user correctly', () => {
    const storyCoach = AI_FEATURES.find((f) => f.feature === 'story_coach')!;
    const cost = featureCost(storyCoach, 1);
    // Input: 1200 tokens * $0.80/1M = $0.00096
    // Output: 800 tokens * $4.0/1M = $0.0032
    // Per call: $0.00416
    // 2 calls per user: $0.00832
    expect(cost).toBeGreaterThan(0);
    expect(cost).toBeLessThan(0.05); // Should be very cheap for 1 user
  });

  it('should scale linearly with user count', () => {
    const feature = AI_FEATURES[0];
    const cost1K = featureCost(feature, 1000);
    const cost10K = featureCost(feature, 10000);

    expect(Math.abs(cost10K / cost1K - 10)).toBeLessThan(0.001);
  });

  it('should calculate total monthly cost for 1K users', () => {
    const totalCost = AI_FEATURES.reduce((sum, f) => sum + featureCost(f, 1000), 0);
    expect(totalCost).toBeGreaterThan(0);
    expect(totalCost).toBeLessThan(100); // Should be under $100/mo for 1K MAU on Haiku
  });

  it('should calculate total monthly cost for 100K users', () => {
    const totalCost = AI_FEATURES.reduce((sum, f) => sum + featureCost(f, 100000), 0);
    expect(totalCost).toBeGreaterThan(0);
    // At 100K users on Haiku, should be manageable
    expect(totalCost).toBeLessThan(10000);
  });

  it('Sonnet should be more expensive than Haiku', () => {
    const haikuPricing = PRICING['claude-haiku-4-5-20251001'];
    const sonnetPricing = PRICING['claude-sonnet-4-20250514'];

    expect(sonnetPricing.inputPer1M).toBeGreaterThan(haikuPricing.inputPer1M);
    expect(sonnetPricing.outputPer1M).toBeGreaterThan(haikuPricing.outputPer1M);
  });

  it('all features should have reasonable token counts', () => {
    for (const feature of AI_FEATURES) {
      expect(feature.avgInputTokens).toBeGreaterThan(0);
      expect(feature.avgInputTokens).toBeLessThan(10000);
      expect(feature.avgOutputTokens).toBeGreaterThan(0);
      expect(feature.avgOutputTokens).toBeLessThan(5000);
    }
  });
});
