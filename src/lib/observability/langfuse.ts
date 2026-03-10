import { Langfuse } from 'langfuse';

// ============================================================
// LangFuse Observability Integration
// ============================================================

interface AICallEvent {
  feature: string;
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  success: boolean;
  error?: string;
}

// In-memory metrics store for the analytics dashboard
// In production, this would be persisted to a database
interface MetricsStore {
  calls: AICallEvent[];
  startTime: string;
}

const metricsStore: MetricsStore = {
  calls: [],
  startTime: new Date().toISOString(),
};

// LangFuse client singleton
let _langfuse: Langfuse | null = null;

function getLangfuse(): Langfuse | null {
  if (_langfuse) return _langfuse;

  const secretKey = process.env.LANGFUSE_SECRET_KEY;
  const publicKey = process.env.LANGFUSE_PUBLIC_KEY;
  const baseUrl = process.env.LANGFUSE_BASEURL;

  if (secretKey && publicKey) {
    _langfuse = new Langfuse({
      secretKey,
      publicKey,
      baseUrl: baseUrl || 'https://cloud.langfuse.com',
    });
    return _langfuse;
  }

  return null;
}

/**
 * Track an AI call for observability.
 * Sends to LangFuse if configured, always stores in-memory for analytics page.
 */
export function trackAICall(event: AICallEvent): void {
  // Always store in memory for analytics dashboard
  metricsStore.calls.push(event);

  // Keep only last 1000 events in memory
  if (metricsStore.calls.length > 1000) {
    metricsStore.calls = metricsStore.calls.slice(-1000);
  }

  // Send to LangFuse if configured
  const langfuse = getLangfuse();
  if (langfuse) {
    const trace = langfuse.trace({
      name: event.feature,
      metadata: {
        provider: event.provider,
        model: event.model,
        success: event.success,
      },
    });

    trace.generation({
      name: event.feature,
      model: event.model,
      usage: {
        input: event.inputTokens,
        output: event.outputTokens,
      },
      metadata: {
        provider: event.provider,
        latencyMs: event.latencyMs,
        error: event.error,
      },
    });
  }
}

/**
 * Get aggregated metrics for the analytics dashboard.
 */
export function getMetrics() {
  const calls = metricsStore.calls;
  const totalCalls = calls.length;
  const successCalls = calls.filter((c) => c.success).length;
  const totalInputTokens = calls.reduce((sum, c) => sum + c.inputTokens, 0);
  const totalOutputTokens = calls.reduce((sum, c) => sum + c.outputTokens, 0);
  const avgLatency =
    totalCalls > 0
      ? Math.round(calls.reduce((sum, c) => sum + c.latencyMs, 0) / totalCalls)
      : 0;

  // Group by feature
  const byFeature: Record<string, { calls: number; tokens: number; avgLatency: number; errors: number }> = {};
  for (const call of calls) {
    if (!byFeature[call.feature]) {
      byFeature[call.feature] = { calls: 0, tokens: 0, avgLatency: 0, errors: 0 };
    }
    byFeature[call.feature].calls++;
    byFeature[call.feature].tokens += call.inputTokens + call.outputTokens;
    byFeature[call.feature].avgLatency += call.latencyMs;
    if (!call.success) byFeature[call.feature].errors++;
  }
  for (const key of Object.keys(byFeature)) {
    byFeature[key].avgLatency = Math.round(byFeature[key].avgLatency / byFeature[key].calls);
  }

  // Group by provider
  const byProvider: Record<string, { calls: number; tokens: number }> = {};
  for (const call of calls) {
    if (!byProvider[call.provider]) {
      byProvider[call.provider] = { calls: 0, tokens: 0 };
    }
    byProvider[call.provider].calls++;
    byProvider[call.provider].tokens += call.inputTokens + call.outputTokens;
  }

  return {
    startTime: metricsStore.startTime,
    totalCalls,
    successRate: totalCalls > 0 ? Math.round((successCalls / totalCalls) * 100) : 100,
    totalInputTokens,
    totalOutputTokens,
    avgLatency,
    byFeature,
    byProvider,
    recentCalls: calls.slice(-20).reverse(),
  };
}
