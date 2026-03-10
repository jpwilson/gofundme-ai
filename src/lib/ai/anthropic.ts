import Anthropic from '@anthropic-ai/sdk';
import type { AIProvider, AICompletionRequest, AICompletionResponse } from './types';

const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';

export class AnthropicProvider implements AIProvider {
  name = 'anthropic';
  private client: Anthropic | null = null;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey) {
      this.client = new Anthropic({ apiKey });
    }
  }

  isConfigured(): boolean {
    return this.client !== null && !!process.env.ANTHROPIC_API_KEY;
  }

  async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
    if (!this.client) {
      throw new Error('Anthropic API key not configured');
    }

    const model = request.model || DEFAULT_MODEL;
    const start = Date.now();

    const systemMessage = request.messages.find((m) => m.role === 'system');
    const userMessages = request.messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    const response = await this.client.messages.create({
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
