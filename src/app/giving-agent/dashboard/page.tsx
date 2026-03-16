'use client';

import { BackToHome } from '@/components/ui/BackToHome';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ProgressCircle } from '@/components/ui/ProgressCircle';
import { DistributionBreakdown } from '@/components/giving-agent/DistributionBreakdown';
import { PledgeSummary } from '@/components/giving-agent/PledgeSummary';
import { ImpactCard } from '@/components/giving-agent/ImpactCard';
import { givingPledges, causes } from '@/lib/data/mock';

// --- Mock dashboard data ---

const pledge = givingPledges[0];

const monthlyDistribution = [
  { label: 'LA Wildfire Recovery', amount: 2000, color: '#02a95c', percentage: 40 },
  { label: 'LA Animal Rescue', amount: 1500, color: '#6366f1', percentage: 30 },
  { label: 'Clean Ocean Project', amount: 1000, color: '#0891b2', percentage: 20 },
  { label: 'Tree Planting Initiative', amount: 500, color: '#ea580c', percentage: 10 },
];

const supportedCampaigns = [
  {
    id: 'fund-1',
    title: 'LA Wildfire Alerts & Recovery Fund',
    slug: 'la-wildfire-alerts-and-recovery',
    organizer: 'Janahan Sivaraman',
    amount: 2000,
    category: 'emergency',
    progress: 70,
  },
  {
    id: 'fund-3',
    title: 'LA Animal Rescue Fund',
    slug: 'la-animal-rescue-fund',
    organizer: 'Arnie Katz',
    amount: 1500,
    category: 'animals',
    progress: 78,
  },
  {
    id: 'fund-ext-5',
    title: 'Clean Ocean Plastic Removal',
    slug: 'clean-ocean-plastic-removal',
    organizer: 'Ocean Foundation',
    amount: 1000,
    category: 'environment',
    progress: 45,
  },
  {
    id: 'fund-ext-6',
    title: 'Urban Tree Planting Initiative',
    slug: 'urban-tree-planting',
    organizer: 'Green Cities Corp',
    amount: 500,
    category: 'environment',
    progress: 62,
  },
];

const monthlyHistory = [
  { month: 'Oct 2025', amount: 5000, campaigns: 4 },
  { month: 'Nov 2025', amount: 5000, campaigns: 5 },
  { month: 'Dec 2025', amount: 5000, campaigns: 3 },
  { month: 'Jan 2026', amount: 5000, campaigns: 4 },
  { month: 'Feb 2026', amount: 5000, campaigns: 4 },
  { month: 'Mar 2026', amount: 5000, campaigns: 4 },
];

// --- Animated counter hook ---
function useAnimatedCounter(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return count;
}

// --- Category color map ---
const categoryColors: Record<string, string> = {
  emergency: '#FDBA74',
  animals: '#FDE68A',
  environment: '#6EE7B7',
  medical: '#FCA5A5',
  education: '#93C5FD',
  community: '#A5B4FC',
  arts_culture: '#C4B5FD',
  faith: '#D8B4FE',
  sports: '#86EFAC',
  business: '#67E8F9',
};

export default function DashboardPage() {
  const [isActive, setIsActive] = useState(pledge.isActive);
  const [showImpactCard, setShowImpactCard] = useState(false);
  const [showPauseConfirm, setShowPauseConfirm] = useState(false);

  const totalGiven = useAnimatedCounter(30000);
  const campaignsCount = useAnimatedCounter(24);
  const goalsHelped = useAnimatedCounter(8);

  const maxAmount = Math.max(...monthlyHistory.map((m) => m.amount));

  return (
    <div className="min-h-screen bg-[var(--gfm-bg)]">
      <BackToHome />
      {/* Header */}
      <div
        className="relative overflow-hidden pb-28"
        style={{ background: 'linear-gradient(145deg, #02a95c 0%, #017a3e 50%, #015e30 100%)' }}
      >
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pt-8 text-white">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              <h1 className="text-xl font-bold">Giving Agent Dashboard</h1>
            </div>
            <Link href="/giving-agent/setup" className="text-sm font-medium text-white/70 hover:text-white transition-colors flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Adjust Preferences
            </Link>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-white/60 mb-1">Monthly Pledge</p>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold tracking-tight">
                  ${(pledge.monthlyAmount / 100).toFixed(0)}
                </span>
                <span className="text-lg text-white/60">/month</span>
              </div>
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <div className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-emerald-300 animate-pulse' : 'bg-amber-300'}`} />
                <span className="text-sm font-medium text-white/80">
                  {isActive ? 'Active' : 'Paused'}
                </span>
                <span className="text-white/30">|</span>
                <span className="text-sm text-white/60">
                  {pledge.causes.map(ct => causes.find(c => c.type === ct)?.label).join(', ')}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowImpactCard(true)}
                className="rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition-all"
              >
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                  </svg>
                  Share Impact
                </span>
              </button>
              <button
                onClick={() => setShowPauseConfirm(true)}
                className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                    : 'border-emerald-300/40 bg-emerald-300/20 text-emerald-100 hover:bg-emerald-300/30'
                }`}
              >
                {isActive ? 'Pause Pledge' : 'Resume Pledge'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 -mt-20 pb-16 relative z-10">
        {/* Impact Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Given', value: `$${(totalGiven / 100).toLocaleString('en-US', { minimumFractionDigits: 0 })}`, sub: 'All time' },
            { label: 'Campaigns Supported', value: campaignsCount.toString(), sub: 'Across all causes' },
            { label: 'Goals Helped Reach', value: goalsHelped.toString(), sub: 'Campaigns fully funded' },
            { label: 'Impact Score', value: 'Top 5%', sub: 'Of all givers' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-[var(--gfm-border)] bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-sm font-medium text-[var(--gfm-secondary)]">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold text-[var(--gfm-dark)]">{stat.value}</p>
              <p className="mt-0.5 text-xs text-[var(--gfm-secondary)]">{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Distribution */}
            <div className="rounded-2xl border border-[var(--gfm-border)] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-[var(--gfm-dark)]">This Month&apos;s Distribution</h2>
                  <p className="text-sm text-[var(--gfm-secondary)]">March 2026</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-[var(--gfm-green)]/10 px-3 py-1 text-sm font-semibold text-[var(--gfm-green)]">
                  ${(pledge.monthlyAmount / 100).toFixed(0)} distributed
                </span>
              </div>
              <DistributionBreakdown slices={monthlyDistribution} totalAmount={pledge.monthlyAmount} />
            </div>

            {/* Campaigns */}
            <div className="rounded-2xl border border-[var(--gfm-border)] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[var(--gfm-dark)] mb-4">Campaigns Supported</h2>
              <div className="space-y-3">
                {supportedCampaigns.map((campaign) => (
                  <Link
                    key={campaign.id}
                    href={`/f/${campaign.slug}`}
                    className="group flex items-center gap-4 rounded-xl border border-[var(--gfm-border)] p-4 transition-all hover:shadow-md hover:border-[var(--gfm-green)]/30 hover:-translate-y-0.5"
                  >
                    <div
                      className="h-12 w-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: categoryColors[campaign.category] || '#ccc' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--gfm-dark)] group-hover:text-[var(--gfm-green)] transition-colors truncate">
                        {campaign.title}
                      </p>
                      <p className="text-xs text-[var(--gfm-secondary)] mt-0.5">by {campaign.organizer}</p>
                      <div className="mt-2 h-1.5 w-full rounded-full bg-[var(--gfm-border)]">
                        <div
                          className="h-full rounded-full bg-[var(--gfm-green)] transition-all duration-500"
                          style={{ width: `${campaign.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-[var(--gfm-green)]">
                        ${(campaign.amount / 100).toFixed(2)}
                      </p>
                      <p className="text-xs text-[var(--gfm-secondary)]">
                        {campaign.progress}% funded
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Giving History */}
            <div className="rounded-2xl border border-[var(--gfm-border)] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[var(--gfm-dark)] mb-6">Giving History</h2>
              <div className="flex items-end gap-2 h-40 mb-4">
                {monthlyHistory.map((month, i) => {
                  const heightPct = (month.amount / maxAmount) * 100;
                  const isLatest = i === monthlyHistory.length - 1;
                  return (
                    <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-xs font-semibold text-[var(--gfm-dark)]">
                        ${(month.amount / 100).toFixed(0)}
                      </span>
                      <div
                        className={`w-full rounded-t-lg transition-all duration-700 ${
                          isLatest
                            ? 'bg-gradient-to-t from-[var(--gfm-dark-green)] to-[var(--gfm-green)]'
                            : 'bg-[var(--gfm-green)]/20'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2">
                {monthlyHistory.map((month) => (
                  <div key={month.month} className="flex-1 text-center">
                    <p className="text-[10px] text-[var(--gfm-secondary)] font-medium">{month.month.split(' ')[0]}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-[var(--gfm-border)] flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--gfm-secondary)]">Total across {monthlyHistory.length} months</p>
                  <p className="text-xl font-bold text-[var(--gfm-dark)]">
                    ${(monthlyHistory.reduce((sum, m) => sum + m.amount, 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[var(--gfm-secondary)]">Avg campaigns/month</p>
                  <p className="text-xl font-bold text-[var(--gfm-dark)]">
                    {(monthlyHistory.reduce((sum, m) => sum + m.campaigns, 0) / monthlyHistory.length).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Impact Score */}
            <div className="rounded-2xl border border-[var(--gfm-border)] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[var(--gfm-dark)] mb-4">Your Impact Score</h2>
              <div className="flex flex-col items-center">
                <ProgressCircle percentage={95} size={120} strokeWidth={8} />
                <p className="mt-4 text-2xl font-bold text-[var(--gfm-dark)]">Top 5%</p>
                <p className="text-sm text-[var(--gfm-secondary)] text-center mt-1">
                  You give more than 95% of all GoFundMe donors
                </p>
                <div className="mt-4 w-full space-y-3">
                  {[
                    { label: 'Consistency', value: 100, detail: '6/6 months' },
                    { label: 'Diversity', value: 85, detail: '3 causes' },
                    { label: 'Impact', value: 90, detail: '8 goals reached' },
                  ].map((metric) => (
                    <div key={metric.label}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium text-[var(--gfm-dark)]">{metric.label}</span>
                        <span className="text-[var(--gfm-secondary)]">{metric.detail}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[var(--gfm-border)]">
                        <div
                          className="h-full rounded-full bg-[var(--gfm-green)] transition-all duration-1000"
                          style={{ width: `${metric.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="rounded-2xl border border-[var(--gfm-border)] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <svg className="h-5 w-5 text-[var(--gfm-green)]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                <h2 className="text-lg font-bold text-[var(--gfm-dark)]">AI Insights</h2>
              </div>
              <div className="space-y-3">
                <div className="rounded-xl bg-[var(--gfm-bg)] p-4">
                  <p className="text-sm text-[var(--gfm-dark)] leading-relaxed">
                    <span className="font-semibold">Great impact this month!</span> Your donation to the LA Wildfire Recovery fund helped them reach 70% of their goal. They are on track to fully fund by end of April.
                  </p>
                </div>
                <div className="rounded-xl bg-[var(--gfm-bg)] p-4">
                  <p className="text-sm text-[var(--gfm-dark)] leading-relaxed">
                    <span className="font-semibold">Trending cause:</span> Environmental campaigns in your area have increased 40% this month. Your AI agent allocated 30% of your pledge to this category.
                  </p>
                </div>
                <div className="rounded-xl bg-[var(--gfm-bg)] p-4">
                  <p className="text-sm text-[var(--gfm-dark)] leading-relaxed">
                    <span className="font-semibold">Milestone approaching:</span> You are 2 donations away from supporting 25 total campaigns. Keep going!
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-[var(--gfm-border)] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[var(--gfm-dark)] mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link
                  href="/giving-agent/setup"
                  className="flex items-center gap-3 rounded-xl p-3 hover:bg-[var(--gfm-bg)] transition-colors"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--gfm-green)]/10">
                    <svg className="h-4 w-4 text-[var(--gfm-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--gfm-dark)]">Adjust Preferences</p>
                    <p className="text-xs text-[var(--gfm-secondary)]">Change causes, budget, or strategy</p>
                  </div>
                </Link>
                <button
                  onClick={() => setShowImpactCard(true)}
                  className="w-full flex items-center gap-3 rounded-xl p-3 hover:bg-[var(--gfm-bg)] transition-colors text-left"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--gfm-purple)]/10">
                    <svg className="h-4 w-4 text-[var(--gfm-purple)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--gfm-dark)]">Share Your Impact</p>
                    <p className="text-xs text-[var(--gfm-secondary)]">Generate a shareable impact card</p>
                  </div>
                </button>
                <button
                  onClick={() => setShowPauseConfirm(true)}
                  className="w-full flex items-center gap-3 rounded-xl p-3 hover:bg-[var(--gfm-bg)] transition-colors text-left"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
                    <svg className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={isActive ? "M15.75 5.25v13.5m-7.5-13.5v13.5" : "M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z"} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--gfm-dark)]">
                      {isActive ? 'Pause Pledge' : 'Resume Pledge'}
                    </p>
                    <p className="text-xs text-[var(--gfm-secondary)]">
                      {isActive ? 'Temporarily stop distributions' : 'Reactivate your monthly giving'}
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Impact Modal */}
      {showImpactCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => setShowImpactCard(false)}
              className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <ImpactCard
              totalGiven={30000}
              campaignsSupported={24}
              goalsHelped={8}
              topCause="Emergency & Animals"
              monthsActive={6}
              impactPercentile={5}
              displayName="Janahan Sivaraman"
            />
            <div className="mt-4 flex gap-3">
              <button className="flex-1 rounded-xl bg-white py-3 text-sm font-semibold text-[var(--gfm-dark)] hover:bg-gray-100 transition-colors">
                Copy Link
              </button>
              <button className="flex-1 rounded-xl bg-white py-3 text-sm font-semibold text-[var(--gfm-dark)] hover:bg-gray-100 transition-colors">
                Download Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pause/Resume Modal */}
      {showPauseConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-[var(--gfm-dark)]">
              {isActive ? 'Pause your pledge?' : 'Resume your pledge?'}
            </h3>
            <p className="mt-2 text-sm text-[var(--gfm-secondary)] leading-relaxed">
              {isActive
                ? 'No distributions will be made while your pledge is paused. You can resume anytime.'
                : 'Your next distribution will happen on the 1st of the upcoming month.'}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowPauseConfirm(false)}
                className="flex-1 rounded-xl border border-[var(--gfm-border)] py-2.5 text-sm font-semibold text-[var(--gfm-dark)] hover:bg-[var(--gfm-bg)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { setIsActive(!isActive); setShowPauseConfirm(false); }}
                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-colors ${
                  isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-[var(--gfm-green)] hover:bg-[var(--gfm-dark-green)]'
                }`}
              >
                {isActive ? 'Pause Pledge' : 'Resume Pledge'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
