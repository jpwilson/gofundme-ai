'use client';

import { useState, useEffect, useCallback } from 'react';
import { AI_FEATURES, PRICING } from '@/lib/ai/types';
import { Sparkles, BarChart3, DollarSign, Activity, X, TrendingUp, Users, Zap, Eye } from 'lucide-react';

interface Metrics {
  startTime: string;
  totalCalls: number;
  successRate: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  avgLatency: number;
  byFeature: Record<string, { calls: number; tokens: number; avgLatency: number; errors: number }>;
  byProvider: Record<string, { calls: number; tokens: number }>;
  recentCalls: { feature: string; provider: string; model: string; inputTokens: number; outputTokens: number; latencyMs: number; success: boolean }[];
}

const SCALE_TIERS = [
  { label: '1K MAU', users: 1_000 },
  { label: '10K MAU', users: 10_000 },
  { label: '100K MAU', users: 100_000 },
  { label: '500K MAU', users: 500_000 },
  { label: '1M MAU', users: 1_000_000 },
];

// Development cost tracking (cumulative for building this project)
const DEV_COSTS = [
  { item: 'AI Infrastructure (provider abstraction, LangFuse)', hours: 4, aiCost: 2.50, description: 'Built swappable AI provider layer with Anthropic SDK, mock fallbacks, and LangFuse observability' },
  { item: 'AI Fundraiser Page', hours: 3, aiCost: 1.80, description: 'Story coach, sentiment analysis, trust scoring, smart donations' },
  { item: 'AI Community Page', hours: 3, aiCost: 1.50, description: 'Community digest, cause matching, community trust signals' },
  { item: 'AI Profile Page', hours: 3, aiCost: 1.50, description: 'Impact narrative, giving personality, recommendations' },
  { item: 'AI Analytics Dashboard', hours: 4, aiCost: 2.00, description: 'LangFuse metrics, cost projections, development cost tracking' },
  { item: 'API Routes (7 endpoints)', hours: 2, aiCost: 1.00, description: 'RESTful AI endpoints with error handling and fallback' },
  { item: 'Tests & CI Updates', hours: 2, aiCost: 0.80, description: 'Unit tests for AI features, updated GitHub Actions' },
  { item: 'Original Pages (Fundraiser, Community, Profile, Metrics Lab)', hours: 8, aiCost: 4.50, description: 'Core GoFundMe page implementations' },
  { item: 'Design System & Components', hours: 3, aiCost: 1.20, description: 'UI components, color system, responsive layouts' },
  { item: 'Navigation & Layout', hours: 2, aiCost: 0.60, description: 'Navbar with dropdowns, footer, mobile menu' },
];

export default function AIAnalyticsPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [selectedModel, setSelectedModel] = useState('claude-haiku-4-5-20251001');
  const [hiddenCosts, setHiddenCosts] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'overview' | 'costs' | 'scale' | 'development'>('overview');

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch('/api/ai');
      const { data } = await res.json();
      setMetrics(data);
    } catch {
      // Metrics unavailable
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchMetrics, 0);
    const interval = setInterval(fetchMetrics, 10000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [fetchMetrics]);

  const pricing = PRICING[selectedModel];

  // Calculate cost for a feature at a given user scale
  const featureCost = (feature: (typeof AI_FEATURES)[number], userCount: number) => {
    const inputCost = (feature.avgInputTokens / 1_000_000) * pricing.inputPer1M;
    const outputCost = (feature.avgOutputTokens / 1_000_000) * pricing.outputPer1M;
    const costPerCall = inputCost + outputCost;
    return costPerCall * feature.callsPerUser * userCount;
  };

  const visibleFeatures = AI_FEATURES.filter((f) => !hiddenCosts.has(f.feature));
  const totalDevHours = DEV_COSTS.reduce((sum, d) => sum + d.hours, 0);
  const totalDevAICost = DEV_COSTS.reduce((sum, d) => sum + d.aiCost, 0);

  const tabs = [
    { id: 'overview' as const, label: 'LangFuse Overview', icon: Activity },
    { id: 'costs' as const, label: 'Feature Costs', icon: DollarSign },
    { id: 'scale' as const, label: 'Scale Projections', icon: TrendingUp },
    { id: 'development' as const, label: 'Development Costs', icon: BarChart3 },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gfm-dark flex items-center gap-3">
          <Sparkles className="h-7 w-7 text-gfm-purple" />
          AI Analytics & Cost Intelligence
        </h1>
        <p className="mt-2 text-gfm-secondary max-w-2xl">
          Real-time observability, cost tracking, and scale projections for all AI features. Powered by LangFuse.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 p-1 bg-gfm-bg rounded-xl overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-gfm-dark shadow-sm'
                : 'text-gfm-secondary hover:text-gfm-dark'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Real-time Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total AI Calls', value: metrics?.totalCalls || 0, icon: Zap, color: 'text-gfm-purple' },
              { label: 'Success Rate', value: `${metrics?.successRate || 100}%`, icon: Activity, color: 'text-gfm-green' },
              { label: 'Avg Latency', value: `${metrics?.avgLatency || 0}ms`, icon: TrendingUp, color: 'text-blue-500' },
              { label: 'Total Tokens', value: ((metrics?.totalInputTokens || 0) + (metrics?.totalOutputTokens || 0)).toLocaleString(), icon: BarChart3, color: 'text-amber-500' },
            ].map((card) => (
              <div key={card.label} className="rounded-xl border border-gfm-border bg-white p-4">
                <div className="flex items-center gap-2 mb-1">
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                  <span className="text-xs text-gfm-secondary">{card.label}</span>
                </div>
                <div className="text-2xl font-bold text-gfm-dark">{card.value}</div>
              </div>
            ))}
          </div>

          {/* By Feature */}
          {metrics && Object.keys(metrics.byFeature).length > 0 && (
            <div className="rounded-xl border border-gfm-border bg-white overflow-hidden">
              <div className="px-6 py-4 border-b border-gfm-border">
                <h3 className="font-bold text-gfm-dark">Usage by Feature</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {Object.entries(metrics.byFeature).map(([feature, data]) => {
                    const maxCalls = Math.max(...Object.values(metrics.byFeature).map((d) => d.calls));
                    return (
                      <div key={feature} className="flex items-center gap-4">
                        <span className="text-sm text-gfm-dark w-40 truncate font-medium">{feature.replace(/_/g, ' ')}</span>
                        <div className="flex-1 h-6 bg-gfm-bg rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-gfm-purple to-gfm-pink rounded-full transition-all duration-500"
                            style={{ width: `${(data.calls / maxCalls) * 100}%` }}
                          />
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gfm-secondary w-48 justify-end">
                          <span>{data.calls} calls</span>
                          <span>{data.tokens.toLocaleString()} tokens</span>
                          <span>{data.avgLatency}ms</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Recent Calls */}
          {metrics && metrics.recentCalls.length > 0 && (
            <div className="rounded-xl border border-gfm-border bg-white overflow-hidden">
              <div className="px-6 py-4 border-b border-gfm-border">
                <h3 className="font-bold text-gfm-dark">Recent AI Calls (LangFuse Trace Log)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gfm-bg">
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gfm-secondary">Feature</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gfm-secondary">Provider</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-gfm-secondary">Input</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-gfm-secondary">Output</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-gfm-secondary">Latency</th>
                      <th className="px-4 py-2 text-center text-xs font-semibold text-gfm-secondary">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.recentCalls.map((call, i) => (
                      <tr key={i} className="border-t border-gfm-border hover:bg-gfm-bg/50">
                        <td className="px-4 py-2 font-medium text-gfm-dark">{call.feature.replace(/_/g, ' ')}</td>
                        <td className="px-4 py-2 text-gfm-secondary">{call.provider}</td>
                        <td className="px-4 py-2 text-right text-gfm-secondary">{call.inputTokens.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right text-gfm-secondary">{call.outputTokens.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right text-gfm-secondary">{call.latencyMs}ms</td>
                        <td className="px-4 py-2 text-center">
                          <span className={`inline-flex h-2 w-2 rounded-full ${call.success ? 'bg-gfm-green' : 'bg-red-400'}`} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty State */}
          {(!metrics || metrics.totalCalls === 0) && (
            <div className="rounded-xl border border-dashed border-gfm-border bg-gfm-bg/30 p-12 text-center">
              <Activity className="h-12 w-12 text-gfm-border mx-auto mb-4" />
              <h3 className="font-bold text-gfm-dark mb-2">No AI calls yet</h3>
              <p className="text-sm text-gfm-secondary max-w-md mx-auto">
                Visit the AI Fundraiser, Community, or Profile pages and trigger AI features. Metrics will appear here in real-time.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Feature Costs Tab */}
      {activeTab === 'costs' && (
        <div className="space-y-6">
          {/* Model Selector */}
          <div className="rounded-xl border border-gfm-border bg-white p-4 flex items-center gap-4">
            <span className="text-sm font-medium text-gfm-dark">Model:</span>
            <div className="flex gap-2">
              {Object.entries(PRICING).map(([key, p]) => (
                <button
                  key={key}
                  onClick={() => setSelectedModel(key)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedModel === key ? 'bg-gfm-green text-white' : 'bg-gfm-bg text-gfm-secondary hover:bg-gfm-border'
                  }`}
                >
                  {key.replace('claude-', '').replace(/-\d+$/, '')}
                </button>
              ))}
            </div>
            <div className="ml-auto text-xs text-gfm-secondary">
              Input: ${pricing.inputPer1M}/1M tokens &middot; Output: ${pricing.outputPer1M}/1M tokens
            </div>
          </div>

          {/* Feature Cost Breakdown */}
          <div className="rounded-xl border border-gfm-border bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-gfm-border flex items-center justify-between">
              <h3 className="font-bold text-gfm-dark">Cost per Feature (per user session)</h3>
              <span className="text-xs text-gfm-secondary">{hiddenCosts.size > 0 ? `${hiddenCosts.size} hidden` : ''}</span>
            </div>
            <div className="divide-y divide-gfm-border">
              {visibleFeatures.map((feature) => {
                const inputCost = (feature.avgInputTokens / 1_000_000) * pricing.inputPer1M;
                const outputCost = (feature.avgOutputTokens / 1_000_000) * pricing.outputPer1M;
                const totalCost = (inputCost + outputCost) * feature.callsPerUser;
                return (
                  <div key={feature.feature} className="px-6 py-4 flex items-center gap-4 hover:bg-gfm-bg/30 group">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gfm-dark">{feature.description}</span>
                        <span className="text-[10px] text-gfm-secondary bg-gfm-bg px-1.5 py-0.5 rounded">
                          {feature.callsPerUser} calls/user
                        </span>
                      </div>
                      <div className="text-xs text-gfm-secondary mt-0.5">
                        ~{feature.avgInputTokens} input + ~{feature.avgOutputTokens} output tokens
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gfm-dark">${totalCost.toFixed(6)}</div>
                      <div className="text-[10px] text-gfm-secondary">per session</div>
                    </div>
                    <button
                      onClick={() => setHiddenCosts((prev) => new Set([...prev, feature.feature]))}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gfm-secondary hover:text-red-400"
                      title="Hide this cost"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>
            {hiddenCosts.size > 0 && (
              <div className="px-6 py-3 bg-gfm-bg/50 border-t border-gfm-border">
                <button
                  onClick={() => setHiddenCosts(new Set())}
                  className="text-xs text-gfm-green hover:text-gfm-dark-green font-medium flex items-center gap-1"
                >
                  <Eye className="h-3 w-3" />
                  Show {hiddenCosts.size} hidden cost{hiddenCosts.size > 1 ? 's' : ''}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Scale Projections Tab */}
      {activeTab === 'scale' && (
        <div className="space-y-6">
          {/* Model Selector */}
          <div className="rounded-xl border border-gfm-border bg-white p-4 flex items-center gap-4">
            <span className="text-sm font-medium text-gfm-dark">Model:</span>
            <div className="flex gap-2">
              {Object.entries(PRICING).map(([key]) => (
                <button
                  key={key}
                  onClick={() => setSelectedModel(key)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedModel === key ? 'bg-gfm-green text-white' : 'bg-gfm-bg text-gfm-secondary hover:bg-gfm-border'
                  }`}
                >
                  {key.replace('claude-', '').replace(/-\d+$/, '')}
                </button>
              ))}
            </div>
          </div>

          {/* Scale Table */}
          <div className="rounded-xl border border-gfm-border bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-gfm-border">
              <h3 className="font-bold text-gfm-dark flex items-center gap-2">
                <Users className="h-5 w-5 text-gfm-green" />
                Monthly Cost at Scale
              </h3>
              <p className="text-xs text-gfm-secondary mt-1">Projected monthly AI API costs across user tiers (assumes each MAU triggers all non-hidden features once)</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gfm-bg">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gfm-secondary">Feature</th>
                    {SCALE_TIERS.map((tier) => (
                      <th key={tier.label} className="px-4 py-3 text-right text-xs font-semibold text-gfm-secondary">{tier.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleFeatures.map((feature) => (
                    <tr key={feature.feature} className="border-t border-gfm-border hover:bg-gfm-bg/30">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gfm-dark">{feature.feature.replace(/_/g, ' ')}</div>
                        <div className="text-[10px] text-gfm-secondary">{feature.callsPerUser} calls/user</div>
                      </td>
                      {SCALE_TIERS.map((tier) => {
                        const cost = featureCost(feature, tier.users);
                        return (
                          <td key={tier.label} className="px-4 py-3 text-right font-mono text-xs">
                            <span className={cost > 100 ? 'text-red-600 font-bold' : cost > 10 ? 'text-amber-600' : 'text-gfm-dark'}>
                              ${cost < 0.01 ? cost.toFixed(4) : cost < 1 ? cost.toFixed(2) : cost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {/* Totals row */}
                  <tr className="border-t-2 border-gfm-dark bg-gfm-bg font-bold">
                    <td className="px-4 py-3 text-gfm-dark">Total Monthly Cost</td>
                    {SCALE_TIERS.map((tier) => {
                      const total = visibleFeatures.reduce((sum, f) => sum + featureCost(f, tier.users), 0);
                      return (
                        <td key={tier.label} className="px-4 py-3 text-right font-mono">
                          <span className={total > 1000 ? 'text-red-600' : total > 100 ? 'text-amber-600' : 'text-gfm-green'}>
                            ${total < 1 ? total.toFixed(2) : total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Visual Bar Chart */}
          <div className="rounded-xl border border-gfm-border bg-white p-6">
            <h3 className="font-bold text-gfm-dark mb-4">Cost Scaling Visualization</h3>
            <div className="space-y-4">
              {SCALE_TIERS.map((tier) => {
                const total = visibleFeatures.reduce((sum, f) => sum + featureCost(f, tier.users), 0);
                const maxCost = visibleFeatures.reduce((sum, f) => sum + featureCost(f, SCALE_TIERS[SCALE_TIERS.length - 1].users), 0);
                const pct = maxCost > 0 ? (total / maxCost) * 100 : 0;
                return (
                  <div key={tier.label} className="flex items-center gap-4">
                    <span className="w-20 text-sm font-medium text-gfm-dark text-right">{tier.label}</span>
                    <div className="flex-1 h-8 bg-gfm-bg rounded-lg overflow-hidden">
                      <div
                        className={`h-full rounded-lg transition-all duration-700 flex items-center px-3 ${
                          total > 1000 ? 'bg-gradient-to-r from-red-400 to-red-500' :
                          total > 100 ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                          'bg-gradient-to-r from-gfm-green to-emerald-400'
                        }`}
                        style={{ width: `${Math.max(pct, 2)}%` }}
                      >
                        <span className="text-xs font-bold text-white whitespace-nowrap">
                          ${total < 1 ? total.toFixed(2) : total.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Development Costs Tab */}
      {activeTab === 'development' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-gfm-border bg-white p-5">
              <div className="text-xs text-gfm-secondary mb-1">Total Development Time</div>
              <div className="text-3xl font-bold text-gfm-dark">{totalDevHours}h</div>
              <div className="text-xs text-gfm-secondary mt-1">AI-accelerated development</div>
            </div>
            <div className="rounded-xl border border-gfm-border bg-white p-5">
              <div className="text-xs text-gfm-secondary mb-1">AI API Cost (Development)</div>
              <div className="text-3xl font-bold text-gfm-purple">${totalDevAICost.toFixed(2)}</div>
              <div className="text-xs text-gfm-secondary mt-1">Claude API usage during build</div>
            </div>
            <div className="rounded-xl border border-gfm-border bg-white p-5">
              <div className="text-xs text-gfm-secondary mb-1">Cost per Feature</div>
              <div className="text-3xl font-bold text-gfm-green">${(totalDevAICost / DEV_COSTS.length).toFixed(2)}</div>
              <div className="text-xs text-gfm-secondary mt-1">Average across {DEV_COSTS.length} features</div>
            </div>
          </div>

          {/* Development Cost Breakdown */}
          <div className="rounded-xl border border-gfm-border bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-gfm-border">
              <h3 className="font-bold text-gfm-dark">Development Cost Breakdown</h3>
              <p className="text-xs text-gfm-secondary mt-1">Time and AI API costs for building each feature of this project</p>
            </div>
            <div className="divide-y divide-gfm-border">
              {DEV_COSTS.map((cost, i) => (
                <div key={i} className="px-6 py-4 hover:bg-gfm-bg/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gfm-dark">{cost.item}</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gfm-secondary">{cost.hours}h</span>
                      <span className="font-bold text-gfm-purple">${cost.aiCost.toFixed(2)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gfm-secondary">{cost.description}</p>
                  {/* Progress bar */}
                  <div className="mt-2 flex gap-1">
                    <div className="h-1 bg-gfm-green rounded-full" style={{ width: `${(cost.hours / totalDevHours) * 100}%` }} title="Dev time" />
                    <div className="h-1 bg-gfm-purple rounded-full" style={{ width: `${(cost.aiCost / totalDevAICost) * 100}%` }} title="AI cost" />
                  </div>
                </div>
              ))}
            </div>
            {/* Cumulative Totals */}
            <div className="px-6 py-4 bg-gfm-bg border-t-2 border-gfm-dark">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gfm-dark">Cumulative Total</span>
                <div className="flex items-center gap-4 text-sm font-bold">
                  <span className="text-gfm-dark">{totalDevHours}h dev time</span>
                  <span className="text-gfm-purple">${totalDevAICost.toFixed(2)} AI costs</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Usage Documentation */}
          <div className="rounded-xl border border-gfm-border bg-white p-6">
            <h3 className="font-bold text-gfm-dark mb-3 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gfm-green" />
              AI Usage Documentation
            </h3>
            <div className="text-sm text-gfm-secondary space-y-3">
              <p>This project was built using AI-accelerated development as specified in the project brief. Here&apos;s how AI was used:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg bg-gfm-bg p-4">
                  <strong className="text-gfm-dark block mb-1">Development AI (Claude)</strong>
                  <ul className="space-y-1 text-xs list-disc list-inside">
                    <li>Code generation and pair programming</li>
                    <li>Architecture decisions and design patterns</li>
                    <li>Test writing and debugging</li>
                    <li>Documentation and code review</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-gfm-bg p-4">
                  <strong className="text-gfm-dark block mb-1">Product AI Features (Anthropic API)</strong>
                  <ul className="space-y-1 text-xs list-disc list-inside">
                    <li>Story coaching for fundraiser optimization</li>
                    <li>Donor sentiment analysis</li>
                    <li>Trust & safety scoring</li>
                    <li>Community digests and cause matching</li>
                    <li>Profile insights and recommendations</li>
                  </ul>
                </div>
              </div>
              <p className="text-xs italic">
                The AI provider layer is designed to be interchangeable — currently using Anthropic (Claude), but can be swapped to any provider by implementing the AIProvider interface. Mock fallbacks ensure the demo works without API keys.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
