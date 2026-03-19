'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { ProgressCircle } from '@/components/ui/ProgressCircle';
import {
  CheckCircle,
  Circle,
  XCircle,
  Lightbulb,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  MapPin,
  DollarSign,
  Target,
  Wand2,
  Share2,
  Twitter,
  Facebook,
  Instagram,
  Smartphone,
  Clock,
  TrendingUp,
  Users,
  Calendar,
  Rocket,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Constants & Types
// ---------------------------------------------------------------------------

const TOTAL_STEPS = 4;
const STEP_LABELS = ['Details', 'Story Builder', 'AI Enhance', 'Share Strategy'] as const;

const CATEGORIES = [
  { id: 'medical', label: 'Medical', emoji: '\u{1F3E5}' },
  { id: 'emergency', label: 'Emergency', emoji: '\u{1F6A8}' },
  { id: 'education', label: 'Education', emoji: '\u{1F393}' },
  { id: 'animals', label: 'Animals', emoji: '\u{1F43E}' },
  { id: 'environment', label: 'Environment', emoji: '\u{1F33F}' },
  { id: 'community', label: 'Community', emoji: '\u{1F91D}' },
  { id: 'business', label: 'Business', emoji: '\u{1F4BC}' },
  { id: 'faith', label: 'Faith', emoji: '\u{1F54A}\u{FE0F}' },
] as const;

const SUBCATEGORIES: Record<string, string[]> = {
  medical: ['Cancer', 'Injury', 'Surgery', 'Mental Health', 'Chronic Illness', 'Disability', 'Other'],
  emergency: ['Wildfire', 'Flood', 'Accident', 'Hurricane', 'Earthquake', 'House Fire', 'Other'],
  education: ['Tuition', 'Study Abroad', 'Supplies', 'Scholarship', 'Special Needs', 'Other'],
  animals: ['Rescue', 'Veterinary Care', 'Shelter', 'Wildlife', 'Service Animal', 'Other'],
  environment: ['Conservation', 'Clean Energy', 'Cleanup', 'Reforestation', 'Sustainability', 'Other'],
  community: ['Neighborhood', 'Youth Programs', 'Homeless Support', 'Food Bank', 'Infrastructure', 'Other'],
  business: ['Startup', 'Small Business', 'Social Enterprise', 'Creative Project', 'Other'],
  faith: ['Church', 'Mission Trip', 'Ministry', 'Religious School', 'Outreach', 'Other'],
};

const SUGGESTED_AMOUNTS = [5000, 10000, 25000, 50000, 100000]; // in cents

interface CampaignData {
  category: string;
  subcategory: string;
  location: string;
  goalCents: number;
  story: string;
  enhancedStory: string;
  selectedTitle: string;
}

interface ScoreData {
  score: number;
  included: string[];
  missing: string[];
  antiPatterns: string[];
  nicheTips: string[];
  suggestedTitles: string[];
  goalBenchmark: { median: number; top25: number; category: string };
}

const INITIAL_DATA: CampaignData = {
  category: '',
  subcategory: '',
  location: '',
  goalCents: 0,
  story: '',
  enhancedStory: '',
  selectedTitle: '',
};

// Human-readable labels for checklist items
const INCLUDED_LABELS: Record<string, string> = {
  specific_amounts: 'Specific dollar amounts needed',
  personal_connection: 'Personal connection to cause',
  timeline: 'Timeline or urgency',
  fund_breakdown: 'How funds will be used',
  gratitude: 'Gratitude / emotional appeal',
  updates_commitment: 'Commitment to post updates',
};

const ANTI_PATTERN_LABELS: Record<string, string> = {
  too_short: 'Story is too short',
  too_vague: 'Too vague or generic',
  wall_of_text: 'Wall of text (needs paragraphs)',
  no_specific_ask: 'No specific ask amount',
  guilt_tripping: 'Guilt-tripping language detected',
  missing_location: 'Missing location context',
};

// Template sentences for tips
const TIP_TEMPLATES: Record<string, string> = {
  'Include diagnosis details and treatment plan':
    'I was diagnosed with [condition] on [date]. My treatment plan includes [details], which is expected to take [timeline].',
  'Mention your insurance coverage status':
    'Unfortunately, my insurance [does not cover / only partially covers] these treatments, leaving us with [amount] in out-of-pocket costs.',
  'Add a treatment timeline with milestones':
    'The treatment is expected to span [X months]: Phase 1 involves [details], followed by Phase 2 which includes [details].',
  'Share the hospital or care facility name':
    'I am receiving treatment at [Hospital Name] under the care of Dr. [Name], who specializes in [specialty].',
  'Include the date the emergency occurred':
    'On [date], our lives changed when [describe the emergency]. Since then, we have been [describe situation].',
  'Describe the area or extent of damage':
    'The [disaster] affected [area/number of homes], causing approximately $[amount] in damage to our [property/community].',
  'Separate immediate needs from long-term recovery':
    'Our immediate needs include [food, shelter, clothing]. In the longer term, we will need funds for [rebuilding, medical care, relocation].',
  'Mention any assistance already received (FEMA, insurance, etc.)':
    'We have applied for [FEMA assistance / insurance claims], but [coverage is limited / processing is slow], leaving a gap of $[amount].',
  'Include the rescue organization if applicable':
    'We are working with [Rescue Organization Name] to provide care and find permanent homes for these animals.',
  'Provide a detailed vet cost breakdown':
    'Veterinary costs include: surgery ($X), medication ($X/month), follow-up visits ($X each), and rehabilitation ($X).',
  "Describe the animal's story and current condition":
    '[Animal name] was found [describe condition/location]. Currently, [he/she] is [describe current state and needs].',
  'Mention before/after potential or recovery outlook':
    'With proper care and treatment, [animal name] is expected to make a [full/partial] recovery within [timeline].',
};

// ---------------------------------------------------------------------------
// Mock fallback score (used when no API response yet)
// ---------------------------------------------------------------------------

const EMPTY_SCORE: ScoreData = {
  score: 0,
  included: [],
  missing: Object.keys(INCLUDED_LABELS),
  antiPatterns: [],
  nicheTips: [],
  suggestedTitles: [],
  goalBenchmark: { median: 10000, top25: 25000, category: '' },
};

// ---------------------------------------------------------------------------
// Step Indicator
// ---------------------------------------------------------------------------

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div
          className="absolute top-0 left-0 h-full bg-gfm-green rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
        />
      </div>
      <div className="flex justify-between">
        {STEP_LABELS.map((label, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          return (
            <div key={label} className="flex flex-col items-center gap-1">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                  ${isCompleted ? 'bg-gfm-green text-white' : isCurrent ? 'bg-gfm-green text-white ring-4 ring-gfm-light-green' : 'bg-gray-200 text-gfm-secondary'}
                `}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={`text-xs hidden sm:block ${isCurrent ? 'text-gfm-dark font-semibold' : 'text-gfm-secondary'}`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 1: Campaign Details
// ---------------------------------------------------------------------------

function Step1Details({
  data,
  onUpdate,
}: {
  data: CampaignData;
  onUpdate: <K extends keyof CampaignData>(key: K, value: CampaignData[K]) => void;
}) {
  const subcats = SUBCATEGORIES[data.category] || [];

  return (
    <div>
      <h2 className="text-xl font-bold text-gfm-dark mb-2">Campaign Details</h2>
      <p className="text-gfm-secondary mb-6">Tell us about your campaign so we can benchmark it against top performers.</p>

      {/* Category */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gfm-dark mb-3">Category</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => {
            const isSelected = data.category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  onUpdate('category', cat.id);
                  onUpdate('subcategory', '');
                }}
                className={`
                  flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200
                  hover:shadow-md hover:border-gfm-green cursor-pointer
                  ${isSelected ? 'border-gfm-green bg-green-50 shadow-md' : 'border-gray-200 bg-white'}
                `}
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className={`text-sm font-medium ${isSelected ? 'text-gfm-dark-green' : 'text-gfm-dark'}`}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subcategory */}
      {subcats.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gfm-dark mb-3">Specifics</label>
          <div className="flex flex-wrap gap-2">
            {subcats.map((sub) => {
              const isSelected = data.subcategory === sub.toLowerCase();
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => onUpdate('subcategory', sub.toLowerCase())}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200 cursor-pointer
                    ${isSelected ? 'border-gfm-green bg-green-50 text-gfm-dark-green' : 'border-gray-200 bg-white text-gfm-dark hover:border-gfm-green'}
                  `}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Location */}
      <div className="mb-6">
        <label htmlFor="cb-location" className="block text-sm font-semibold text-gfm-dark mb-2">
          Location
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gfm-secondary" />
          <input
            id="cb-location"
            type="text"
            value={data.location}
            onChange={(e) => onUpdate('location', e.target.value)}
            placeholder="City, State"
            className="w-full h-12 pl-10 pr-4 text-gfm-dark bg-white border-2 border-gray-200 rounded-xl focus:border-gfm-green focus:ring-4 focus:ring-gfm-light-green focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Goal */}
      <div>
        <label htmlFor="cb-goal" className="block text-sm font-semibold text-gfm-dark mb-2">
          Fundraising Goal
        </label>
        <div className="relative mb-4">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gfm-secondary" />
          <input
            id="cb-goal"
            type="text"
            inputMode="numeric"
            value={data.goalCents > 0 ? (data.goalCents / 100).toLocaleString('en-US') : ''}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9]/g, '');
              if (raw === '') { onUpdate('goalCents', 0); return; }
              const num = parseInt(raw, 10);
              if (num <= 10_000_000) onUpdate('goalCents', num * 100);
            }}
            placeholder="0"
            className="w-full h-12 pl-10 pr-4 text-gfm-dark bg-white border-2 border-gray-200 rounded-xl focus:border-gfm-green focus:ring-4 focus:ring-gfm-light-green focus:outline-none transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_AMOUNTS.map((amt) => {
            const isActive = data.goalCents === amt;
            return (
              <button
                key={amt}
                type="button"
                onClick={() => onUpdate('goalCents', amt)}
                className={`
                  px-4 py-1.5 rounded-full text-sm font-medium border-2 transition-all duration-200 cursor-pointer
                  ${isActive ? 'border-gfm-green bg-green-50 text-gfm-dark-green' : 'border-gray-200 bg-white text-gfm-dark hover:border-gfm-green'}
                `}
              >
                ${(amt / 100).toLocaleString('en-US')}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Score Panel (used in Step 2)
// ---------------------------------------------------------------------------

function ScorePanel({
  scoreData,
  isLoading,
  onInsertTip,
}: {
  scoreData: ScoreData;
  isLoading: boolean;
  onInsertTip: (text: string) => void;
}) {
  const allChecklistKeys = Object.keys(INCLUDED_LABELS);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Score header */}
      <div className="p-5 border-b border-gray-100 flex items-center gap-4">
        <div className="relative">
          <ProgressCircle percentage={scoreData.score} size={72} strokeWidth={5} />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-gfm-green border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-gfm-dark">Campaign Score</p>
          <p className="text-xs text-gfm-secondary">
            {scoreData.score >= 80
              ? 'Excellent! Your story is compelling.'
              : scoreData.score >= 60
                ? 'Good start. A few improvements will help.'
                : scoreData.score >= 30
                  ? 'Keep going! Add more detail.'
                  : 'Start writing to see your score.'}
          </p>
        </div>
      </div>

      {/* Included / Missing checklist */}
      <div className="p-5 border-b border-gray-100">
        <p className="text-xs font-semibold text-gfm-secondary uppercase tracking-wider mb-3">
          Top campaigns include
        </p>
        <div className="space-y-2">
          {allChecklistKeys.map((key) => {
            const isIncluded = scoreData.included.includes(key);
            return (
              <div key={key} className="flex items-center gap-2">
                {isIncluded ? (
                  <CheckCircle className="w-4 h-4 text-gfm-green flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                )}
                <span className={`text-sm ${isIncluded ? 'text-gfm-dark' : 'text-gfm-secondary'}`}>
                  {INCLUDED_LABELS[key]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Anti-patterns */}
      {scoreData.antiPatterns.length > 0 && (
        <div className="p-5 border-b border-gray-100">
          <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-3">
            Things to avoid
          </p>
          <div className="space-y-2">
            {scoreData.antiPatterns.map((ap) => (
              <div key={ap} className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-sm text-red-600">{ANTI_PATTERN_LABELS[ap] || ap}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Niche tips */}
      {scoreData.nicheTips.length > 0 && (
        <div className="p-5">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5" />
            Niche-specific tips
          </p>
          <div className="space-y-2">
            {scoreData.nicheTips.map((tip, i) => {
              const template = TIP_TEMPLATES[tip];
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    if (template) onInsertTip(template);
                  }}
                  className={`
                    w-full text-left flex items-start gap-2 p-2 rounded-lg transition-all text-sm
                    ${template ? 'hover:bg-amber-50 cursor-pointer group' : 'cursor-default'}
                  `}
                >
                  <ChevronRight className={`w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500 ${template ? 'group-hover:text-amber-600' : ''}`} />
                  <span className="text-gfm-dark">
                    {tip}
                    {template && (
                      <span className="text-xs text-amber-500 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        (click to insert)
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2: AI-Powered Story Builder
// ---------------------------------------------------------------------------

function Step2StoryBuilder({
  data,
  onUpdate,
  scoreData,
  isScoring,
  onInsertTip,
}: {
  data: CampaignData;
  onUpdate: <K extends keyof CampaignData>(key: K, value: CampaignData[K]) => void;
  scoreData: ScoreData;
  isScoring: boolean;
  onInsertTip: (text: string) => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gfm-dark mb-2">Write Your Campaign Story</h2>
      <p className="text-gfm-secondary mb-6">
        Your story is the heart of your campaign. Write naturally, and the AI will score it in real time.
      </p>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Textarea */}
        <div className="flex-1">
          <div className="relative">
            <textarea
              value={data.story}
              onChange={(e) => onUpdate('story', e.target.value)}
              placeholder={
                'Tell your story here...\n\n' +
                'Some prompts to get started:\n' +
                '- Who is this campaign for?\n' +
                '- What happened or what do you need?\n' +
                '- How will the funds be used?\n' +
                '- Why does this matter to you?\n' +
                '- What is the timeline?'
              }
              rows={18}
              className="w-full px-4 py-3 text-gfm-dark bg-white border-2 border-gray-200 rounded-xl focus:border-gfm-green focus:ring-4 focus:ring-gfm-light-green focus:outline-none transition-all resize-y text-[15px] leading-relaxed"
            />
            <div className="absolute right-3 bottom-3 flex items-center gap-3">
              <span className="text-xs text-gfm-secondary">
                {data.story.split(/\s+/).filter(Boolean).length} words
              </span>
              {isScoring && (
                <span className="flex items-center gap-1 text-xs text-gfm-green">
                  <div className="w-3 h-3 border-2 border-gfm-green border-t-transparent rounded-full animate-spin" />
                  Scoring...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Score panel */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <ScorePanel scoreData={scoreData} isLoading={isScoring} onInsertTip={onInsertTip} />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 3: AI Enhancement
// ---------------------------------------------------------------------------

function Step3Enhance({
  data,
  onUpdate,
  scoreData,
}: {
  data: CampaignData;
  onUpdate: <K extends keyof CampaignData>(key: K, value: CampaignData[K]) => void;
  scoreData: ScoreData;
}) {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const handleEnhance = useCallback(async () => {
    setIsEnhancing(true);
    try {
      // Simulate AI enhancement (in production this would call another API)
      await new Promise((r) => setTimeout(r, 2000));
      const story = data.story;
      // Create an "enhanced" version by adding structure
      const lines = story.split('\n').filter((l) => l.trim());
      let enhanced = lines.join('\n\n');
      if (!enhanced.includes('Thank') && !enhanced.includes('thank')) {
        enhanced += '\n\nThank you from the bottom of our hearts for any support you can provide. Every dollar makes a difference, and we promise to keep you updated on our progress.';
      }
      if (!enhanced.includes('$') && data.goalCents > 0) {
        enhanced = `We are trying to raise $${(data.goalCents / 100).toLocaleString('en-US')} to cover the costs described below.\n\n` + enhanced;
      }
      onUpdate('enhancedStory', enhanced);
      setShowComparison(true);
    } finally {
      setIsEnhancing(false);
    }
  }, [data.story, data.goalCents, onUpdate]);

  const handleAcceptEnhanced = () => {
    onUpdate('story', data.enhancedStory);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gfm-dark mb-2 flex items-center gap-2">
        <Wand2 className="w-5 h-5 text-gfm-green" />
        AI Enhancement
      </h2>
      <p className="text-gfm-secondary mb-6">
        Let AI polish your story and suggest improvements. Your original story is preserved.
      </p>

      {/* Enhance button */}
      {!showComparison && (
        <div className="text-center mb-8">
          <Button
            variant="primary"
            size="lg"
            onClick={handleEnhance}
            disabled={isEnhancing || data.story.trim().length < 20}
          >
            {isEnhancing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Enhancing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Enhance My Story
              </>
            )}
          </Button>
          {data.story.trim().length < 20 && (
            <p className="text-xs text-gfm-secondary mt-2">Write at least 20 characters in your story first.</p>
          )}
        </div>
      )}

      {/* Before / After comparison */}
      {showComparison && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <p className="text-sm font-semibold text-gfm-secondary mb-2">Original</p>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gfm-dark whitespace-pre-wrap max-h-64 overflow-y-auto">
              {data.story}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gfm-green mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Enhanced
            </p>
            <div className="p-4 bg-green-50 rounded-xl border border-gfm-green/30 text-sm text-gfm-dark whitespace-pre-wrap max-h-64 overflow-y-auto">
              {data.enhancedStory}
            </div>
          </div>
        </div>
      )}

      {showComparison && (
        <div className="flex items-center gap-3 mb-8">
          <Button variant="primary" size="md" onClick={handleAcceptEnhanced}>
            Use Enhanced Version
          </Button>
          <Button variant="ghost" size="md" onClick={() => setShowComparison(false)}>
            Keep Original
          </Button>
        </div>
      )}

      {/* Suggested Titles */}
      {scoreData.suggestedTitles.length > 0 && (
        <div className="mb-8">
          <p className="text-sm font-semibold text-gfm-dark mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-gfm-green" />
            Suggested Titles
          </p>
          <div className="space-y-2">
            {scoreData.suggestedTitles.map((title, i) => {
              const isSelected = data.selectedTitle === title;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onUpdate('selectedTitle', title)}
                  className={`
                    w-full text-left p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer
                    ${isSelected ? 'border-gfm-green bg-green-50' : 'border-gray-200 bg-white hover:border-gfm-green/50'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${isSelected ? 'text-gfm-dark-green' : 'text-gfm-dark'}`}>
                      {title}
                    </span>
                    {isSelected && <CheckCircle className="w-4 h-4 text-gfm-green" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Goal benchmark */}
      {scoreData.goalBenchmark.category && (
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Goal Benchmark — {scoreData.goalBenchmark.category.charAt(0).toUpperCase() + scoreData.goalBenchmark.category.slice(1)} Campaigns
          </p>
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-blue-600 font-medium">Median goal:</span>{' '}
              <span className="font-bold text-blue-900">${scoreData.goalBenchmark.median.toLocaleString('en-US')}</span>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Top 25%:</span>{' '}
              <span className="font-bold text-blue-900">${scoreData.goalBenchmark.top25.toLocaleString('en-US')}</span>
            </div>
            {data.goalCents > 0 && (
              <div>
                <span className="text-blue-600 font-medium">Your goal:</span>{' '}
                <span className="font-bold text-blue-900">${(data.goalCents / 100).toLocaleString('en-US')}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 4: Share Strategy Preview
// ---------------------------------------------------------------------------

function Step4ShareStrategy({
  data,
  scoreData,
}: {
  data: CampaignData;
  scoreData: ScoreData;
}) {
  const [isLaunched, setIsLaunched] = useState(false);

  const title = data.selectedTitle || scoreData.suggestedTitles[0] || 'My Campaign';
  const goalStr = data.goalCents > 0 ? `$${(data.goalCents / 100).toLocaleString('en-US')}` : '$5,000';
  const categoryLabel = CATEGORIES.find((c) => c.id === data.category)?.label || 'Campaign';

  // Predicted metrics
  const estimatedDonors = Math.round(((data.goalCents / 100) / 75) * (scoreData.score / 80));
  const estimatedDays = Math.max(7, Math.round(30 * (80 / Math.max(scoreData.score, 20))));
  const estimatedShares = Math.round(estimatedDonors * 2.5);

  // Share messages
  const shareMessages = [
    {
      platform: 'Twitter',
      icon: <Twitter className="w-5 h-5" />,
      color: 'bg-[#1DA1F2]',
      message: `Please help us reach our ${goalStr} goal! ${title}. Every share and donation counts. #GoFundMe #${categoryLabel.replace(/\s/g, '')}`,
    },
    {
      platform: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      color: 'bg-[#1877F2]',
      message: `I just launched a GoFundMe campaign: "${title}". We're trying to raise ${goalStr} and every bit helps. Please consider donating or sharing with your friends and family. Thank you for your support!`,
    },
    {
      platform: 'Instagram',
      icon: <Instagram className="w-5 h-5" />,
      color: 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]',
      message: `Link in bio! "${title}" — Help us reach our goal of ${goalStr}. Your support means the world to us. #GoFundMe #Fundraiser #${categoryLabel.replace(/\s/g, '')} #Community #GiveBack`,
    },
    {
      platform: 'SMS',
      icon: <Smartphone className="w-5 h-5" />,
      color: 'bg-gfm-green',
      message: `Hey! I started a GoFundMe for ${title}. I'm trying to raise ${goalStr}. Would you be able to help by donating or sharing? Here's the link: [campaign-url]`,
    },
  ];

  // Sharing schedule
  const schedule = [
    { day: 'Day 1', action: 'Launch announcement on all platforms', icon: <Rocket className="w-4 h-4" /> },
    { day: 'Day 3', action: 'Personal messages to close friends & family', icon: <Users className="w-4 h-4" /> },
    { day: 'Day 7', action: 'First update post with progress + thank-yous', icon: <TrendingUp className="w-4 h-4" /> },
    { day: 'Day 14', action: 'Milestone celebration or halfway update', icon: <Target className="w-4 h-4" /> },
    { day: 'Day 21', action: 'Share a specific story or impact detail', icon: <Share2 className="w-4 h-4" /> },
    { day: 'Day 28', action: 'Final push — urgency and countdown', icon: <Clock className="w-4 h-4" /> },
  ];

  if (isLaunched) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gfm-light-green rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <Rocket className="w-10 h-10 text-gfm-green" />
        </div>
        <h2 className="text-2xl font-bold text-gfm-dark mb-3">Campaign Ready to Launch!</h2>
        <p className="text-gfm-secondary mb-6 max-w-md mx-auto">
          Your AI-optimized campaign &ldquo;{title}&rdquo; is ready. In a real app, this would publish your campaign and start accepting donations.
        </p>
        <Button variant="outline" size="lg" onClick={() => setIsLaunched(false)}>
          Back to Preview
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gfm-dark mb-2 flex items-center gap-2">
        <Share2 className="w-5 h-5 text-gfm-green" />
        Share Strategy Preview
      </h2>
      <p className="text-gfm-secondary mb-6">
        Here is your predicted performance and ready-to-use share messages.
      </p>

      {/* Predicted metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Campaign Score', value: `${scoreData.score}/100`, icon: <Target className="w-5 h-5" /> },
          { label: 'Est. Donors', value: estimatedDonors.toString(), icon: <Users className="w-5 h-5" /> },
          { label: 'Est. Shares', value: estimatedShares.toString(), icon: <Share2 className="w-5 h-5" /> },
          { label: 'Est. Duration', value: `${estimatedDays} days`, icon: <Calendar className="w-5 h-5" /> },
        ].map((metric) => (
          <div key={metric.label} className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
            <div className="flex justify-center mb-2 text-gfm-green">{metric.icon}</div>
            <p className="text-lg font-bold text-gfm-dark">{metric.value}</p>
            <p className="text-xs text-gfm-secondary">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Share message previews */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-gfm-dark mb-3">Share Messages</p>
        <div className="space-y-3">
          {shareMessages.map((sm) => (
            <div key={sm.platform} className="p-4 bg-white rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 ${sm.color} rounded-full flex items-center justify-center text-white`}>
                  {sm.icon}
                </div>
                <span className="text-sm font-semibold text-gfm-dark">{sm.platform}</span>
              </div>
              <p className="text-sm text-gfm-secondary leading-relaxed">{sm.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sharing schedule */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-gfm-dark mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gfm-green" />
          Recommended Sharing Schedule
        </p>
        <div className="space-y-2">
          {schedule.map((s) => (
            <div key={s.day} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-gfm-light-green rounded-full flex items-center justify-center text-gfm-green flex-shrink-0">
                {s.icon}
              </div>
              <div>
                <span className="text-sm font-semibold text-gfm-dark">{s.day}</span>
                <span className="text-sm text-gfm-secondary ml-2">{s.action}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Launch button */}
      <div className="text-center">
        <Button variant="primary" size="lg" onClick={() => setIsLaunched(true)}>
          <Rocket className="w-4 h-4 mr-2" />
          Launch Campaign
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Campaign Builder Wizard
// ---------------------------------------------------------------------------

export default function CampaignBuilderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<CampaignData>(INITIAL_DATA);
  const [scoreData, setScoreData] = useState<ScoreData>(EMPTY_SCORE);
  const [isScoring, setIsScoring] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const update = useCallback(
    <K extends keyof CampaignData>(key: K, value: CampaignData[K]) => {
      setData((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  // Debounced scoring
  useEffect(() => {
    if (currentStep !== 2) return;
    if (data.story.trim().length < 10) {
      setScoreData(EMPTY_SCORE);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setIsScoring(true);
      try {
        const res = await fetch('/api/ai/campaign-score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            story: data.story,
            category: data.category,
            subcategory: data.subcategory,
            location: data.location,
            goal: data.goalCents,
          }),
        });
        if (res.ok) {
          const json = await res.json();
          setScoreData(json);
        }
      } catch {
        // Silently fail — the panel will just show last known score
      } finally {
        setIsScoring(false);
      }
    }, 1500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [data.story, data.category, data.subcategory, data.location, data.goalCents, currentStep]);

  const handleInsertTip = useCallback(
    (template: string) => {
      setData((prev) => ({
        ...prev,
        story: prev.story + (prev.story.endsWith('\n') || prev.story === '' ? '' : '\n\n') + template,
      }));
    },
    [],
  );

  const canContinue = (): boolean => {
    switch (currentStep) {
      case 1:
        return data.category !== '' && data.goalCents >= 10_000;
      case 2:
        return data.story.trim().length >= 20;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  return (
    <div className="min-h-screen bg-gfm-bg py-8 px-4">
      <div className={`mx-auto ${currentStep === 2 ? 'max-w-5xl' : 'max-w-3xl'}`}>
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gfm-dark mb-2">
          AI Campaign Builder
        </h1>
        <p className="text-center text-gfm-secondary mb-8">
          Build a high-performing campaign with real-time AI coaching
        </p>

        {/* Step indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Step content */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-6">
          <div
            key={currentStep}
            className="animate-[fadeIn_0.3s_ease-out]"
            style={{ animationFillMode: 'both' }}
          >
            {currentStep === 1 && <Step1Details data={data} onUpdate={update} />}
            {currentStep === 2 && (
              <Step2StoryBuilder
                data={data}
                onUpdate={update}
                scoreData={scoreData}
                isScoring={isScoring}
                onInsertTip={handleInsertTip}
              />
            )}
            {currentStep === 3 && <Step3Enhance data={data} onUpdate={update} scoreData={scoreData} />}
            {currentStep === 4 && <Step4ShareStrategy data={data} scoreData={scoreData} />}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <Button variant="ghost" size="lg" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
          </div>
          <div>
            {currentStep < TOTAL_STEPS && (
              <Button variant="primary" size="lg" onClick={handleNext} disabled={!canContinue()}>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
