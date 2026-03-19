'use client';

import { useState, useEffect } from 'react';
import {
  Building2,
  Target,
  Eye,
  Layers,
  BarChart3,
  Rocket,
  Plug,
  Sparkles,
  Loader2,
  CheckCircle2,
  Globe,
  Users,
  Heart,
  DollarSign,
  Calendar,
  ArrowRight,
  Edit3,
  Send,
  Database,
  Mail,
  Calculator,
  MapPin,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Program {
  name: string;
  description: string;
  impactMetric: string;
}

interface Campaign {
  title: string;
  goalAmountCents: number;
  category: string;
  description: string;
}

interface Integration {
  name: string;
  reason: string;
  icon: string;
}

interface ProfileData {
  organization: {
    name: string;
    tagline: string;
    location: string;
    yearFounded: number;
    type: string;
  };
  mission: string;
  vision: string;
  programs: Program[];
  impactStats: {
    peopleServed: string;
    foodDistributed: string;
    yearsActive: string;
    volunteers: string;
  };
  suggestedCampaigns: Campaign[];
  recommendedIntegrations: Integration[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EXAMPLE_FOOD_BANK =
  'The Community Food Bank has been serving families in the greater metro area since 2008. Our mission is to eliminate hunger by providing nutritious food and resources to those in need. Last year we distributed over 2 million pounds of food to 15,000 families. Our programs include: Weekly food distribution at 12 locations, Mobile pantry serving rural communities, Childhood hunger prevention through school partnerships, Nutrition education and cooking classes. We partner with 200+ local businesses and 500 regular volunteers. Our goal is to increase our reach by 30% in the coming year.';

const EXAMPLE_RED_CROSS =
  'The American Red Cross prevents and alleviates human suffering in the face of emergencies by mobilizing the power of volunteers and the generosity of donors. Founded in 1881, we provide disaster relief across the country, supply about 40% of the nation\'s blood, teach lifesaving skills, provide international humanitarian aid, and support military members and their families. Last year we responded to over 60,000 disasters, trained 4.6 million people in first aid and CPR, and collected 6.8 million blood donations. With 300+ chapters nationwide and 300,000 volunteers, we are one of the nation\'s premier humanitarian organizations.';

const EXAMPLE_HABITAT =
  'Habitat for Humanity is a global nonprofit housing organization working in local communities across all 50 states and in approximately 70 countries. Our vision is a world where everyone has a decent place to live. Since 1976, Habitat has helped more than 46 million people build or improve the place they call home. We bring people together to build homes, communities, and hope. Our programs include new home construction, home repairs and renovations, neighborhood revitalization, and disaster response. We operate over 1,100 local affiliates and ReStore locations that sell donated home goods to fund our mission. Over 4 million volunteers have built alongside future homeowners.';

const PROGRESS_STEPS = [
  'Analyzing content...',
  'Extracting mission & values...',
  'Identifying programs...',
  'Building profile...',
  'Generating campaigns...',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDollars(cents: number): string {
  return (cents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function getIntegrationIcon(icon: string) {
  switch (icon) {
    case 'database':
      return <Database className="w-5 h-5" />;
    case 'mail':
      return <Mail className="w-5 h-5" />;
    case 'calculator':
      return <Calculator className="w-5 h-5" />;
    case 'users':
      return <Users className="w-5 h-5" />;
    case 'globe':
      return <Globe className="w-5 h-5" />;
    case 'heart':
      return <Heart className="w-5 h-5" />;
    default:
      return <Plug className="w-5 h-5" />;
  }
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ProWordmark() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-white text-lg font-bold tracking-tight">gofundme</span>
      <span className="text-emerald-300 text-lg font-light tracking-widest uppercase">Pro</span>
    </div>
  );
}

function ProgressAnimation({ currentStep }: { currentStep: number }) {
  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center justify-center mb-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
          <Sparkles className="w-8 h-8 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
      <div className="space-y-3">
        {PROGRESS_STEPS.map((step, i) => {
          const isComplete = i < currentStep;
          const isActive = i === currentStep;
          return (
            <div
              key={step}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-500 ${
                isComplete
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : isActive
                    ? 'bg-white/5 text-white'
                    : 'text-white/30'
              }`}
            >
              {isComplete ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : isActive ? (
                <Loader2 className="w-5 h-5 animate-spin shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border border-white/20 shrink-0" />
              )}
              <span className={`text-sm ${isActive ? 'font-medium' : ''}`}>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 text-center hover:shadow-md transition-shadow">
      <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-3 text-emerald-600">
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col">
      <span className="inline-block self-start px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full mb-3">
        {campaign.category}
      </span>
      <h4 className="text-lg font-bold text-gray-900 mb-2">{campaign.title}</h4>
      <p className="text-sm text-gray-600 mb-4 flex-1">{campaign.description}</p>
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div>
          <span className="text-lg font-bold text-emerald-600">
            {formatDollars(campaign.goalAmountCents)}
          </span>
          <span className="text-sm text-gray-500 ml-1">goal</span>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-full hover:bg-emerald-700 transition-colors cursor-pointer"
        >
          Launch This
          <Rocket className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function IntegrationCard({ integration }: { integration: Integration }) {
  return (
    <div className="flex items-start gap-4 bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 text-gray-600">
        {getIntegrationIcon(integration.icon)}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 mb-1">{integration.name}</h4>
        <p className="text-sm text-gray-500">{integration.reason}</p>
      </div>
      <button
        type="button"
        className="px-3 py-1.5 text-sm font-medium text-emerald-600 border border-emerald-200 rounded-full hover:bg-emerald-50 transition-colors cursor-pointer shrink-0"
      >
        Connect
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Profile Preview (Phase 2)
// ---------------------------------------------------------------------------

function ProfilePreview({ profile }: { profile: ProfileData }) {
  const { organization, mission, vision, programs, impactStats, suggestedCampaigns, recommendedIntegrations } =
    profile;

  return (
    <div className="animate-[fadeInUp_0.6s_ease-out]">
      {/* Organization Header */}
      <div className="bg-[#1a3c34] rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/20">
            <Building2 className="w-8 h-8 text-emerald-300" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs font-medium rounded-full">
                {organization.type}
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-1">{organization.name}</h2>
            <p className="text-emerald-200 text-lg mb-3">{organization.tagline}</p>
            <div className="flex items-center gap-4 text-sm text-white/60">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {organization.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Founded {organization.yearFounded}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-gray-900">Mission</h3>
          </div>
          <p className="text-gray-600 leading-relaxed">{mission}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-gray-900">Vision</h3>
          </div>
          <p className="text-gray-600 leading-relaxed">{vision}</p>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-bold text-gray-900">Impact at a Glance</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="People Served"
            value={impactStats.peopleServed}
            icon={<Users className="w-5 h-5" />}
          />
          <StatCard
            label="Primary Impact"
            value={impactStats.foodDistributed}
            icon={<Heart className="w-5 h-5" />}
          />
          <StatCard
            label="Years Active"
            value={impactStats.yearsActive}
            icon={<Calendar className="w-5 h-5" />}
          />
          <StatCard
            label="Volunteers"
            value={impactStats.volunteers}
            icon={<Users className="w-5 h-5" />}
          />
        </div>
      </div>

      {/* Key Programs */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-bold text-gray-900">Key Programs</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {programs.map((program) => (
            <div
              key={program.name}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <h4 className="font-semibold text-gray-900 mb-2">{program.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{program.description}</p>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">{program.impactMetric}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Campaigns */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Rocket className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-bold text-gray-900">Suggested First Campaigns</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {suggestedCampaigns.map((campaign) => (
            <CampaignCard key={campaign.title} campaign={campaign} />
          ))}
        </div>
      </div>

      {/* Recommended Integrations */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Plug className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-bold text-gray-900">Recommended Integrations</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {recommendedIntegrations.map((integration) => (
            <IntegrationCard key={integration.name} integration={integration} />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 pt-4 pb-8">
        <button
          type="button"
          className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-700 font-semibold rounded-full border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <Edit3 className="w-4 h-4" />
          Edit Profile
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-700 transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
          Publish Profile
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function NPOOnboardPage() {
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [phase, setPhase] = useState<'input' | 'loading' | 'preview'>('input');
  const [progressStep, setProgressStep] = useState(0);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [error, setError] = useState('');

  // Animate progress steps during loading
  useEffect(() => {
    if (phase !== 'loading') return;
    if (progressStep >= PROGRESS_STEPS.length) return;

    const timer = setTimeout(() => {
      setProgressStep((s) => s + 1);
    }, 600);

    return () => clearTimeout(timer);
  }, [phase, progressStep]);

  const handleSubmit = async () => {
    if (!content.trim() && !url.trim()) {
      setError('Please paste some content or enter a URL.');
      return;
    }

    setError('');
    setPhase('loading');
    setProgressStep(0);

    try {
      const res = await fetch('/api/ai/npo-onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim(), url: url.trim() }),
      });

      const json = await res.json();

      if (json.error) {
        throw new Error(json.error);
      }

      // Ensure minimum loading time for the animation to complete
      const minDelay = new Promise((resolve) => setTimeout(resolve, 3000));
      await minDelay;

      setProfile(json.data);
      setPhase('preview');
    } catch (err) {
      console.error('Onboarding error:', err);
      setError('Something went wrong. Please try again.');
      setPhase('input');
    }
  };

  const handleExample = (text: string) => {
    setContent(text);
    setUrl('');
    setError('');
  };

  const handleStartOver = () => {
    setPhase('input');
    setContent('');
    setUrl('');
    setProfile(null);
    setError('');
    setProgressStep(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1a3c34] border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
          <ProWordmark />
          {phase === 'preview' ? (
            <div className="mt-5">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Your profile is ready
              </h1>
              <p className="text-emerald-200 text-lg">
                Review your AI-generated profile below, then publish when you are ready.
              </p>
              <button
                onClick={handleStartOver}
                className="mt-4 text-sm text-emerald-300 hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
              >
                Start over with different content
              </button>
            </div>
          ) : (
            <div className="mt-5">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Set up your nonprofit in seconds
              </h1>
              <p className="text-emerald-200 text-lg max-w-2xl">
                Paste your about page, annual report, or mission statement — our AI does the rest.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Phase 1: Input */}
        {phase === 'input' && (
          <div className="animate-[fadeInUp_0.4s_ease-out]">
            {/* Main input card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 mb-6">
              {/* Textarea */}
              <label
                htmlFor="npo-content"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Organization content
              </label>
              <textarea
                id="npo-content"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setError('');
                }}
                placeholder="Paste your organization's about page, mission statement, annual report text, or any description..."
                rows={8}
                className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all resize-y text-sm leading-relaxed"
              />

              {/* Divider */}
              <div className="flex items-center gap-4 my-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  or
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* URL input */}
              <label htmlFor="npo-url" className="block text-sm font-semibold text-gray-900 mb-2">
                Website URL
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="npo-url"
                  type="url"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setError('');
                  }}
                  placeholder="https://www.yournonprofit.org"
                  className="w-full h-12 pl-10 pr-4 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all text-sm"
                />
              </div>

              {/* Error */}
              {error && (
                <p className="mt-3 text-sm text-red-600 font-medium">{error}</p>
              )}
            </div>

            {/* Example buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="text-sm text-gray-500 self-center mr-1">Try:</span>
              <button
                type="button"
                onClick={() => handleExample(EXAMPLE_RED_CROSS)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-emerald-400 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                American Red Cross
              </button>
              <button
                type="button"
                onClick={() => handleExample(EXAMPLE_HABITAT)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-emerald-400 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                Habitat for Humanity
              </button>
              <button
                type="button"
                onClick={() => handleExample(EXAMPLE_FOOD_BANK)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-emerald-400 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                Local Food Bank
              </button>
            </div>

            {/* Submit button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!content.trim() && !url.trim()}
                className="inline-flex items-center gap-2.5 px-10 py-4 bg-emerald-600 text-white text-lg font-semibold rounded-full hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-lg shadow-emerald-600/20"
              >
                <Sparkles className="w-5 h-5" />
                Build My Profile
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Phase: Loading */}
        {phase === 'loading' && (
          <div className="bg-[#0d1f1b] rounded-2xl p-10 sm:p-14 text-center">
            <ProgressAnimation currentStep={progressStep} />
          </div>
        )}

        {/* Phase 2: Preview */}
        {phase === 'preview' && profile && <ProfilePreview profile={profile} />}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
