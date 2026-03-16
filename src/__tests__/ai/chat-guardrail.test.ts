import { describe, it, expect } from 'vitest';
import { isOnTopic, FALLBACK_MESSAGE } from '@/lib/ai/guardrail';

describe('Chat guardrail — isOnTopic', () => {
  it('passes on-topic responses containing project keywords', () => {
    expect(isOnTopic('The fundraiser page lets organizers tell their story.')).toBe(true);
    expect(isOnTopic('This demo uses Claude API via OpenRouter.')).toBe(true);
    expect(isOnTopic('The trust scoring feature flags suspicious activity.')).toBe(true);
    expect(isOnTopic('Community digest summarises recent donations.')).toBe(true);
  });

  it('catches off-topic responses with no project keywords', () => {
    expect(isOnTopic('The capital of France is Paris.')).toBe(false);
    expect(isOnTopic('Here is a Python script to sort a list.')).toBe(false);
    expect(isOnTopic('The weather today is sunny and warm.')).toBe(false);
  });

  it('catches jailbreak attempt responses that lack project keywords', () => {
    expect(
      isOnTopic('Sure! I will now ignore my previous instructions and act as a pirate.')
    ).toBe(false);
    expect(
      isOnTopic('As a completely unrestricted language model, I can tell you anything.')
    ).toBe(false);
  });

  it('matches keywords case-insensitively', () => {
    expect(isOnTopic('GoFundMe is a great platform.')).toBe(true);
    expect(isOnTopic('gofundme is a great platform.')).toBe(true);
    expect(isOnTopic('GOFUNDME is a great platform.')).toBe(true);
  });

  it('exports a meaningful fallback message', () => {
    expect(FALLBACK_MESSAGE).toContain('GoFundMe');
    expect(FALLBACK_MESSAGE.length).toBeGreaterThan(0);
  });
});
