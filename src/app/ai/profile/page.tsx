'use client';

import { useState } from 'react';
import Link from 'next/link';
import { users, getActivitiesByUserId, donations } from '@/lib/data/mock';
import { formatCurrency } from '@/lib/utils/format';
import { Sparkles, User, TrendingUp, Target, ChevronRight, Loader2, BookOpen } from 'lucide-react';

const user = users[0]; // Janahan
const userActivities = getActivitiesByUserId(user.id);
const userDonations = donations.filter((d) => d.donorId === user.id);

interface GivingInsights {
  givingPersonality: { type: string; description: string; traits: string[] };
  patterns: { averageDonation: number; preferredTime: string; preferredDay: string; messageRate: number; shareRate: number };
  suggestions: string[];
}

interface Recommendation {
  slug: string;
  title: string;
  reason: string;
  urgency: string;
  matchScore: number;
}

export default function AIProfilePage() {
  const [narrative, setNarrative] = useState<string | null>(null);
  const [narrativeLoading, setNarrativeLoading] = useState(false);
  const [insights, setInsights] = useState<GivingInsights | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [recsLoading, setRecsLoading] = useState(false);

  const callProfileInsights = async (type: string) => {
    const res = await fetch('/api/ai/profile-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        feature: type,
        user: { displayName: user.displayName, location: user.location, bio: user.bio, followerCount: user.followerCount },
        activities: userActivities,
        donations: userDonations,
      }),
    });
    return res.json();
  };

  const runNarrative = async () => {
    setNarrativeLoading(true);
    try {
      const { data } = await callProfileInsights('narrative');
      setNarrative(data.content);
    } catch {
      setNarrative('Failed to generate narrative.');
    }
    setNarrativeLoading(false);
  };

  const runInsights = async () => {
    setInsightsLoading(true);
    try {
      const { data } = await callProfileInsights('insights');
      setInsights(data.parsed);
    } catch {
      setInsights(null);
    }
    setInsightsLoading(false);
  };

  const runRecommendations = async () => {
    setRecsLoading(true);
    try {
      const { data } = await callProfileInsights('recommendations');
      setRecommendations(data.parsed?.recommendations || []);
    } catch {
      setRecommendations(null);
    }
    setRecsLoading(false);
  };

  const totalGiven = userDonations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gfm-secondary mb-2">
          <Link href="/u/janahan" className="hover:text-gfm-green transition-colors">
            {user.displayName}&apos;s Profile
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gfm-green font-medium">AI-Enhanced View</span>
        </div>
        <h1 className="text-3xl font-bold text-gfm-dark flex items-center gap-3">
          <Sparkles className="h-7 w-7 text-gfm-purple" />
          AI Profile Intelligence
        </h1>
        <p className="mt-2 text-gfm-secondary">
          AI-powered insights that help donors understand their impact, discover their giving style, and find new causes.
        </p>
      </div>

      {/* Profile Summary */}
      <div className="rounded-xl border border-gfm-border bg-white p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gfm-green to-gfm-dark-green flex items-center justify-center">
            <span className="text-xl font-bold text-white">{user.displayName.charAt(0)}</span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gfm-dark">{user.displayName}</h2>
            <p className="text-sm text-gfm-secondary">{user.location} &middot; Member since {new Date(user.createdAt).getFullYear()}</p>
          </div>
          <div className="hidden md:flex items-center gap-6 text-center">
            <div>
              <div className="text-xl font-bold text-gfm-green">{formatCurrency(totalGiven)}</div>
              <div className="text-xs text-gfm-secondary">Total Given</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gfm-dark">{userDonations.length}</div>
              <div className="text-xs text-gfm-secondary">Donations</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gfm-dark">{user.inspiredCount}</div>
              <div className="text-xs text-gfm-secondary">Inspired</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Features */}
      <div className="space-y-6">
        {/* Impact Narrative */}
        <div className="rounded-xl border border-gfm-border bg-white overflow-hidden">
          <div className="bg-gradient-to-r from-gfm-purple/10 to-gfm-pink/10 px-6 py-4 border-b border-gfm-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-gfm-purple" />
                <h3 className="font-bold text-gfm-dark">Your Impact Narrative</h3>
              </div>
              <button
                onClick={runNarrative}
                disabled={narrativeLoading}
                className="rounded-full bg-gfm-purple px-4 py-1.5 text-xs font-semibold text-white hover:bg-gfm-purple/90 transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {narrativeLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                {narrativeLoading ? 'Writing...' : 'Generate Story'}
              </button>
            </div>
            <p className="text-xs text-gfm-secondary mt-1">AI-generated personal narrative about your giving journey and impact</p>
          </div>
          <div className="p-6 min-h-[200px]">
            {narrative ? (
              <div className="prose prose-sm max-w-none text-gfm-dark">
                {narrative.split('\n').map((line, i) => {
                  if (line.startsWith('##')) return <h3 key={i} className="text-lg font-bold text-gfm-dark mt-4 mb-2">{line.replace(/^#+\s*/, '')}</h3>;
                  if (line.startsWith('**')) return <p key={i} className="mb-2" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />;
                  return line.trim() ? <p key={i} className="mb-2 text-sm text-gfm-secondary leading-relaxed">{line}</p> : null;
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <BookOpen className="h-10 w-10 text-gfm-border mb-3" />
                <p className="text-sm text-gfm-secondary">Generate a personalized story about your giving journey</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Giving Insights */}
          <div className="rounded-xl border border-gfm-border bg-white overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-gfm-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  <h3 className="font-bold text-gfm-dark">Giving Personality</h3>
                </div>
                <button
                  onClick={runInsights}
                  disabled={insightsLoading}
                  className="rounded-full bg-blue-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {insightsLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <User className="h-3 w-3" />}
                  {insightsLoading ? 'Analyzing...' : 'Discover Style'}
                </button>
              </div>
            </div>
            <div className="p-6 min-h-[280px]">
              {insights ? (
                <div>
                  {/* Personality Type */}
                  <div className="text-center mb-4 pb-4 border-b border-gfm-border">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 mb-2">
                      <User className="h-7 w-7 text-blue-600" />
                    </div>
                    <div className="text-lg font-bold text-gfm-dark">{insights.givingPersonality.type}</div>
                    <p className="text-xs text-gfm-secondary mt-1">{insights.givingPersonality.description}</p>
                  </div>
                  {/* Traits */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {insights.givingPersonality.traits.map((t, i) => (
                      <span key={i} className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs text-blue-700">{t}</span>
                    ))}
                  </div>
                  {/* Patterns */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gfm-secondary">Avg donation</span>
                      <span className="font-medium text-gfm-dark">{formatCurrency(insights.patterns.averageDonation)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gfm-secondary">Preferred time</span>
                      <span className="font-medium text-gfm-dark">{insights.patterns.preferredTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gfm-secondary">Message rate</span>
                      <span className="font-medium text-gfm-dark">{Math.round(insights.patterns.messageRate * 100)}%</span>
                    </div>
                  </div>
                  {/* Suggestions */}
                  {insights.suggestions.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gfm-border">
                      <h4 className="text-xs font-semibold text-gfm-secondary uppercase tracking-wide mb-2">AI Suggestions</h4>
                      {insights.suggestions.map((s, i) => (
                        <p key={i} className="text-xs text-gfm-secondary mb-1 flex items-start gap-1.5">
                          <Sparkles className="h-3 w-3 text-blue-400 mt-0.5 flex-shrink-0" />
                          {s}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <User className="h-10 w-10 text-gfm-border mb-3" />
                  <p className="text-sm text-gfm-secondary">Discover your giving personality and patterns</p>
                </div>
              )}
            </div>
          </div>

          {/* Fundraiser Recommendations */}
          <div className="rounded-xl border border-gfm-border bg-white overflow-hidden">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-gfm-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-amber-600" />
                  <h3 className="font-bold text-gfm-dark">For You</h3>
                </div>
                <button
                  onClick={runRecommendations}
                  disabled={recsLoading}
                  className="rounded-full bg-amber-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {recsLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Target className="h-3 w-3" />}
                  {recsLoading ? 'Finding...' : 'Get Recommendations'}
                </button>
              </div>
              <p className="text-xs text-gfm-secondary mt-1">Personalized fundraiser suggestions based on your giving history</p>
            </div>
            <div className="p-6 min-h-[280px]">
              {recommendations ? (
                <div className="space-y-3">
                  {recommendations.map((rec, i) => (
                    <Link
                      key={i}
                      href={`/f/${rec.slug}`}
                      className="block rounded-lg border border-gfm-border p-4 hover:border-amber-300 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-bold text-sm text-gfm-dark group-hover:text-gfm-green transition-colors">{rec.title}</h4>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            rec.urgency === 'high' ? 'bg-red-100 text-red-700' : rec.urgency === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                          }`}>{rec.urgency.toUpperCase()}</span>
                          <span className="text-xs font-bold text-amber-600">{rec.matchScore}%</span>
                        </div>
                      </div>
                      <p className="text-xs text-gfm-secondary">{rec.reason}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <Target className="h-10 w-10 text-gfm-border mb-3" />
                  <p className="text-sm text-gfm-secondary">Get AI-curated fundraiser recommendations</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Instrumentation Note */}
      <div className="mt-8 rounded-xl border border-dashed border-gfm-border bg-gfm-bg/50 p-6">
        <h3 className="font-bold text-gfm-dark mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gfm-green animate-pulse" />
          Instrumentation & Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gfm-secondary">
          <div>
            <strong className="text-gfm-dark">What we track:</strong>
            <ul className="mt-1 space-y-1 list-disc list-inside">
              <li>Narrative generation engagement (reads, shares)</li>
              <li>Recommendation click-through to donation</li>
              <li>Giving personality type distribution</li>
              <li>Suggestion adoption rates</li>
            </ul>
          </div>
          <div>
            <strong className="text-gfm-dark">Why we track it:</strong>
            <ul className="mt-1 space-y-1 list-disc list-inside">
              <li>Drive repeat visits through personalized experiences</li>
              <li>Measure recommendation quality (conversion rate)</li>
              <li>Improve matching algorithms with feedback loops</li>
              <li>Optimize for meaningful actions (Donate, Share, Follow)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
