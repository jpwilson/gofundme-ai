'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles, MessageCircle, Send, X, ArrowRight, ArrowLeft,
  MapPin, Compass,
} from 'lucide-react';

/* ─── Tour Steps ─── */
const TOUR_STEPS = [
  // Welcome
  {
    title: 'Welcome',
    description: 'AI-enhanced versions of GoFundMe\'s three core pages — Fundraiser, Community, and Profile — plus AI tools that show where AI adds real value. Let\'s walk through it all.',
    path: '/',
    highlight: null,
    scrollTo: null,
  },
  // ── Core Pages (the 3 deliverables) ──
  {
    title: '1. Fundraiser Page',
    description: 'A faithful recreation with AI enhancements: a trust badge where Claude scores fundraiser legitimacy, and sentiment analysis summarizing donor messages.',
    path: '/f/la-wildfire-alerts-and-recovery',
    highlight: 'See the AI trust badge next to the title',
    scrollTo: 'tour-trust-badge',
  },
  {
    title: '2. Community Page',
    description: 'Community hub with activity feed, leaderboard, and campaigns. AI adds a collapsible digest — Claude summarizes all recent activity into a quick update.',
    path: '/communities/watch-duty',
    highlight: 'Open the AI digest',
    scrollTo: 'tour-ai-digest',
  },
  {
    title: '3. Profile Page',
    description: 'User profile with highlights and causes. AI adds a giving personality badge — Claude classifies donors as Crisis Responder, Champion Giver, Steady Supporter, or Community Builder.',
    path: '/u/janahan',
    highlight: 'See the AI personality badge',
    scrollTo: 'tour-ai-personality',
  },
  // ── AI Features ──
  {
    title: '4. AI Story Coach',
    description: 'Deep campaign analysis — click "Story insights" to see Claude analyze narrative quality, suggest headline alternatives, and score photo engagement.',
    path: '/f/la-wildfire-alerts-and-recovery',
    highlight: 'Click "Story insights" to see AI analysis',
    scrollTo: 'tour-story-coach',
  },
  {
    title: '5. AI Donor Insights',
    description: 'Claude generates a full impact narrative of the donor\'s journey, giving personality with traits, and personalized fundraiser recommendations with match scores.',
    path: '/u/janahan',
    highlight: 'Read the AI-generated narrative',
    scrollTo: 'tour-ai-narrative',
  },
  {
    title: '6. Fraud Detection',
    description: 'Trust & safety dashboard with 6 detection rules. Switch to "Flagged" and click "Review" — Claude does a live trust analysis with signals and risk factors.',
    path: '/fraud-detection',
    highlight: 'Click "Review" on a flagged campaign',
    scrollTo: null,
  },
  {
    title: '7. Giving Agent',
    description: 'Automated monthly giving — set a budget, pick causes, choose allocation strategy, and AI distributes donations across verified campaigns.',
    path: '/giving-agent',
    highlight: null,
    scrollTo: null,
  },
  // ── Internal / Analytics ──
  {
    title: '8. AI Analytics & Costs',
    description: 'Every AI call traced via LangFuse. See per-feature costs, scale projections (1K→1M users), and full development cost transparency.',
    path: '/ai/analytics',
    highlight: 'Try "Scale Projections" and "Development Costs" tabs',
    scrollTo: null,
  },
  // ── Polish ──
  {
    title: '9. Product Explorer',
    description: 'Interactive 3D graph (Three.js) showing how all 24 features connect — fundraisers, AI, infrastructure. Drag to rotate, click nodes for details.',
    path: '/explore',
    highlight: 'Click any node to see connections',
    scrollTo: null,
  },
  {
    title: '10. Documentation',
    description: 'Full docs covering features, metrics rationale, architecture, and philosophy. Plus a chat agent with guardrails and 5 eval tests. Thanks for the tour!',
    path: '/docs',
    highlight: null,
    scrollTo: null,
  },
];

const STORAGE_KEY = 'gfm-tour-completed';

/* ─── Page links for chat ─── */
const PAGE_LINKS: Record<string, { label: string; href: string }> = {
  fundraiser: { label: 'Fundraiser Page', href: '/f/la-wildfire-alerts-and-recovery' },
  'ai fundraiser': { label: 'Fundraiser Page', href: '/f/la-wildfire-alerts-and-recovery' },
  'story coach': { label: 'Fundraiser Page', href: '/f/la-wildfire-alerts-and-recovery' },
  community: { label: 'Community Page', href: '/communities/watch-duty' },
  'ai community': { label: 'Community Page', href: '/communities/watch-duty' },
  digest: { label: 'Community Page', href: '/communities/watch-duty' },
  profile: { label: 'Profile Page', href: '/u/janahan' },
  'ai profile': { label: 'Profile Page', href: '/u/janahan' },
  personality: { label: 'Profile Page', href: '/u/janahan' },
  fraud: { label: 'Fraud Detection', href: '/fraud-detection' },
  trust: { label: 'Fraud Detection', href: '/fraud-detection' },
  analytics: { label: 'AI Analytics', href: '/ai/analytics' },
  langfuse: { label: 'AI Analytics', href: '/ai/analytics' },
  cost: { label: 'AI Analytics', href: '/ai/analytics' },
  explore: { label: 'Product Explorer', href: '/explore' },
  '3d': { label: 'Product Explorer', href: '/explore' },
  graph: { label: 'Product Explorer', href: '/explore' },
  docs: { label: 'Documentation', href: '/docs' },
  giving: { label: 'Giving Agent', href: '/giving-agent' },
  sentiment: { label: 'Fundraiser Page', href: '/f/la-wildfire-alerts-and-recovery' },
};

/* ─── Extract relevant links from message ─── */
function extractLinks(userMsg: string, botMsg: string): { label: string; href: string }[] {
  const combined = (userMsg + ' ' + botMsg).toLowerCase();
  const found = new Map<string, { label: string; href: string }>();
  for (const [keyword, link] of Object.entries(PAGE_LINKS)) {
    if (combined.includes(keyword) && !found.has(link.href)) {
      found.set(link.href, link);
    }
  }
  return Array.from(found.values()).slice(0, 3);
}

/* ─── Chat Message ─── */
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  links?: { label: string; href: string }[];
}

const INITIAL_MESSAGE: ChatMessage = {
  role: 'assistant',
  content: "Hi! I'm the GoFundMe AI Guide. Ask me about any feature, architecture decision, or metric — I'll explain it and link you to the right page.",
};

/* ─── Main Component ─── */
export function DemoAssistant() {
  const router = useRouter();
  const pathname = usePathname();
  const [mode, setMode] = useState<'closed' | 'menu' | 'tour' | 'chat'>('closed');
  const [tourStep, setTourStep] = useState(0);
  const [shouldPulse, setShouldPulse] = useState(false);
  const [mounted, setMounted] = useState(false);
  const startPathRef = useRef<string | null>(null);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    if (!localStorage.getItem(STORAGE_KEY)) setShouldPulse(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (mode === 'chat') inputRef.current?.focus();
  }, [mode]);

  const markCompleted = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setShouldPulse(false);
  }, []);

  /* Scroll to element after a short delay (wait for page render) */
  const scrollToTarget = useCallback((elementId: string | null) => {
    if (!elementId) return;
    // Try a few times with increasing delays to handle page transitions
    const attempts = [300, 600, 1200];
    attempts.forEach((delay) => {
      setTimeout(() => {
        const el = document.getElementById(elementId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Brief highlight flash
          el.style.outline = '2px solid #02a95c';
          el.style.outlineOffset = '4px';
          el.style.borderRadius = '8px';
          el.style.transition = 'outline-color 1.5s ease-out';
          setTimeout(() => {
            el.style.outlineColor = 'transparent';
          }, 1500);
        }
      }, delay);
    });
  }, []);

  /* Tour navigation */
  const goToStep = (step: number) => {
    setTourStep(step);
    const target = TOUR_STEPS[step];
    if (target.path && target.path !== pathname) {
      router.push(target.path);
    }
    // Scroll to target element after page loads
    scrollToTarget(target.scrollTo);
  };

  const nextStep = () => {
    if (tourStep < TOUR_STEPS.length - 1) {
      goToStep(tourStep + 1);
    } else {
      // Tour finished — return to where we started
      finishTour();
    }
  };

  const prevStep = () => {
    if (tourStep > 0) goToStep(tourStep - 1);
  };

  const finishTour = () => {
    setMode('closed');
    markCompleted();
    if (startPathRef.current && startPathRef.current !== pathname) {
      router.push(startPathRef.current);
    }
    startPathRef.current = null;
  };

  const closeTour = () => {
    finishTour();
  };

  /* Chat send */
  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
      const json = await res.json();
      const content = json.data?.content ?? 'Sorry, something went wrong.';
      const links = extractLinks(trimmed, content);
      setMessages((prev) => [...prev, { role: 'assistant', content, links }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  if (!mounted) return null;

  const step = TOUR_STEPS[tourStep];
  const isLastStep = tourStep === TOUR_STEPS.length - 1;

  return (
    <>
      {/* ─── Floating Button ─── */}
      <button
        onClick={() => setMode(mode === 'closed' ? 'menu' : 'closed')}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gfm-green text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center ${
          shouldPulse && mode === 'closed' ? 'animate-pulse-ring' : ''
        } ${mode !== 'closed' ? 'rotate-45' : ''}`}
        aria-label="Demo assistant"
      >
        {mode !== 'closed' ? (
          <X className="w-5 h-5 -rotate-45" />
        ) : (
          <Sparkles className="w-5 h-5" />
        )}
      </button>

      {/* ─── Expandable Menu ─── */}
      {mode === 'menu' && (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-2 animate-menu-in">
          <button
            onClick={() => { startPathRef.current = pathname; setTourStep(0); setMode('tour'); goToStep(0); }}
            className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-lg border border-gfm-border hover:border-gfm-green/40 hover:shadow-xl transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-gfm-green/10 flex items-center justify-center group-hover:bg-gfm-green/20 transition-colors">
              <Compass className="w-4 h-4 text-gfm-green" />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-gfm-dark">Take a Tour</div>
              <div className="text-xs text-gfm-secondary">Guided walkthrough of all features</div>
            </div>
          </button>
          <button
            onClick={() => setMode('chat')}
            className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-lg border border-gfm-border hover:border-gfm-green/40 hover:shadow-xl transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-gfm-green/10 flex items-center justify-center group-hover:bg-gfm-green/20 transition-colors">
              <MessageCircle className="w-4 h-4 text-gfm-green" />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-gfm-dark">Ask AI Guide</div>
              <div className="text-xs text-gfm-secondary">Chat about features & architecture</div>
            </div>
          </button>
        </div>
      )}

      {/* ─── Tour Card ─── */}
      {mode === 'tour' && (
        <div className="fixed bottom-24 right-6 z-50 w-[400px] animate-panel-in">
          <div className="rounded-2xl border border-gfm-border bg-white shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-gfm-green to-emerald-500">
              <div className="flex items-center gap-2 text-white">
                <Compass className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  {tourStep + 1} of {TOUR_STEPS.length}
                </span>
              </div>
              <button onClick={closeTour} className="text-white/80 hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-gray-100">
              <div
                className="h-full bg-gfm-green transition-all duration-500"
                style={{ width: `${((tourStep + 1) / TOUR_STEPS.length) * 100}%` }}
              />
            </div>

            {/* Body */}
            <div className="px-5 py-4">
              <h3 className="text-lg font-bold text-gfm-dark">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gfm-secondary">{step.description}</p>
              {step.highlight && (
                step.scrollTo ? (
                  <button
                    onClick={() => scrollToTarget(step.scrollTo)}
                    className="mt-3 w-full flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200/50 px-3 py-2 text-left transition-colors hover:bg-amber-100 cursor-pointer"
                  >
                    <MapPin className="h-3.5 w-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-amber-800">
                      {step.highlight}
                      <ArrowRight className="h-3 w-3 inline ml-1 text-amber-600" />
                    </span>
                  </button>
                ) : (
                  <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200/50 px-3 py-2">
                    <MapPin className="h-3.5 w-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-amber-800">{step.highlight}</span>
                  </div>
                )
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gfm-border px-5 py-3">
              <button onClick={closeTour} className="text-xs font-medium text-gfm-secondary hover:text-gfm-dark transition-colors">
                End tour
              </button>
              <div className="flex items-center gap-2">
                {tourStep > 0 && (
                  <button
                    onClick={prevStep}
                    className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-gfm-dark hover:bg-gray-100 transition-colors"
                  >
                    <ArrowLeft className="h-3 w-3" /> Back
                  </button>
                )}
                <button
                  onClick={nextStep}
                  className="flex items-center gap-1 rounded-lg bg-gfm-green px-4 py-1.5 text-xs font-semibold text-white hover:bg-gfm-dark-green transition-colors"
                >
                  {isLastStep ? 'Finish' : 'Next'}
                  {!isLastStep && <ArrowRight className="h-3 w-3" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Chat Panel ─── */}
      {mode === 'chat' && (
        <div className="fixed bottom-24 right-6 z-50 w-[400px] max-h-[520px] flex flex-col bg-white rounded-2xl shadow-2xl border border-gfm-border animate-panel-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gfm-border bg-gradient-to-r from-gfm-green to-emerald-500 rounded-t-2xl">
            <div className="flex items-center gap-2 text-white text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              GoFundMe AI Guide
            </div>
            <button onClick={() => setMode('closed')} className="text-white/80 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 max-h-[380px]">
            {messages.map((msg, i) => (
              <div key={i}>
                <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gfm-green text-white rounded-2xl rounded-br-md'
                        : 'bg-gray-100 text-gfm-dark rounded-2xl rounded-bl-md'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
                {/* Page links */}
                {msg.links && msg.links.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5 ml-1">
                    {msg.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="inline-flex items-center gap-1 rounded-full border border-gfm-green/30 bg-gfm-green/5 px-2.5 py-1 text-[11px] font-medium text-gfm-green hover:bg-gfm-green hover:text-white transition-colors"
                      >
                        {link.label}
                        <ArrowRight className="h-2.5 w-2.5" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gfm-secondary/60 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-gfm-secondary/60 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-gfm-secondary/60 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gfm-border">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, 500))}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Ask about features, AI, metrics..."
                disabled={isLoading}
                maxLength={500}
                className="flex-1 text-sm px-3 py-2 rounded-lg border border-gfm-border outline-none focus:border-gfm-green transition-colors disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-2 rounded-lg bg-gfm-green text-white hover:bg-gfm-dark-green transition-colors disabled:opacity-50"
                aria-label="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Animations ─── */}
      <style jsx global>{`
        @keyframes menuIn {
          from { opacity: 0; transform: translateY(8px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-menu-in { animation: menuIn 0.2s ease-out; }

        @keyframes panelIn {
          from { opacity: 0; transform: translateY(12px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-panel-in { animation: panelIn 0.25s ease-out; }

        .animate-pulse-ring {
          animation: pulseRing 2.5s ease-in-out infinite;
        }
        @keyframes pulseRing {
          0%, 100% { box-shadow: 0 0 0 0 rgba(2, 169, 92, 0.4); }
          50% { box-shadow: 0 0 0 10px rgba(2, 169, 92, 0); }
        }
      `}</style>
    </>
  );
}
