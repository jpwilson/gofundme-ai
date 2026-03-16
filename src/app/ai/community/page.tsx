'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  communities,
  activities as allActivities,
  fundraisers as allFundraisers,
  users,
  donations,
} from '@/lib/data/mock';
import { formatCurrency, formatNumber, formatRelativeTime } from '@/lib/utils/format';
import {
  Heart, Users, TrendingUp, Clock, Filter, ChevronDown, Share2,
  ArrowUpRight, Target, RefreshCw, MapPin, Flame, Sparkles,
} from 'lucide-react';

const community = communities[0];
const communityActivities = allActivities.filter((a) => a.communityId === community.id);
const communityFundraisers = allFundraisers.filter((f) => f.communityId === community.id);

// Expanded fundraisers for richer display
const enrichedFundraisers = allFundraisers.map((f) => {
  const fundDonations = donations.filter((d) => d.fundraiserId === f.id);
  const daysOld = Math.floor((Date.now() - new Date(f.createdAt).getTime()) / (1000 * 60 * 60 * 24));
  const velocity = f.raisedAmount / Math.max(daysOld, 1); // cents/day
  const pctToGoal = (f.raisedAmount / f.goalAmount) * 100;
  const isNearGoal = pctToGoal >= 70 && pctToGoal < 100;
  const isNew = daysOld <= 14;
  const isUrgent = velocity > 5000 && pctToGoal < 100;

  return {
    ...f,
    donationList: fundDonations,
    daysOld,
    velocity,
    pctToGoal,
    isNearGoal,
    isNew,
    isUrgent,
    recentDonationCount: fundDonations.filter(
      (d) => Date.now() - new Date(d.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000
    ).length,
  };
});

type SortOption = 'trending' | 'urgent' | 'near-goal' | 'newest' | 'most-raised';

// Milestone
const milestoneReached = community.totalRaised >= 1_000_00000;
const milestoneLabel = '$18M+';

// Related communities
const relatedCommunities = [
  { name: 'Climate Resilience', members: 12400, slug: '#' },
  { name: 'Emergency Preparedness', members: 8900, slug: '#' },
  { name: 'LA Mutual Aid', members: 6200, slug: '#' },
];

// Recurring giving stat
const monthlyGivers = 340;

export default function SmartCommunityPage() {
  const [sortBy, setSortBy] = useState<SortOption>('trending');
  const [showFilter, setShowFilter] = useState(false);
  const [pulseItems, setPulseItems] = useState(communityActivities.slice(0, 6));
  const [digest, setDigest] = useState<{ loading: boolean; data: string | null; error: boolean }>({ loading: true, data: null, error: false });

  // Fetch AI-generated community digest
  useEffect(() => {
    fetch('/api/ai/community-digest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        communityName: community.name,
        activities: communityActivities.slice(0, 15),
        stats: {
          totalRaised: community.totalRaised,
          totalDonations: community.totalDonations,
          totalFundraisers: community.totalFundraisers,
          followerCount: community.followerCount,
        },
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch digest');
        return res.json();
      })
      .then((json) => {
        setDigest({ loading: false, data: json.data.content, error: false });
      })
      .catch(() => {
        setDigest({ loading: false, data: null, error: true });
      });
  }, []);

  // Simulate live pulse updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseItems((prev) => {
        const shuffled = [...communityActivities].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 6);
      });
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Smart sorted fundraisers
  const sortedFundraisers = useMemo(() => {
    const list = [...enrichedFundraisers];
    switch (sortBy) {
      case 'trending':
        return list.sort((a, b) => b.velocity - a.velocity);
      case 'urgent':
        return list.sort((a, b) => (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0) || b.velocity - a.velocity);
      case 'near-goal':
        return list.filter((f) => f.pctToGoal >= 50).sort((a, b) => b.pctToGoal - a.pctToGoal);
      case 'newest':
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'most-raised':
        return list.sort((a, b) => b.raisedAmount - a.raisedAmount);
      default:
        return list;
    }
  }, [sortBy]);

  const sortOptions: { value: SortOption; label: string; description: string }[] = [
    { value: 'trending', label: 'Most active', description: 'Highest donation velocity right now' },
    { value: 'urgent', label: 'Most urgent', description: 'Need support the most' },
    { value: 'near-goal', label: 'Nearing their goal', description: 'Almost there — your donation could tip the scale' },
    { value: 'newest', label: 'New this week', description: 'Recently launched campaigns' },
    { value: 'most-raised', label: 'Most raised', description: 'Top campaigns by total raised' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Community Hero */}
      <div className="relative bg-gradient-to-br from-gfm-dark via-gray-900 to-gray-800 text-white">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Flame className="h-7 w-7 text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{community.name}</h1>
              <p className="text-sm text-white/70">{formatNumber(community.followerCount)} members united for wildfire relief</p>
            </div>
          </div>

          {/* Impact Aggregator */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            {[
              { value: formatCurrency(community.totalRaised), label: 'Raised together', emphasis: true },
              { value: formatNumber(community.totalDonations), label: 'Donations made' },
              { value: formatNumber(community.totalFundraisers), label: 'Campaigns supported' },
              { value: '830+', label: 'Families helped' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 p-4">
                <div className={`text-xl md:text-2xl font-bold ${stat.emphasis ? 'text-gfm-green' : 'text-white'}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-white/60 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Milestone Celebration */}
            {milestoneReached && (
              <div className="rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-gfm-green/20 p-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gfm-green/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-gfm-green" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gfm-dark">This community just crossed {milestoneLabel} raised</h3>
                    <p className="text-xs text-gfm-secondary mt-0.5">
                      {formatNumber(community.followerCount)} people came together to make this happen. Share this milestone to inspire more.
                    </p>
                  </div>
                  <button className="rounded-full bg-gfm-green px-4 py-2 text-xs font-semibold text-white hover:bg-gfm-dark-green transition-colors flex items-center gap-1.5">
                    <Share2 className="h-3.5 w-3.5" />
                    Share
                  </button>
                </div>
              </div>
            )}

            {/* Campaign Discovery */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gfm-dark">Campaigns</h2>
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className="flex items-center gap-1.5 text-sm text-gfm-secondary hover:text-gfm-dark transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  {sortOptions.find((s) => s.value === sortBy)?.label}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showFilter ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {showFilter && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4 animate-in slide-in-from-top-2 duration-200">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => { setSortBy(option.value); setShowFilter(false); }}
                      className={`rounded-lg border p-2.5 text-left transition-all ${
                        sortBy === option.value ? 'border-gfm-green bg-green-50' : 'border-gfm-border hover:border-gfm-green/30'
                      }`}
                    >
                      <div className="text-xs font-medium text-gfm-dark">{option.label}</div>
                      <div className="text-[10px] text-gfm-secondary mt-0.5">{option.description}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* Campaign Cards */}
              <div className="space-y-4">
                {sortedFundraisers.map((fund) => (
                  <Link
                    key={fund.id}
                    href={`/f/${fund.slug}`}
                    className="flex gap-4 rounded-xl border border-gfm-border p-4 hover:border-gfm-green/30 hover:shadow-sm transition-all group"
                  >
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={fund.coverImageUrl} alt={fund.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {fund.isUrgent && (
                          <span className="rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-[10px] font-semibold">Most urgent</span>
                        )}
                        {fund.isNearGoal && (
                          <span className="rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-[10px] font-semibold">Almost there</span>
                        )}
                        {fund.isNew && (
                          <span className="rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 text-[10px] font-semibold">New</span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-gfm-dark group-hover:text-gfm-green transition-colors truncate">
                        {fund.title}
                      </h3>
                      <p className="text-xs text-gfm-secondary mt-0.5 line-clamp-1">
                        by {fund.organizer.displayName}
                      </p>
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-1 h-1.5 bg-gfm-bg rounded-full overflow-hidden">
                            <div className="h-full bg-gfm-green rounded-full" style={{ width: `${Math.min(100, fund.pctToGoal)}%` }} />
                          </div>
                          <span className="text-xs font-medium text-gfm-dark">{Math.round(fund.pctToGoal)}%</span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-gfm-secondary">
                          <span>{formatCurrency(fund.raisedAmount)} raised</span>
                          <span>{fund.donationCount} donors</span>
                          {fund.recentDonationCount > 0 && (
                            <span className="text-gfm-green">{fund.recentDonationCount} this week</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-gfm-secondary group-hover:text-gfm-green transition-colors flex-shrink-0 mt-1" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-5">
            {/* Cause Pulse - Live Feed */}
            <div className="rounded-xl border border-gfm-border overflow-hidden">
              <div className="px-4 py-3 border-b border-gfm-border bg-gfm-bg/50 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gfm-dark flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gfm-green animate-pulse" />
                  Live activity
                </h3>
                <RefreshCw className="h-3.5 w-3.5 text-gfm-secondary" />
              </div>
              <div className="divide-y divide-gfm-border">
                {pulseItems.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="px-4 py-3 hover:bg-gfm-bg/30 transition-colors">
                    <div className="flex items-start gap-2.5">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        activity.type === 'donation' ? 'bg-green-100' : activity.type === 'fundraiser_created' ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        {activity.type === 'donation' ? (
                          <Heart className="h-3 w-3 text-gfm-green" />
                        ) : (
                          <TrendingUp className="h-3 w-3 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gfm-dark">
                          <strong>{activity.user.displayName}</strong>
                          {activity.type === 'donation' && activity.donationAmount
                            ? ` donated ${formatCurrency(activity.donationAmount)}`
                            : activity.type === 'fundraiser_created'
                            ? ' created a campaign'
                            : ' posted an update'}
                        </p>
                        <p className="text-[10px] text-gfm-secondary truncate mt-0.5">
                          {activity.fundraiser?.title}
                        </p>
                        <span className="text-[10px] text-gfm-secondary">
                          {formatRelativeTime(new Date(activity.createdAt))}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Digest */}
            <div id="tour-weekly-digest" className="rounded-xl border border-transparent bg-gradient-to-br from-purple-50 via-white to-blue-50 p-[1px]">
              <div className="rounded-[11px] bg-white p-4" style={{ background: 'linear-gradient(135deg, rgba(245,243,255,0.6) 0%, rgba(255,255,255,1) 40%, rgba(239,246,255,0.6) 100%)' }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-gfm-dark uppercase tracking-wide flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                    Weekly Digest
                  </h3>
                  <span className="rounded-full bg-purple-100 text-purple-700 px-2 py-0.5 text-[10px] font-semibold">AI-powered</span>
                </div>
                {digest.loading && (
                  <div className="space-y-2.5 animate-pulse">
                    <div className="h-3 bg-gray-200 rounded-full w-full" />
                    <div className="h-3 bg-gray-200 rounded-full w-5/6" />
                    <div className="h-3 bg-gray-200 rounded-full w-4/6" />
                    <div className="h-3 bg-gray-200 rounded-full w-3/4" />
                  </div>
                )}
                {!digest.loading && digest.data && (
                  <div className="text-xs text-gfm-dark leading-relaxed whitespace-pre-line">
                    {digest.data.split('\n').map((line, i) => {
                      const trimmed = line.trim();
                      if (!trimmed) return <br key={i} />;
                      if (trimmed.startsWith('###')) return <p key={i} className="font-bold text-gfm-dark mt-2 mb-1 text-xs">{trimmed.replace(/^###\s*/, '')}</p>;
                      if (trimmed.startsWith('##')) return <p key={i} className="font-bold text-gfm-dark mt-2 mb-1 text-sm">{trimmed.replace(/^##\s*/, '')}</p>;
                      if (trimmed.startsWith('#')) return <p key={i} className="font-bold text-gfm-dark mt-2 mb-1 text-sm">{trimmed.replace(/^#\s*/, '')}</p>;
                      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) return (
                        <div key={i} className="flex gap-1.5 ml-1 my-0.5">
                          <span className="text-gfm-green mt-px">&#8226;</span>
                          <span>{trimmed.replace(/^[-*]\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1')}</span>
                        </div>
                      );
                      return <p key={i} className="my-0.5">{trimmed.replace(/\*\*(.*?)\*\*/g, '$1')}</p>;
                    })}
                  </div>
                )}
                {!digest.loading && digest.error && (
                  <>
                    {(() => {
                      const spotlight = communityActivities.find((a) => a.type === 'fundraiser_update' && a.content);
                      if (!spotlight) return null;
                      return (
                        <div>
                          <p className="text-sm text-gfm-dark leading-relaxed line-clamp-4">{spotlight.content}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <div className="w-6 h-6 rounded-full bg-gfm-bg flex items-center justify-center text-[10px] font-bold text-gfm-secondary">
                              {spotlight.user.displayName.charAt(0)}
                            </div>
                            <span className="text-xs text-gfm-secondary">{spotlight.user.displayName}</span>
                            <span className="text-xs text-gfm-secondary">&middot;</span>
                            <span className="text-xs text-gfm-secondary">{spotlight.likeCount} likes</span>
                          </div>
                        </div>
                      );
                    })()}
                  </>
                )}
              </div>
            </div>

            {/* Recurring Giving Nudge */}
            <div className="rounded-xl bg-gradient-to-br from-gfm-green/5 to-emerald-50 border border-gfm-green/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="h-4 w-4 text-gfm-green" />
                <h3 className="text-sm font-bold text-gfm-dark">Give monthly</h3>
              </div>
              <p className="text-xs text-gfm-secondary leading-relaxed">
                Wildfires happen every year. <strong className="text-gfm-dark">{monthlyGivers} people</strong> in this community give monthly to stay ready. Recurring giving ensures communities are prepared before disaster strikes.
              </p>
              <button className="mt-3 w-full rounded-full bg-gfm-green py-2 text-xs font-semibold text-white hover:bg-gfm-dark-green transition-colors">
                Set up monthly giving
              </button>
            </div>

            {/* Related Communities */}
            <div className="rounded-xl border border-gfm-border p-4">
              <h3 className="text-xs font-semibold text-gfm-secondary uppercase tracking-wide mb-3">People also support</h3>
              <div className="space-y-3">
                {relatedCommunities.map((rc) => (
                  <div key={rc.name} className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-9 h-9 rounded-lg bg-gfm-bg flex items-center justify-center">
                      <Users className="h-4 w-4 text-gfm-secondary" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gfm-dark group-hover:text-gfm-green transition-colors">{rc.name}</span>
                      <span className="text-xs text-gfm-secondary block">{formatNumber(rc.members)} members</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="rounded-xl border border-gfm-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-gfm-secondary" />
                <h3 className="text-sm font-bold text-gfm-dark">Near you</h3>
              </div>
              <p className="text-xs text-gfm-secondary">
                Showing campaigns relevant to <strong className="text-gfm-dark">Los Angeles, CA</strong>. Community members in your area are most active in emergency relief and animal rescue.
              </p>
            </div>

            {/* About */}
            <div className="rounded-xl border border-gfm-border p-4">
              <h3 className="text-sm font-bold text-gfm-dark mb-2">About</h3>
              <p className="text-xs text-gfm-secondary leading-relaxed">{community.description}</p>
              <p className="text-[10px] text-gfm-secondary mt-3">
                <Clock className="h-3 w-3 inline mr-1" />
                Created {new Date(community.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
