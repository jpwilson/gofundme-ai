import Link from 'next/link';
import { Search, DollarSign, Users, TrendingUp, ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Avatar } from '@/components/ui/Avatar';
import { fundraisers as mockFundraisers } from '@/lib/data/mock';
import { formatCurrency, formatCompactCurrency, formatPercentage } from '@/lib/utils/format';

const categories = [
  { name: 'Medical', emoji: '🏥', href: '/c/medical' },
  { name: 'Emergency', emoji: '🚨', href: '/c/emergency' },
  { name: 'Education', emoji: '📚', href: '/c/education' },
  { name: 'Animals', emoji: '🐾', href: '/c/animals' },
  { name: 'Environment', emoji: '🌱', href: '/c/environment' },
  { name: 'Community', emoji: '🤝', href: '/c/community' },
  { name: 'Business', emoji: '💼', href: '/c/business' },
  { name: 'Faith', emoji: '🙏', href: '/c/faith' },
];

const stats = [
  { value: '$50M+', label: 'raised weekly', icon: DollarSign },
  { value: '2.5', label: 'donations per second', icon: TrendingUp },
  { value: '8K+', label: 'fundraisers started daily', icon: Users },
];

const steps = [
  {
    number: '1',
    title: 'Start your GoFundMe',
    description: 'Share your story with our AI coach or create step-by-step. It only takes a few minutes.',
  },
  {
    number: '2',
    title: 'Share with friends',
    description: 'Share your fundraiser on social media and with your network. Each share generates ~$13-15 in donations.',
  },
  {
    number: '3',
    title: 'Receive donations',
    description: 'Donations go directly to you. Withdraw funds at any time to your bank account.',
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[var(--gfm-light-green)] py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[var(--gfm-dark)] md:text-6xl leading-[1.1]">
            Successful fundraisers
            <br />
            start here
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--gfm-secondary)] md:text-xl">
            190+ million people helping each other. Join the world&apos;s largest fundraising community.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/create">
              <Button variant="primary" size="lg">
                Start a GoFundMe
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="outline" size="lg">
                <Search className="mr-2 h-4 w-4" />
                Find a fundraiser
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold text-[var(--gfm-dark)]">
            Browse by category
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="flex flex-col items-center gap-2 rounded-xl border border-[var(--gfm-border)] bg-white p-4 transition-all duration-200 hover:shadow-md hover:border-[var(--gfm-green)]/30 hover:-translate-y-0.5"
              >
                <span className="text-3xl">{cat.emoji}</span>
                <span className="text-sm font-medium text-[var(--gfm-dark)]">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-[var(--gfm-dark)] py-12 text-white">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--gfm-green)]/15">
                  <stat.icon className="h-7 w-7 text-[var(--gfm-green)]" />
                </div>
                <span className="text-3xl font-bold">{stat.value}</span>
                <span className="mt-1 text-sm text-gray-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Fundraisers */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[var(--gfm-dark)]">Trending fundraisers</h2>
            <Link href="/search" className="flex items-center text-sm font-semibold text-[var(--gfm-green)] hover:underline">
              See all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockFundraisers.map((fundraiser) => (
              <Link
                key={fundraiser.id}
                href={`/f/${fundraiser.slug}`}
                className="group overflow-hidden rounded-xl border border-[var(--gfm-border)] bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="aspect-video overflow-hidden bg-gray-100">
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-orange-400 to-red-500 p-4 text-center text-sm font-medium text-white transition-transform duration-300 group-hover:scale-105">
                    {fundraiser.title}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[var(--gfm-dark)] group-hover:text-[var(--gfm-green)] transition-colors line-clamp-2">
                    {fundraiser.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-2">
                    <Avatar name={fundraiser.organizer.displayName} size="xs" />
                    <span className="text-sm text-[var(--gfm-secondary)]">
                      by{' '}
                      <Link
                        href={`/u/${fundraiser.organizer.username}`}
                        className="hover:text-[var(--gfm-green)] hover:underline"
                      >
                        {fundraiser.organizer.displayName}
                      </Link>
                    </span>
                  </div>
                  <div className="mt-3">
                    <ProgressBar
                      percentage={formatPercentage(fundraiser.raisedAmount, fundraiser.goalAmount)}
                      height="sm"
                    />
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="font-semibold text-[var(--gfm-dark)]">
                        {formatCurrency(fundraiser.raisedAmount)} raised
                      </span>
                      <span className="text-sm text-[var(--gfm-secondary)]">
                        of {formatCompactCurrency(fundraiser.goalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[var(--gfm-bg)] py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-12 text-center text-2xl font-bold text-[var(--gfm-dark)]">
            How GoFundMe works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--gfm-green)] text-xl font-bold text-white shadow-lg shadow-[var(--gfm-green)]/25">
                  {step.number}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[var(--gfm-dark)]">{step.title}</h3>
                <p className="text-sm text-[var(--gfm-secondary)] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/create">
              <Button variant="primary" size="lg">
                Get started in just a few minutes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--gfm-light-green)]">
            <Shield className="h-8 w-8 text-[var(--gfm-green)]" />
          </div>
          <h2 className="mb-4 text-2xl font-bold text-[var(--gfm-dark)]">
            GoFundMe Giving Guarantee
          </h2>
          <p className="mx-auto max-w-2xl text-[var(--gfm-secondary)] leading-relaxed">
            GoFundMe has the first and only donor protection guarantee in the industry.
            If funds aren&apos;t delivered to the right person, we&apos;ll refund your donation.
          </p>
          <Link
            href="#"
            className="mt-4 inline-block text-sm font-semibold text-[var(--gfm-green)] hover:underline"
          >
            Learn more about our guarantee
          </Link>
        </div>
      </section>

      {/* AI Giving Agent CTA - Our Novel Feature */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-[var(--gfm-green)] via-[#028a4a] to-[var(--gfm-dark-green)] py-20 text-white">
          {/* Decorative background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 text-center">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 px-4 py-1.5 text-sm font-semibold">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              New Feature
            </span>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">AI Giving Agent</h2>
            <p className="mx-auto mb-8 mt-4 max-w-2xl text-lg text-white/85 leading-relaxed">
              Set a monthly giving pledge and let our AI match your donations to causes you care about.
              Get impact reports showing exactly how your generosity made a difference.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/giving-agent">
                <button className="rounded-full bg-white px-8 py-3.5 font-semibold text-[var(--gfm-green)] transition-all duration-200 hover:bg-white/90 hover:shadow-lg hover:shadow-white/20 hover:-translate-y-0.5">
                  Set up your Giving Pledge
                </button>
              </Link>
              <Link href="/giving-agent" className="text-sm font-semibold text-white/80 underline underline-offset-4 hover:text-white transition-colors">
                Learn how it works
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
