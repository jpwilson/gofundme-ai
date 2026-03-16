'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ArrowLeft, X, ExternalLink, MapPin } from 'lucide-react';

const TOUR_STEPS = [
  {
    title: 'Welcome',
    description:
      'Welcome to the GoFundMe AI exploration. This tour highlights how AI can enhance fundraising — from story coaching to fraud detection.',
    link: null,
  },
  {
    title: 'Fundraiser Page',
    description:
      'The core fundraiser page now includes an AI trust badge and sentiment analysis on donor messages — real Claude API calls happening live.',
    link: '/f/la-wildfire-alerts-and-recovery',
  },
  {
    title: 'AI Story Coach',
    description:
      'The AI Fundraiser page analyzes campaign narratives, scores story quality, suggests headline alternatives, and provides photo performance tips.',
    link: '/ai/fundraiser',
  },
  {
    title: 'Community Intelligence',
    description:
      'AI generates weekly community digests and surfaces smart campaign discovery with urgency and momentum signals.',
    link: '/ai/community',
  },
  {
    title: 'Donor Insights',
    description:
      'AI analyzes giving patterns to generate personality profiles, impact narratives, and personalized fundraiser recommendations.',
    link: '/ai/profile',
  },
  {
    title: 'Fraud Detection',
    description:
      "A trust & safety dashboard with AI-powered trust scoring. Click 'Review' on any flagged campaign for real-time Claude analysis.",
    link: '/ai2/fraud-detection',
  },
  {
    title: 'AI Analytics',
    description:
      'Every AI call is tracked via LangFuse. See real-time costs, token usage, latency, and scale projections from 1K to 1M users.',
    link: '/ai/analytics',
  },
  {
    title: 'Product Explorer',
    description:
      'An interactive 3D graph showing how all features connect — fundraisers, communities, profiles, AI, and infrastructure.',
    link: '/explore',
  },
];

const STORAGE_KEY = 'gfm-tour-completed';

export function ProductTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [shouldPulse, setShouldPulse] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const completed = localStorage.getItem(STORAGE_KEY);
    if (!completed) {
      setShouldPulse(true);
    }
  }, []);

  const markCompleted = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setShouldPulse(false);
  }, []);

  const openTour = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  const closeTour = () => {
    setIsOpen(false);
    markCompleted();
  };

  const nextStep = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      closeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  if (!mounted) return null;

  const step = TOUR_STEPS[currentStep];
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={openTour}
        className={`fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full bg-gfm-green px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 ${
          shouldPulse ? 'animate-pulse-gentle' : ''
        }`}
      >
        <Sparkles className="h-4 w-4" />
        Take a tour
      </button>

      {/* Tour Card Overlay */}
      {isOpen && (
        <div
          className="fixed bottom-20 left-6 z-50 w-[380px] origin-bottom-left transition-all duration-300"
          style={{
            animation: 'tourCardIn 0.25s ease-out',
          }}
        >
          <div className="rounded-2xl border border-gfm-border bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gfm-border px-5 pt-4 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gfm-green" />
                <span className="text-xs font-semibold text-gfm-secondary uppercase tracking-wide">
                  {currentStep + 1} of {TOUR_STEPS.length}
                </span>
              </div>
              <button
                onClick={closeTour}
                className="rounded-lg p-1 text-gfm-secondary transition-colors hover:bg-gray-100 hover:text-gfm-dark"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4">
              <h3 className="text-lg font-bold text-gfm-dark">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gfm-secondary">
                {step.description}
              </p>

              {step.link && (
                <Link
                  href={step.link}
                  onClick={closeTour}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-gfm-green px-3.5 py-1.5 text-xs font-semibold text-gfm-green transition-colors hover:bg-gfm-green hover:text-white"
                >
                  Go there
                  <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gfm-border px-5 py-3">
              {/* Progress Dots */}
              <div className="flex items-center gap-1.5">
                {TOUR_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${
                      i <= currentStep ? 'bg-gfm-green' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={closeTour}
                  className="text-xs font-medium text-gfm-secondary transition-colors hover:text-gfm-dark"
                >
                  Skip
                </button>

                {currentStep > 0 && (
                  <button
                    onClick={prevStep}
                    className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gfm-dark transition-colors hover:bg-gray-100"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Back
                  </button>
                )}

                <button
                  onClick={nextStep}
                  className="flex items-center gap-1 rounded-lg bg-gfm-green px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-gfm-green/90"
                >
                  {isLastStep ? 'Finish' : 'Next'}
                  {!isLastStep && <ArrowRight className="h-3 w-3" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inline styles for animations */}
      <style jsx global>{`
        @keyframes tourCardIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-pulse-gentle {
          animation: pulseGentle 2.5s ease-in-out infinite;
        }

        @keyframes pulseGentle {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(2, 168, 68, 0.4);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(2, 168, 68, 0);
          }
        }
      `}</style>
    </>
  );
}
