import Anthropic from '@anthropic-ai/sdk';
import type { AIProvider, AICompletionRequest, AICompletionResponse } from './types';

const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';
const OPENROUTER_MODEL = 'anthropic/claude-haiku-4.5';

export class AnthropicProvider implements AIProvider {
  name = 'anthropic';
  private client: Anthropic | null = null;
  private openRouterKey: string | null = null;

  constructor() {
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (openRouterKey) {
      this.openRouterKey = openRouterKey;
      this.name = 'openrouter';
    } else if (anthropicKey) {
      this.client = new Anthropic({ apiKey: anthropicKey });
    }
  }

  isConfigured(): boolean {
    return this.client !== null || this.openRouterKey !== null;
  }

  async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
    if (this.openRouterKey) {
      return this.completeViaOpenRouter(request);
    }
    if (!this.client) {
      throw new Error('No API key configured');
    }
    return this.completeViaAnthropic(request);
  }

  private async completeViaOpenRouter(request: AICompletionRequest): Promise<AICompletionResponse> {
    const start = Date.now();

    // OpenRouter uses OpenAI-style chat completions format
    const messages = request.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openRouterKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        max_tokens: request.maxTokens || 1024,
        temperature: request.temperature ?? 0.7,
        messages,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenRouter error ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const latencyMs = Date.now() - start;

    return {
      content: data.choices?.[0]?.message?.content || '',
      model: OPENROUTER_MODEL,
      inputTokens: data.usage?.prompt_tokens || 0,
      outputTokens: data.usage?.completion_tokens || 0,
      latencyMs,
      provider: 'openrouter',
      cached: false,
    };
  }

  private async completeViaAnthropic(request: AICompletionRequest): Promise<AICompletionResponse> {
    const model = request.model || DEFAULT_MODEL;
    const start = Date.now();

    const systemMessage = request.messages.find((m) => m.role === 'system');
    const userMessages = request.messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    const response = await this.client!.messages.create({
      model,
      max_tokens: request.maxTokens || 1024,
      temperature: request.temperature ?? 0.7,
      system: systemMessage?.content,
      messages: userMessages,
    });

    const latencyMs = Date.now() - start;
    const content =
      response.content[0].type === 'text' ? response.content[0].text : '';

    return {
      content,
      model,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      latencyMs,
      provider: this.name,
      cached: false,
    };
  }
}
