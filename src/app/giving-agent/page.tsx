'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const features = [
  {
    step: '01',
    title: 'Set Your Pledge',
    description: 'Choose a monthly giving budget, pick the causes you care about most, and set your geographic preferences. You are in control.',
    details: ['Monthly budget you are comfortable with', 'Choose from 10+ cause categories', 'Local, regional, national, or global reach'],
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: 'from-emerald-400 to-emerald-600',
  },
  {
    step: '02',
    title: 'AI Matches Campaigns',
    description: 'Our AI proactively discovers high-impact campaigns that align with your values and distributes your pledge smartly across them.',
    details: ['Proactive campaign discovery', 'Smart allocation strategies', 'Verified campaigns only'],
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    gradient: 'from-blue-400 to-indigo-600',
  },
  {
    step: '03',
    title: 'Track Your Impact',
    description: 'Get detailed monthly reports, see the stories behind your donations, and share beautiful impact cards with your network.',
    details: ['Monthly impact reports', 'Campaign success stories', 'Shareable impact cards'],
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    gradient: 'from-purple-400 to-pink-600',
  },
];

const howItWorks = [
  {
    number: 1,
    title: 'Set your monthly budget',
    description: 'Choose how much you want to give each month, starting from as little as $10.',
  },
  {
    number: 2,
    title: 'Pick your causes',
    description: 'Select the causes closest to your heart - medical, education, environment, and more.',
  },
  {
    number: 3,
    title: 'AI finds the best matches',
    description: 'Our AI scans thousands of verified campaigns and distributes your pledge for maximum impact.',
  },
  {
    number: 4,
    title: 'Review your impact',
    description: 'Get monthly reports showing exactly where your money went and the lives you helped change.',
  },
];

const faqs = [
  {
    question: 'How does the AI decide where my money goes?',
    answer: 'Our AI analyzes verified campaigns based on your selected causes, geographic preferences, and allocation strategy. It considers factors like campaign urgency, verification status, how close a campaign is to its goal, and organizer track record to maximize the impact of every dollar.',
  },
  {
    question: 'Can I change my preferences after setting up?',
    answer: 'Absolutely. You can adjust your monthly amount, causes, geographic focus, and allocation strategy at any time from your Giving Agent dashboard. Changes take effect in the next distribution cycle.',
  },
  {
    question: 'When does my monthly distribution happen?',
    answer: 'Distributions happen on the 1st of each month. After setup, your first distribution will occur on the next 1st. You will receive an email summary of where your pledge was distributed.',
  },
  {
    question: 'Is there a minimum pledge amount?',
    answer: 'The minimum monthly pledge is $10. There is no maximum. You can start small and increase your pledge at any time as you see the impact of your giving.',
  },
  {
    question: 'Can I pause or cancel my pledge?',
    answer: 'Yes, you can pause or cancel your giving pledge at any time from your dashboard. When paused, no distributions will be made until you reactivate. There are no cancellation fees.',
  },
  {
    question: 'Do I get tax receipts?',
    answer: 'Yes. You receive detailed tax-deductible receipts for all eligible donations. Your annual giving summary is available in your dashboard for easy tax filing.',
  },
];

export default function GivingAgentPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="py-24 md:py-32"
          style={{
            background: 'linear-gradient(145deg, #02a95c 0%, #028a4a 40%, #017a3e 70%, #015e30 100%)',
          }}
        >
          {/* Decorative blobs */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute top-1/4 right-0 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-white/8 blur-3xl" />
            {/* Dot grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />
          </div>

          <div className="relative mx-auto max-w-5xl px-4 text-center text-white">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-5 py-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              <span className="text-sm font-semibold">Powered by AI</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl leading-[1.08]">
              Let AI Help You
              <br />
              <span className="bg-gradient-to-r from-white via-green-100 to-white bg-clip-text text-transparent">
                Give Smarter
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 leading-relaxed md:text-xl">
              Set a monthly giving pledge and our AI will discover the highest-impact
              campaigns that match your values. Track every dollar and see the difference you make.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/giving-agent/setup">
                <button className="group relative rounded-full bg-white px-8 py-2.5 text-base font-bold text-[var(--gfm-dark-green)] shadow-xl shadow-black/15 transition-all duration-300 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-0.5">
                  <span className="flex items-center gap-2">
                    Get Started
                    <svg className="h-5 w-5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </button>
              </Link>
              <a href="#how-it-works" className="text-sm font-semibold text-white/70 underline underline-offset-4 decoration-white/30 hover:text-white hover:decoration-white/60 transition-all">
                See how it works
              </a>
            </div>

            {/* Stats row */}
            <div className="mt-16 grid grid-cols-3 gap-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 md:p-8">
              <div>
                <p className="text-3xl font-bold md:text-4xl">$2.4M</p>
                <p className="mt-1 text-sm text-white/60">distributed by agents</p>
              </div>
              <div>
                <p className="text-3xl font-bold md:text-4xl">12K+</p>
                <p className="mt-1 text-sm text-white/60">active pledges</p>
              </div>
              <div>
                <p className="text-3xl font-bold md:text-4xl">94%</p>
                <p className="mt-1 text-sm text-white/60">satisfaction rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[var(--gfm-dark)] md:text-4xl">
              Giving, reimagined
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[var(--gfm-secondary)] text-lg">
              Three simple steps to transform how you give back to the world.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.step}
                className="group relative overflow-hidden rounded-3xl border border-[var(--gfm-border)] bg-white p-8 transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1"
              >
                {/* Gradient accent at top */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient}`} />

                <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}>
                  {feature.icon}
                </div>

                <div className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--gfm-secondary)]">
                  Step {feature.step}
                </div>

                <h3 className="mb-3 text-xl font-bold text-[var(--gfm-dark)]">
                  {feature.title}
                </h3>

                <p className="mb-5 text-sm text-[var(--gfm-secondary)] leading-relaxed">
                  {feature.description}
                </p>

                <ul className="space-y-2">
                  {feature.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-2 text-sm text-[var(--gfm-dark)]">
                      <svg className="h-4 w-4 shrink-0 text-[var(--gfm-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-[var(--gfm-bg)] py-20 md:py-28 scroll-mt-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[var(--gfm-dark)] md:text-4xl">
              How it works
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[var(--gfm-secondary)] text-lg">
              Set up in under 2 minutes. Your AI agent handles the rest.
            </p>
          </div>

          <div className="space-y-0">
            {howItWorks.map((step, i) => (
              <div key={step.number} className="relative flex gap-6 pb-12 last:pb-0">
                {/* Vertical line */}
                {i < howItWorks.length - 1 && (
                  <div className="absolute left-[23px] top-12 bottom-0 w-[2px] bg-[var(--gfm-green)]/20" />
                )}
                {/* Number circle */}
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--gfm-green)] text-lg font-bold text-white shadow-lg shadow-[var(--gfm-green)]/25">
                  {step.number}
                </div>
                <div className="pt-1.5">
                  <h3 className="text-lg font-bold text-[var(--gfm-dark)]">{step.title}</h3>
                  <p className="mt-1 text-[var(--gfm-secondary)] leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link href="/giving-agent/setup">
              <Button variant="primary" size="lg">
                Start Your Giving Pledge
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--gfm-dark)] md:text-4xl">
              What givers are saying
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                quote: 'I used to feel overwhelmed by all the campaigns. Now I set my pledge and trust the AI to find the most impactful ones. Best decision I made.',
                name: 'Sarah K.',
                role: '$100/mo pledge',
                initial: 'S',
              },
              {
                quote: 'The monthly reports are incredible. I can see exactly where my money went and read the stories from people I helped. It makes giving so much more personal.',
                name: 'Marcus T.',
                role: '$50/mo pledge',
                initial: 'M',
              },
              {
                quote: 'Love the Impact Score. Seeing myself in the Top 5% of givers motivates me to keep going. The gamification is tasteful and meaningful.',
                name: 'Priya N.',
                role: '$250/mo pledge',
                initial: 'P',
              },
            ].map((testimonial, i) => (
              <div key={i} className="rounded-2xl border border-[var(--gfm-border)] bg-white p-6">
                <div className="mb-4 flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-[var(--gfm-dark)] leading-relaxed mb-5">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--gfm-green)] text-sm font-bold text-white">
                    {testimonial.initial}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--gfm-dark)]">{testimonial.name}</p>
                    <p className="text-xs text-[var(--gfm-secondary)]">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[var(--gfm-bg)] py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--gfm-dark)] md:text-4xl">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-[var(--gfm-border)] bg-white transition-shadow hover:shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >
                  <span className="pr-4 text-base font-semibold text-[var(--gfm-dark)]">
                    {faq.question}
                  </span>
                  <svg
                    className={`h-5 w-5 shrink-0 text-[var(--gfm-secondary)] transition-transform duration-300 ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === i ? 'max-h-48 pb-5' : 'max-h-0'
                  }`}
                >
                  <p className="px-6 text-sm text-[var(--gfm-secondary)] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="rounded-3xl p-12 text-white" style={{ background: 'linear-gradient(145deg, #02a95c 0%, #017a3e 50%, #015e30 100%)' }}>
            <h2 className="text-3xl font-bold md:text-4xl">Ready to give smarter?</h2>
            <p className="mx-auto mt-4 max-w-lg text-white/80 text-lg">
              Join thousands of givers who are using AI to maximize their impact. Setup takes less than 2 minutes.
            </p>
            <div className="mt-8">
              <Link href="/giving-agent/setup">
                <button className="rounded-full bg-white px-8 py-4 text-base font-bold text-[var(--gfm-dark-green)] shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5">
                  Set Up Your Giving Pledge
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
