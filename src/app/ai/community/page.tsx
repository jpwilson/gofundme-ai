'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  communities,
  activities as allActivities,
  fundraisers as allFundraisers,
  users,
} from '@/lib/data/mock';
import { formatCurrency, formatNumber } from '@/lib/utils/format';
import { Sparkles, Users, Shield, BookOpen, ChevronRight, Loader2, TrendingUp, Heart } from 'lucide-react';

const community = communities[0];
const communityActivities = allActivities.filter((a) => a.communityId === community.id);
const communityFundraisers = allFundraisers.filter((f) => f.communityId === community.id);

interface CauseMatch {
  fundraiserSlug: string;
  title: string;
  matchScore: number;
  reasons: string[];
}

export default function AICommunityPage() {
  const [digest, setDigest] = useState<string | null>(null);
  const [digestLoading, setDigestLoading] = useState(false);
  const [matches, setMatches] = useState<CauseMatch[] | null>(null);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [trustData, setTrustData] = useState<{
    overallScore: number;
    label: string;
    signals: { signal: string; status: string; weight: number }[];
    recommendation: string;
  } | null>(null);
  const [trustLoading, setTrustLoading] = useState(false);

  const runDigest = async () => {
    setDigestLoading(true);
    try {
      const res = await fetch('/api/ai/community-digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          communityName: community.name,
          activities: communityActivities.map((a) => ({
            type: a.type,
            user: a.user.displayName,
            content: a.content,
            amount: a.donationAmount,
            date: a.createdAt,
          })),
          stats: {
            followers: community.followerCount,
            totalRaised: community.totalRaised,
            totalDonations: community.totalDonations,
            totalFundraisers: community.totalFundraisers,
            activeFundraisers: communityFundraisers.length,
          },
        }),
      });
      const { data } = await res.json();
      setDigest(data.content);
    } catch {
      setDigest('Failed to generate digest.');
    }
    setDigestLoading(false);
  };

  const runCauseMatching = async () => {
    setMatchesLoading(true);
    try {
      const res = await fetch('/api/ai/cause-matching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: {
            name: users[0].displayName,
            location: users[0].location,
            interests: ['emergency', 'animals', 'environment'],
          },
          givingHistory: [
            { category: 'emergency', amount: 30000, count: 3 },
            { category: 'animals', amount: 10000, count: 1 },
          ],
          availableFundraisers: allFundraisers.map((f) => ({
            slug: f.slug,
            title: f.title,
            category: f.category,
            goalAmount: f.goalAmount,
            raisedAmount: f.raisedAmount,
            description: f.description.substring(0, 150),
          })),
        }),
      });
      const { data } = await res.json();
      setMatches(data.parsed?.matches || data.parsed);
    } catch {
      setMatches(null);
    }
    setMatchesLoading(false);
  };

  const runCommunityTrust = async () => {
    setTrustLoading(true);
    try {
      const res = await fetch('/api/ai/trust-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fundraiser: {
            title: community.name,
            category: 'community',
            goalAmount: community.totalRaised,
            raisedAmount: community.totalRaised,
            donationCount: community.totalDonations,
          },
          organizer: { displayName: community.name, followerCount: community.followerCount },
          donations: [],
        }),
      });
      const { data } = await res.json();
      setTrustData(data.parsed);
    } catch {
      setTrustData(null);
    }
    setTrustLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-gfm-green/10 via-emerald-50 to-cyan-50 border-b border-gfm-border">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex items-center gap-2 text-sm text-gfm-secondary mb-3">
            <Link href="/communities/watch-duty" className="hover:text-gfm-green transition-colors">
              {community.name}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gfm-green font-medium">AI-Enhanced View</span>
          </div>
          <h1 className="text-3xl font-bold text-gfm-dark flex items-center gap-3">
            <Sparkles className="h-7 w-7 text-gfm-purple" />
            AI Community Intelligence
          </h1>
          <p className="mt-2 text-gfm-secondary max-w-2xl">
            AI-powered tools that strengthen communities through smart digests, personalized cause matching, and trust monitoring.
          </p>

          {/* Community Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Followers', value: formatNumber(community.followerCount), icon: Users },
              { label: 'Total Raised', value: formatCurrency(community.totalRaised), icon: TrendingUp },
              { label: 'Donations', value: formatNumber(community.totalDonations), icon: Heart },
              { label: 'Fundraisers', value: formatNumber(community.totalFundraisers), icon: BookOpen },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-white/80 backdrop-blur-sm border border-gfm-border/50 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon className="h-4 w-4 text-gfm-green" />
                  <span className="text-xs text-gfm-secondary">{stat.label}</span>
                </div>
                <div className="text-lg font-bold text-gfm-dark">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Features */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Community Digest - Full Width */}
          <div className="lg:col-span-2 rounded-xl border border-gfm-border bg-white overflow-hidden">
            <div className="bg-gradient-to-r from-gfm-purple/10 to-gfm-pink/10 px-6 py-4 border-b border-gfm-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-gfm-purple" />
                  <h3 className="font-bold text-gfm-dark">AI Community Digest</h3>
                </div>
                <button
                  onClick={runDigest}
                  disabled={digestLoading}
                  className="rounded-full bg-gfm-purple px-4 py-1.5 text-xs font-semibold text-white hover:bg-gfm-purple/90 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {digestLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                  {digestLoading ? 'Generating...' : 'Generate Digest'}
                </button>
              </div>
              <p className="text-xs text-gfm-secondary mt-1">AI-generated weekly summary of community activity, trends, and highlights</p>
            </div>
            <div className="p-6 min-h-[300px]">
              {digest ? (
                <div className="prose prose-sm max-w-none text-gfm-dark">
                  {digest.split('\n').map((line, i) => {
                    if (line.startsWith('##')) return <h3 key={i} className="text-lg font-bold text-gfm-dark mt-4 mb-2">{line.replace(/^#+\s*/, '')}</h3>;
                    if (line.startsWith('**') && line.includes(':')) {
                      const [label, ...rest] = line.split(':');
                      return <p key={i} className="mb-1"><strong className="text-gfm-dark">{label.replace(/\*\*/g, '')}:</strong><span className="text-gfm-secondary">{rest.join(':')}</span></p>;
                    }
                    if (line.startsWith('-')) return <p key={i} className="ml-4 mb-1 text-sm text-gfm-secondary">{line}</p>;
                    return line.trim() ? <p key={i} className="mb-2 text-sm text-gfm-secondary">{line}</p> : <br key={i} />;
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <BookOpen className="h-12 w-12 text-gfm-border mb-3" />
                  <p className="text-sm text-gfm-secondary">Generate an AI-powered weekly digest summarizing all community activity</p>
                  <p className="text-xs text-gfm-secondary mt-1">Includes highlights, trending causes, and community health metrics</p>
                </div>
              )}
            </div>
          </div>

          {/* Community Trust Score */}
          <div className="rounded-xl border border-gfm-border bg-white overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gfm-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-gfm-green" />
                  <h3 className="font-bold text-gfm-dark">Community Trust</h3>
                </div>
                <button
                  onClick={runCommunityTrust}
                  disabled={trustLoading}
                  className="rounded-full bg-gfm-green px-4 py-1.5 text-xs font-semibold text-white hover:bg-gfm-dark-green transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {trustLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Shield className="h-3 w-3" />}
                  {trustLoading ? 'Checking...' : 'Check Trust'}
                </button>
              </div>
            </div>
            <div className="p-6 min-h-[260px]">
              {trustData ? (
                <div>
                  <div className="text-center mb-4">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${
                      trustData.overallScore >= 80 ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                      <span className={`text-2xl font-bold ${
                        trustData.overallScore >= 80 ? 'text-gfm-green' : 'text-yellow-600'
                      }`}>{trustData.overallScore}</span>
                    </div>
                    <div className="font-bold text-gfm-dark mt-2">{trustData.label}</div>
                  </div>
                  <div className="space-y-2">
                    {trustData.signals.map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <div className={`w-1.5 h-1.5 rounded-full ${s.status === 'pass' ? 'bg-gfm-green' : 'bg-yellow-400'}`} />
                        <span className="text-gfm-secondary">{s.signal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <Shield className="h-10 w-10 text-gfm-border mb-3" />
                  <p className="text-xs text-gfm-secondary">Evaluate community trust signals</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Smart Cause Matching */}
        <div className="mt-6 rounded-xl border border-gfm-border bg-white overflow-hidden">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-gfm-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-amber-600" />
                <h3 className="font-bold text-gfm-dark">Smart Cause Matching</h3>
              </div>
              <button
                onClick={runCauseMatching}
                disabled={matchesLoading}
                className="rounded-full bg-amber-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {matchesLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Heart className="h-3 w-3" />}
                {matchesLoading ? 'Matching...' : 'Find My Causes'}
              </button>
            </div>
            <p className="text-xs text-gfm-secondary mt-1">AI matches you with fundraisers based on your giving history, interests, and community connections</p>
          </div>
          <div className="p-6">
            {matches ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {matches.map((match, i) => (
                  <Link
                    key={i}
                    href={`/f/${match.fundraiserSlug}`}
                    className="rounded-lg border border-gfm-border p-4 hover:border-amber-300 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-amber-600">#{i + 1} Match</span>
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                        {match.matchScore}%
                      </span>
                    </div>
                    <h4 className="font-bold text-gfm-dark text-sm group-hover:text-gfm-green transition-colors">{match.title}</h4>
                    <div className="mt-2 space-y-1">
                      {match.reasons.map((r, j) => (
                        <p key={j} className="text-xs text-gfm-secondary flex items-start gap-1">
                          <span className="text-amber-400 mt-0.5">&#8226;</span>
                          {r}
                        </p>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-8">
                <Heart className="h-10 w-10 text-gfm-border mb-3" />
                <p className="text-sm text-gfm-secondary">Find fundraisers in this community that match your interests and giving style</p>
              </div>
            )}
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
                <li>Digest open rates and read-through time</li>
                <li>Cause match click-through to donation completion</li>
                <li>Community trust score changes over time</li>
                <li>New member acquisition from AI recommendations</li>
              </ul>
            </div>
            <div>
              <strong className="text-gfm-dark">Why we track it:</strong>
              <ul className="mt-1 space-y-1 list-disc list-inside">
                <li>Measure engagement lift from AI digests</li>
                <li>Validate matching algorithm quality via conversions</li>
                <li>Detect emerging trust issues early</li>
                <li>Optimize AI costs vs. community growth ROI</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
