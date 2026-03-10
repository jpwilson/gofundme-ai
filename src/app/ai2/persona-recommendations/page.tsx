'use client';

import { useState } from 'react';
import {
  Users, Target, BarChart3, ChevronDown, ChevronUp,
  Instagram, Twitter, Facebook, Clock, TrendingUp,
  DollarSign, Eye, Zap, Megaphone,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

interface Platform {
  name: string;
  score: number;
  bestTimeToPost: string;
  contentType: string;
}

interface Persona {
  id: string;
  name: string;
  emoji: string;
  demographics: { ageRange: string; income: string; location: string; education: string };
  interests: string[];
  platforms: Platform[];
  donationLikelihood: number;
  avgDonation: number; // cents
  motivations: string[];
  outreachEffectiveness: number;
}

interface Campaign {
  name: string;
  targetPersonaIds: string[];
  estimatedReach: number;
  estimatedConversion: number;
  suggestedContent: string;
  platform: string;
}

interface PlatformMetric {
  name: string;
  totalReach: number;
  engagementRate: number;
  conversionRate: number;
  costPerAcquisition: number; // cents
  topPersonaName: string;
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const PERSONAS: Persona[] = [
  {
    id: 'yp', name: 'Young Professional', emoji: '💼',
    demographics: { ageRange: '25-34', income: '$55K-$85K', location: 'Urban Metro', education: "Bachelor's" },
    interests: ['Career Growth', 'Fitness', 'Travel', 'Social Impact'],
    platforms: [
      { name: 'Instagram', score: 88, bestTimeToPost: '7-9 PM', contentType: 'Story highlights' },
      { name: 'Twitter/X', score: 72, bestTimeToPost: '12-1 PM', contentType: 'Thread with stats' },
      { name: 'TikTok', score: 65, bestTimeToPost: '8-10 PM', contentType: 'Short testimonials' },
    ],
    donationLikelihood: 74, avgDonation: 4500, motivations: ['Peer influence', 'Career-aligned causes', 'Visible impact'],
    outreachEffectiveness: 78,
  },
  {
    id: 'sp', name: 'Suburban Parent', emoji: '🏠',
    demographics: { ageRange: '35-48', income: '$75K-$120K', location: 'Suburban', education: "Bachelor's/Master's" },
    interests: ['Family', 'Education', 'Community Events'],
    platforms: [
      { name: 'Facebook', score: 92, bestTimeToPost: '8-10 AM', contentType: 'Community posts' },
      { name: 'Instagram', score: 70, bestTimeToPost: '12-2 PM', contentType: 'Photo carousel' },
      { name: 'Twitter/X', score: 40, bestTimeToPost: '9-10 AM', contentType: 'News shares' },
    ],
    donationLikelihood: 82, avgDonation: 7500, motivations: ['Child-related causes', 'Local community impact'],
    outreachEffectiveness: 85,
  },
  {
    id: 'te', name: 'Tech Entrepreneur', emoji: '🌱',
    demographics: { ageRange: '28-42', income: '$120K-$300K+', location: 'Tech Hubs', education: "Bachelor's/MBA" },
    interests: ['Innovation', 'Startups', 'Sustainability', 'Education'],
    platforms: [
      { name: 'Twitter/X', score: 95, bestTimeToPost: '10-11 AM', contentType: 'Data-driven threads' },
      { name: 'Instagram', score: 55, bestTimeToPost: '6-8 PM', contentType: 'Behind-the-scenes' },
      { name: 'Facebook', score: 35, bestTimeToPost: '11 AM-1 PM', contentType: 'Long-form updates' },
    ],
    donationLikelihood: 68, avgDonation: 15000, motivations: ['Scalable solutions', 'Tech-for-good', 'Network effects'],
    outreachEffectiveness: 72,
  },
  {
    id: 'cs', name: 'College Student', emoji: '🎓',
    demographics: { ageRange: '18-24', income: '<$25K', location: 'College Towns', education: 'In Progress' },
    interests: ['Social Justice', 'Music', 'Volunteering'],
    platforms: [
      { name: 'TikTok', score: 96, bestTimeToPost: '7-11 PM', contentType: 'Viral short-form' },
      { name: 'Instagram', score: 85, bestTimeToPost: '5-8 PM', contentType: 'Reels & stories' },
      { name: 'Twitter/X', score: 60, bestTimeToPost: '3-5 PM', contentType: 'Quote-tweet activism' },
    ],
    donationLikelihood: 45, avgDonation: 1500, motivations: ['Peer sharing', 'Social justice alignment'],
    outreachEffectiveness: 62,
  },
  {
    id: 'rp', name: 'Retiree Philanthropist', emoji: '🎨',
    demographics: { ageRange: '60-75', income: '$80K-$150K', location: 'Mixed', education: "Bachelor's+" },
    interests: ['Arts', 'Health', 'Legacy Giving', 'Community'],
    platforms: [
      { name: 'Facebook', score: 90, bestTimeToPost: '9-11 AM', contentType: 'Heartfelt stories' },
      { name: 'Instagram', score: 45, bestTimeToPost: '10 AM-12 PM', contentType: 'Photo essays' },
      { name: 'Twitter/X', score: 30, bestTimeToPost: '10-11 AM', contentType: 'News & org updates' },
    ],
    donationLikelihood: 88, avgDonation: 12000, motivations: ['Legacy building', 'Health causes', 'Arts preservation'],
    outreachEffectiveness: 80,
  },
  {
    id: 'sa', name: 'Social Activist', emoji: '👨‍👩‍👧',
    demographics: { ageRange: '22-38', income: '$35K-$65K', location: 'Urban', education: "Bachelor's/Master's" },
    interests: ['Human Rights', 'Environment', 'Policy', 'Community Organizing'],
    platforms: [
      { name: 'Twitter/X', score: 93, bestTimeToPost: '6-9 PM', contentType: 'Advocacy threads' },
      { name: 'Instagram', score: 80, bestTimeToPost: '5-7 PM', contentType: 'Infographics' },
      { name: 'TikTok', score: 75, bestTimeToPost: '8-10 PM', contentType: 'Explainer videos' },
    ],
    donationLikelihood: 71, avgDonation: 3500, motivations: ['Justice-driven causes', 'Grassroots movements', 'Systemic change'],
    outreachEffectiveness: 76,
  },
];

const CAMPAIGNS: Campaign[] = [
  {
    name: 'Back-to-School Drive',
    targetPersonaIds: ['sp', 'rp'],
    estimatedReach: 185_000,
    estimatedConversion: 4.8,
    suggestedContent: 'Share a parent\'s story of how school supplies changed their child\'s confidence. Use before/after imagery.',
    platform: 'Facebook',
  },
  {
    name: 'Tech for Underserved Youth',
    targetPersonaIds: ['te', 'yp'],
    estimatedReach: 310_000,
    estimatedConversion: 3.2,
    suggestedContent: 'Highlight coding bootcamp graduates with data on employment outcomes. Thread with metrics and testimonials.',
    platform: 'Twitter/X',
  },
  {
    name: 'Climate Emergency Fund',
    targetPersonaIds: ['sa', 'cs'],
    estimatedReach: 520_000,
    estimatedConversion: 2.1,
    suggestedContent: 'Fast-paced montage of community climate action with a clear CTA. Duet-friendly format.',
    platform: 'TikTok',
  },
  {
    name: 'Senior Care & Wellness',
    targetPersonaIds: ['rp', 'sp', 'yp'],
    estimatedReach: 145_000,
    estimatedConversion: 5.6,
    suggestedContent: 'Carousel of real beneficiary stories with progress updates and community thank-you messages.',
    platform: 'Instagram',
  },
];

const AB_TESTS = [
  { name: 'Emotional vs. Data-Driven Copy', variantA: 'Emotional storytelling', variantB: 'Stats-first approach', predA: 62, predB: 48 },
  { name: 'Video vs. Static Image', variantA: 'Short video testimonial', variantB: 'Photo carousel', predA: 71, predB: 55 },
  { name: 'Urgent vs. Hopeful Tone', variantA: '"Help now" urgency framing', variantB: '"Together we can" hope framing', predA: 44, predB: 58 },
];

const PLATFORM_METRICS: PlatformMetric[] = [
  { name: 'Instagram', totalReach: 420_000, engagementRate: 4.2, conversionRate: 2.8, costPerAcquisition: 320, topPersonaName: 'Young Professional' },
  { name: 'Twitter/X', totalReach: 680_000, engagementRate: 2.1, conversionRate: 1.6, costPerAcquisition: 480, topPersonaName: 'Tech Entrepreneur' },
  { name: 'Facebook', totalReach: 350_000, engagementRate: 3.5, conversionRate: 4.1, costPerAcquisition: 210, topPersonaName: 'Suburban Parent' },
  { name: 'TikTok', totalReach: 920_000, engagementRate: 6.8, conversionRate: 1.2, costPerAcquisition: 560, topPersonaName: 'College Student' },
];

const BEST_TIMES: { platform: string; weekday: string; weekend: string }[] = [
  { platform: 'Instagram', weekday: '7-9 PM', weekend: '10 AM-12 PM' },
  { platform: 'Twitter/X', weekday: '10 AM-1 PM', weekend: '11 AM-1 PM' },
  { platform: 'Facebook', weekday: '8-10 AM', weekend: '9-11 AM' },
  { platform: 'TikTok', weekday: '7-11 PM', weekend: '2-6 PM' },
];

type Tab = 'personas' | 'campaigns' | 'platforms';

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(0)}K` : String(n);
}

function dollars(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function likelihoodColor(v: number) {
  if (v > 70) return 'bg-gfm-light-green text-gfm-green';
  if (v > 50) return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-600';
}

function engagementColor(rate: number) {
  if (rate >= 5) return 'text-gfm-green';
  if (rate >= 3) return 'text-amber-600';
  return 'text-red-500';
}

const PILL_COLORS = [
  'bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700',
  'bg-pink-100 text-pink-700', 'bg-teal-100 text-teal-700',
];

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  'Instagram': <Instagram className="h-4 w-4" />,
  'Twitter/X': <Twitter className="h-4 w-4" />,
  'Facebook': <Facebook className="h-4 w-4" />,
  'TikTok': <Zap className="h-4 w-4" />,
};

// ── Component ──────────────────────────────────────────────────────────────────

export default function PersonaRecommendationsPage() {
  const [tab, setTab] = useState<Tab>('personas');
  const [expanded, setExpanded] = useState<string | null>(null);

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'personas', label: 'Donor Personas', icon: <Users className="h-4 w-4" /> },
    { key: 'campaigns', label: 'Campaign Targeting', icon: <Target className="h-4 w-4" /> },
    { key: 'platforms', label: 'Platform Analytics', icon: <BarChart3 className="h-4 w-4" /> },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gfm-dark">Persona Recommendations</h1>
        <p className="mt-1 text-gfm-secondary">
          AI-driven donor persona insights and social media targeting intelligence.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg border border-gfm-border bg-gfm-bg p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-white text-gfm-green shadow-sm' : 'text-gfm-secondary hover:text-gfm-dark'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Personas Tab ─────────────────────────────────────────────────── */}
      {tab === 'personas' && (
        <div className="grid gap-5 md:grid-cols-2">
          {PERSONAS.map((p) => {
            const isOpen = expanded === p.id;
            return (
              <div
                key={p.id}
                className="rounded-xl border border-gfm-border bg-white p-5 transition-shadow hover:shadow-md"
              >
                {/* Header row */}
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{p.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-gfm-dark">{p.name}</h3>
                      <p className="text-xs text-gfm-secondary">Outreach Score: {p.outreachEffectiveness}%</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${likelihoodColor(p.donationLikelihood)}`}>
                    {p.donationLikelihood}% likely
                  </span>
                </div>

                {/* Demographics tags */}
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {Object.values(p.demographics).map((d) => (
                    <span key={d} className="rounded bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500">{d}</span>
                  ))}
                </div>

                {/* Interests */}
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {p.interests.map((int, i) => (
                    <span key={int} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${PILL_COLORS[i % PILL_COLORS.length]}`}>
                      {int}
                    </span>
                  ))}
                </div>

                {/* Platform scores */}
                <div className="mb-3 space-y-1.5">
                  {p.platforms.map((pl) => (
                    <div key={pl.name} className="flex items-center gap-2 text-xs">
                      <span className="w-20 text-gfm-secondary">{pl.name}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full bg-gfm-green" style={{ width: `${pl.score}%` }} />
                      </div>
                      <span className="w-8 text-right font-medium text-gfm-dark">{pl.score}</span>
                    </div>
                  ))}
                </div>

                {/* Avg donation + expand */}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm text-gfm-secondary">
                    <DollarSign className="h-3.5 w-3.5" />
                    Avg donation: <strong className="text-gfm-dark">{dollars(p.avgDonation)}</strong>
                  </span>
                  <button
                    onClick={() => setExpanded(isOpen ? null : p.id)}
                    className="flex items-center gap-1 text-xs font-medium text-gfm-green hover:underline"
                  >
                    {isOpen ? 'Less' : 'Details'}
                    {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                </div>

                {/* Expanded details */}
                {isOpen && (
                  <div className="mt-4 space-y-3 border-t border-gfm-border pt-4">
                    <div>
                      <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gfm-secondary">Platform Details</h4>
                      <div className="space-y-2">
                        {p.platforms.map((pl) => (
                          <div key={pl.name} className="flex items-center gap-3 rounded-lg bg-gfm-bg px-3 py-2 text-xs">
                            {PLATFORM_ICONS[pl.name] || <Megaphone className="h-4 w-4" />}
                            <div className="flex-1">
                              <span className="font-medium text-gfm-dark">{pl.name}</span>
                              <span className="ml-2 text-gfm-secondary">Best: {pl.bestTimeToPost}</span>
                            </div>
                            <span className="text-gfm-secondary">{pl.contentType}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gfm-secondary">Motivations</h4>
                      <ul className="space-y-1">
                        {p.motivations.map((m) => (
                          <li key={m} className="flex items-center gap-2 text-sm text-gfm-dark">
                            <span className="h-1.5 w-1.5 rounded-full bg-gfm-green" />
                            {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Campaigns Tab ────────────────────────────────────────────────── */}
      {tab === 'campaigns' && (
        <div className="space-y-8">
          {/* Campaign cards */}
          <div className="grid gap-5 md:grid-cols-2">
            {CAMPAIGNS.map((c) => {
              const targeted = PERSONAS.filter((p) => c.targetPersonaIds.includes(p.id));
              return (
                <div key={c.name} className="rounded-xl border border-gfm-border bg-white p-5">
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="font-semibold text-gfm-dark">{c.name}</h3>
                    <span className="flex items-center gap-1 rounded-full bg-gfm-bg px-2.5 py-0.5 text-xs font-medium text-gfm-dark">
                      {PLATFORM_ICONS[c.platform]}
                      {c.platform}
                    </span>
                  </div>

                  {/* Targeted personas */}
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-xs text-gfm-secondary">Targeting:</span>
                    <div className="flex gap-1.5">
                      {targeted.map((p) => (
                        <span key={p.id} title={p.name} className="rounded-full bg-gfm-bg px-2 py-0.5 text-sm">
                          {p.emoji} <span className="text-xs text-gfm-secondary">{p.name.split(' ')[0]}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mb-3 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-gfm-bg px-3 py-2 text-center">
                      <p className="text-lg font-bold text-gfm-dark">{fmt(c.estimatedReach)}</p>
                      <p className="flex items-center justify-center gap-1 text-[11px] text-gfm-secondary">
                        <Eye className="h-3 w-3" /> Est. Reach
                      </p>
                    </div>
                    <div className="rounded-lg bg-gfm-bg px-3 py-2 text-center">
                      <p className="text-lg font-bold text-gfm-green">{c.estimatedConversion}%</p>
                      <p className="flex items-center justify-center gap-1 text-[11px] text-gfm-secondary">
                        <TrendingUp className="h-3 w-3" /> Conversion
                      </p>
                    </div>
                  </div>

                  {/* Content snippet */}
                  <p className="rounded-lg border border-dashed border-gfm-border p-3 text-xs leading-relaxed text-gfm-secondary">
                    <Megaphone className="mb-0.5 mr-1 inline h-3 w-3 text-gfm-green" />
                    {c.suggestedContent}
                  </p>
                </div>
              );
            })}
          </div>

          {/* A/B Test Suggestions */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gfm-dark">A/B Test Suggestions</h2>
            <div className="space-y-4">
              {AB_TESTS.map((t) => (
                <div key={t.name} className="rounded-xl border border-gfm-border bg-white p-5">
                  <h4 className="mb-3 font-medium text-gfm-dark">{t.name}</h4>
                  <div className="space-y-2.5">
                    <div>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-gfm-secondary">A: {t.variantA}</span>
                        <span className="font-semibold text-gfm-dark">{t.predA}%</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full bg-gfm-green transition-all" style={{ width: `${t.predA}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-gfm-secondary">B: {t.variantB}</span>
                        <span className="font-semibold text-gfm-dark">{t.predB}%</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${t.predB}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Platforms Tab ─────────────────────────────────────────────────── */}
      {tab === 'platforms' && (
        <div className="space-y-8">
          {/* Platform comparison cards */}
          <div className="grid gap-5 sm:grid-cols-2">
            {PLATFORM_METRICS.map((pm) => (
              <div key={pm.name} className="rounded-xl border border-gfm-border bg-white p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gfm-bg text-gfm-green">
                    {PLATFORM_ICONS[pm.name]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gfm-dark">{pm.name}</h3>
                    <p className="text-xs text-gfm-secondary">Top persona: {pm.topPersonaName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-gfm-bg px-3 py-2">
                    <p className="text-sm font-bold text-gfm-dark">{fmt(pm.totalReach)}</p>
                    <p className="text-[11px] text-gfm-secondary">Total Reach</p>
                  </div>
                  <div className="rounded-lg bg-gfm-bg px-3 py-2">
                    <p className={`text-sm font-bold ${engagementColor(pm.engagementRate)}`}>{pm.engagementRate}%</p>
                    <p className="text-[11px] text-gfm-secondary">Engagement</p>
                  </div>
                  <div className="rounded-lg bg-gfm-bg px-3 py-2">
                    <p className="text-sm font-bold text-gfm-dark">{pm.conversionRate}%</p>
                    <p className="text-[11px] text-gfm-secondary">Conversion</p>
                  </div>
                  <div className="rounded-lg bg-gfm-bg px-3 py-2">
                    <p className="text-sm font-bold text-gfm-dark">{dollars(pm.costPerAcquisition)}</p>
                    <p className="text-[11px] text-gfm-secondary">CPA</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bar chart comparison */}
          <div className="rounded-xl border border-gfm-border bg-white p-5">
            <h2 className="mb-4 font-semibold text-gfm-dark">Platform Comparison</h2>
            {['Reach', 'Engagement', 'Conversion'].map((metric) => {
              const maxVal = Math.max(
                ...PLATFORM_METRICS.map((pm) =>
                  metric === 'Reach' ? pm.totalReach : metric === 'Engagement' ? pm.engagementRate : pm.conversionRate,
                ),
              );
              return (
                <div key={metric} className="mb-5 last:mb-0">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gfm-secondary">{metric}</p>
                  <div className="space-y-2">
                    {PLATFORM_METRICS.map((pm) => {
                      const val = metric === 'Reach' ? pm.totalReach : metric === 'Engagement' ? pm.engagementRate : pm.conversionRate;
                      const pct = (val / maxVal) * 100;
                      const colors = ['bg-pink-500', 'bg-blue-500', 'bg-indigo-500', 'bg-emerald-500'];
                      const idx = PLATFORM_METRICS.indexOf(pm);
                      return (
                        <div key={pm.name} className="flex items-center gap-3 text-xs">
                          <span className="w-20 text-gfm-secondary">{pm.name}</span>
                          <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-100">
                            <div className={`h-full rounded-full ${colors[idx]} transition-all`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-14 text-right font-medium text-gfm-dark">
                            {metric === 'Reach' ? fmt(val) : `${val}%`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Best posting times */}
          <div className="rounded-xl border border-gfm-border bg-white p-5">
            <h2 className="mb-4 flex items-center gap-2 font-semibold text-gfm-dark">
              <Clock className="h-4 w-4 text-gfm-green" />
              Optimal Posting Times
            </h2>
            <div className="grid grid-cols-3 gap-3 text-xs font-medium text-gfm-secondary">
              <div />
              <div className="text-center">Weekday</div>
              <div className="text-center">Weekend</div>
            </div>
            <div className="mt-2 space-y-2">
              {BEST_TIMES.map((bt) => (
                <div key={bt.platform} className="grid grid-cols-3 items-center gap-3 rounded-lg bg-gfm-bg px-3 py-2.5 text-sm">
                  <div className="flex items-center gap-2 font-medium text-gfm-dark">
                    {PLATFORM_ICONS[bt.platform]}
                    {bt.platform}
                  </div>
                  <div className="text-center text-gfm-secondary">{bt.weekday}</div>
                  <div className="text-center text-gfm-secondary">{bt.weekend}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
