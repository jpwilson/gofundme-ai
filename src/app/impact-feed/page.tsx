'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import {
  Heart,
  Share2,
  TrendingUp,
  Users,
  ArrowRight,
  Zap,
  Globe,
  Sparkles,
  ChevronUp,
  MessageCircle,
  Award,
  Target,
  ArrowUpRight,
} from 'lucide-react';

/* ─── Types ─── */
interface ImpactStory {
  id: string;
  type: 'donation_ripple' | 'milestone' | 'viral_share' | 'network_growth' | 'challenge';
  user: { name: string; avatar?: string; username: string };
  headline: string;
  body: string;
  stats: { label: string; value: string }[];
  rippleCount?: number;
  totalImpact?: string;
  timeAgo: string;
  campaignTitle?: string;
  campaignSlug?: string;
  reactions: { hearts: number; shares: number; comments: number };
  color: string;
}

/* ─── Mock Impact Stories ─── */
const MOCK_STORIES: ImpactStory[] = [
  {
    id: '1',
    type: 'donation_ripple',
    user: { name: 'Sarah Chen', username: 'sarahc' },
    headline: 'Sarah\'s $50 donation inspired a chain reaction',
    body: 'Sarah donated to the LA Wildfire Recovery fund and shared it on Instagram. Her post was shared 47 times, bringing in 12 new donors who collectively raised $2,340.',
    stats: [
      { label: 'Initial donation', value: '$50' },
      { label: 'People inspired', value: '12' },
      { label: 'Total raised', value: '$2,340' },
      { label: 'Multiplier', value: '46.8x' },
    ],
    rippleCount: 3,
    totalImpact: '$2,340',
    timeAgo: '2 hours ago',
    campaignTitle: 'LA Wildfire Recovery Fund',
    campaignSlug: 'la-wildfire-alerts-and-recovery',
    reactions: { hearts: 234, shares: 89, comments: 15 },
    color: 'from-emerald-400 to-teal-500',
  },
  {
    id: '2',
    type: 'milestone',
    user: { name: 'Marcus Johnson', username: 'marcusj' },
    headline: 'Marcus hit 100 donations milestone!',
    body: 'Over the past 18 months, Marcus has donated to 100 different campaigns on GoFundMe, helping fund medical bills, disaster relief, and education programs across 14 states.',
    stats: [
      { label: 'Campaigns funded', value: '100' },
      { label: 'Total given', value: '$4,720' },
      { label: 'States reached', value: '14' },
      { label: 'Lives impacted', value: '~300' },
    ],
    timeAgo: '4 hours ago',
    reactions: { hearts: 567, shares: 123, comments: 42 },
    color: 'from-violet-400 to-purple-500',
  },
  {
    id: '3',
    type: 'viral_share',
    user: { name: 'Priya Patel', username: 'priyap' },
    headline: 'Priya\'s tweet went viral — $18K raised in 6 hours',
    body: 'When Priya shared a medical fundraiser for a friend\'s child, the tweet was retweeted 2,300 times. The campaign hit its goal in under 6 hours, with donations averaging $45.',
    stats: [
      { label: 'Retweets', value: '2,300' },
      { label: 'New donors', value: '412' },
      { label: 'Raised in 6h', value: '$18,540' },
      { label: 'Avg donation', value: '$45' },
    ],
    rippleCount: 5,
    totalImpact: '$18,540',
    timeAgo: '6 hours ago',
    campaignTitle: 'Help Baby Maya\'s Surgery',
    campaignSlug: 'la-wildfire-alerts-and-recovery',
    reactions: { hearts: 1243, shares: 456, comments: 89 },
    color: 'from-blue-400 to-indigo-500',
  },
  {
    id: '4',
    type: 'network_growth',
    user: { name: 'David Kim', username: 'davidk' },
    headline: 'David connected 3 communities for disaster relief',
    body: 'David organized a cross-community fundraising effort, connecting his church group, workplace, and neighborhood association. The combined network raised 340% more than individual efforts.',
    stats: [
      { label: 'Communities linked', value: '3' },
      { label: 'Network size', value: '847' },
      { label: 'Combined raised', value: '$12,650' },
      { label: 'vs individual', value: '+340%' },
    ],
    timeAgo: '8 hours ago',
    reactions: { hearts: 389, shares: 201, comments: 34 },
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: '5',
    type: 'challenge',
    user: { name: 'Emma Rodriguez', username: 'emmar' },
    headline: 'Emma started the "Match My Gift" challenge',
    body: 'Emma challenged her followers to match her $100 donation to an education fund. 28 people accepted, raising $3,200. The challenge format has since been used by 150+ other donors.',
    stats: [
      { label: 'Challenge accepted', value: '28' },
      { label: 'Total matched', value: '$3,200' },
      { label: 'Format copied', value: '150+' },
      { label: 'Ripple raised', value: '$45K+' },
    ],
    rippleCount: 4,
    totalImpact: '$45,000+',
    timeAgo: '12 hours ago',
    reactions: { hearts: 892, shares: 567, comments: 73 },
    color: 'from-rose-400 to-pink-500',
  },
  {
    id: '6',
    type: 'donation_ripple',
    user: { name: 'Alex Thompson', username: 'alext' },
    headline: 'Alex\'s monthly giving inspired a workplace movement',
    body: 'After Alex set up $25/month recurring donations, 14 coworkers followed suit. Their company then matched all donations 2:1, turning $375/month into $1,125/month of sustained giving.',
    stats: [
      { label: 'Monthly pledge', value: '$25' },
      { label: 'Coworkers joined', value: '14' },
      { label: 'Company match', value: '2:1' },
      { label: 'Monthly total', value: '$1,125' },
    ],
    timeAgo: '1 day ago',
    reactions: { hearts: 445, shares: 178, comments: 29 },
    color: 'from-teal-400 to-cyan-500',
  },
  {
    id: '7',
    type: 'milestone',
    user: { name: 'Lisa Wang', username: 'lisaw' },
    headline: 'Lisa\'s network reached $50K total impact',
    body: 'Through direct donations and inspiring others, Lisa\'s giving network has now crossed $50,000 in total impact. Her profile shows connections to 23 funded campaigns and 189 donors she\'s influenced.',
    stats: [
      { label: 'Total impact', value: '$50K+' },
      { label: 'Campaigns funded', value: '23' },
      { label: 'Donors influenced', value: '189' },
      { label: 'Avg gift inspired', value: '$62' },
    ],
    timeAgo: '1 day ago',
    reactions: { hearts: 1567, shares: 345, comments: 112 },
    color: 'from-emerald-400 to-green-600',
  },
  {
    id: '8',
    type: 'viral_share',
    user: { name: 'Jordan Rivera', username: 'jordanr' },
    headline: 'Jordan\'s TikTok review of GoFundMe campaigns went viral',
    body: 'Jordan posted a 60-second review of 5 animal rescue campaigns. The video got 1.2M views and drove $8,900 in donations across the featured campaigns within 48 hours.',
    stats: [
      { label: 'Views', value: '1.2M' },
      { label: 'Campaigns featured', value: '5' },
      { label: 'Donations driven', value: '$8,900' },
      { label: 'New donors', value: '267' },
    ],
    timeAgo: '2 days ago',
    campaignTitle: 'Rescue Dogs of LA',
    campaignSlug: 'la-wildfire-alerts-and-recovery',
    reactions: { hearts: 2341, shares: 890, comments: 156 },
    color: 'from-fuchsia-400 to-purple-500',
  },
];

/* ─── Network Stats ─── */
const NETWORK_STATS = [
  { icon: Users, value: '2.3M', label: 'Active givers this month', trend: '+12%' },
  { icon: TrendingUp, value: '$4.7M', label: 'Ripple-driven donations', trend: '+23%' },
  { icon: Share2, value: '847K', label: 'Shares this week', trend: '+8%' },
  { icon: Zap, value: '46.8x', label: 'Average donation multiplier', trend: '+3.2x' },
];

/* ─── Virality Score ─── */
function ViralityScore({ score }: { score: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={88} height={88} viewBox="0 0 88 88" className="-rotate-90">
        <circle cx={44} cy={44} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={5} />
        <circle
          cx={44}
          cy={44}
          r={radius}
          fill="none"
          stroke="var(--gfm-green)"
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>
      <span className="absolute text-lg font-bold text-gfm-dark">{score}</span>
    </div>
  );
}

/* ─── Type Icon ─── */
function StoryTypeIcon({ type }: { type: ImpactStory['type'] }) {
  const map = {
    donation_ripple: { icon: Zap, label: 'Ripple Effect' },
    milestone: { icon: Award, label: 'Milestone' },
    viral_share: { icon: TrendingUp, label: 'Viral Share' },
    network_growth: { icon: Globe, label: 'Network Growth' },
    challenge: { icon: Target, label: 'Challenge' },
  };
  const { icon: Icon, label } = map[type];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gfm-green/10 px-3 py-1 text-xs font-semibold text-gfm-green">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

/* ─── Ripple Visualization ─── */
function RippleViz({ count, color }: { count: number; color: string }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full bg-gradient-to-r ${color} transition-all duration-500`}
          style={{
            width: 8 + i * 4,
            height: 8 + i * 4,
            opacity: 1 - i * 0.15,
            animationDelay: `${i * 150}ms`,
          }}
        />
      ))}
      <span className="ml-2 text-xs font-medium text-gfm-secondary">
        {count} degrees of impact
      </span>
    </div>
  );
}

/* ─── Story Card ─── */
function StoryCard({ story, index }: { story: ImpactStory; index: number }) {
  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      className="group rounded-2xl border border-gfm-border bg-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-gfm-green/5 hover:-translate-y-0.5"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Gradient accent bar */}
      <div className={`h-1 bg-gradient-to-r ${story.color}`} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar name={story.user.name} size="md" />
            <div>
              <Link
                href={`/u/${story.user.username}`}
                className="font-semibold text-gfm-dark hover:text-gfm-green transition-colors"
              >
                {story.user.name}
              </Link>
              <p className="text-xs text-gfm-secondary">{story.timeAgo}</p>
            </div>
          </div>
          <StoryTypeIcon type={story.type} />
        </div>

        {/* Headline */}
        <h3 className="text-lg font-bold text-gfm-dark mb-2 leading-snug">
          {story.headline}
        </h3>

        {/* Body */}
        <p
          className={`text-sm text-gfm-secondary leading-relaxed ${
            !expanded ? 'line-clamp-2' : ''
          }`}
        >
          {story.body}
        </p>
        {story.body.length > 120 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1 text-xs font-medium text-gfm-green hover:underline"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}

        {/* Ripple visualization */}
        {story.rippleCount && (
          <div className="mt-4">
            <RippleViz count={story.rippleCount} color={story.color} />
          </div>
        )}

        {/* Stats grid */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {story.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-gfm-bg p-3 text-center"
            >
              <p className="text-lg font-bold text-gfm-dark">{stat.value}</p>
              <p className="text-[11px] text-gfm-secondary">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Campaign link */}
        {story.campaignTitle && (
          <Link
            href={`/f/${story.campaignSlug}`}
            className="mt-4 flex items-center gap-2 rounded-lg border border-gfm-border px-3 py-2 text-sm text-gfm-dark hover:border-gfm-green/40 hover:bg-gfm-bg transition-colors"
          >
            <Heart className="h-4 w-4 text-gfm-green" />
            <span className="truncate">{story.campaignTitle}</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-gfm-secondary ml-auto flex-shrink-0" />
          </Link>
        )}

        {/* Reactions */}
        <div className="mt-4 flex items-center gap-4 pt-4 border-t border-gfm-border">
          <button
            onClick={() => setLiked(!liked)}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              liked ? 'text-pink-500 font-medium' : 'text-gfm-secondary hover:text-pink-500'
            }`}
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
            {story.reactions.hearts + (liked ? 1 : 0)}
          </button>
          <button className="flex items-center gap-1.5 text-sm text-gfm-secondary hover:text-gfm-green transition-colors">
            <Share2 className="h-4 w-4" />
            {story.reactions.shares}
          </button>
          <button className="flex items-center gap-1.5 text-sm text-gfm-secondary hover:text-blue-500 transition-colors">
            <MessageCircle className="h-4 w-4" />
            {story.reactions.comments}
          </button>
        </div>
      </div>
    </article>
  );
}

/* ─── Your Network Score Panel ─── */
function NetworkScorePanel() {
  return (
    <div className="rounded-2xl border border-gfm-border bg-white p-6 sticky top-20">
      <h3 className="text-sm font-semibold text-gfm-dark uppercase tracking-wider mb-4">
        Your Network Score
      </h3>

      <div className="flex items-center gap-4 mb-6">
        <ViralityScore score={73} />
        <div>
          <p className="text-sm font-semibold text-gfm-dark">Strong Network</p>
          <p className="text-xs text-gfm-secondary">Top 15% of givers</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <ScoreRow label="Sharing frequency" value={82} />
        <ScoreRow label="Donation consistency" value={91} />
        <ScoreRow label="Network influence" value={65} />
        <ScoreRow label="Cause diversity" value={54} />
      </div>

      <div className="border-t border-gfm-border pt-4">
        <h4 className="text-xs font-semibold text-gfm-dark uppercase tracking-wider mb-3">
          Boost Your Score
        </h4>
        <div className="space-y-2">
          <TipRow text="Share a campaign this week" points="+5" />
          <TipRow text="Donate to a new category" points="+8" />
          <TipRow text="Invite 3 friends to give" points="+12" />
          <TipRow text="Start a challenge" points="+15" />
        </div>
      </div>

      <Link href="/u/janahan" className="mt-4 block">
        <Button variant="outline" size="sm" className="w-full">
          View Your Profile
        </Button>
      </Link>
    </div>
  );
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gfm-secondary">{label}</span>
        <span className="font-semibold text-gfm-dark">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-gfm-bg overflow-hidden">
        <div
          className="h-full rounded-full bg-gfm-green transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function TipRow({ text, points }: { text: string; points: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-gfm-bg px-3 py-2">
      <span className="text-xs text-gfm-secondary">{text}</span>
      <span className="text-xs font-semibold text-gfm-green">{points}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
/*  PAGE                                                  */
/* ═══════════════════════════════════════════════════════ */
export default function ImpactFeedPage() {
  const [stories, setStories] = useState<ImpactStory[]>(MOCK_STORIES.slice(0, 4));
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const loaderRef = useRef<HTMLDivElement>(null);

  // Infinite scroll
  const loadMore = useCallback(() => {
    if (loading || stories.length >= MOCK_STORIES.length) return;
    setLoading(true);
    setTimeout(() => {
      setStories((prev) => {
        const next = MOCK_STORIES.slice(0, prev.length + 2);
        return next;
      });
      setLoading(false);
    }, 800);
  }, [loading, stories.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.5 }
    );
    const el = loaderRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [loadMore]);

  const filters = [
    { value: 'all', label: 'All Stories' },
    { value: 'donation_ripple', label: 'Ripple Effects' },
    { value: 'viral_share', label: 'Viral Shares' },
    { value: 'milestone', label: 'Milestones' },
    { value: 'network_growth', label: 'Network Growth' },
    { value: 'challenge', label: 'Challenges' },
  ];

  const filteredStories = filter === 'all'
    ? stories
    : stories.filter((s) => s.type === filter);

  return (
    <div className="min-h-screen bg-gfm-bg">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gfm-dark via-[#1a2e1a] to-gfm-dark py-16 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-gfm-green" />
            <span className="text-sm font-semibold text-gfm-green">Impact Stories</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl leading-[1.1]">
            See How Giving
            <br />
            <span className="text-gfm-green">Creates Ripples</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/70 leading-relaxed">
            Every donation creates a chain reaction. See real stories of how one act
            of generosity inspires dozens more — and how your network amplifies impact.
          </p>

          {/* Network stats */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {NETWORK_STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-4 w-4 text-gfm-green" />
                    <span className="text-xs font-medium text-white/50">{stat.label}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">{stat.value}</span>
                    <span className="text-xs font-semibold text-gfm-green flex items-center gap-0.5">
                      <ChevronUp className="h-3 w-3" />
                      {stat.trend}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-8 hide-scrollbar">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filter === f.value
                  ? 'bg-gfm-green text-white'
                  : 'bg-white border border-gfm-border text-gfm-secondary hover:border-gfm-green hover:text-gfm-green'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex gap-8">
          {/* Feed */}
          <div className="flex-1 space-y-6">
            {filteredStories.length === 0 && (
              <div className="text-center py-16 text-gfm-secondary">
                <Globe className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">No stories yet in this category</p>
                <p className="text-sm mt-1">Check back soon or browse all stories</p>
              </div>
            )}
            {filteredStories.map((story, i) => (
              <StoryCard key={story.id} story={story} index={i} />
            ))}

            {/* Infinite scroll loader */}
            <div ref={loaderRef} className="py-8 text-center">
              {loading && (
                <div className="flex items-center justify-center gap-2 text-gfm-secondary">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gfm-border border-t-gfm-green" />
                  <span className="text-sm">Loading more stories...</span>
                </div>
              )}
              {stories.length >= MOCK_STORIES.length && !loading && (
                <p className="text-sm text-gfm-secondary">
                  You&apos;re all caught up! Check back later for new impact stories.
                </p>
              )}
            </div>
          </div>

          {/* Sidebar — Network Score (desktop only) */}
          <div className="hidden lg:block w-[300px] flex-shrink-0">
            <NetworkScorePanel />
          </div>
        </div>
      </div>
    </div>
  );
}
