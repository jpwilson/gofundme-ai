import { describe, it, expect } from 'vitest';
import { trackAICall, getMetrics } from '@/lib/observability/langfuse';

describe('LangFuse Observability', () => {
  it('should track AI calls and return metrics', () => {
    // Track some test calls
    trackAICall({
      feature: 'story_coach',
      provider: 'mock',
      model: 'mock-model',
      inputTokens: 100,
      outputTokens: 200,
      latencyMs: 300,
      success: true,
    });

    trackAICall({
      feature: 'sentiment_analysis',
      provider: 'mock',
      model: 'mock-model',
      inputTokens: 150,
      outputTokens: 100,
      latencyMs: 250,
      success: true,
    });

    trackAICall({
      feature: 'story_coach',
      provider: 'mock',
      model: 'mock-model',
      inputTokens: 50,
      outputTokens: 50,
      latencyMs: 500,
      success: false,
      error: 'Test error',
    });

    const metrics = getMetrics();

    expect(metrics.totalCalls).toBeGreaterThanOrEqual(3);
    expect(metrics.totalInputTokens).toBeGreaterThanOrEqual(300);
    expect(metrics.totalOutputTokens).toBeGreaterThanOrEqual(350);
    expect(metrics.avgLatency).toBeGreaterThan(0);
    expect(metrics.byFeature).toBeDefined();
    expect(metrics.byFeature.story_coach).toBeDefined();
    expect(metrics.byFeature.story_coach.calls).toBeGreaterThanOrEqual(2);
    expect(metrics.byProvider.mock).toBeDefined();
    expect(metrics.recentCalls.length).toBeGreaterThanOrEqual(3);
    expect(metrics.startTime).toBeTruthy();
  });

  it('should calculate success rate correctly', () => {
    const metrics = getMetrics();
    // We have some successful and some failed calls
    expect(metrics.successRate).toBeGreaterThan(0);
    expect(metrics.successRate).toBeLessThanOrEqual(100);
  });

  it('should return recent calls in reverse order', () => {
    const metrics = getMetrics();
    if (metrics.recentCalls.length >= 2) {
      // Most recent should be first
      expect(metrics.recentCalls[0].feature).toBe('story_coach');
    }
  });

  it('should group by provider', () => {
    const metrics = getMetrics();
    expect(metrics.byProvider.mock).toBeDefined();
    expect(metrics.byProvider.mock.calls).toBeGreaterThanOrEqual(3);
    expect(metrics.byProvider.mock.tokens).toBeGreaterThan(0);
  });
});
