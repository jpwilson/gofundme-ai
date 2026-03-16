'use client';

import Link from 'next/link';
import {
  Heart,
  Users,
  User,
  Sparkles,
  Brain,
  BarChart3,
  Shield,
  Ticket,
  Target,
  Eye,
  Wallet,
  Activity,
  MousePointerClick,
  Share2,
  Cpu,
  Gauge,
  Layers,
  TestTube,
  GitBranch,
  Database,
  ArrowRight,
  ExternalLink,
  Github,
  Zap,
  TrendingUp,
  Clock,
  DollarSign,
} from 'lucide-react';

/* ─── Card wrapper ─── */
function Card({
  href,
  icon: Icon,
  title,
  description,
  badge,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <Link href={href} className="group block">
      <div className="relative h-full rounded-2xl border border-gfm-border bg-white p-6 transition-all duration-200 hover:border-gfm-green/40 hover:shadow-lg hover:shadow-gfm-green/5 hover:-translate-y-0.5">
        {badge && (
          <span className="absolute top-4 right-4 rounded-full bg-gfm-green/10 px-2.5 py-1 text-[11px] font-semibold text-gfm-green uppercase tracking-wide">
            {badge}
          </span>
        )}
        <div className="mb-4 inline-flex rounded-xl bg-gfm-bg p-3 text-gfm-green group-hover:bg-gfm-green/10 transition-colors">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-gfm-dark mb-2">{title}</h3>
        <p className="text-sm text-gfm-secondary leading-relaxed">{description}</p>
        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-gfm-green opacity-0 group-hover:opacity-100 transition-opacity">
          Explore <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}

/* ─── Section heading ─── */
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
        <p className="mt-3 max-w-3xl text-gfm-secondary leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}

/* ─── Metric category card ─── */
function MetricCard({
  icon: Icon,
  title,
  metrics,
  rationale,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  metrics: string[];
  rationale: string;
}) {
  return (
    <div className="rounded-2xl border border-gfm-border bg-white p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="inline-flex rounded-xl bg-gfm-bg p-2.5 text-gfm-green">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold text-gfm-dark">{title}</h3>
      </div>
      <ul className="space-y-2 mb-4">
        {metrics.map((m) => (
          <li key={m} className="flex items-start gap-2 text-sm text-gfm-dark">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gfm-green" />
            {m}
          </li>
        ))}
      </ul>
      <p className="text-sm text-gfm-secondary italic border-t border-gfm-border pt-4">
        &ldquo;{rationale}&rdquo;
      </p>
    </div>
  );
}

/* ─── Architecture row ─── */
function ArchRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 py-3 border-b border-gfm-border last:border-b-0">
      <span className="text-sm font-semibold text-gfm-dark min-w-[120px]">{label}</span>
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
      {/* ─── Hero ─── */}
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
            A deep product exploration that reconstructs core GoFundMe pages and layers on
            AI-powered features to explore where the platform could better connect generosity
            with impact.
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

        {/* ─── Core Pages ─── */}
        <section>
          <SectionHeading
            tag="Core Pages"
            title="What&rsquo;s Here"
            subtitle="Faithful reconstructions of GoFundMe's primary surfaces, built from scratch with Next.js 16, Tailwind CSS 4, and production-grade component architecture."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card
              href="/f/la-wildfire-alerts-and-recovery"
              icon={Heart}
              title="Fundraiser Page"
              description="Campaign detail with donation sidebar, donor list, leaderboard, social sharing, and organizer info."
            />
            <Card
              href="/communities/watch-duty"
              icon={Users}
              title="Community Page"
              description="Community hub with leaderboard, activity feed, fundraisers list, and member engagement."
            />
            <Card
              href="/u/janahan"
              icon={User}
              title="Profile Page"
              description="User profile with giving history, highlights, follower network, and top causes."
            />
          </div>
        </section>

        <Divider />

        {/* ─── AI Ideation 1 ─── */}
        <section>
          <SectionHeading
            tag="AI Ideation"
            title="AI Features"
            subtitle="Each page extends the platform with AI capabilities — from narrative coaching to cost projections — all observable and cost-tracked via LangFuse."
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <Card
              href="/ai/fundraiser"
              icon={Sparkles}
              title="AI Fundraiser"
              badge="Claude"
              description="Story coach that analyzes campaign narratives, sentiment analysis on donor messages, and trust scoring for organizer verification. Powered by Claude via OpenRouter."
            />
            <Card
              href="/ai/community"
              icon={Brain}
              title="AI Community"
              description="AI-generated weekly digests summarizing community activity, smart campaign discovery with urgency and momentum signals."
            />
            <Card
              href="/ai/profile"
              icon={User}
              title="AI Profile"
              description="AI giving personality analysis, impact narrative generation, personalized fundraiser recommendations based on giving patterns."
            />
            <Card
              href="/ai/analytics"
              icon={BarChart3}
              title="AI Analytics"
              description="Real-time LangFuse observability, per-feature cost tracking, scale projections from 1K to 1M MAU, and development cost breakdown."
            />
          </div>
        </section>

        <Divider />

        {/* ─── AI Ideation 2 ─── */}
        <section>
          <SectionHeading
            tag="AI Ideation 2"
            title="More AI Explorations"
            subtitle="A second wave of AI features pushing into fraud detection, agent workflows, persona targeting, and autonomous giving."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card
              href="/ai2/fraud-detection"
              icon={Shield}
              title="Fraud Detection"
              description="Real-time anomaly detection with configurable rules, trust score distribution, and live monitoring feed."
            />
            <Card
              href="/ai2/jira-agent"
              icon={Ticket}
              title="Jira Agent"
              description="AI-powered engineering workflows for ticket creation, PR reviews, and sprint planning."
            />
            <Card
              href="/ai2/persona-recommendations"
              icon={Target}
              title="Persona Recommendations"
              description="Donor persona targeting with demographics, platform preferences, and outreach strategies."
            />
            <Card
              href="/ai2/agent-observability"
              icon={Eye}
              title="Agent Observability"
              description="Agent behavior tracking with trace visualization, decision logs, and pattern detection."
            />
            <Card
              href="/giving-agent"
              icon={Wallet}
              title="Giving Agent"
              description="Automated monthly giving — set a budget, choose causes, let AI distribute donations with full transparency."
            />
          </div>
        </section>

        <Divider />

        {/* ─── Instrumentation & Metrics ─── */}
        <section>
          <SectionHeading
            tag="Instrumentation"
            title="Metrics &amp; Why They Matter"
            subtitle="Every metric is chosen for a reason. On a platform where engagement directly drives donations and donor trust drives repeat giving, instrumentation isn't optional — it's product strategy."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              icon={Gauge}
              title="Performance"
              metrics={['TTFB (Time to First Byte)', 'LCP (Largest Contentful Paint)', 'FID (First Input Delay)', 'CLS (Cumulative Layout Shift)']}
              rationale="GoFundMe pages are image-heavy; LCP is crucial for perceived speed."
            />
            <MetricCard
              icon={MousePointerClick}
              title="Engagement"
              metrics={['Page views', 'Scroll depth', 'Time on page', 'Share clicks']}
              rationale="Longer engagement correlates with donation likelihood."
            />
            <MetricCard
              icon={DollarSign}
              title="Donation Funnel"
              metrics={['Button clicks', 'Page views', 'Completion rate', 'Abandonment rate']}
              rationale="Each step drop-off reveals friction in the giving flow."
            />
            <MetricCard
              icon={Share2}
              title="Share-to-Donation"
              metrics={['Share events by channel', 'Referral clicks', 'Conversion from shares', 'Revenue per share']}
              rationale="Each share should generate ~$13-15 in donations."
            />
            <MetricCard
              icon={Cpu}
              title="AI Feature Usage"
              metrics={['API calls per feature', 'Token consumption', 'Latency (p50, p95, p99)', 'Cost per call via LangFuse']}
              rationale="Every AI call tracked for observability and cost management."
            />
            <MetricCard
              icon={TrendingUp}
              title="Growth Signals"
              metrics={['New fundraiser creation rate', 'Returning donor rate', 'Community join rate', 'Viral coefficient']}
              rationale="Network effects compound — tracking virality reveals platform health."
            />
          </div>
        </section>

        <Divider />

        {/* ─── Architecture ─── */}
        <section>
          <SectionHeading
            tag="Architecture"
            title="How It&rsquo;s Built"
            subtitle="A modern stack chosen for developer velocity, type safety, and production readiness."
          />
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-gfm-border bg-white p-8">
              <h3 className="text-lg font-semibold text-gfm-dark mb-6 flex items-center gap-2">
                <Layers className="h-5 w-5 text-gfm-green" />
                Stack
              </h3>
              <div className="divide-y divide-gfm-border">
                <ArchRow label="Framework" value="Next.js 16, App Router, TypeScript" />
                <ArchRow label="Styling" value="Tailwind CSS 4" />
                <ArchRow label="AI" value="Claude (via OpenRouter), Anthropic SDK, LangFuse observability" />
                <ArchRow label="State" value="Zustand, React Query" />
                <ArchRow label="Testing" value="Vitest + Testing Library (200 tests)" />
                <ArchRow label="CI/CD" value="GitHub Actions, Vercel" />
                <ArchRow label="Data" value="Mock data layer (production-ready schema designed for Supabase)" />
              </div>
            </div>
            <div className="rounded-2xl border border-gfm-border bg-white p-8">
              <h3 className="text-lg font-semibold text-gfm-dark mb-6 flex items-center gap-2">
                <Zap className="h-5 w-5 text-gfm-green" />
                Key Decisions
              </h3>
              <div className="space-y-5">
                <div>
                  <h4 className="text-sm font-semibold text-gfm-dark">App Router over Pages Router</h4>
                  <p className="text-sm text-gfm-secondary mt-1">Server components, streaming, and layouts make complex pages like fundraiser detail composable and performant.</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gfm-dark">Mock Data Layer</h4>
                  <p className="text-sm text-gfm-secondary mt-1">All data follows production-ready schemas. Swapping to Supabase is a data-source change, not a refactor.</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gfm-dark">LangFuse for AI Observability</h4>
                  <p className="text-sm text-gfm-secondary mt-1">Every AI call is traced with cost, latency, and token usage. This enables real cost projections at scale.</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gfm-dark">OpenRouter for Model Access</h4>
                  <p className="text-sm text-gfm-secondary mt-1">Abstracts model provider — can switch between Claude, GPT, and others without code changes.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* ─── Philosophy ─── */}
        <section className="pb-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-gfm-green/10 px-3 py-1 text-xs font-semibold text-gfm-green uppercase tracking-wider mb-4">
              Philosophy
            </span>
            <h2 className="text-3xl font-bold text-gfm-dark mb-6">
              Why This Exists
            </h2>
            <p className="text-lg text-gfm-secondary leading-relaxed">
              The goal isn&rsquo;t to rebuild GoFundMe &mdash; it&rsquo;s to understand the product
              deeply enough to identify where there&rsquo;s room to add more value. Each page and
              feature is an exploration of how the platform could better connect generosity with
              impact.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://github.com/jpwilson/gofundme-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gfm-green px-6 py-3 text-sm font-semibold text-white hover:bg-gfm-green/90 transition-colors"
              >
                <Github className="h-4 w-4" />
                GitHub Repository
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border-2 border-gfm-border px-6 py-3 text-sm font-semibold text-gfm-dark hover:border-gfm-green hover:text-gfm-green transition-all"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
