'use client';

import { useState } from 'react';
import Link from 'next/link';
import { fundraisers, getDonationsByFundraiserId } from '@/lib/data/mock';
import { formatCurrency } from '@/lib/utils/format';
import { Sparkles, MessageSquare, Shield, TrendingUp, ChevronRight, Loader2 } from 'lucide-react';

// Use the first fundraiser as the demo
const fundraiser = fundraisers[0];
const donations = getDonationsByFundraiserId(fundraiser.id);
const donorMessages = donations.filter((d) => d.message).map((d) => d.message as string);

interface SentimentData {
  overall: { score: number; label: string; summary: string };
  themes: { theme: string; count: number; sentiment: number }[];
  highlights: { message: string; sentiment: number; impact: string }[];
}

interface TrustData {
  overallScore: number;
  label: string;
  signals: { signal: string; status: string; weight: number }[];
  recommendation: string;
}

interface DonationSuggestion {
  amount: number;
  label: string;
  popular: boolean;
}

export default function AIFundraiserPage() {
  const [storyCoach, setStoryCoach] = useState<string | null>(null);
  const [storyLoading, setStoryLoading] = useState(false);
  const [sentiment, setSentiment] = useState<SentimentData | null>(null);
  const [sentimentLoading, setSentimentLoading] = useState(false);
  const [trust, setTrust] = useState<TrustData | null>(null);
  const [trustLoading, setTrustLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{ suggestions: DonationSuggestion[]; reasoning: string } | null>(null);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const runStoryCoach = async () => {
    setStoryLoading(true);
    try {
      const res = await fetch('/api/ai/story-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: fundraiser.title,
          description: fundraiser.description,
          category: fundraiser.category,
          goalAmount: fundraiser.goalAmount,
          raisedAmount: fundraiser.raisedAmount,
        }),
      });
      const { data } = await res.json();
      setStoryCoach(data.content);
    } catch {
      setStoryCoach('Failed to load suggestions. Please try again.');
    }
    setStoryLoading(false);
  };

  const runSentiment = async () => {
    setSentimentLoading(true);
    try {
      const res = await fetch('/api/ai/sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: donorMessages }),
      });
      const { data } = await res.json();
      setSentiment(data.parsed);
    } catch {
      setSentiment(null);
    }
    setSentimentLoading(false);
  };

  const runTrust = async () => {
    setTrustLoading(true);
    try {
      const res = await fetch('/api/ai/trust-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fundraiser: { title: fundraiser.title, category: fundraiser.category, goalAmount: fundraiser.goalAmount, raisedAmount: fundraiser.raisedAmount, donationCount: fundraiser.donationCount },
          organizer: { displayName: fundraiser.organizer.displayName, followerCount: fundraiser.organizer.followerCount },
          donations,
        }),
      });
      const { data } = await res.json();
      setTrust(data.parsed);
    } catch {
      setTrust(null);
    }
    setTrustLoading(false);
  };

  const runSuggestions = async () => {
    setSuggestionsLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature: 'donation_suggestions',
          messages: [
            { role: 'system', content: 'You are a donation_suggestions engine. Return a JSON object with suggestions array (amount, label, popular boolean) and reasoning string. Return valid JSON only.' },
            { role: 'user', content: `Suggest donation amounts for: "${fundraiser.title}" (Goal: ${formatCurrency(fundraiser.goalAmount)}, Raised: ${formatCurrency(fundraiser.raisedAmount)}, Category: ${fundraiser.category})` },
          ],
        }),
      });
      const { data } = await res.json();
      try {
        setSuggestions(JSON.parse(data.content));
      } catch {
        setSuggestions(null);
      }
    } catch {
      setSuggestions(null);
    }
    setSuggestionsLoading(false);
  };

  const progress = Math.min(100, Math.round((fundraiser.raisedAmount / fundraiser.goalAmount) * 100));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gfm-secondary mb-2">
          <Link href="/f/la-wildfire-alerts-and-recovery" className="hover:text-gfm-green transition-colors">
            Original Fundraiser
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gfm-green font-medium">AI-Enhanced View</span>
        </div>
        <h1 className="text-3xl font-bold text-gfm-dark flex items-center gap-3">
          <Sparkles className="h-7 w-7 text-gfm-purple" />
          AI Fundraiser Intelligence
        </h1>
        <p className="mt-2 text-gfm-secondary max-w-2xl">
          AI-powered tools that help organizers tell better stories, understand donor sentiment, build trust, and optimize donations.
        </p>
      </div>

      {/* Campaign Summary Card */}
      <div className="rounded-xl border border-gfm-border bg-white p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gfm-dark">{fundraiser.title}</h2>
            <p className="text-sm text-gfm-secondary mt-1">by {fundraiser.organizer.displayName} &middot; {fundraiser.category}</p>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <div className="text-2xl font-bold text-gfm-green">{formatCurrency(fundraiser.raisedAmount)}</div>
              <div className="text-xs text-gfm-secondary">of {formatCurrency(fundraiser.goalAmount)} goal</div>
            </div>
            <div className="w-24 h-24 relative">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e0e0e0"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#02a95c"
                  strokeWidth="3"
                  strokeDasharray={`${progress}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gfm-dark">
                {progress}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Feature Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Story Coach */}
        <div className="rounded-xl border border-gfm-border bg-white overflow-hidden">
          <div className="bg-gradient-to-r from-gfm-purple/10 to-gfm-pink/10 px-6 py-4 border-b border-gfm-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-gfm-purple" />
                <h3 className="font-bold text-gfm-dark">AI Story Coach</h3>
              </div>
              <button
                onClick={runStoryCoach}
                disabled={storyLoading}
                className="rounded-full bg-gfm-purple px-4 py-1.5 text-xs font-semibold text-white hover:bg-gfm-purple/90 transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {storyLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                {storyLoading ? 'Analyzing...' : 'Analyze Story'}
              </button>
            </div>
            <p className="text-xs text-gfm-secondary mt-1">Get AI suggestions to improve your fundraiser story and increase donations</p>
          </div>
          <div className="p-6 min-h-[200px]">
            {storyCoach ? (
              <div className="prose prose-sm max-w-none text-gfm-dark">
                {storyCoach.split('\n').map((line, i) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <h4 key={i} className="font-bold text-gfm-dark mt-3 mb-1">{line.replace(/\*\*/g, '')}</h4>;
                  }
                  if (line.startsWith('**')) {
                    return <p key={i} className="mb-2" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/—/g, '&mdash;') }} />;
                  }
                  return line.trim() ? <p key={i} className="mb-2 text-sm text-gfm-secondary">{line}</p> : null;
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <Sparkles className="h-10 w-10 text-gfm-border mb-3" />
                <p className="text-sm text-gfm-secondary">Click &ldquo;Analyze Story&rdquo; to get AI-powered suggestions for improving your fundraiser description</p>
              </div>
            )}
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="rounded-xl border border-gfm-border bg-white overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-gfm-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <h3 className="font-bold text-gfm-dark">Donor Sentiment</h3>
              </div>
              <button
                onClick={runSentiment}
                disabled={sentimentLoading}
                className="rounded-full bg-blue-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {sentimentLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <MessageSquare className="h-3 w-3" />}
                {sentimentLoading ? 'Analyzing...' : 'Analyze Messages'}
              </button>
            </div>
            <p className="text-xs text-gfm-secondary mt-1">Understand the emotional tone and themes in donor messages</p>
          </div>
          <div className="p-6 min-h-[200px]">
            {sentiment ? (
              <div>
                {/* Overall Score */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                    <span className="text-xl font-bold text-blue-600">{Math.round(sentiment.overall.score * 100)}</span>
                  </div>
                  <div>
                    <div className="font-bold text-gfm-dark">{sentiment.overall.label}</div>
                    <p className="text-xs text-gfm-secondary mt-0.5">{sentiment.overall.summary}</p>
                  </div>
                </div>
                {/* Themes */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gfm-secondary uppercase tracking-wide">Key Themes</h4>
                  {sentiment.themes.map((t, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-gfm-dark">{t.theme}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${t.sentiment * 100}%` }} />
                        </div>
                        <span className="text-xs text-gfm-secondary w-8 text-right">{Math.round(t.sentiment * 100)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <MessageSquare className="h-10 w-10 text-gfm-border mb-3" />
                <p className="text-sm text-gfm-secondary">Analyze {donorMessages.length} donor messages to understand sentiment patterns</p>
              </div>
            )}
          </div>
        </div>

        {/* Trust & Safety */}
        <div className="rounded-xl border border-gfm-border bg-white overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gfm-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-gfm-green" />
                <h3 className="font-bold text-gfm-dark">Trust & Safety Score</h3>
              </div>
              <button
                onClick={runTrust}
                disabled={trustLoading}
                className="rounded-full bg-gfm-green px-4 py-1.5 text-xs font-semibold text-white hover:bg-gfm-dark-green transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {trustLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Shield className="h-3 w-3" />}
                {trustLoading ? 'Evaluating...' : 'Evaluate Trust'}
              </button>
            </div>
            <p className="text-xs text-gfm-secondary mt-1">AI-powered fraud detection and trust signal analysis</p>
          </div>
          <div className="p-6 min-h-[200px]">
            {trust ? (
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    trust.overallScore >= 80 ? 'bg-green-100' : trust.overallScore >= 60 ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    <span className={`text-xl font-bold ${
                      trust.overallScore >= 80 ? 'text-gfm-green' : trust.overallScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>{trust.overallScore}</span>
                  </div>
                  <div>
                    <div className="font-bold text-gfm-dark">{trust.label}</div>
                    <p className="text-xs text-gfm-secondary mt-0.5">{trust.recommendation}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gfm-secondary uppercase tracking-wide">Trust Signals</h4>
                  {trust.signals.map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${s.status === 'pass' ? 'bg-gfm-green' : s.status === 'warn' ? 'bg-yellow-400' : 'bg-red-400'}`} />
                        <span className="text-gfm-dark">{s.signal}</span>
                      </div>
                      <span className="text-xs text-gfm-secondary">{s.weight}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <Shield className="h-10 w-10 text-gfm-border mb-3" />
                <p className="text-sm text-gfm-secondary">Run AI trust analysis to evaluate campaign legitimacy signals</p>
              </div>
            )}
          </div>
        </div>

        {/* Smart Donation Suggestions */}
        <div className="rounded-xl border border-gfm-border bg-white overflow-hidden">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-gfm-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-amber-600" />
                <h3 className="font-bold text-gfm-dark">Smart Donation Amounts</h3>
              </div>
              <button
                onClick={runSuggestions}
                disabled={suggestionsLoading}
                className="rounded-full bg-amber-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {suggestionsLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <TrendingUp className="h-3 w-3" />}
                {suggestionsLoading ? 'Generating...' : 'Generate Suggestions'}
              </button>
            </div>
            <p className="text-xs text-gfm-secondary mt-1">AI-recommended donation amounts based on campaign context and donor patterns</p>
          </div>
          <div className="p-6 min-h-[200px]">
            {suggestions ? (
              <div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {suggestions.suggestions.map((s, i) => (
                    <button
                      key={i}
                      className={`rounded-lg border-2 p-3 text-left transition-all hover:shadow-md ${
                        s.popular ? 'border-amber-400 bg-amber-50' : 'border-gfm-border hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gfm-dark">${s.amount}</span>
                        {s.popular && (
                          <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-white">POPULAR</span>
                        )}
                      </div>
                      <p className="text-xs text-gfm-secondary mt-1">{s.label}</p>
                    </button>
                  ))}
                </div>
                <div className="rounded-lg bg-amber-50 p-3">
                  <p className="text-xs text-amber-800">
                    <strong>AI reasoning:</strong> {suggestions.reasoning}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <TrendingUp className="h-10 w-10 text-gfm-border mb-3" />
                <p className="text-sm text-gfm-secondary">Generate personalized donation amount suggestions for this campaign</p>
              </div>
            )}
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
              <li>AI feature usage (which tools organizers use most)</li>
              <li>Token consumption per feature (cost optimization)</li>
              <li>Response latency (performance monitoring)</li>
              <li>Feature completion rates (did users act on suggestions?)</li>
            </ul>
          </div>
          <div>
            <strong className="text-gfm-dark">Why we track it:</strong>
            <ul className="mt-1 space-y-1 list-disc list-inside">
              <li>Measure AI ROI: do AI-coached stories raise more?</li>
              <li>Optimize costs: route simple tasks to cheaper models</li>
              <li>Improve UX: understand which features drive engagement</li>
              <li>Trust & safety: monitor AI-flagged campaigns</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
