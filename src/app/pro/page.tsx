'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Send,
  X,
  MessageCircle,
  CreditCard,
  Link2,
  Globe,
  LayoutDashboard,
  FileText,
  Shield,
  Brain,
  BarChart3,
  Share2,
  ChevronRight,
  Sparkles,
  Calendar,
  ArrowRight,
  TrendingUp,
  Users,
  DollarSign,
  Zap,
  RefreshCw,
} from 'lucide-react';

/* ─── Feature cards data ─── */
const features = [
  {
    icon: CreditCard,
    title: 'GoFundMe Pay',
    description:
      'Increase the ROI of every campaign with the most innovative nonprofit payment solution.',
  },
  {
    icon: Link2,
    title: 'Integrations Hub',
    description:
      'Connect the tools you use and love with best-in-class integrations.',
  },
  {
    icon: Globe,
    title: 'International Fundraising',
    description:
      'Engage supporters across the globe with multi-currency support.',
  },
  {
    icon: LayoutDashboard,
    title: 'Donor Dashboard',
    description:
      'Empower supporters and scale retention with our centralized, self-serve hub.',
  },
  {
    icon: FileText,
    title: 'Campaign Templates',
    description: 'Quickly create high converting donation pages.',
  },
  {
    icon: Shield,
    title: 'Security & Scalability',
    description:
      'Fundraise with confidence on a platform with world-class security and scalability.',
  },
  {
    icon: Brain,
    title: 'GoFundMe Intelligence',
    description:
      'Predict donor behavior and effortlessly optimize your campaigns to reach your goals.',
    highlight: true,
  },
  {
    icon: BarChart3,
    title: 'Reporting',
    description:
      'Gain instant supporter insights and a full view of marketing and fundraising performance.',
  },
  {
    icon: Share2,
    title: 'Meta Social Sharing',
    description:
      'Make it easy for donors to find, share, and support causes on their preferred channels.',
    isNew: true,
  },
];

/* ─── Revenue impact cards ─── */
const revenueFeatures = [
  {
    icon: CreditCard,
    title: 'Digital Wallets',
    stat: '64%',
    description: 'larger gifts on average',
    detail: 'Apple Pay, Google Pay, and PayPal drive significantly higher donation amounts.',
  },
  {
    icon: Brain,
    title: 'Intelligent Ask',
    stat: '7%',
    description: 'revenue lift',
    detail: 'ML-powered personalized ask amounts optimize every donation opportunity.',
  },
  {
    icon: RefreshCw,
    title: 'Recurring Nudge',
    stat: '3.2x',
    description: 'predicted conversion improvement',
    detail: 'Smart prompts convert one-time donors into recurring supporters.',
  },
  {
    icon: Zap,
    title: 'Auto Card Updater',
    stat: '15%',
    description: 'reduced churn',
    detail: 'Automatically update expired cards to prevent involuntary donor churn.',
  },
];

/* ─── Intelligence stats ─── */
const intelligenceStats = [
  { value: '6M+', label: 'donor sessions tested' },
  { value: '200M+', label: 'supporters in network' },
  { value: '$40B+', label: 'raised on platform' },
];

/* ─── Ray Chat Widget ─── */
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const RAY_INITIAL_MESSAGE: ChatMessage = {
  role: 'assistant',
  content:
    "Hey there! I'm Ray, an AI Sales Representative from GoFundMe Pro. What questions do you have about our platform today?",
};

function RayChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([RAY_INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

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
          context: 'pro',
        }),
      });
      const json = await res.json();
      const content =
        json.data?.content ??
        'Sorry, something went wrong. Please try again.';
      setMessages((prev) => [...prev, { role: 'assistant', content }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      {/* Chat panel */}
      <div
        className={`fixed bottom-20 right-6 z-50 w-[400px] max-h-[520px] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-200 origin-bottom-right ${
          isOpen
            ? 'scale-100 opacity-100 pointer-events-auto'
            : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 rounded-t-2xl bg-[#1a3c2e]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#02a95c] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">Ray</div>
              <div className="text-white/60 text-xs">AI Sales Representative</div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/60 hover:text-white transition-colors cursor-pointer"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 max-h-[360px]">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-3 py-2 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#1a3c2e] text-white rounded-2xl rounded-br-md'
                    : 'bg-gray-100 text-gray-800 rounded-2xl rounded-bl-md'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Request a meeting button */}
        <div className="px-4 pb-2">
          <button className="w-full py-2 text-sm font-semibold text-[#02a95c] border border-[#02a95c] rounded-full hover:bg-[#02a95c] hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            Request a meeting
          </button>
        </div>

        {/* Input */}
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, 500))}
              onKeyDown={handleKeyDown}
              placeholder="Ask about GoFundMe Pro..."
              disabled={isLoading}
              maxLength={500}
              className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#02a95c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-2 rounded-lg bg-[#1a3c2e] text-white hover:bg-[#0f2a1e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating trigger */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#1a3c2e] text-white shadow-lg hover:bg-[#0f2a1e] transition-all duration-200 flex items-center justify-center cursor-pointer group"
        aria-label="Chat with Ray"
      >
        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>
    </>
  );
}

/* ─── Pro Navbar ─── */
function ProNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = ['Solutions', 'Platform', 'Who We Serve', 'About', 'Resources'];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/pro" className="flex items-center gap-1.5 select-none">
          <span className="text-xl font-bold text-gray-900 tracking-tight">gofundme</span>
          <span className="text-xl font-light text-gray-500 tracking-wider">PRO</span>
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden lg:block text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
            Sign In
          </button>
          <button className="rounded-full border-2 border-[#02a95c] px-5 py-2 text-sm font-semibold text-[#02a95c] hover:bg-[#02a95c] hover:text-white transition-all duration-200 cursor-pointer">
            Request a Demo
          </button>
          <button
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors lg:hidden cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <button
                key={item}
                className="block w-full text-left py-2 text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                {item}
              </button>
            ))}
            <button className="block w-full text-left py-2 text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer">
              Sign In
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

/* ─── Main Page ─── */
export default function ProPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top banner */}
      <div className="bg-[#e8f5e9] text-center py-2.5 px-4">
        <p className="text-sm font-medium text-[#2e7d32]">
          Go beyond traditional P2P with community-powered fundraising
          <ChevronRight className="inline w-4 h-4 ml-1" />
        </p>
      </div>

      {/* Navbar */}
      <ProNavbar />

      {/* Hero */}
      <section className="bg-[#1a3c2e] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#02a95c]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#02a95c]/5 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 py-24 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold italic text-white leading-[1.1] tracking-tight">
            The #1 fundraising
            <br />
            platform.{' '}
            <span className="text-[#4caf50]">For nonprofits.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Unlock the full potential of your fundraising with enterprise-grade tools, AI-powered
            intelligence, and the world&apos;s largest giving network.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="rounded-full bg-white px-8 py-3.5 text-base font-semibold text-[#1a3c2e] hover:bg-gray-100 transition-colors cursor-pointer shadow-lg shadow-black/20">
              Request a demo
            </button>
            <button className="rounded-full border-2 border-white/30 px-8 py-3.5 text-base font-semibold text-white hover:bg-white/10 transition-colors cursor-pointer">
              Watch overview
            </button>
          </div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="py-12 border-b border-gray-100">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-8">
            Trusted by leading nonprofits worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-40">
            {['Red Cross', 'UNICEF', 'Habitat', 'St. Jude', 'WWF', 'Feeding America'].map(
              (org) => (
                <span key={org} className="text-lg font-bold text-gray-400 tracking-wide">
                  {org}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* Platform Features Grid */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#02a95c] uppercase tracking-wider mb-3">
              Platform
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Everything you need to fundraise smarter
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              A complete suite of tools designed to help nonprofits maximize their impact.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`relative group rounded-xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                  feature.highlight
                    ? 'border-[#02a95c]/30 bg-gradient-to-br from-[#e8f5e9]/50 to-white shadow-lg shadow-[#02a95c]/10 hover:shadow-xl hover:shadow-[#02a95c]/20'
                    : 'border-gray-200 bg-white hover:shadow-lg hover:border-gray-300'
                }`}
              >
                {feature.isNew && (
                  <span className="absolute top-4 right-4 bg-[#02a95c] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                    New
                  </span>
                )}
                {feature.highlight && (
                  <div className="absolute -inset-px rounded-xl bg-gradient-to-br from-[#02a95c]/20 to-transparent pointer-events-none" />
                )}
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                    feature.highlight
                      ? 'bg-[#02a95c] text-white'
                      : 'bg-gray-100 text-gray-600 group-hover:bg-[#e8f5e9] group-hover:text-[#02a95c]'
                  } transition-colors`}
                >
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                <div className="mt-4 flex items-center text-sm font-medium text-[#02a95c] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  Learn more <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GoFundMe Intelligence Section */}
      <section className="py-20 md:py-28 bg-[#fafbfc]">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#e8f5e9] rounded-full px-4 py-1.5 mb-4">
              <Brain className="w-4 h-4 text-[#02a95c]" />
              <span className="text-sm font-semibold text-[#2e7d32]">GoFundMe Intelligence</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              AI-Powered Intelligent Ask Amounts
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Trained on the largest giving dataset in the world, our ML model personalizes every
              donation ask to maximize revenue.
            </p>
          </div>

          {/* How it works diagram */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 mb-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-8 text-center">
              How Intelligent Ask Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              {/* Input signals */}
              <div className="space-y-3">
                <div className="rounded-lg bg-blue-50 border border-blue-100 p-3 text-center">
                  <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs font-medium text-blue-800">Visitor Data</p>
                  <p className="text-[10px] text-blue-600">Device, location, referral</p>
                </div>
                <div className="rounded-lg bg-purple-50 border border-purple-100 p-3 text-center">
                  <BarChart3 className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <p className="text-xs font-medium text-purple-800">Org Data</p>
                  <p className="text-[10px] text-purple-600">History, avg gift, sector</p>
                </div>
                <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3 text-center">
                  <DollarSign className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <p className="text-xs font-medium text-emerald-800">Platform Data</p>
                  <p className="text-[10px] text-emerald-600">$40B+ giving signals</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center">
                <div className="w-full h-px bg-gray-300 relative">
                  <ArrowRight className="w-5 h-5 text-gray-400 absolute right-0 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* ML Model */}
              <div className="rounded-xl bg-gradient-to-br from-[#1a3c2e] to-[#2e7d32] p-6 text-center text-white shadow-lg">
                <Brain className="w-8 h-8 mx-auto mb-2 text-[#4caf50]" />
                <p className="font-bold text-sm">ML Model</p>
                <p className="text-[10px] text-white/70 mt-1">Real-time inference</p>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center">
                <div className="w-full h-px bg-gray-300 relative">
                  <ArrowRight className="w-5 h-5 text-gray-400 absolute right-0 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Output */}
              <div className="rounded-xl bg-[#e8f5e9] border-2 border-[#02a95c]/30 p-6 text-center">
                <div className="text-2xl font-bold text-[#1a3c2e] mb-1">$75</div>
                <p className="text-xs font-medium text-[#2e7d32]">Personalized Ask</p>
                <p className="text-[10px] text-[#4caf50] mt-1">Optimized for conversion</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {intelligenceStats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl border border-gray-200 p-6 text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-[#1a3c2e]">{stat.value}</div>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400 italic">
              Trained on the largest giving dataset in the world
            </p>
          </div>
        </div>
      </section>

      {/* 7% Revenue Lift Highlight */}
      <section className="py-20 md:py-28 bg-[#1a3c2e] text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#02a95c]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 text-center">
          <p className="text-[#4caf50] font-semibold text-sm uppercase tracking-wider mb-4">
            Proven Results
          </p>
          <div className="text-7xl md:text-8xl font-bold text-white mb-4">7%</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">average lift in donation revenue</h2>
          <p className="text-white/60 max-w-xl mx-auto text-lg">
            GoFundMe Intelligence consistently delivers measurable revenue increases across
            campaigns of all sizes.
          </p>
        </div>
      </section>

      {/* Revenue Impact Section */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#02a95c] uppercase tracking-wider mb-3">
              Revenue Impact
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Features that increase your revenue
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Every feature is designed to maximize donations and donor retention.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {revenueFeatures.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#e8f5e9] flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-[#02a95c]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold text-[#02a95c]">{feature.stat}</span>
                      <span className="text-sm text-gray-500">{feature.description}</span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{feature.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-[#1a3c2e] via-[#2e5a3e] to-[#1a3c2e] text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#02a95c]/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-[#02a95c]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to transform your fundraising?
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of nonprofits using GoFundMe Pro to raise more, engage deeper, and grow
            faster.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="rounded-full bg-white px-8 py-3.5 text-base font-semibold text-[#1a3c2e] hover:bg-gray-100 transition-colors cursor-pointer shadow-lg">
              Request a demo
            </button>
            <button className="rounded-full border-2 border-white/30 px-8 py-3.5 text-base font-semibold text-white hover:bg-white/10 transition-colors cursor-pointer">
              Talk to sales
            </button>
          </div>
        </div>
      </section>

      {/* Pro Footer */}
      <footer className="bg-[#111] text-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight">gofundme</span>
              <span className="text-lg font-light text-gray-500 tracking-wider">PRO</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Security
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-600">
              &copy; 2010-{new Date().getFullYear()} GoFundMe. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Ray AI Chat Widget */}
      <RayChatWidget />
    </div>
  );
}
