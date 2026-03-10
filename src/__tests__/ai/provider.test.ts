import { describe, it, expect } from 'vitest';
import { MockAIProvider } from '@/lib/ai/mock';
import { AI_FEATURES, PRICING } from '@/lib/ai/types';

describe('MockAIProvider', () => {
  const provider = new MockAIProvider();

  it('should always be configured', () => {
    expect(provider.isConfigured()).toBe(true);
  });

  it('should have name "mock"', () => {
    expect(provider.name).toBe('mock');
  });

  it('should return a valid response for story_coach', async () => {
    const response = await provider.complete({
      messages: [
        { role: 'system', content: 'You are a story_coach for GoFundMe.' },
        { role: 'user', content: 'Analyze this fundraiser.' },
      ],
    });

    expect(response.content).toBeTruthy();
    expect(response.content.length).toBeGreaterThan(50);
    expect(response.provider).toBe('mock');
    expect(response.model).toBe('mock-model');
    expect(response.inputTokens).toBeGreaterThan(0);
    expect(response.outputTokens).toBeGreaterThan(0);
    expect(response.latencyMs).toBeGreaterThan(0);
    expect(response.cached).toBe(false);
  });

  it('should return a valid response for sentiment_analysis', async () => {
    const response = await provider.complete({
      messages: [
        { role: 'system', content: 'You are a sentiment_analysis engine.' },
        { role: 'user', content: 'Analyze these messages.' },
      ],
    });

    const parsed = JSON.parse(response.content);
    expect(parsed.overall).toBeDefined();
    expect(parsed.overall.score).toBeGreaterThan(0);
    expect(parsed.overall.label).toBeTruthy();
    expect(parsed.themes).toBeInstanceOf(Array);
  });

  it('should return a valid response for trust_scoring', async () => {
    const response = await provider.complete({
      messages: [
        { role: 'system', content: 'You are a trust_scoring system.' },
        { role: 'user', content: 'Evaluate this fundraiser.' },
      ],
    });

    const parsed = JSON.parse(response.content);
    expect(parsed.overallScore).toBeGreaterThanOrEqual(0);
    expect(parsed.overallScore).toBeLessThanOrEqual(100);
    expect(parsed.label).toBeTruthy();
    expect(parsed.signals).toBeInstanceOf(Array);
  });

  it('should return a valid response for community_digest', async () => {
    const response = await provider.complete({
      messages: [
        { role: 'system', content: 'You are a community_digest generator.' },
        { role: 'user', content: 'Generate a digest.' },
      ],
    });

    expect(response.content).toContain('Watch Duty');
    expect(response.content.length).toBeGreaterThan(100);
  });

  it('should return a valid response for cause_matching', async () => {
    const response = await provider.complete({
      messages: [
        { role: 'system', content: 'You are a cause_matching engine.' },
        { role: 'user', content: 'Match causes.' },
      ],
    });

    const parsed = JSON.parse(response.content);
    expect(parsed.matches).toBeInstanceOf(Array);
    expect(parsed.matches.length).toBeGreaterThan(0);
    expect(parsed.matches[0].matchScore).toBeGreaterThan(0);
  });

  it('should return a valid response for giving_insights', async () => {
    const response = await provider.complete({
      messages: [
        { role: 'system', content: 'You are a giving_insights analyst.' },
        { role: 'user', content: 'Analyze giving patterns.' },
      ],
    });

    const parsed = JSON.parse(response.content);
    expect(parsed.givingPersonality).toBeDefined();
    expect(parsed.givingPersonality.type).toBeTruthy();
    expect(parsed.patterns).toBeDefined();
    expect(parsed.suggestions).toBeInstanceOf(Array);
  });

  it('should return a valid response for impact_narrative', async () => {
    const response = await provider.complete({
      messages: [
        { role: 'system', content: 'You are an impact_narrative writer.' },
        { role: 'user', content: 'Write a narrative.' },
      ],
    });

    expect(response.content).toContain('Giving Story');
    expect(response.content.length).toBeGreaterThan(100);
  });

  it('should fall back to story_coach for unknown features', async () => {
    const response = await provider.complete({
      messages: [
        { role: 'system', content: 'You are an unknown_feature engine.' },
        { role: 'user', content: 'Do something.' },
      ],
    });

    expect(response.content).toBeTruthy();
    expect(response.content.length).toBeGreaterThan(50);
  });

  it('should simulate latency between 200-500ms', async () => {
    const response = await provider.complete({
      messages: [
        { role: 'system', content: 'story_coach' },
        { role: 'user', content: 'Test.' },
      ],
    });

    expect(response.latencyMs).toBeGreaterThanOrEqual(200);
    expect(response.latencyMs).toBeLessThanOrEqual(600);
  });
});

describe('AI_FEATURES', () => {
  it('should have at least 5 features defined', () => {
    expect(AI_FEATURES.length).toBeGreaterThanOrEqual(5);
  });

  it('each feature should have required fields', () => {
    for (const feature of AI_FEATURES) {
      expect(feature.feature).toBeTruthy();
      expect(feature.description).toBeTruthy();
      expect(feature.avgInputTokens).toBeGreaterThan(0);
      expect(feature.avgOutputTokens).toBeGreaterThan(0);
      expect(feature.callsPerUser).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('PRICING', () => {
  it('should have pricing for at least one model', () => {
    expect(Object.keys(PRICING).length).toBeGreaterThanOrEqual(1);
  });

  it('each pricing entry should have valid costs', () => {
    for (const [key, pricing] of Object.entries(PRICING)) {
      expect(key).toBeTruthy();
      expect(pricing.provider).toBeTruthy();
      expect(pricing.model).toBeTruthy();
      expect(pricing.inputPer1M).toBeGreaterThan(0);
      expect(pricing.outputPer1M).toBeGreaterThan(0);
    }
  });
});
