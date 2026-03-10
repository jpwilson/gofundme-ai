import type { AIProvider, AICompletionRequest, AICompletionResponse } from './types';
import { AnthropicProvider } from './anthropic';
import { MockAIProvider } from './mock';
import { trackAICall } from '../observability/langfuse';

// Singleton provider instance
let _provider: AIProvider | null = null;

function getProvider(): AIProvider {
  if (_provider) return _provider;

  const providerName = process.env.AI_PROVIDER || 'anthropic';

  switch (providerName) {
    case 'anthropic': {
      const anthropic = new AnthropicProvider();
      if (anthropic.isConfigured()) {
        _provider = anthropic;
      } else {
        console.warn('[AI] Anthropic API key not found, falling back to mock provider');
        _provider = new MockAIProvider();
      }
      break;
    }
    default:
      _provider = new MockAIProvider();
  }

  return _provider;
}

/**
 * Execute an AI completion with automatic provider selection,
 * observability tracking, and fallback handling.
 */
export async function aiComplete(
  feature: string,
  request: AICompletionRequest
): Promise<AICompletionResponse> {
  const provider = getProvider();

  try {
    const response = await provider.complete(request);

    // Track in LangFuse for observability
    trackAICall({
      feature,
      provider: response.provider,
      model: response.model,
      inputTokens: response.inputTokens,
      outputTokens: response.outputTokens,
      latencyMs: response.latencyMs,
      success: true,
    });

    return response;
  } catch (error) {
    // Track failure
    trackAICall({
      feature,
      provider: provider.name,
      model: request.model || 'unknown',
      inputTokens: 0,
      outputTokens: 0,
      latencyMs: 0,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    // Fallback to mock if real provider fails
    if (provider.name !== 'mock') {
      console.warn(`[AI] ${provider.name} failed, falling back to mock:`, error);
      const mock = new MockAIProvider();
      return mock.complete(request);
    }

    throw error;
  }
}

export { getProvider };
export type { AIProvider, AICompletionRequest, AICompletionResponse };
