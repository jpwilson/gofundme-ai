'use client';

import { BackToHome } from '@/components/ui/BackToHome';

import { useState } from 'react';
import {
  Activity, Brain, GitBranch, BarChart3, AlertTriangle, CheckCircle2,
  XCircle, Clock, Zap, Search, ChevronDown, ChevronRight, Eye,
  TrendingUp, Shield, Users, Workflow, Target,
} from 'lucide-react';

// --- Mock Data ---

type TraceStep = {
  name: string;
  durationMs: number;
  input: string;
  output: string;
  toolsUsed: string[];
  decision: string;
  confidence: number;
};

type AgentTrace = {
  traceId: string;
  agentName: string;
  startTime: string;
  durationMs: number;
  status: 'success' | 'error' | 'timeout';
  steps: TraceStep[];
};

const AGENT_TRACES: AgentTrace[] = [
  { traceId: 'a3f8c1d9e2b7', agentName: 'FraudDetector', startTime: '2026-03-10T09:14:22Z', durationMs: 287, status: 'success',
    steps: [
      { name: 'Parse Transaction', durationMs: 42, input: 'txn_id=TXN-88291, amount=$2,500...', output: 'Parsed: high-value donation flagged', toolsUsed: ['json_parser'], decision: 'Flag for review', confidence: 82 },
      { name: 'Behavioral Analysis', durationMs: 118, input: 'user_id=U-4419, history_depth=90d...', output: 'Pattern: first-time donor, velocity ok', toolsUsed: ['vector_search', 'user_profile_db'], decision: 'Low behavioral risk', confidence: 91 },
      { name: 'Network Graph Check', durationMs: 89, input: 'ip=203.0.113.42, device_fp=d8a2f...', output: 'No known fraud rings detected', toolsUsed: ['graph_db', 'ip_reputation'], decision: 'Clear — no network risk', confidence: 95 },
      { name: 'Final Verdict', durationMs: 38, input: 'Aggregate scores: [82, 91, 95]', output: 'ALLOW with monitoring flag', toolsUsed: ['decision_engine'], decision: 'Allow transaction', confidence: 89 },
    ] },
  { traceId: 'b7e2c4a0f193', agentName: 'StoryCoach', startTime: '2026-03-10T09:12:05Z', durationMs: 512, status: 'success',
    steps: [
      { name: 'Content Ingestion', durationMs: 65, input: 'fundraiser_id=F-2291, draft text...', output: 'Extracted: 342 words, 2 images ref', toolsUsed: ['text_parser'], decision: 'Content parsed successfully', confidence: 99 },
      { name: 'Sentiment Scan', durationMs: 134, input: 'Full draft text for sentiment...', output: 'Tone: hopeful but lacks urgency', toolsUsed: ['sentiment_model', 'vector_search'], decision: 'Suggest stronger opening', confidence: 78 },
      { name: 'Structure Analysis', durationMs: 156, input: 'Paragraph structure, CTA placement...', output: 'Missing: clear ask, timeline, updates plan', toolsUsed: ['template_matcher'], decision: 'Recommend 3 structural changes', confidence: 85 },
      { name: 'Generate Suggestions', durationMs: 112, input: 'Improvement areas: opening, CTA...', output: '5 actionable suggestions generated', toolsUsed: ['llm_generate', 'a_b_optimizer'], decision: 'Return coaching suggestions', confidence: 88 },
      { name: 'Safety Check', durationMs: 45, input: 'Generated suggestions text...', output: 'All suggestions pass safety filters', toolsUsed: ['content_filter'], decision: 'Safe to display', confidence: 97 },
    ] },
  { traceId: 'c9d1e3f5a824', agentName: 'CauseMapper', startTime: '2026-03-10T09:10:47Z', durationMs: 198, status: 'success',
    steps: [
      { name: 'Category Detection', durationMs: 54, input: 'fundraiser text: "medical bills..."', output: 'Category: Medical (0.94), Emergency (0.72)', toolsUsed: ['classifier_v3'], decision: 'Primary: Medical', confidence: 94 },
      { name: 'Geographic Mapping', durationMs: 67, input: 'Location signals: Austin, TX...', output: 'Region: South Central US, metro area', toolsUsed: ['geo_resolver'], decision: 'Map to Austin metro', confidence: 91 },
      { name: 'Similar Cause Linking', durationMs: 77, input: 'Medical + Austin + urgency=high...', output: 'Found 14 similar active campaigns', toolsUsed: ['vector_search', 'similarity_engine'], decision: 'Link to 5 most relevant', confidence: 86 },
    ] },
  { traceId: 'd2a4b6c8e0f1', agentName: 'TrustScorer', startTime: '2026-03-10T09:08:33Z', durationMs: 423, status: 'error',
    steps: [
      { name: 'Identity Verification', durationMs: 112, input: 'user_id=U-7723, docs submitted...', output: 'ID match: partial (name mismatch)', toolsUsed: ['id_verify_api', 'ocr_engine'], decision: 'Flag identity discrepancy', confidence: 62 },
      { name: 'Social Proof Check', durationMs: 98, input: 'Social links: twitter, linkedin...', output: 'Twitter: valid, LinkedIn: 404 error', toolsUsed: ['social_scraper'], decision: 'Partial social verification', confidence: 55 },
      { name: 'Historical Trust Data', durationMs: 145, input: 'Previous campaigns: 0, account age...', output: 'ERROR: Trust DB timeout after 2000ms', toolsUsed: ['trust_db'], decision: 'Unable to complete — DB timeout', confidence: 0 },
      { name: 'Score Aggregation', durationMs: 68, input: 'Partial scores: [62, 55, null]', output: 'Incomplete score: manual review required', toolsUsed: ['decision_engine'], decision: 'Escalate to human review', confidence: 45 },
    ] },
  { traceId: 'e5f7a9b1c3d2', agentName: 'DonorMatcher', startTime: '2026-03-10T09:06:11Z', durationMs: 345, status: 'success',
    steps: [
      { name: 'Donor Profile Load', durationMs: 38, input: 'donor_id=D-1192, preferences...', output: 'Interests: education, local, recurring', toolsUsed: ['user_profile_db'], decision: 'Profile loaded', confidence: 99 },
      { name: 'Cause Matching', durationMs: 156, input: 'Preferences vs active campaigns...', output: 'Top 8 matches scored and ranked', toolsUsed: ['vector_search', 'ranking_model'], decision: 'Return top 5 matches', confidence: 87 },
      { name: 'Personalization', durationMs: 89, input: 'Match results + donor history...', output: 'Personalized messaging for each match', toolsUsed: ['llm_generate'], decision: 'Customize presentation', confidence: 83 },
      { name: 'Dedup & Filter', durationMs: 62, input: 'Already donated: [F-112, F-445]...', output: 'Removed 1 duplicate, 4 final recs', toolsUsed: ['dedup_filter'], decision: 'Serve 4 recommendations', confidence: 96 },
    ] },
  { traceId: 'f1a3c5d7e9b0', agentName: 'FraudDetector', startTime: '2026-03-10T09:03:55Z', durationMs: 890, status: 'timeout',
    steps: [
      { name: 'Parse Transaction', durationMs: 51, input: 'txn_id=TXN-90102, amount=$48,000...', output: 'Parsed: extremely high value', toolsUsed: ['json_parser'], decision: 'Critical review required', confidence: 72 },
      { name: 'Behavioral Analysis', durationMs: 210, input: 'user_id=U-0091, new account...', output: 'Red flags: new account, high amount', toolsUsed: ['vector_search', 'user_profile_db'], decision: 'High behavioral risk', confidence: 34 },
      { name: 'Network Graph Check', durationMs: 629, input: 'ip=198.51.100.7, device cluster...', output: 'TIMEOUT: Graph traversal exceeded limit', toolsUsed: ['graph_db'], decision: 'Unable to complete graph check', confidence: 0 },
    ] },
  { traceId: 'a0b2d4f6e8c1', agentName: 'StoryCoach', startTime: '2026-03-10T08:58:22Z', durationMs: 310, status: 'success',
    steps: [
      { name: 'Content Ingestion', durationMs: 48, input: 'fundraiser_id=F-3301, update post...', output: 'Extracted: 128 words, progress update', toolsUsed: ['text_parser'], decision: 'Update content parsed', confidence: 99 },
      { name: 'Engagement Prediction', durationMs: 134, input: 'Update style, timing, audience...', output: 'Predicted engagement: above average', toolsUsed: ['engagement_model', 'vector_search'], decision: 'Good timing for update', confidence: 81 },
      { name: 'Tone Calibration', durationMs: 128, input: 'Gratitude tone check, donor names...', output: 'Tone appropriate, mentions 3 donors', toolsUsed: ['sentiment_model'], decision: 'Approve with minor edits', confidence: 90 },
    ] },
  { traceId: 'b4c6e8a0d2f1', agentName: 'CauseMapper', startTime: '2026-03-10T08:55:41Z', durationMs: 245, status: 'success',
    steps: [
      { name: 'Category Detection', durationMs: 61, input: 'fundraiser text: "school supplies..."', output: 'Category: Education (0.97), Community (0.63)', toolsUsed: ['classifier_v3'], decision: 'Primary: Education', confidence: 97 },
      { name: 'Impact Estimation', durationMs: 102, input: 'Goal=$5,000, category=Education...', output: 'Est. impact: 120 students served', toolsUsed: ['impact_model', 'benchmark_db'], decision: 'High impact per dollar', confidence: 79 },
      { name: 'Trending Analysis', durationMs: 82, input: 'Education + back-to-school season...', output: 'Trending score: 8.4/10 for timing', toolsUsed: ['trend_analyzer'], decision: 'Boost visibility recommended', confidence: 88 },
    ] },
];

const AGENT_METRICS = {
  totalTraces: 4892, successRate: 96.3, avgDurationMs: 342, p95DurationMs: 890,
  errorRate: 2.1, avgSteps: 3.4, totalToolCalls: 15847, topTool: 'vector_search',
};

const BEHAVIOR_PATTERNS = [
  { name: 'Conservative Fraud Thresholds', frequency: 342, avgConfidence: 88, description: 'FraudDetector consistently applies stricter thresholds for new accounts, flagging 23% more transactions than baseline.', isAnomalous: false },
  { name: 'Story Length Bias', frequency: 187, avgConfidence: 76, description: 'StoryCoach provides more detailed suggestions for shorter fundraiser stories, averaging 5.2 suggestions vs 2.1 for longer ones.', isAnomalous: false },
  { name: 'Geographic Clustering', frequency: 256, avgConfidence: 91, description: 'CauseMapper links causes within the same metro area 3.4x more often than cross-region, even when similarity scores are comparable.', isAnomalous: true },
  { name: 'Confidence Deflation', frequency: 89, avgConfidence: 52, description: 'TrustScorer reports lower confidence than other agents on equivalent data quality, potentially under-trusting valid fundraisers.', isAnomalous: true },
  { name: 'Recurring Donor Preference', frequency: 411, avgConfidence: 84, description: 'DonorMatcher weights recurring donation history 2.8x higher than one-time donations in match scoring.', isAnomalous: false },
  { name: 'Timeout Cascade', frequency: 12, avgConfidence: 0, description: 'When graph_db times out in FraudDetector, downstream TrustScorer also fails within 200ms due to shared connection pool exhaustion.', isAnomalous: true },
];

type DecisionEntry = {
  timestamp: string;
  agent: string;
  decision: string;
  reasoning: string;
  confidence: number;
  outcome: 'correct' | 'incorrect' | 'pending';
};

const DECISION_LOG: DecisionEntry[] = [
  { timestamp: '2026-03-10T09:14:22Z', agent: 'FraudDetector', decision: 'Allow transaction TXN-88291', reasoning: 'First-time donor with $2,500 donation. Behavioral analysis shows normal velocity, no fraud ring connections detected. High-value but within acceptable range for verified account.', confidence: 89, outcome: 'correct' },
  { timestamp: '2026-03-10T09:12:05Z', agent: 'StoryCoach', decision: 'Suggest 5 story improvements', reasoning: 'Draft lacks urgency in opening and has no clear call-to-action. Structure analysis found missing timeline and update plan. Generated improvements focus on emotional connection and clarity.', confidence: 88, outcome: 'correct' },
  { timestamp: '2026-03-10T09:10:47Z', agent: 'CauseMapper', decision: 'Categorize as Medical, link 5 campaigns', reasoning: 'Text analysis strongly indicates medical emergency fundraiser. Geographic proximity to similar campaigns in Austin metro enables local community support linkage.', confidence: 86, outcome: 'correct' },
  { timestamp: '2026-03-10T09:08:33Z', agent: 'TrustScorer', decision: 'Escalate to human review', reasoning: 'Identity verification showed name mismatch on submitted documents. LinkedIn profile returned 404. Trust database timed out preventing full scoring. Insufficient data for automated decision.', confidence: 45, outcome: 'pending' },
  { timestamp: '2026-03-10T09:06:11Z', agent: 'DonorMatcher', decision: 'Serve 4 campaign recommendations', reasoning: 'Donor profile indicates preference for local education causes with recurring donations. Matched against 8 candidates, filtered duplicates and already-donated campaigns. Top 4 have >80% match score.', confidence: 96, outcome: 'correct' },
  { timestamp: '2026-03-10T09:03:55Z', agent: 'FraudDetector', decision: 'Block transaction TXN-90102', reasoning: 'Extremely high value ($48,000) from new account. Multiple behavioral red flags. Graph traversal timed out preventing full network analysis — defaulting to deny on insufficient data.', confidence: 34, outcome: 'correct' },
  { timestamp: '2026-03-10T08:58:22Z', agent: 'StoryCoach', decision: 'Approve update with minor edits', reasoning: 'Progress update has appropriate gratitude tone, mentions specific donors. Engagement prediction is above average. Minor edits suggested for formatting consistency.', confidence: 90, outcome: 'correct' },
  { timestamp: '2026-03-10T08:55:41Z', agent: 'CauseMapper', decision: 'Boost visibility for education campaign', reasoning: 'Back-to-school timing gives trending score of 8.4/10. High impact-per-dollar estimate of 120 students served at $5,000 goal. Category confidence is 97%.', confidence: 88, outcome: 'pending' },
  { timestamp: '2026-03-10T08:51:09Z', agent: 'TrustScorer', decision: 'Assign trust score 78/100', reasoning: 'Organizer has 2 previous successful campaigns, verified identity, active social profiles. Slight deduction for no institutional backing. Score within normal range for individual fundraisers.', confidence: 78, outcome: 'correct' },
  { timestamp: '2026-03-10T08:47:33Z', agent: 'DonorMatcher', decision: 'Skip matching for anonymous donor', reasoning: 'Donor opted out of personalized recommendations. Respecting privacy preference and serving only trending campaigns from general pool.', confidence: 99, outcome: 'correct' },
  { timestamp: '2026-03-10T08:44:18Z', agent: 'FraudDetector', decision: 'Allow transaction TXN-87455', reasoning: 'Returning donor with consistent giving pattern. Amount ($150) within historical range. All network checks passed. No risk signals detected.', confidence: 97, outcome: 'incorrect' },
  { timestamp: '2026-03-10T08:40:02Z', agent: 'CauseMapper', decision: 'Recategorize from Memorial to Medical', reasoning: 'Updated fundraiser text shifted focus from memorial tribute to covering outstanding medical bills. Reclassification triggers new matching pool. Confidence in new category is 82%.', confidence: 82, outcome: 'correct' },
];

const DAILY_TRACES = [410, 388, 425, 392, 401, 378, 445, 462, 398, 412, 435, 390, 448, 408];
const DAY_LABELS = ['Feb 25', 'Feb 26', 'Feb 27', 'Feb 28', 'Mar 1', 'Mar 2', 'Mar 3', 'Mar 4', 'Mar 5', 'Mar 6', 'Mar 7', 'Mar 8', 'Mar 9', 'Mar 10'];

const AGENT_HEALTH: { name: string; status: 'healthy' | 'degraded' | 'failing'; latency: number; errorRate: number }[] = [
  { name: 'FraudDetector', status: 'healthy', latency: 312, errorRate: 1.2 },
  { name: 'StoryCoach', status: 'healthy', latency: 408, errorRate: 0.8 },
  { name: 'CauseMapper', status: 'healthy', latency: 215, errorRate: 0.3 },
  { name: 'TrustScorer', status: 'degraded', latency: 623, errorRate: 4.7 },
  { name: 'DonorMatcher', status: 'healthy', latency: 298, errorRate: 1.1 },
];

type Tab = 'traces' | 'decisions' | 'patterns' | 'metrics';
type OutcomeFilter = 'all' | 'correct' | 'incorrect' | 'pending';

const STATUS_STYLES = { success: 'bg-green-100 text-green-700', error: 'bg-red-100 text-red-700', timeout: 'bg-amber-100 text-amber-700' };
const OUTCOME_STYLES = { correct: 'bg-green-100 text-green-700', incorrect: 'bg-red-100 text-red-700', pending: 'bg-amber-100 text-amber-700' };
const HEALTH_DOT = { healthy: 'bg-green-500', degraded: 'bg-amber-500', failing: 'bg-red-500' };

const AGENT_COLORS: Record<string, string> = {
  FraudDetector: 'bg-red-100 text-red-700', StoryCoach: 'bg-purple-100 text-purple-700',
  CauseMapper: 'bg-blue-100 text-blue-700', TrustScorer: 'bg-amber-100 text-amber-700',
  DonorMatcher: 'bg-emerald-100 text-emerald-700',
};

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function AgentObservabilityPage() {
  const [tab, setTab] = useState<Tab>('traces');
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);
  const [outcomeFilter, setOutcomeFilter] = useState<OutcomeFilter>('all');

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'traces', label: 'Traces', icon: <GitBranch size={16} /> },
    { key: 'decisions', label: 'Decisions', icon: <Brain size={16} /> },
    { key: 'patterns', label: 'Patterns', icon: <Eye size={16} /> },
    { key: 'metrics', label: 'Metrics', icon: <BarChart3 size={16} /> },
  ];

  const filteredDecisions = outcomeFilter === 'all' ? DECISION_LOG : DECISION_LOG.filter(d => d.outcome === outcomeFilter);
  const correctDecisions = DECISION_LOG.filter(d => d.outcome === 'correct');
  const incorrectDecisions = DECISION_LOG.filter(d => d.outcome === 'incorrect');
  const correctPct = ((correctDecisions.length / (correctDecisions.length + incorrectDecisions.length)) * 100).toFixed(1);
  const avgConfCorrect = (correctDecisions.reduce((s, d) => s + d.confidence, 0) / correctDecisions.length).toFixed(0);
  const avgConfIncorrect = incorrectDecisions.length > 0 ? (incorrectDecisions.reduce((s, d) => s + d.confidence, 0) / incorrectDecisions.length).toFixed(0) : 'N/A';

  const maxDaily = Math.max(...DAILY_TRACES);

  return (
    <><BackToHome /><div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gfm-dark">Agent Observability</h1>
        <p className="mt-1 text-sm text-gfm-secondary">Interpret agent behavior, trace decisions, and detect anomalous patterns.</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg border border-gfm-border bg-gfm-bg p-1">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors ${tab === t.key ? 'bg-white text-gfm-dark shadow-sm' : 'text-gfm-secondary hover:text-gfm-dark'}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* Traces Tab */}
      {tab === 'traces' && (
        <div className="space-y-3">
          {AGENT_TRACES.map(trace => {
            const isOpen = expandedTraceId === trace.traceId;
            return (
              <div key={trace.traceId} className="rounded-xl border border-gfm-border bg-white">
                <button onClick={() => setExpandedTraceId(isOpen ? null : trace.traceId)}
                  className="flex w-full items-center gap-3 p-4 text-left">
                  {isOpen ? <ChevronDown size={16} className="text-gfm-secondary" /> : <ChevronRight size={16} className="text-gfm-secondary" />}
                  <code className="text-xs text-gfm-secondary">{trace.traceId.slice(0, 10)}...</code>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${AGENT_COLORS[trace.agentName] ?? 'bg-gray-100 text-gray-700'}`}>{trace.agentName}</span>
                  <span className="text-xs text-gfm-secondary">{fmtTime(trace.startTime)}</span>
                  <span className="ml-auto flex items-center gap-1 text-xs text-gfm-secondary"><Clock size={12} />{trace.durationMs}ms</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[trace.status]}`}>{trace.status}</span>
                </button>
                {isOpen && (
                  <div className="border-t border-gfm-border px-4 pb-4 pt-3">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gfm-secondary">Step-by-Step Waterfall</p>
                    <div className="relative space-y-0">
                      {trace.steps.map((step, i) => {
                        const pct = Math.max((step.durationMs / trace.durationMs) * 100, 8);
                        return (
                          <div key={i} className="relative flex gap-3 pb-4">
                            {/* Vertical connector */}
                            <div className="flex w-5 flex-col items-center">
                              <div className={`h-3 w-3 rounded-full border-2 ${step.confidence > 70 ? 'border-green-500 bg-green-100' : step.confidence > 40 ? 'border-amber-500 bg-amber-100' : 'border-red-500 bg-red-100'}`} />
                              {i < trace.steps.length - 1 && <div className="w-0.5 flex-1 bg-gfm-border" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gfm-dark">{step.name}</span>
                                <span className="text-xs text-gfm-secondary">{step.durationMs}ms</span>
                              </div>
                              {/* Duration bar */}
                              <div className="mt-1 h-2 rounded-full bg-gfm-bg">
                                <div className="h-2 rounded-full bg-gfm-green" style={{ width: `${pct}%` }} />
                              </div>
                              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                <div><span className="text-gfm-secondary">In:</span> <span className="text-gfm-dark">{step.input}</span></div>
                                <div><span className="text-gfm-secondary">Out:</span> <span className="text-gfm-dark">{step.output}</span></div>
                              </div>
                              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                {step.toolsUsed.map(t => (
                                  <span key={t} className="rounded bg-gfm-bg px-1.5 py-0.5 text-[10px] font-medium text-gfm-secondary">{t}</span>
                                ))}
                                <span className="ml-2 text-xs text-gfm-dark"><strong>Decision:</strong> {step.decision}</span>
                                <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold ${step.confidence > 70 ? 'bg-green-100 text-green-700' : step.confidence > 40 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                  {step.confidence}% conf
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Decisions Tab */}
      {tab === 'decisions' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-gfm-border bg-white p-5 text-center">
              <p className="text-2xl font-bold text-gfm-green">{correctPct}%</p>
              <p className="text-xs text-gfm-secondary">Decision Accuracy</p>
            </div>
            <div className="rounded-xl border border-gfm-border bg-white p-5 text-center">
              <p className="text-2xl font-bold text-gfm-dark">{avgConfCorrect}</p>
              <p className="text-xs text-gfm-secondary">Avg Confidence (Correct)</p>
            </div>
            <div className="rounded-xl border border-gfm-border bg-white p-5 text-center">
              <p className="text-2xl font-bold text-red-600">{avgConfIncorrect}</p>
              <p className="text-xs text-gfm-secondary">Avg Confidence (Incorrect)</p>
            </div>
          </div>

          <div className="flex gap-2">
            {(['all', 'correct', 'incorrect', 'pending'] as OutcomeFilter[]).map(f => (
              <button key={f} onClick={() => setOutcomeFilter(f)}
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${outcomeFilter === f ? 'bg-gfm-green text-white' : 'bg-gfm-bg text-gfm-secondary hover:text-gfm-dark'}`}>
                {f} {f !== 'all' && `(${DECISION_LOG.filter(d => d.outcome === f).length})`}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredDecisions.map((d, i) => (
              <div key={i} className="rounded-xl border border-gfm-border bg-white p-5">
                <div className="mb-2 flex items-center gap-3">
                  <span className="text-xs text-gfm-secondary">{fmtTime(d.timestamp)}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${AGENT_COLORS[d.agent] ?? 'bg-gray-100 text-gray-700'}`}>{d.agent}</span>
                  <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-medium ${OUTCOME_STYLES[d.outcome]}`}>{d.outcome}</span>
                </div>
                <p className="mb-1 text-sm font-semibold text-gfm-dark">{d.decision}</p>
                <p className="mb-3 text-xs leading-relaxed text-gfm-secondary">{d.reasoning}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gfm-secondary">Confidence</span>
                  <div className="h-2 flex-1 rounded-full bg-gfm-bg">
                    <div className={`h-2 rounded-full ${d.confidence > 70 ? 'bg-gfm-green' : d.confidence > 40 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${d.confidence}%` }} />
                  </div>
                  <span className="text-xs font-medium text-gfm-dark">{d.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Patterns Tab */}
      {tab === 'patterns' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-gfm-border bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <Search size={16} className="text-gfm-green" />
              <h2 className="text-sm font-semibold text-gfm-dark">Pattern Analysis Summary</h2>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center text-xs">
              <div><p className="text-lg font-bold text-gfm-dark">{BEHAVIOR_PATTERNS.length}</p><p className="text-gfm-secondary">Patterns Detected</p></div>
              <div><p className="text-lg font-bold text-amber-600">{BEHAVIOR_PATTERNS.filter(p => p.isAnomalous).length}</p><p className="text-gfm-secondary">Anomalous</p></div>
              <div><p className="text-lg font-bold text-gfm-green">{(BEHAVIOR_PATTERNS.reduce((s, p) => s + p.avgConfidence, 0) / BEHAVIOR_PATTERNS.length).toFixed(0)}</p><p className="text-gfm-secondary">Avg Confidence</p></div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {BEHAVIOR_PATTERNS.map((p, i) => (
              <div key={i} className={`rounded-xl border bg-white p-5 ${p.isAnomalous ? 'border-amber-400' : 'border-gfm-border'}`}>
                <div className="mb-2 flex items-center gap-2">
                  {p.isAnomalous && <AlertTriangle size={14} className="text-amber-500" />}
                  <h3 className="text-sm font-semibold text-gfm-dark">{p.name}</h3>
                </div>
                <p className="mb-3 text-xs leading-relaxed text-gfm-secondary">{p.description}</p>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-gfm-secondary">Freq: <strong className="text-gfm-dark">{p.frequency}</strong></span>
                  <div className="flex flex-1 items-center gap-2">
                    <span className="text-gfm-secondary">Conf:</span>
                    <div className="h-1.5 flex-1 rounded-full bg-gfm-bg">
                      <div className={`h-1.5 rounded-full ${p.avgConfidence > 70 ? 'bg-gfm-green' : p.avgConfidence > 40 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${p.avgConfidence}%` }} />
                    </div>
                    <span className="font-medium text-gfm-dark">{p.avgConfidence}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metrics Tab */}
      {tab === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Total Traces', value: AGENT_METRICS.totalTraces.toLocaleString(), icon: <Activity size={16} /> },
              { label: 'Success Rate', value: `${AGENT_METRICS.successRate}%`, icon: <CheckCircle2 size={16} /> },
              { label: 'Avg Duration', value: `${AGENT_METRICS.avgDurationMs}ms`, icon: <Clock size={16} /> },
              { label: 'P95 Duration', value: `${AGENT_METRICS.p95DurationMs}ms`, icon: <TrendingUp size={16} /> },
              { label: 'Error Rate', value: `${AGENT_METRICS.errorRate}%`, icon: <XCircle size={16} /> },
              { label: 'Avg Steps', value: String(AGENT_METRICS.avgSteps), icon: <Workflow size={16} /> },
              { label: 'Total Tool Calls', value: AGENT_METRICS.totalToolCalls.toLocaleString(), icon: <Zap size={16} /> },
              { label: 'Top Tool', value: AGENT_METRICS.topTool, icon: <Target size={16} /> },
            ].map((m, i) => (
              <div key={i} className="rounded-xl border border-gfm-border bg-white p-5">
                <div className="mb-2 text-gfm-green">{m.icon}</div>
                <p className="text-lg font-bold text-gfm-dark">{m.value}</p>
                <p className="text-xs text-gfm-secondary">{m.label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-gfm-border bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-gfm-dark">Daily Traces (14 Days)</h2>
            <div className="flex items-end gap-1.5" style={{ height: 160 }}>
              {DAILY_TRACES.map((v, i) => (
                <div key={i} className="group relative flex flex-1 flex-col items-center">
                  <div className="absolute -top-6 hidden rounded bg-gfm-dark px-1.5 py-0.5 text-[10px] text-white group-hover:block">{v}</div>
                  <div className="w-full rounded-t bg-gfm-green transition-opacity hover:opacity-80" style={{ height: `${(v / maxDaily) * 140}px` }} />
                  <span className="mt-1 text-[9px] text-gfm-secondary">{DAY_LABELS[i].slice(4)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-gfm-border bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <Shield size={16} className="text-gfm-green" />
              <h2 className="text-sm font-semibold text-gfm-dark">Agent Health</h2>
            </div>
            <div className="space-y-3">
              {AGENT_HEALTH.map(a => (
                <div key={a.name} className="flex items-center gap-3 rounded-lg bg-gfm-bg px-4 py-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${HEALTH_DOT[a.status]}`} />
                  <span className="text-sm font-medium text-gfm-dark w-32">{a.name}</span>
                  <span className="text-xs text-gfm-secondary capitalize">{a.status}</span>
                  <span className="ml-auto text-xs text-gfm-secondary">Latency: <strong className="text-gfm-dark">{a.latency}ms</strong></span>
                  <span className="text-xs text-gfm-secondary">Errors: <strong className={a.errorRate > 3 ? 'text-red-600' : 'text-gfm-dark'}>{a.errorRate}%</strong></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div></>
  );
}
