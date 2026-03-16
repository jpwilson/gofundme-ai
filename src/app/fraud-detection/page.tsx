'use client';

import { BackToHome } from '@/components/ui/BackToHome';

import { useState, useEffect } from 'react';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  Star,
  Target,
  Eye,
  XCircle,
  ArrowUp,
  ToggleLeft,
  ToggleRight,
  Activity,
  Radio,
  Loader2,
  X,
  Check,
  AlertCircle,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatCurrency = (amount: number) =>
  (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  });

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const SUMMARY_STATS = {
  totalScanned: 12847,
  flaggedToday: 23,
  autoResolved: 14,
  escalated: 4,
  avgTrustScore: 87,
  falsePositiveRate: 3.2,
};

const FLAGGED_FUNDRAISERS = [
  {
    id: 'ff-001',
    title: 'Emergency Medical Bills for Baby Sophia',
    organizer: 'Jennifer R.',
    raisedAmount: 1245000,
    trustScore: 28,
    flagType: 'velocity' as const,
    riskLevel: 'high' as const,
    flaggedAt: '2026-03-10T09:14:00Z',
    details: 'Received 47 donations within 12 minutes from similar IP ranges.',
  },
  {
    id: 'ff-002',
    title: 'Help Rebuild After the Tornado',
    organizer: 'Marcus T.',
    raisedAmount: 873400,
    trustScore: 52,
    flagType: 'pattern' as const,
    riskLevel: 'medium' as const,
    flaggedAt: '2026-03-10T08:43:00Z',
    details: 'Story text matches 3 previously removed fundraisers at 92% similarity.',
  },
  {
    id: 'ff-003',
    title: 'College Tuition Fund for Aiden',
    organizer: 'Samantha K.',
    raisedAmount: 450000,
    trustScore: 65,
    flagType: 'identity' as const,
    riskLevel: 'medium' as const,
    flaggedAt: '2026-03-10T07:22:00Z',
    details: 'Organizer profile photo flagged as AI-generated with 88% confidence.',
  },
  {
    id: 'ff-004',
    title: 'Funeral Expenses for Uncle James',
    organizer: 'David L.',
    raisedAmount: 2100000,
    trustScore: 18,
    flagType: 'behavioral' as const,
    riskLevel: 'high' as const,
    flaggedAt: '2026-03-10T06:05:00Z',
    details: 'Withdrawal requested 2 hours after campaign created; no social connections.',
  },
  {
    id: 'ff-005',
    title: 'Service Dog Training for Veteran',
    organizer: 'Lisa M.',
    raisedAmount: 310000,
    trustScore: 71,
    flagType: 'velocity' as const,
    riskLevel: 'low' as const,
    flaggedAt: '2026-03-09T22:18:00Z',
    details: 'Spike in donations correlates with a verified social media post—likely benign.',
  },
  {
    id: 'ff-006',
    title: 'Fire Recovery for the Nguyen Family',
    organizer: 'Tran N.',
    raisedAmount: 564200,
    trustScore: 44,
    flagType: 'pattern' as const,
    riskLevel: 'medium' as const,
    flaggedAt: '2026-03-09T19:51:00Z',
    details: 'Donation amounts follow a repeating $25/$50/$100 sequence consistent with bot patterns.',
  },
];

const DETECTION_RULES = [
  { id: 'r1', name: 'Sudden Donation Velocity', description: 'Flags campaigns receiving an unusually high number of donations in a short window.', threshold: '>30 donations / 15 min', triggeredCount: 142, enabled: true },
  { id: 'r2', name: 'Geographic Anomaly', description: 'Detects donations originating from geographically dispersed IPs within minutes.', threshold: '>5 countries / 10 min', triggeredCount: 87, enabled: true },
  { id: 'r3', name: 'Duplicate Story Detection', description: 'Compares campaign text against known fraudulent fundraiser templates.', threshold: '>85% similarity', triggeredCount: 63, enabled: true },
  { id: 'r4', name: 'Bot-like Donation Pattern', description: 'Identifies repeating donation amount sequences and timing intervals.', threshold: '>3 repeated sequences', triggeredCount: 211, enabled: false },
  { id: 'r5', name: 'Identity Verification Gap', description: 'Flags organizers whose profile data cannot be cross-referenced with public records.', threshold: '<50% match confidence', triggeredCount: 95, enabled: true },
  { id: 'r6', name: 'Withdrawal Timing Anomaly', description: 'Detects early withdrawal requests relative to campaign age and activity.', threshold: '<24h after creation', triggeredCount: 38, enabled: true },
];

const MONITORING_FEED = [
  { timestamp: '2026-03-10T09:14:22Z', type: 'flag' as const, message: 'Campaign "Emergency Medical Bills for Baby Sophia" flagged for donation velocity spike.', severity: 'high' as const },
  { timestamp: '2026-03-10T09:12:05Z', type: 'auto-resolve' as const, message: 'Campaign "Help My Dog Rex" cleared by automated trust re-assessment.', severity: 'low' as const },
  { timestamp: '2026-03-10T09:08:33Z', type: 'clear' as const, message: 'Manual review cleared "Playground Rebuild Fund" — verified organizer.', severity: 'low' as const },
  { timestamp: '2026-03-10T08:55:11Z', type: 'escalate' as const, message: 'Campaign "Quick Cash for Rent" escalated to fraud investigation team.', severity: 'high' as const },
  { timestamp: '2026-03-10T08:43:00Z', type: 'flag' as const, message: 'Campaign "Help Rebuild After the Tornado" flagged for story duplication.', severity: 'medium' as const },
  { timestamp: '2026-03-10T08:30:47Z', type: 'auto-resolve' as const, message: 'Velocity alert on "Marathon for Charity" resolved — event-correlated spike.', severity: 'low' as const },
  { timestamp: '2026-03-10T08:22:19Z', type: 'clear' as const, message: 'Identity check passed for organizer Kevin S. after document upload.', severity: 'low' as const },
  { timestamp: '2026-03-10T08:10:55Z', type: 'flag' as const, message: 'Bot-like pattern detected on "Funeral Expenses for Uncle James".', severity: 'high' as const },
  { timestamp: '2026-03-10T07:58:02Z', type: 'escalate' as const, message: 'Repeated offender flagged: organizer linked to 3 removed campaigns.', severity: 'high' as const },
  { timestamp: '2026-03-10T07:45:30Z', type: 'auto-resolve' as const, message: 'Geographic anomaly on "School Supplies Drive" resolved — university network.', severity: 'low' as const },
  { timestamp: '2026-03-10T07:33:12Z', type: 'flag' as const, message: 'Campaign "College Tuition Fund for Aiden" flagged for identity gap.', severity: 'medium' as const },
  { timestamp: '2026-03-10T07:20:44Z', type: 'clear' as const, message: 'Withdrawal hold released for "Cancer Treatment for Mom" after verification.', severity: 'low' as const },
  { timestamp: '2026-03-10T07:08:18Z', type: 'flag' as const, message: 'Withdrawal timing anomaly on campaign created 90 minutes ago.', severity: 'medium' as const },
  { timestamp: '2026-03-10T06:55:09Z', type: 'auto-resolve' as const, message: 'Duplicate story alert dismissed — campaigns are by the same organizer.', severity: 'low' as const },
  { timestamp: '2026-03-10T06:42:33Z', type: 'escalate' as const, message: 'High-value campaign ($21,000) with zero social verification escalated.', severity: 'high' as const },
];

const TRUST_DISTRIBUTION = [
  { range: '0-10', count: 12 },
  { range: '11-20', count: 25 },
  { range: '21-30', count: 38 },
  { range: '31-40', count: 54 },
  { range: '41-50', count: 89 },
  { range: '51-60', count: 156 },
  { range: '61-70', count: 342 },
  { range: '71-80', count: 1820 },
  { range: '81-90', count: 4950 },
  { range: '91-100', count: 5361 },
];

const WEEKLY_TREND = [
  { day: 'Mon', flagged: 18 },
  { day: 'Tue', flagged: 31 },
  { day: 'Wed', flagged: 24 },
  { day: 'Thu', flagged: 27 },
  { day: 'Fri', flagged: 42 },
  { day: 'Sat', flagged: 15 },
  { day: 'Sun', flagged: 23 },
];

const RANDOM_EVENTS = [
  { type: 'flag' as const, message: 'New velocity spike detected on a trending campaign.', severity: 'medium' as const },
  { type: 'auto-resolve' as const, message: 'Geographic anomaly auto-resolved — VPN usage confirmed by organizer.', severity: 'low' as const },
  { type: 'clear' as const, message: 'Manual review cleared a flagged withdrawal request.', severity: 'low' as const },
  { type: 'escalate' as const, message: 'Suspicious organizer pattern escalated for further review.', severity: 'high' as const },
  { type: 'flag' as const, message: 'Duplicate story content detected across two new campaigns.', severity: 'medium' as const },
  { type: 'auto-resolve' as const, message: 'Bot-pattern alert dismissed — donations traced to a corporate matching program.', severity: 'low' as const },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type Tab = 'dashboard' | 'flagged' | 'rules' | 'monitoring';

const trustColor = (score: number) =>
  score < 40 ? 'text-red-600' : score <= 70 ? 'text-amber-500' : 'text-gfm-green';

const trustBg = (score: number) =>
  score < 40 ? 'bg-red-100 text-red-700' : score <= 70 ? 'bg-amber-100 text-amber-700' : 'bg-gfm-light-green text-gfm-green';

const riskBadge = (level: string) => {
  if (level === 'high') return 'bg-red-100 text-red-700';
  if (level === 'medium') return 'bg-amber-100 text-amber-700';
  return 'bg-green-100 text-green-700';
};

const eventDot = (type: string) => {
  if (type === 'flag') return 'bg-red-500';
  if (type === 'escalate') return 'bg-amber-500';
  if (type === 'clear') return 'bg-green-500';
  return 'bg-blue-500';
};

const barColor = (idx: number) => {
  if (idx < 4) return 'bg-red-400';
  if (idx < 7) return 'bg-amber-400';
  return 'bg-gfm-green';
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function FraudDetectionPage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [ruleToggles, setRuleToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(DETECTION_RULES.map((r) => [r.id, r.enabled])),
  );
  const [feed, setFeed] = useState(MONITORING_FEED);
  const [reviewResults, setReviewResults] = useState<Record<string, { loading: boolean; data: { overallScore: number; label: string; signals: { name: string; status: string; signal?: string; weight?: string }[]; riskFactors: string[]; recommendation: string } | null }>>({});

  const handleReview = async (fundraiserId: string) => {
    const f = FLAGGED_FUNDRAISERS.find((item) => item.id === fundraiserId);
    if (!f) return;

    setReviewResults((prev) => ({
      ...prev,
      [fundraiserId]: { loading: true, data: null },
    }));

    try {
      const res = await fetch('/api/ai/trust-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fundraiser: {
            title: f.title,
            raisedAmount: f.raisedAmount,
            flagType: f.flagType,
            riskLevel: f.riskLevel,
            details: f.details,
            flaggedAt: f.flaggedAt,
          },
          organizer: {
            name: f.organizer,
          },
          donations: [
            { amount: Math.round(f.raisedAmount * 0.4), donor: 'Anonymous', timestamp: f.flaggedAt },
            { amount: Math.round(f.raisedAmount * 0.35), donor: 'Anonymous', timestamp: f.flaggedAt },
            { amount: Math.round(f.raisedAmount * 0.25), donor: 'Anonymous', timestamp: f.flaggedAt },
          ],
        }),
      });

      const json = await res.json();
      setReviewResults((prev) => ({
        ...prev,
        [fundraiserId]: { loading: false, data: json?.data?.parsed ?? null },
      }));
    } catch {
      setReviewResults((prev) => ({
        ...prev,
        [fundraiserId]: { loading: false, data: null },
      }));
    }
  };

  // Live feed simulation
  useEffect(() => {
    if (activeTab !== 'monitoring') return;
    const interval = setInterval(() => {
      const template = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
      setFeed((prev) => [
        { ...template, timestamp: new Date().toISOString() },
        ...prev,
      ]);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const maxTrust = Math.max(...TRUST_DISTRIBUTION.map((d) => d.count));
  const maxTrend = Math.max(...WEEKLY_TREND.map((d) => d.flagged));

  const tabs: { key: Tab; label: string }[] = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'flagged', label: 'Flagged' },
    { key: 'rules', label: 'Rules' },
    { key: 'monitoring', label: 'Monitoring' },
  ];

  return (
    <><BackToHome /><div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gfm-green text-white">
          <Shield size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gfm-dark">Fraud Anomaly Detection</h1>
          <p className="text-sm text-gfm-secondary">Real-time campaign integrity monitoring</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg border border-gfm-border bg-gfm-bg p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === t.key
                ? 'bg-white text-gfm-dark shadow-sm'
                : 'text-gfm-secondary hover:text-gfm-dark'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Dashboard Tab                                                     */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'dashboard' && (
        <>
          {/* Summary Stats */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: 'Total Scanned', value: SUMMARY_STATS.totalScanned.toLocaleString(), icon: Shield, accent: 'text-gfm-green' },
              { label: 'Flagged Today', value: SUMMARY_STATS.flaggedToday, icon: AlertTriangle, accent: 'text-amber-500' },
              { label: 'Auto-Resolved', value: SUMMARY_STATS.autoResolved, icon: CheckCircle2, accent: 'text-green-600' },
              { label: 'Escalated', value: SUMMARY_STATS.escalated, icon: ArrowUpRight, accent: 'text-red-500' },
              { label: 'Avg Trust Score', value: `${SUMMARY_STATS.avgTrustScore}/100`, icon: Star, accent: 'text-gfm-green' },
              { label: 'False Positive Rate', value: `${SUMMARY_STATS.falsePositiveRate}%`, icon: Target, accent: 'text-blue-500' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-gfm-border bg-white p-5">
                <div className="mb-2 flex items-center gap-2">
                  <s.icon size={18} className={s.accent} />
                  <span className="text-sm text-gfm-secondary">{s.label}</span>
                </div>
                <p className="text-2xl font-bold text-gfm-dark">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Trust Distribution */}
          <div className="mb-6 rounded-xl border border-gfm-border bg-white p-5">
            <h2 className="mb-4 text-lg font-semibold text-gfm-dark">Trust Score Distribution</h2>
            <div className="space-y-2">
              {TRUST_DISTRIBUTION.map((d, idx) => (
                <div key={d.range} className="flex items-center gap-3">
                  <span className="w-14 text-right text-xs text-gfm-secondary">{d.range}</span>
                  <div className="flex-1">
                    <div
                      className={`h-5 rounded ${barColor(idx)} transition-all`}
                      style={{ width: `${(d.count / maxTrust) * 100}%` }}
                    />
                  </div>
                  <span className="w-14 text-xs text-gfm-secondary">{d.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 7-Day Trend */}
          <div className="rounded-xl border border-gfm-border bg-white p-5">
            <h2 className="mb-4 text-lg font-semibold text-gfm-dark">7-Day Flagged Trend</h2>
            <div className="flex items-end gap-3" style={{ height: 160 }}>
              {WEEKLY_TREND.map((d) => (
                <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-xs font-medium text-gfm-dark">{d.flagged}</span>
                  <div
                    className="w-full rounded-t bg-gfm-green/80 transition-all"
                    style={{ height: `${(d.flagged / maxTrend) * 120}px` }}
                  />
                  <span className="text-xs text-gfm-secondary">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Flagged Tab                                                       */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'flagged' && (
        <div id="tour-fraud-flagged" className="space-y-4">
          {FLAGGED_FUNDRAISERS.map((f) => (
            <div key={f.id} className="rounded-xl border border-gfm-border bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="font-semibold text-gfm-dark">{f.title}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${riskBadge(f.riskLevel)}`}>
                      {f.riskLevel}
                    </span>
                  </div>
                  <p className="mb-2 text-sm text-gfm-secondary">
                    by {f.organizer} &middot; {formatCurrency(f.raisedAmount)} raised &middot;{' '}
                    <span className="capitalize">{f.flagType}</span> flag
                  </p>
                  <p className="text-sm text-gfm-dark">{f.details}</p>
                  <p className="mt-1 text-xs text-gfm-secondary">
                    Flagged {new Date(f.flaggedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold ${trustBg(f.trustScore)}`}
                  >
                    {f.trustScore}
                  </div>
                  <span className={`text-xs font-medium ${trustColor(f.trustScore)}`}>Trust</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleReview(f.id)}
                  disabled={reviewResults[f.id]?.loading}
                  className="flex items-center gap-1 rounded-lg bg-gfm-green px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-60"
                >
                  {reviewResults[f.id]?.loading ? (
                    <><Loader2 size={14} className="animate-spin" /> Analyzing...</>
                  ) : (
                    <><Eye size={14} /> Review</>
                  )}
                </button>
                <button className="flex items-center gap-1 rounded-lg border border-gfm-border px-4 py-2 text-sm font-medium text-gfm-secondary transition-colors hover:bg-gfm-bg">
                  <XCircle size={14} /> Dismiss
                </button>
                <button className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100">
                  <ArrowUp size={14} /> Escalate
                </button>
              </div>

              {/* AI Review Expanded Panel */}
              {(() => {
                const reviewData = reviewResults[f.id]?.data;
                if (!reviewData) return null;
                return (
                <div className="mt-4 animate-in slide-in-from-top-2 border-t border-gfm-border bg-gfm-bg/50 rounded-b-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gfm-dark">AI Deep Analysis</h4>
                    <button
                      onClick={() =>
                        setReviewResults((prev) => {
                          const next = { ...prev };
                          delete next[f.id];
                          return next;
                        })
                      }
                      className="rounded p-1 text-gfm-secondary hover:bg-gfm-bg hover:text-gfm-dark"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Score + Label */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold ${trustBg(reviewData.overallScore)}`}
                    >
                      {reviewData.overallScore}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gfm-dark">{reviewData.label}</p>
                      <p className="text-xs text-gfm-secondary">AI Trust Score</p>
                    </div>
                  </div>

                  {/* Trust Signals */}
                  {reviewData.signals?.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gfm-secondary">Trust Signals</p>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {reviewData.signals.map((s, idx) => (
                          <div key={idx} className="flex items-center gap-2 rounded-lg border border-gfm-border bg-white px-3 py-2">
                            {s.status === 'pass' || s.status === 'positive' ? (
                              <CheckCircle2 size={16} className="flex-shrink-0 text-green-500" />
                            ) : s.status === 'fail' || s.status === 'negative' ? (
                              <XCircle size={16} className="flex-shrink-0 text-red-500" />
                            ) : (
                              <AlertCircle size={16} className="flex-shrink-0 text-amber-500" />
                            )}
                            <span className="flex-1 text-sm text-gfm-dark">{s.signal}</span>
                            <span className="text-xs text-gfm-secondary">{s.weight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Risk Factors */}
                  {reviewData.riskFactors?.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gfm-secondary">Risk Factors</p>
                      <ul className="list-disc space-y-1 pl-5">
                        {reviewData.riskFactors.map((risk: string, idx: number) => (
                          <li key={idx} className="text-sm text-gfm-dark">{risk}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendation */}
                  {reviewData.recommendation && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-700">Recommendation</p>
                      <p className="text-sm text-amber-900">{reviewData.recommendation}</p>
                    </div>
                  )}
                </div>
                );
              })()}
            </div>
          ))}
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Rules Tab                                                         */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'rules' && (
        <div className="overflow-hidden rounded-xl border border-gfm-border bg-white">
          <div className="grid grid-cols-[1fr_2fr_auto_auto_auto] gap-4 bg-gfm-bg px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gfm-secondary">
            <span>Rule</span>
            <span>Description</span>
            <span className="text-center">Threshold</span>
            <span className="text-center">Triggered</span>
            <span className="text-center">Enabled</span>
          </div>
          {DETECTION_RULES.map((rule) => (
            <div
              key={rule.id}
              className="grid grid-cols-[1fr_2fr_auto_auto_auto] items-center gap-4 border-t border-gfm-border px-5 py-4"
            >
              <span className="text-sm font-medium text-gfm-dark">{rule.name}</span>
              <span className="text-sm text-gfm-secondary">{rule.description}</span>
              <span className="whitespace-nowrap rounded bg-gfm-bg px-2 py-1 text-center text-xs text-gfm-secondary">
                {rule.threshold}
              </span>
              <span className="text-center text-sm font-medium text-gfm-dark">{rule.triggeredCount}</span>
              <button
                onClick={() =>
                  setRuleToggles((prev) => ({ ...prev, [rule.id]: !prev[rule.id] }))
                }
                className="flex justify-center"
              >
                {ruleToggles[rule.id] ? (
                  <ToggleRight size={28} className="text-gfm-green" />
                ) : (
                  <ToggleLeft size={28} className="text-gray-300" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Monitoring Tab                                                    */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'monitoring' && (
        <div className="rounded-xl border border-gfm-border bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
            </span>
            <h2 className="text-lg font-semibold text-gfm-dark">Live Event Feed</h2>
            <span className="ml-auto flex items-center gap-1 text-xs text-gfm-secondary">
              <Activity size={14} /> Auto-refreshing every 5s
            </span>
          </div>

          <div className="space-y-3">
            {feed.map((event, idx) => (
              <div
                key={`${event.timestamp}-${idx}`}
                className="flex items-start gap-3 rounded-lg border border-gfm-border px-4 py-3 transition-colors hover:bg-gfm-bg"
              >
                <span className={`mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full ${eventDot(event.type)}`} />
                <div className="flex-1">
                  <p className="text-sm text-gfm-dark">{event.message}</p>
                  <p className="mt-0.5 text-xs text-gfm-secondary">
                    {new Date(event.timestamp).toLocaleTimeString()} &middot;{' '}
                    <span className="capitalize">{event.type.replace('-', ' ')}</span> &middot;{' '}
                    <span
                      className={
                        event.severity === 'high'
                          ? 'text-red-500'
                          : event.severity === 'medium'
                            ? 'text-amber-500'
                            : 'text-green-600'
                      }
                    >
                      {event.severity}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div></>
  );
}
