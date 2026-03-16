'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { users, getActivitiesByUserId, donations, fundraisers, causes } from '@/lib/data/mock';
import { IMAGES } from '@/lib/data/images';
import { formatCurrency, formatNumber } from '@/lib/utils/format';
import { Heart, Share2, Users, MapPin, Calendar, ChevronRight, TrendingUp, ArrowUpRight } from 'lucide-react';

const user = users[0];
const userActivities = getActivitiesByUserId(user.id);
const userDonations = donations.filter((d) => d.donorId === user.id);
const totalGiven = userDonations.reduce((sum, d) => sum + d.amount, 0);

// Compute cause affinity from donation history
const causeAffinity = (() => {
  const affinityMap: Record<string, { amount: number; count: number }> = {};
  for (const donation of userDonations) {
    const fund = fundraisers.find((f) => f.id === donation.fundraiserId);
    if (fund) {
      if (!affinityMap[fund.category]) affinityMap[fund.category] = { amount: 0, count: 0 };
      affinityMap[fund.category].amount += donation.amount;
      affinityMap[fund.category].count++;
    }
  }
  return Object.entries(affinityMap)
    .map(([category, data]) => {
      const cause = causes.find((c) => c.type === category);
      return { category, label: cause?.label || category, color: cause?.iconBgColor || '#e0e0e0', ...data };
    })
    .sort((a, b) => b.amount - a.amount);
})();

// Giving personality derived from behavior
const givingPersonality = (() => {
  const avgDonation = totalGiven / Math.max(userDonations.length, 1);
  const hasEmergency = causeAffinity.some((c) => c.category === 'emergency');
  const donationCount = userDonations.length;
  const messageRate = userDonations.filter((d) => d.message).length / Math.max(donationCount, 1);

  if (hasEmergency && donationCount >= 2) return { type: 'Crisis Responder', description: 'You show up when it matters most, rallying support during emergencies and natural disasters.', color: '#FDBA74' };
  if (avgDonation > 15000 && messageRate > 0.5) return { type: 'Champion Giver', description: 'Your generous contributions and heartfelt messages inspire others to give.', color: '#93C5FD' };
  if (donationCount >= 3) return { type: 'Steady Supporter', description: 'Your consistent giving across causes builds lasting impact over time.', color: '#6EE7B7' };
  return { type: 'Community Builder', description: 'You bring people together around causes that matter, amplifying collective impact.', color: '#C4B5FD' };
})();

// Precomputed ring offsets for the cause affinity SVG
const causeAffinityRing = (() => {
  const total = causeAffinity.reduce((s, c) => s + c.amount, 0);
  let offset = 0;
  return causeAffinity.map((cause) => {
    const pct = (cause.amount / total) * 100;
    const item = { ...cause, pct, offset };
    offset += pct;
    return item;
  });
})();

// Ripple effect: fundraisers shared that received follow-on donations
const rippleEffect = {
  fundraisersShared: 3,
  followOnDonors: 8,
  followOnAmount: 75000,
};

// Recommended causes based on affinity
const recommendedFundraisers = fundraisers
  .filter((f) => !userDonations.some((d) => d.fundraiserId === f.id))
  .map((f) => {
    const categoryMatch = causeAffinity.some((c) => c.category === f.category);
    return { ...f, relevance: categoryMatch ? 'Based on your giving history' : 'Trending in your area' };
  });

// Network giving
const networkDonors: { name: string; sharedCauses: number; avatar: string | null }[] = [
  { name: 'Tim Cadogan', sharedCauses: 2, avatar: IMAGES.avatars.tim },
  { name: 'Arnie Katz', sharedCauses: 1, avatar: IMAGES.avatars.arnie },
  { name: 'Maria Gonzalez', sharedCauses: 1, avatar: IMAGES.avatars.maria },
];

export default function SmartProfilePage() {
  const [animated, setAnimated] = useState(false);
  const [aiPersonality, setAiPersonality] = useState<{ loading: boolean; data: any | null }>({ loading: true, data: null });
  const [aiNarrative, setAiNarrative] = useState<{ loading: boolean; data: string | null }>({ loading: true, data: null });
  const [aiRecommendations, setAiRecommendations] = useState<{ loading: boolean; data: any[] | null }>({ loading: true, data: null });

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const payload = { user, activities: userActivities, donations: userDonations };

    // Fetch personality insights
    fetch('/api/ai/profile-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feature: 'insights', ...payload }),
    })
      .then((res) => res.json())
      .then((res) => {
        setAiPersonality({ loading: false, data: res.data?.parsed?.givingPersonality ?? null });
      })
      .catch(() => setAiPersonality({ loading: false, data: null }));

    // Fetch narrative
    fetch('/api/ai/profile-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feature: 'narrative', ...payload }),
    })
      .then((res) => res.json())
      .then((res) => {
        setAiNarrative({ loading: false, data: res.data?.content ?? null });
      })
      .catch(() => setAiNarrative({ loading: false, data: null }));

    // Fetch recommendations
    fetch('/api/ai/profile-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feature: 'recommendations', ...payload }),
    })
      .then((res) => res.json())
      .then((res) => {
        setAiRecommendations({ loading: false, data: res.data?.parsed?.recommendations ?? null });
      })
      .catch(() => setAiRecommendations({ loading: false, data: null }));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Cover + Profile Header */}
      <div className="relative">
        <div className="h-48 overflow-hidden">
          <img src={IMAGES.covers.janahan} alt="Cover" className="w-full h-full object-cover" />
        </div>
        <div className="mx-auto max-w-3xl px-4">
          <div className="relative -mt-16 flex items-end gap-4 pb-6">
            <img
              src={user.avatarUrl || IMAGES.avatars.janahan}
              alt={user.displayName}
              className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover flex-shrink-0"
            />
            <div className="pb-1 flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-gfm-dark">{user.displayName}</h1>
                {/* Giving Personality Badge */}
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ backgroundColor: aiPersonality.data?.type ? '#6EE7B7' : givingPersonality.color, color: '#1a1a1a' }}
                >
                  {aiPersonality.loading ? (
                    <span className="inline-block w-20 h-3 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    aiPersonality.data?.type || givingPersonality.type
                  )}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-sm text-gfm-secondary flex-wrap">
                {user.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {user.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-16">
        {/* Bio */}
        {user.bio && (
          <p className="text-sm text-gfm-secondary leading-relaxed mb-6">{user.bio}</p>
        )}

        {/* Personality Description */}
        <div id="tour-ai-narrative" className="rounded-xl bg-gradient-to-r from-gfm-bg to-white border border-gfm-border p-4 mb-8">
          {aiNarrative.loading ? (
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-4/6" />
            </div>
          ) : aiNarrative.data ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-medium text-gfm-green bg-gfm-light-green rounded-full px-2 py-0.5">AI-powered</span>
              </div>
              <div className="text-sm text-gfm-secondary leading-relaxed prose prose-sm max-w-none">
                {aiNarrative.data.split('\n').map((line, i) => (
                  <p key={i} className={line.trim() === '' ? 'hidden' : 'mb-1'}>{line}</p>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gfm-secondary italic">&ldquo;{aiPersonality.data?.description || givingPersonality.description}&rdquo;</p>
          )}
          {/* Traits pills */}
          {!aiPersonality.loading && aiPersonality.data?.traits && aiPersonality.data.traits.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {aiPersonality.data.traits.map((trait: string) => (
                <span key={trait} className="text-[10px] font-medium text-gfm-secondary bg-gfm-bg border border-gfm-border rounded-full px-2 py-0.5">
                  {trait}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Impact Summary — "Giving Wrapped" */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gfm-dark mb-4">Your Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total given', value: formatCurrency(totalGiven), sub: `across ${userDonations.length} donations` },
              { label: 'People helped', value: '12', sub: 'through your contributions' },
              { label: 'Causes supported', value: String(causeAffinity.length), sub: causeAffinity.map((c) => c.label).join(', ') },
              { label: 'Inspired', value: formatNumber(user.inspiredCount), sub: 'people to take action' },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`rounded-xl border border-gfm-border p-4 transition-all duration-700 ${
                  animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <div className="text-2xl font-bold text-gfm-dark">{stat.value}</div>
                <div className="text-xs font-medium text-gfm-dark mt-1">{stat.label}</div>
                <div className="text-[10px] text-gfm-secondary mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Cause Affinity Wheel */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gfm-dark mb-4">What You Care About</h2>
          <div className="flex items-center gap-6">
            {/* Visual affinity ring */}
            <div className="relative w-32 h-32 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                {causeAffinityRing.map((item) => (
                  <circle
                    key={item.category}
                    cx="18" cy="18" r="14"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="4"
                    strokeDasharray={`${item.pct} ${100 - item.pct}`}
                    strokeDashoffset={`${-item.offset}`}
                    className="transition-all duration-1000"
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Heart className="h-6 w-6 text-gfm-green" />
              </div>
            </div>
            {/* Legend */}
            <div className="flex-1 space-y-2">
              {causeAffinity.map((cause) => {
                const total = causeAffinity.reduce((s, c) => s + c.amount, 0);
                const pct = Math.round((cause.amount / total) * 100);
                return (
                  <div key={cause.category} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cause.color }} />
                    <span className="text-sm text-gfm-dark flex-1">{cause.label}</span>
                    <span className="text-sm font-medium text-gfm-dark">{pct}%</span>
                    <span className="text-xs text-gfm-secondary">{formatCurrency(cause.amount)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Ripple Effect */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gfm-dark mb-4">Your Ripple Effect</h2>
          <div className="rounded-xl border border-gfm-border bg-gradient-to-r from-green-50/50 to-white p-5">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gfm-light-green flex items-center justify-center">
                  <Share2 className="h-5 w-5 text-gfm-green" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gfm-dark">{rippleEffect.fundraisersShared}</div>
                  <div className="text-xs text-gfm-secondary">fundraisers shared</div>
                </div>
              </div>
              <div className="text-gfm-border">
                <ChevronRight className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gfm-dark">{rippleEffect.followOnDonors}</div>
                  <div className="text-xs text-gfm-secondary">donors followed your shares</div>
                </div>
              </div>
              <div className="text-gfm-border">
                <ChevronRight className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gfm-dark">{formatCurrency(rippleEffect.followOnAmount)}</div>
                  <div className="text-xs text-gfm-secondary">raised from your shares</div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gfm-secondary mt-3">
              When you share a fundraiser, it reaches people who trust your judgment. Your shares have inspired {rippleEffect.followOnDonors} additional donations.
            </p>
          </div>
        </section>

        {/* Network */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gfm-dark mb-4">Giving Together</h2>
          <div className="space-y-3">
            {networkDonors.map((donor) => (
              <div key={donor.name} className="flex items-center gap-3 rounded-lg border border-gfm-border p-3 hover:bg-gfm-bg/50 transition-colors">
                {donor.avatar ? (
                  <img src={donor.avatar} alt={donor.name} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gfm-bg flex items-center justify-center text-sm font-bold text-gfm-secondary">
                    {donor.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <span className="text-sm font-medium text-gfm-dark">{donor.name}</span>
                  <span className="text-xs text-gfm-secondary ml-2">{donor.sharedCauses} cause{donor.sharedCauses > 1 ? 's' : ''} in common</span>
                </div>
                <button className="text-xs text-gfm-green font-medium hover:text-gfm-dark-green transition-colors">
                  View profile
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* You Might Care About */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gfm-dark mb-1">You might care about</h2>
          <p className="text-xs text-gfm-secondary mb-4">People with similar giving patterns are rallying around these</p>
          <div className="space-y-3">
            {aiRecommendations.loading ? (
              // Loading skeletons
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 rounded-xl border border-gfm-border p-4">
                  <div className="w-16 h-16 rounded-lg bg-gray-200 animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                    <div className="h-1.5 bg-gray-200 rounded-full animate-pulse w-full" />
                    <div className="h-2 bg-gray-200 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))
            ) : aiRecommendations.data && aiRecommendations.data.length > 0 ? (
              // AI-powered recommendations
              aiRecommendations.data.slice(0, 3).map((rec) => {
                const fund = fundraisers.find((f) => f.slug === rec.slug);
                const urgencyColor = rec.urgency === 'high' ? 'bg-red-100 text-red-700' : rec.urgency === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700';
                return (
                  <Link
                    key={rec.slug}
                    href={`/f/${rec.slug}`}
                    className="flex items-center gap-4 rounded-xl border border-gfm-border p-4 hover:border-gfm-green/30 hover:shadow-sm transition-all group"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      {fund && <img src={fund.coverImageUrl} alt={rec.title} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-gfm-dark group-hover:text-gfm-green transition-colors truncate">{rec.title}</h3>
                        {rec.matchScore != null && (
                          <span className="text-[10px] font-medium text-gfm-green bg-gfm-light-green rounded-full px-1.5 py-0.5 flex-shrink-0">
                            {Math.round(rec.matchScore * 100)}% match
                          </span>
                        )}
                      </div>
                      {fund && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-gfm-bg rounded-full overflow-hidden">
                            <div className="h-full bg-gfm-green rounded-full" style={{ width: `${Math.min(100, (fund.raisedAmount / fund.goalAmount) * 100)}%` }} />
                          </div>
                          <span className="text-xs text-gfm-secondary flex-shrink-0">{formatCurrency(fund.raisedAmount)} raised</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[10px] text-gfm-secondary">{rec.reason}</p>
                        {rec.urgency && (
                          <span className={`text-[10px] font-medium rounded-full px-1.5 py-0.5 flex-shrink-0 ${urgencyColor}`}>
                            {rec.urgency}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-gfm-secondary group-hover:text-gfm-green transition-colors flex-shrink-0" />
                  </Link>
                );
              })
            ) : (
              // Fallback: original hardcoded recommendations
              recommendedFundraisers.slice(0, 3).map((fund) => (
                <Link
                  key={fund.slug}
                  href={`/f/${fund.slug}`}
                  className="flex items-center gap-4 rounded-xl border border-gfm-border p-4 hover:border-gfm-green/30 hover:shadow-sm transition-all group"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={fund.coverImageUrl} alt={fund.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gfm-dark group-hover:text-gfm-green transition-colors truncate">{fund.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-gfm-bg rounded-full overflow-hidden">
                        <div className="h-full bg-gfm-green rounded-full" style={{ width: `${Math.min(100, (fund.raisedAmount / fund.goalAmount) * 100)}%` }} />
                      </div>
                      <span className="text-xs text-gfm-secondary flex-shrink-0">{formatCurrency(fund.raisedAmount)} raised</span>
                    </div>
                    <p className="text-[10px] text-gfm-secondary mt-1">{fund.relevance}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gfm-secondary group-hover:text-gfm-green transition-colors flex-shrink-0" />
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="text-lg font-bold text-gfm-dark mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {userActivities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gfm-light-green flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Heart className="h-4 w-4 text-gfm-green" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gfm-dark">
                    {activity.type === 'donation' && activity.donationAmount
                      ? `Donated ${formatCurrency(activity.donationAmount)} to `
                      : activity.type === 'fundraiser_created'
                      ? 'Created '
                      : activity.type === 'fundraiser_update'
                      ? 'Posted an update to '
                      : 'Commented on '}
                    {activity.fundraiser && (
                      <Link href={`/f/${activity.fundraiser.slug}`} className="font-medium text-gfm-green hover:text-gfm-dark-green">
                        {activity.fundraiser.title}
                      </Link>
                    )}
                  </p>
                  {activity.content && (
                    <p className="text-xs text-gfm-secondary mt-0.5 line-clamp-2">{activity.content}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-gfm-secondary">
                    <span>{new Date(activity.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span>{activity.likeCount} likes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
