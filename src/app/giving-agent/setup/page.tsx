'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CauseSelector } from '@/components/giving-agent/CauseSelector';
import { PledgeSummary } from '@/components/giving-agent/PledgeSummary';
import type { CauseType, GivingPledge } from '@/lib/types';

const PRESET_AMOUNTS = [1000, 2500, 5000, 10000, 20000]; // cents
const PRESET_LABELS = ['$10', '$25', '$50', '$100', '$200'];

const GEO_OPTIONS: { value: GivingPledge['geographicPreference']; label: string; description: string }[] = [
  { value: 'local', label: 'Local', description: 'My city & nearby' },
  { value: 'state', label: 'State', description: 'My state/region' },
  { value: 'country', label: 'National', description: 'Across the country' },
  { value: 'global', label: 'Global', description: 'Worldwide' },
];

const STRATEGY_OPTIONS: {
  value: GivingPledge['allocationStrategy'];
  label: string;
  description: string;
  recommended?: boolean;
}[] = [
  {
    value: 'even_split',
    label: 'Even Split',
    description: 'Equal distribution across all matching campaigns. Simple and predictable.',
  },
  {
    value: 'impact_weighted',
    label: 'Impact Weighted',
    description: 'More funding goes to campaigns close to their goal or with urgent timelines.',
  },
  {
    value: 'ai_optimized',
    label: 'AI Optimized',
    description: 'Our AI allocates based on maximum impact potential, urgency, and verification signals.',
    recommended: true,
  },
];

const TOTAL_STEPS = 3;

export default function SetupPage() {
  const [step, setStep] = useState(1);

  // Form state
  const [monthlyAmount, setMonthlyAmount] = useState(5000);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [selectedCauses, setSelectedCauses] = useState<CauseType[]>([]);
  const [geoPref, setGeoPref] = useState<GivingPledge['geographicPreference']>('country');
  const [strategy, setStrategy] = useState<GivingPledge['allocationStrategy']>('ai_optimized');
  const [isActivating, setIsActivating] = useState(false);
  const [isActivated, setIsActivated] = useState(false);

  const canProceed = () => {
    switch (step) {
      case 1: return monthlyAmount >= 1000;
      case 2: return selectedCauses.length >= 1;
      case 3: return true;
      default: return false;
    }
  };

  const goNext = () => {
    if (step < TOTAL_STEPS && canProceed()) {
      setStep(step + 1);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleActivate = () => {
    setIsActivating(true);
    setTimeout(() => {
      setIsActivating(false);
      setIsActivated(true);
    }, 1500);
  };

  const handleCustomAmount = (val: string) => {
    setCustomAmount(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed >= 10) {
      setMonthlyAmount(Math.round(parsed * 100));
    }
  };

  // Calculate first distribution date (next 1st of month)
  const now = new Date();
  const firstDistribution = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const dateStr = firstDistribution.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // --- Success Screen ---
  if (isActivated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--gfm-green)]/10">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--gfm-green)] shadow-lg shadow-[var(--gfm-green)]/30">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-[var(--gfm-dark)] mb-3">
            Your Giving Pledge is Active!
          </h1>
          <p className="text-lg text-[var(--gfm-secondary)] mb-2">
            ${(monthlyAmount / 100).toLocaleString()}/month across {selectedCauses.length} cause{selectedCauses.length > 1 ? 's' : ''}
          </p>
          <p className="text-sm text-[var(--gfm-secondary)] mb-8">
            Your first AI-matched distribution will happen on {dateStr}.
            You will receive an email summary of where your pledge was allocated.
          </p>

          <div className="space-y-3">
            <Link href="/giving-agent/dashboard">
              <Button variant="primary" size="lg" fullWidth>
                Go to Your Dashboard
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="ghost" size="md" fullWidth>
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--gfm-bg)]">
      {/* Header */}
      <div className="border-b border-[var(--gfm-border)] bg-white">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={step === 1 ? '/giving-agent' : '#'}
              onClick={(e) => {
                if (step > 1) {
                  e.preventDefault();
                  goBack();
                }
              }}
              className="flex items-center gap-1 text-sm font-medium text-[var(--gfm-secondary)] hover:text-[var(--gfm-dark)] transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back
            </Link>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-[var(--gfm-green)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              <span className="text-sm font-bold text-[var(--gfm-dark)]">Giving Agent Setup</span>
            </div>
            <span className="text-sm text-[var(--gfm-secondary)]">
              Step {step} of {TOTAL_STEPS}
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-4 flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-[var(--gfm-border)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--gfm-green)] transition-all duration-500 ease-out"
                    style={{ width: s <= step ? '100%' : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-[var(--gfm-secondary)]">
            <span className={step >= 1 ? 'text-[var(--gfm-green)] font-medium' : ''}>Amount</span>
            <span className={step >= 2 ? 'text-[var(--gfm-green)] font-medium' : ''}>Causes</span>
            <span className={step >= 3 ? 'text-[var(--gfm-green)] font-medium' : ''}>Strategy & Review</span>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">

        {/* ============================================ */}
        {/* Step 1: Pledge Amount                        */}
        {/* ============================================ */}
        {step === 1 && (
          <div>
            <div className="text-center mb-10">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--gfm-green)]/10">
                <svg className="h-7 w-7 text-[var(--gfm-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-[var(--gfm-dark)] md:text-3xl">Set your monthly budget</h1>
              <p className="mt-2 text-[var(--gfm-secondary)]">
                Choose how much you want to give each month. You can adjust this anytime.
              </p>
            </div>

            {/* Current amount display */}
            <div className="mb-8 text-center">
              <span className="text-5xl font-bold text-[var(--gfm-dark)] md:text-6xl">
                ${(monthlyAmount / 100).toLocaleString('en-US', { minimumFractionDigits: 0 })}
              </span>
              <span className="text-xl text-[var(--gfm-secondary)] font-normal">/month</span>
            </div>

            {/* Preset amounts */}
            <div className="grid grid-cols-5 gap-3 mb-4">
              {PRESET_AMOUNTS.map((amount, i) => (
                <button
                  key={amount}
                  onClick={() => { setMonthlyAmount(amount); setIsCustom(false); setCustomAmount(''); }}
                  className={`rounded-xl border-2 py-3.5 text-sm font-semibold transition-all duration-200 ${
                    monthlyAmount === amount && !isCustom
                      ? 'border-[var(--gfm-green)] bg-[var(--gfm-green)]/5 text-[var(--gfm-green)] shadow-md shadow-[var(--gfm-green)]/10'
                      : 'border-[var(--gfm-border)] bg-white text-[var(--gfm-dark)] hover:border-[var(--gfm-green)]/40'
                  }`}
                >
                  {PRESET_LABELS[i]}
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <div className="mb-6">
              <button
                onClick={() => setIsCustom(true)}
                className={`w-full rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                  isCustom
                    ? 'border-[var(--gfm-green)] bg-[var(--gfm-green)]/5 shadow-md shadow-[var(--gfm-green)]/10'
                    : 'border-[var(--gfm-border)] bg-white hover:border-[var(--gfm-green)]/40'
                }`}
              >
                <p className="text-xs font-medium text-[var(--gfm-secondary)] mb-1.5">Custom amount</p>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-bold text-[var(--gfm-dark)]">$</span>
                  <input
                    type="number"
                    min="10"
                    step="1"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={(e) => handleCustomAmount(e.target.value)}
                    onFocus={() => setIsCustom(true)}
                    className="flex-1 bg-transparent text-xl font-bold text-[var(--gfm-dark)] outline-none placeholder:text-[var(--gfm-border)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-sm text-[var(--gfm-secondary)]">/month</span>
                </div>
              </button>
            </div>

            {/* Slider */}
            <div className="mb-6">
              <input
                type="range"
                min={1000}
                max={50000}
                step={500}
                value={monthlyAmount}
                onChange={(e) => { setMonthlyAmount(Number(e.target.value)); setIsCustom(false); setCustomAmount(''); }}
                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[var(--gfm-green)]"
                style={{
                  background: `linear-gradient(to right, var(--gfm-green) ${((monthlyAmount - 1000) / (50000 - 1000)) * 100}%, var(--gfm-border) ${((monthlyAmount - 1000) / (50000 - 1000)) * 100}%)`,
                }}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-[var(--gfm-secondary)]">$10</span>
                <span className="text-xs text-[var(--gfm-secondary)]">$500</span>
              </div>
            </div>

            {/* Annual projection */}
            <div className="rounded-2xl border border-[var(--gfm-purple)]/20 bg-[var(--gfm-purple)]/5 p-5">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--gfm-purple)]/10">
                  <svg className="h-5 w-5 text-[var(--gfm-purple)]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--gfm-dark)]">
                    ${((monthlyAmount / 100) * 12).toLocaleString()} projected annual impact
                  </p>
                  <p className="text-xs text-[var(--gfm-secondary)]">
                    That could support ~{Math.max(1, Math.round((monthlyAmount / 100) * 12 / 25))} campaigns over a year
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* Step 2: Cause Selection + Geography          */}
        {/* ============================================ */}
        {step === 2 && (
          <div>
            <div className="text-center mb-10">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--gfm-green)]/10">
                <svg className="h-7 w-7 text-[var(--gfm-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-[var(--gfm-dark)] md:text-3xl">Choose your causes</h1>
              <p className="mt-2 text-[var(--gfm-secondary)]">
                Select the causes you care about. Our AI will match campaigns in these areas.
              </p>
              <p className="mt-1 text-sm text-[var(--gfm-green)] font-medium">
                {selectedCauses.length === 0 ? 'Select at least 1 cause' : `${selectedCauses.length} cause${selectedCauses.length > 1 ? 's' : ''} selected`}
              </p>
            </div>

            <CauseSelector selected={selectedCauses} onChange={setSelectedCauses} />

            {/* Geographic Preference */}
            <div className="mt-12">
              <h3 className="text-lg font-bold text-[var(--gfm-dark)] mb-2">Geographic preference</h3>
              <p className="text-sm text-[var(--gfm-secondary)] mb-4">
                Where should the AI focus when finding campaigns?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {GEO_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setGeoPref(option.value)}
                    className={`rounded-2xl border-2 p-4 text-center transition-all duration-200 ${
                      geoPref === option.value
                        ? 'border-[var(--gfm-green)] bg-[var(--gfm-green)]/5 shadow-md shadow-[var(--gfm-green)]/10'
                        : 'border-[var(--gfm-border)] bg-white hover:border-[var(--gfm-green)]/40'
                    }`}
                  >
                    <span className={`text-sm font-bold block ${
                      geoPref === option.value ? 'text-[var(--gfm-green)]' : 'text-[var(--gfm-dark)]'
                    }`}>
                      {option.label}
                    </span>
                    <span className="text-xs text-[var(--gfm-secondary)] mt-0.5 block">{option.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* Step 3: Strategy & Review                    */}
        {/* ============================================ */}
        {step === 3 && (
          <div>
            <div className="text-center mb-10">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--gfm-green)]/10">
                <svg className="h-7 w-7 text-[var(--gfm-green)]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-[var(--gfm-dark)] md:text-3xl">Choose your strategy</h1>
              <p className="mt-2 text-[var(--gfm-secondary)]">
                How should your monthly pledge be distributed across matching campaigns?
              </p>
            </div>

            {/* Strategy options */}
            <div className="space-y-3 mb-10">
              {STRATEGY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStrategy(option.value)}
                  className={`relative w-full rounded-2xl border-2 p-6 text-left transition-all duration-200 ${
                    strategy === option.value
                      ? 'border-[var(--gfm-green)] bg-[var(--gfm-green)]/5 shadow-md shadow-[var(--gfm-green)]/10'
                      : 'border-[var(--gfm-border)] bg-white hover:border-[var(--gfm-green)]/40'
                  }`}
                >
                  {option.recommended && (
                    <span className="absolute -top-3 right-4 inline-flex items-center gap-1 rounded-full bg-[var(--gfm-green)] px-3 py-1 text-xs font-bold text-white shadow-sm">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                      Recommended
                    </span>
                  )}
                  <div className="flex items-start gap-4">
                    <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      strategy === option.value ? 'border-[var(--gfm-green)]' : 'border-[var(--gfm-border)]'
                    }`}>
                      {strategy === option.value && (
                        <div className="h-2.5 w-2.5 rounded-full bg-[var(--gfm-green)]" />
                      )}
                    </div>
                    <div>
                      <p className={`text-lg font-semibold ${strategy === option.value ? 'text-[var(--gfm-green)]' : 'text-[var(--gfm-dark)]'}`}>
                        {option.label}
                      </p>
                      <p className="mt-1 text-sm text-[var(--gfm-secondary)] leading-relaxed">{option.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Review Summary */}
            <div className="border-t border-[var(--gfm-border)] pt-10">
              <h3 className="text-lg font-bold text-[var(--gfm-dark)] mb-5 flex items-center gap-2">
                <svg className="h-5 w-5 text-[var(--gfm-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Review Your Pledge
              </h3>

              <PledgeSummary
                monthlyAmount={monthlyAmount}
                selectedCauses={selectedCauses}
                geographicPreference={geoPref}
                allocationStrategy={strategy}
              />

              {/* Distribution date notice */}
              <div className="mt-6 rounded-2xl border border-[var(--gfm-green)]/20 bg-[var(--gfm-green)]/5 p-5">
                <div className="flex gap-3">
                  <svg className="h-5 w-5 shrink-0 text-[var(--gfm-green)] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-[var(--gfm-dark)]">
                      First distribution: {dateStr}
                    </p>
                    <p className="mt-1 text-sm text-[var(--gfm-secondary)]">
                      Distributions happen on the 1st of each month. You can adjust your preferences anytime.
                    </p>
                  </div>
                </div>
              </div>

              {/* Activate button */}
              <div className="mt-8">
                <button
                  onClick={handleActivate}
                  disabled={isActivating}
                  className="w-full rounded-2xl py-4 text-base font-bold text-white shadow-lg shadow-[var(--gfm-green)]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--gfm-green)]/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  style={{ background: 'linear-gradient(135deg, #02a95c 0%, #017a3e 100%)' }}
                >
                  {isActivating ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Activating...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                      Activate Giving Pledge
                    </span>
                  )}
                </button>
                <p className="mt-3 text-xs text-center text-[var(--gfm-secondary)]">
                  By activating, you agree to a monthly recurring charge. You can pause or cancel at any time.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons (steps 1 & 2 only) */}
        {step < 3 && (
          <div className="mt-10 flex justify-between">
            <Button
              variant="ghost"
              size="lg"
              onClick={goBack}
              disabled={step === 1}
              className={step === 1 ? 'invisible' : ''}
            >
              <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={goNext}
              disabled={!canProceed()}
            >
              Continue
              <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Button>
          </div>
        )}

        {/* Back button on step 3 */}
        {step === 3 && (
          <div className="mt-6">
            <Button variant="ghost" size="md" onClick={goBack}>
              <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to Causes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
