'use client';

import { BackToHome } from '@/components/ui/BackToHome';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ExternalLink,
  Github,
  MapPin,
  Layers,
  DollarSign,
  Activity,
  Shield,
  Wallet,
  BarChart3,
  Box,
  Brain,
  Share2,
  Target,
  BadgeCheck,
  MessageSquare,
  Newspaper,
  Heart,
  Bot,
  Cpu,
  Gauge,
  TrendingUp,
  MousePointerClick,
} from 'lucide-react';

/* ─── Types ─── */
interface FeatureMapping {
  feature: string;
  problem: string;
  where: string;
  icon: React.ComponentType<{ className?: string }>;
}

/* ─── Feature Map Data ─── */
const featureMap: FeatureMapping[] = [
  {
    feature: 'AI Story Coach',
    problem: 'Campaign quality (Smart Fundraising Coach)',
    where: 'Fundraiser page → "Get AI Story Feedback"',
    icon: Sparkles,
  },
  {
    feature: 'Share Content Generator',
    problem: 'Sharing rate (+10% with AI-generated content)',
    where: 'Fundraiser page → "Generate Share Messages"',
    icon: Share2,
  },
  {
    feature: 'Intelligent Ask Amounts',
    problem: 'Revenue optimization (7% lift in A/B tests)',
    where: 'Fundraiser donation sidebar',
    icon: Target,
  },
  {
    feature: 'AI Trust Badge',
    problem: 'Donor confidence (Giving Guarantee)',
    where: 'Fundraiser page, next to title',
    icon: BadgeCheck,
  },
  {
    feature: 'Donor Sentiment',
    problem: 'Organizer insights',
    where: 'Fundraiser page, below description',
    icon: MessageSquare,
  },
  {
    feature: 'AI Community Digest',
    problem: 'Repeat visits',
    where: 'Community page, above leaderboard',
    icon: Newspaper,
  },
  {
    feature: 'Giving Personality',
    problem: 'Donor engagement/retention',
    where: 'Profile page, below header',
    icon: Heart,
  },
  {
    feature: 'Fraud Detection',
    problem: 'Trust & Safety',
    where: '/fraud-detection dashboard',
    icon: Shield,
  },
  {
    feature: 'AI Impact Narrative',
    problem: 'Donor retention',
    where: 'Profile page → "View AI Impact Story"',
    icon: Brain,
  },
  {
    feature: 'Giving Agent',
    problem: 'Recurring revenue',
    where: '/giving-agent',
    icon: Bot,
  },
];

/* ─── Section Heading ─── */
function SectionHeading({
  tag,
  title,
  subtitle,
}: {
  tag: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-10">
      <span className="inline-block rounded-full bg-gfm-green/10 px-3 py-1 text-xs font-semibold text-gfm-green uppercase tracking-wider mb-3">
        {tag}
      </span>
      <h2 className="text-3xl font-bold text-gfm-dark">{title}</h2>
      {subtitle && (
        <p className="mt-3 max-w-3xl text-gfm-secondary leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ─── Feature Card ─── */
function FeatureCard({ item }: { item: FeatureMapping }) {
  const Icon = item.icon;
  return (
    <div className="group rounded-2xl border border-gfm-border bg-white p-6 transition-all duration-200 hover:border-gfm-green/40 hover:shadow-lg hover:shadow-gfm-green/5 hover:-translate-y-0.5">
      <div className="flex items-start gap-4">
        <div className="inline-flex rounded-xl bg-gfm-bg p-2.5 text-gfm-green group-hover:bg-gfm-green/10 transition-colors flex-shrink-0">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-gfm-dark">{item.feature}</h3>
          <p className="mt-1 text-sm text-gfm-secondary leading-relaxed">
            {item.problem}
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-gfm-green/80">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{item.where}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Architecture Row ─── */
function ArchRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 py-3 border-b border-gfm-border last:border-b-0">
      <span className="text-sm font-semibold text-gfm-dark min-w-[120px]">
        {label}
      </span>
      <span className="text-sm text-gfm-secondary">{value}</span>
    </div>
  );
}

/* ─── Divider ─── */
function Divider() {
  return <div className="my-16 border-t border-gfm-border" />;
}

/* ═══════════════════════════════════════════════════════ */
/*  PAGE                                                  */
/* ═══════════════════════════════════════════════════════ */
export default function DocsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gfm-bg/30 to-white">
      <BackToHome />

      {/* ─── 1. Hero ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(2,173,73,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-5xl px-6 pt-24 pb-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-gfm-green/10 px-4 py-1.5 text-sm font-medium text-gfm-green mb-6">
            <Sparkles className="h-4 w-4" /> Product Exploration
          </span>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-gfm-dark leading-[1.1]">
            GoFundMe AI
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gfm-secondary leading-relaxed">
            GoFundMe launched their Smart Fundraising Coach on March 12, 2026
            &mdash; predicting $125M in incremental funding. This project
            explores the same thesis: AI can make fundraising more accessible,
            trustworthy, and effective.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://github.com/jpwilson/gofundme-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gfm-dark px-6 py-3 text-sm font-semibold text-white hover:bg-gfm-dark/90 transition-colors"
            >
              <Github className="h-4 w-4" />
              View on GitHub
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <Link
              href="/f/la-wildfire-alerts-and-recovery"
              className="inline-flex items-center gap-2 rounded-full border-2 border-gfm-green px-6 py-3 text-sm font-semibold text-gfm-green hover:bg-gfm-green hover:text-white transition-all"
            >
              See it in action
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        <Divider />

        {/* ─── 2. Feature Map ─── */}
        <section>
          <SectionHeading
            tag="Feature Map"
            title="AI Features &rarr; GoFundMe Business Problems"
            subtitle="Each feature maps directly to a real GoFundMe strategic priority. Click around the app to see them in context."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {featureMap.map((item) => (
              <FeatureCard key={item.feature} item={item} />
            ))}
          </div>
        </section>

        <Divider />

        {/* ─── 3. Architecture ─── */}
        <section>
          <SectionHeading
            tag="Architecture"
            title="How It&rsquo;s Built"
            subtitle="A modern stack chosen for developer velocity, type safety, and production readiness."
          />
          <div className="rounded-2xl border border-gfm-border bg-white p-8">
            <h3 className="text-lg font-semibold text-gfm-dark mb-6 flex items-center gap-2">
              <Layers className="h-5 w-5 text-gfm-green" />
              Stack
            </h3>
            <div className="divide-y divide-gfm-border">
              <ArchRow label="Framework" value="Next.js 16, App Router, TypeScript" />
              <ArchRow label="Styling" value="Tailwind CSS 4" />
              <ArchRow
                label="AI"
                value="Claude Haiku 4.5 via OpenRouter, Anthropic SDK"
              />
              <ArchRow label="Observability" value="LangFuse (every AI call traced)" />
              <ArchRow label="State" value="Zustand, React Query" />
              <ArchRow label="Testing" value="Vitest + Testing Library (205 tests)" />
              <ArchRow label="CI/CD" value="GitHub Actions, Vercel" />
              <ArchRow
                label="Data"
                value="Mock data layer (Supabase-ready schema)"
              />
            </div>
          </div>
        </section>

        <Divider />

        {/* ─── 4. AI Cost Projections ─── */}
        <section>
          <SectionHeading
            tag="Cost"
            title="AI Cost Projections"
            subtitle="Claude Haiku at $0.80 / $4.00 per 1M tokens, approximately 5 calls per user per month."
          />
          <div className="rounded-2xl border border-gfm-border bg-white overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gfm-border bg-gfm-bg/50">
                  <th className="px-6 py-4 text-sm font-semibold text-gfm-dark">
                    Users
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gfm-dark">
                    AI Calls / mo
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gfm-dark">
                    Monthly Cost
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gfm-border">
                {[
                  { users: '1K', calls: '~5K', cost: '$5' },
                  { users: '10K', calls: '~50K', cost: '$50' },
                  { users: '100K', calls: '~500K', cost: '$500' },
                  { users: '1M', calls: '~5M', cost: '$5,000' },
                ].map((row) => (
                  <tr
                    key={row.users}
                    className="hover:bg-gfm-bg/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gfm-dark">
                      {row.users}
                    </td>
                    <td className="px-6 py-4 text-sm text-gfm-secondary">
                      {row.calls}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gfm-green">
                      {row.cost}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <Divider />

        {/* ─── 5. Metrics & Instrumentation ─── */}
        <section>
          <SectionHeading
            tag="Instrumentation"
            title="Metrics &amp; Instrumentation"
            subtitle="Every metric is chosen for a reason. On a platform where engagement directly drives donations, instrumentation is product strategy."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Gauge,
                title: 'Page Performance',
                desc: 'LCP, FID, CLS — image-heavy pages need speed.',
              },
              {
                icon: MousePointerClick,
                title: 'Donation Funnel',
                desc: 'Clicks → page views → completions — identify friction.',
              },
              {
                icon: Share2,
                title: 'Share-to-Donation',
                desc: 'The viral growth loop. Each share should generate ~$13-15.',
              },
              {
                icon: Cpu,
                title: 'AI Feature Usage',
                desc: 'Tokens, latency, cost per call — all via LangFuse.',
              },
              {
                icon: TrendingUp,
                title: 'Campaign Health',
                desc: 'Sentiment signals, trust scores, momentum indicators.',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-gfm-border bg-white p-6 transition-all duration-200 hover:border-gfm-green/40 hover:shadow-lg hover:shadow-gfm-green/5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="inline-flex rounded-xl bg-gfm-bg p-2.5 text-gfm-green">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-semibold text-gfm-dark">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gfm-secondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <Divider />

        {/* ─── 6. Additional Features ─── */}
        <section className="pb-24">
          <SectionHeading
            tag="Explore"
            title="Additional Features"
            subtitle="More AI-powered explorations beyond the core pages."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                href: '/explore',
                icon: Box,
                title: '3D Product Explorer',
                desc: 'Interactive feature map',
              },
              {
                href: '/ai/analytics',
                icon: BarChart3,
                title: 'AI Analytics',
                desc: 'LangFuse observability dashboard',
              },
              {
                href: '/fraud-detection',
                icon: Shield,
                title: 'Fraud Detection',
                desc: 'AI trust scoring dashboard',
              },
              {
                href: '/giving-agent',
                icon: Wallet,
                title: 'Giving Agent',
                desc: 'Automated monthly giving',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="group block">
                  <div className="h-full rounded-2xl border border-gfm-border bg-white p-6 transition-all duration-200 hover:border-gfm-green/40 hover:shadow-lg hover:shadow-gfm-green/5 hover:-translate-y-0.5">
                    <div className="mb-4 inline-flex rounded-xl bg-gfm-bg p-3 text-gfm-green group-hover:bg-gfm-green/10 transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-semibold text-gfm-dark mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gfm-secondary">{item.desc}</p>
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-gfm-green opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
