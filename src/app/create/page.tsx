'use client';

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import type { CauseType } from '@/lib/types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TOTAL_STEPS = 6;

const STEP_LABELS = [
  'Who',
  'Category',
  'Goal',
  'Story',
  'Photo',
  'Review',
] as const;

type FundraisingFor = 'yourself' | 'someone_else' | 'charity';

interface WizardData {
  fundraisingFor: FundraisingFor | '';
  category: CauseType | '';
  goalCents: number;
  title: string;
  description: string;
  location: string;
  hasPhoto: boolean;
}

const INITIAL_DATA: WizardData = {
  fundraisingFor: '',
  category: '',
  goalCents: 0,
  title: '',
  description: '',
  location: '',
  hasPhoto: false,
};

// ---------------------------------------------------------------------------
// Category definitions
// ---------------------------------------------------------------------------

interface CategoryDef {
  id: CauseType;
  label: string;
  emoji: string;
  description: string;
}

const CATEGORIES: CategoryDef[] = [
  { id: 'medical', label: 'Medical', emoji: '\u{1F3E5}', description: 'Surgeries, treatments & medical bills' },
  { id: 'emergency', label: 'Emergency', emoji: '\u{1F6A8}', description: 'Urgent & unexpected situations' },
  { id: 'education', label: 'Education', emoji: '\u{1F393}', description: 'Tuition, supplies & programs' },
  { id: 'animals', label: 'Animals', emoji: '\u{1F43E}', description: 'Rescue, shelter & veterinary care' },
  { id: 'environment', label: 'Environment', emoji: '\u{1F33F}', description: 'Conservation & sustainability' },
  { id: 'community', label: 'Community', emoji: '\u{1F91D}', description: 'Neighborhoods & local projects' },
  { id: 'business', label: 'Business', emoji: '\u{1F4BC}', description: 'Startups, shops & ventures' },
  { id: 'faith', label: 'Faith', emoji: '\u{1F54A}\u{FE0F}', description: 'Churches, missions & ministries' },
  { id: 'sports', label: 'Sports', emoji: '\u26BD', description: 'Teams, equipment & tournaments' },
  { id: 'arts_culture', label: 'Arts & Culture', emoji: '\u{1F3A8}', description: 'Music, art & cultural projects' },
];

const CATEGORY_LABEL_MAP: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.label]),
);

const SUGGESTED_AMOUNTS = [500, 1_000, 5_000, 10_000, 25_000];

const FUNDRAISING_FOR_OPTIONS: {
  id: FundraisingFor;
  title: string;
  subtitle: string;
  icon: ReactNode;
}[] = [
  {
    id: 'yourself',
    title: 'Yourself',
    subtitle: "Funds are delivered to you and you'll manage them",
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    id: 'someone_else',
    title: 'Someone else',
    subtitle: "You'll invite a beneficiary to receive the funds directly",
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    id: 'charity',
    title: 'Charity / Nonprofit',
    subtitle: 'Funds go directly to a registered nonprofit organisation',
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
];

// ---------------------------------------------------------------------------
// Confetti particle types
// ---------------------------------------------------------------------------

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
  isCircle: boolean;
}

function generateParticles(count: number): Particle[] {
  const colors = ['#02a95c', '#017a3e', '#6366f1', '#ec4899', '#f59e0b', '#3b82f6', '#ef4444', '#10b981'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 3,
    size: 6 + Math.random() * 8,
    isCircle: Math.random() > 0.5,
  }));
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) || 'my-fundraiser';
}

function formatCurrency(cents: number): string {
  return (cents / 100).toLocaleString('en-US');
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Horizontal step progress indicator */
function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      {/* Progress bar */}
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div
          className="absolute top-0 left-0 h-full bg-gfm-green rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      {/* Step dots + labels */}
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

/** Checkmark badge shown on selected cards */
function SelectedBadge() {
  return (
    <div className="w-6 h-6 bg-gfm-green rounded-full flex items-center justify-center">
      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 1 - Who are you fundraising for?
// ---------------------------------------------------------------------------

function Step1({
  selected,
  onSelect,
}: {
  selected: FundraisingFor | '';
  onSelect: (val: FundraisingFor) => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gfm-dark mb-2">Who are you fundraising for?</h2>
      <p className="text-gfm-secondary mb-6">Choose who will receive the funds from your fundraiser.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {FUNDRAISING_FOR_OPTIONS.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              className={`
                flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-200
                hover:shadow-md hover:border-gfm-green cursor-pointer
                ${isSelected ? 'border-gfm-green bg-green-50 shadow-md' : 'border-gray-200 bg-white'}
              `}
            >
              <div className={`${isSelected ? 'text-gfm-green' : 'text-gfm-secondary'} transition-colors`}>
                {opt.icon}
              </div>
              <div className="text-center">
                <p className={`font-semibold ${isSelected ? 'text-gfm-dark-green' : 'text-gfm-dark'}`}>
                  {opt.title}
                </p>
                <p className="text-xs text-gfm-secondary mt-1">{opt.subtitle}</p>
              </div>
              {isSelected && <SelectedBadge />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2 - Category picker
// ---------------------------------------------------------------------------

function Step2({
  selected,
  onSelect,
}: {
  selected: CauseType | '';
  onSelect: (cat: CauseType) => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gfm-dark mb-2">What best describes your fundraiser?</h2>
      <p className="text-gfm-secondary mb-6">Choose the category that best fits your fundraiser.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {CATEGORIES.map((cat) => {
          const isSelected = selected === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.id)}
              className={`
                flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200
                hover:shadow-md hover:border-gfm-green cursor-pointer
                ${isSelected ? 'border-gfm-green bg-green-50 shadow-md' : 'border-gray-200 bg-white'}
              `}
            >
              <span className="text-3xl">{cat.emoji}</span>
              <span className={`text-sm font-medium ${isSelected ? 'text-gfm-dark-green' : 'text-gfm-dark'}`}>
                {cat.label}
              </span>
              <span className="text-[11px] leading-tight text-gfm-secondary text-center">{cat.description}</span>
              {isSelected && (
                <div className="w-5 h-5 bg-gfm-green rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 3 - Set your goal
// ---------------------------------------------------------------------------

function Step3({
  goalCents,
  onGoalChange,
}: {
  goalCents: number;
  onGoalChange: (cents: number) => void;
}) {
  const [inputValue, setInputValue] = useState(goalCents > 0 ? formatCurrency(goalCents) : '');

  const applyDollars = useCallback(
    (dollars: number) => {
      setInputValue(dollars.toLocaleString('en-US'));
      onGoalChange(dollars * 100);
    },
    [onGoalChange],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    if (raw === '') {
      setInputValue('');
      onGoalChange(0);
      return;
    }
    const num = parseInt(raw, 10);
    if (num <= 10_000_000) {
      setInputValue(num.toLocaleString('en-US'));
      onGoalChange(num * 100);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gfm-dark mb-2">Set your goal</h2>
      <p className="text-gfm-secondary mb-8">
        You can always change your goal later. Tip: Set a goal close to the minimum you need.
      </p>

      {/* Currency input */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-4xl font-bold text-gfm-secondary">$</span>
          <input
            type="text"
            inputMode="numeric"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="0"
            className="w-72 h-20 pl-12 pr-4 text-4xl font-bold text-center text-gfm-dark bg-white border-2 border-gray-200 rounded-2xl focus:border-gfm-green focus:ring-4 focus:ring-gfm-light-green focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Suggested amounts */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        {SUGGESTED_AMOUNTS.map((amt) => {
          const isActive = goalCents === amt * 100;
          return (
            <button
              key={amt}
              type="button"
              onClick={() => applyDollars(amt)}
              className={`
                px-5 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-200 cursor-pointer
                ${isActive ? 'border-gfm-green bg-green-50 text-gfm-dark-green' : 'border-gray-200 bg-white text-gfm-dark hover:border-gfm-green hover:bg-green-50/50'}
              `}
            >
              ${amt.toLocaleString('en-US')}
            </button>
          );
        })}
      </div>

      <p className="text-center text-sm text-gfm-secondary">You can always change your goal later.</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 4 - Tell your story
// ---------------------------------------------------------------------------

const MAX_TITLE_LENGTH = 100;

function Step4({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  location,
  onLocationChange,
}: {
  title: string;
  onTitleChange: (v: string) => void;
  description: string;
  onDescriptionChange: (v: string) => void;
  location: string;
  onLocationChange: (v: string) => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gfm-dark mb-2">Tell your story</h2>
      <p className="text-gfm-secondary mb-6">A compelling story helps donors connect with your cause.</p>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="wiz-title" className="block text-sm font-semibold text-gfm-dark mb-2">
            Fundraiser title
          </label>
          <div className="relative">
            <input
              id="wiz-title"
              type="text"
              value={title}
              onChange={(e) => {
                if (e.target.value.length <= MAX_TITLE_LENGTH) onTitleChange(e.target.value);
              }}
              placeholder="Give your fundraiser a title..."
              className="w-full h-12 px-4 pr-16 text-gfm-dark bg-white border-2 border-gray-200 rounded-xl focus:border-gfm-green focus:ring-4 focus:ring-gfm-light-green focus:outline-none transition-all"
            />
            <span
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${
                title.length >= MAX_TITLE_LENGTH ? 'text-red-500 font-semibold' : 'text-gfm-secondary'
              }`}
            >
              {title.length}/{MAX_TITLE_LENGTH}
            </span>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="wiz-desc" className="block text-sm font-semibold text-gfm-dark mb-2">
            Your story
          </label>
          <div className="relative">
            <textarea
              id="wiz-desc"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder={
                'Tell potential donors why you are fundraising.\n\n' +
                'Some ideas to get you started:\n' +
                '- Who is this fundraiser for?\n' +
                '- What happened or what do you need?\n' +
                '- How will the funds be used?\n' +
                '- Why does this matter to you?'
              }
              rows={8}
              className="w-full px-4 py-3 text-gfm-dark bg-white border-2 border-gray-200 rounded-xl focus:border-gfm-green focus:ring-4 focus:ring-gfm-light-green focus:outline-none transition-all resize-y"
            />
            <span className="absolute right-3 bottom-3 text-xs text-gfm-secondary">
              {description.length} characters
            </span>
          </div>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="wiz-location" className="block text-sm font-semibold text-gfm-dark mb-2">
            Location
          </label>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gfm-secondary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
            <input
              id="wiz-location"
              type="text"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              placeholder="City, State"
              className="w-full h-12 pl-10 pr-4 text-gfm-dark bg-white border-2 border-gray-200 rounded-xl focus:border-gfm-green focus:ring-4 focus:ring-gfm-light-green focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 5 - Add a cover photo
// ---------------------------------------------------------------------------

function Step5({
  hasPhoto,
  onPhotoChange,
}: {
  hasPhoto: boolean;
  onPhotoChange: (v: boolean) => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gfm-dark mb-2">Add a cover photo</h2>
      <p className="text-gfm-secondary mb-6">
        A compelling photo helps raise <span className="font-semibold text-gfm-dark">3x more donations</span>.
      </p>

      {!hasPhoto ? (
        <div
          onClick={() => onPhotoChange(true)}
          className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-gfm-green hover:bg-green-50/50 transition-all cursor-pointer group"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gfm-light-green transition-colors">
              <svg
                className="w-8 h-8 text-gfm-secondary group-hover:text-gfm-green transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21zM8.25 8.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold text-gfm-dark">Drag and drop your photo here</p>
              <p className="text-sm text-gfm-secondary mt-1">or click to browse your files</p>
            </div>
            <span className="mt-2 px-6 py-2.5 bg-white border-2 border-gfm-green text-gfm-green rounded-full font-semibold text-sm hover:bg-gfm-green hover:text-white transition-all">
              Choose a photo
            </span>
            <p className="text-xs text-gfm-secondary">JPG, PNG, or GIF. Max 20MB.</p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden bg-gray-100">
          <div className="w-full aspect-video bg-gradient-to-br from-gfm-light-green via-green-100 to-emerald-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-10 h-10 text-gfm-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gfm-dark-green">Photo preview</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onPhotoChange(false)}
            className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Remove photo"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 6 - Review & Launch
// ---------------------------------------------------------------------------

function Step6({ formData }: { formData: WizardData }) {
  const goalDollars = formatCurrency(formData.goalCents);
  const fundraisingForLabel =
    formData.fundraisingFor === 'yourself'
      ? 'yourself'
      : formData.fundraisingFor === 'someone_else'
        ? 'someone else'
        : 'charity';

  return (
    <div>
      <h2 className="text-xl font-bold text-gfm-dark mb-2">Review &amp; Launch</h2>
      <p className="text-gfm-secondary mb-6">Everything look good? You can always edit after launching.</p>

      {/* Preview card */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        {/* Cover image placeholder */}
        <div className="w-full aspect-video bg-gradient-to-br from-gfm-light-green via-green-100 to-emerald-50 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gfm-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
              />
            </svg>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Category badge */}
          {formData.category && (
            <span className="inline-block px-3 py-1 bg-green-50 text-gfm-dark-green text-xs font-semibold rounded-full">
              {CATEGORY_LABEL_MAP[formData.category] ?? formData.category}
            </span>
          )}

          {/* Title */}
          <h3 className="text-lg font-bold text-gfm-dark">{formData.title || 'Your fundraiser title'}</h3>

          {/* Goal */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gfm-green">${goalDollars}</span>
            <span className="text-sm text-gfm-secondary">goal</span>
          </div>

          {/* Progress bar (empty) */}
          <div className="w-full h-2 bg-gray-100 rounded-full">
            <div className="h-full w-0 bg-gfm-green rounded-full" />
          </div>

          {/* Description preview */}
          {formData.description && (
            <p className="text-sm text-gfm-secondary line-clamp-3">{formData.description}</p>
          )}

          {/* Location */}
          {formData.location && (
            <div className="flex items-center gap-1.5 text-sm text-gfm-secondary">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {formData.location}
            </div>
          )}

          {/* Organizer */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-gfm-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gfm-dark">Organized by You</p>
              <p className="text-xs text-gfm-secondary">Fundraising for {fundraisingForLabel}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Launch success screen
// ---------------------------------------------------------------------------

function LaunchSuccess({ title, slug }: { title: string; slug: string }) {
  const [particles] = useState(() => generateParticles(50));
  const [showContent, setShowContent] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative text-center py-8 overflow-hidden">
      {/* Confetti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute"
            style={{
              left: `${p.x}%`,
              top: '-20px',
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              borderRadius: p.isCircle ? '50%' : '2px',
              animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
              opacity: 0,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div
        className={`relative z-10 transition-all duration-700 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Celebration icon */}
        <div className="w-24 h-24 bg-gfm-light-green rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <svg className="w-12 h-12 text-gfm-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
            />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-gfm-dark mb-2">Your GoFundMe is live!</h2>
        <p className="text-gfm-secondary mb-8 max-w-md mx-auto">
          Congratulations! &ldquo;{title || 'Your fundraiser'}&rdquo; is now live and ready to receive donations.
          Share it with your network to get the word out.
        </p>

        {/* Share buttons */}
        <div className="max-w-sm mx-auto mb-8">
          <p className="text-sm font-semibold text-gfm-dark mb-4">Share your fundraiser</p>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Facebook', bg: 'bg-[#1877F2]', d: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
              { label: 'Twitter', bg: 'bg-[#1DA1F2]', d: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' },
              { label: 'Email', bg: 'bg-gray-700', d: '' },
              { label: 'Copy link', bg: 'bg-gray-600', d: '' },
            ].map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={s.label === 'Copy link' ? handleCopyLink : undefined}
                className="flex flex-col items-center gap-1.5 cursor-pointer group"
              >
                <div className={`w-12 h-12 ${s.bg} rounded-full flex items-center justify-center text-white group-hover:opacity-80 transition-opacity`}>
                  {s.label === 'Email' ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  ) : s.label === 'Copy link' ? (
                    copied ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-1.024a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L5.25 9.314" />
                      </svg>
                    )
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d={s.d} />
                    </svg>
                  )}
                </div>
                <span className="text-xs text-gfm-secondary">{s.label === 'Copy link' && copied ? 'Copied!' : s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* View fundraiser link */}
        <a
          href={`/f/${slug}`}
          className="inline-flex items-center gap-2 text-gfm-green hover:text-gfm-dark-green font-semibold transition-colors"
        >
          View your fundraiser
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </a>
      </div>

      {/* Confetti CSS */}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(calc(100vh + 20px)) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main wizard page
// ---------------------------------------------------------------------------

export default function CreatePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLaunched, setIsLaunched] = useState(false);
  const [formData, setFormData] = useState<WizardData>(INITIAL_DATA);

  const update = useCallback(
    <K extends keyof WizardData>(key: K, value: WizardData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const canContinue = (): boolean => {
    switch (currentStep) {
      case 1:
        return formData.fundraisingFor !== '';
      case 2:
        return formData.category !== '';
      case 3:
        return formData.goalCents >= 10_000; // at least $100
      case 4:
        return formData.title.trim().length > 0;
      case 5:
        return true; // photo is optional
      case 6:
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

  const handleLaunch = () => {
    setIsLaunched(true);
  };

  const slug = toSlug(formData.title);

  // ---- Launched state ----
  if (isLaunched) {
    return (
      <div className="min-h-screen bg-gfm-bg py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-8">
          <LaunchSuccess title={formData.title} slug={slug} />
        </div>
      </div>
    );
  }

  // ---- Wizard state ----
  return (
    <div className="min-h-screen bg-gfm-bg py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gfm-dark mb-8">
          Start a GoFundMe
        </h1>

        {/* Step indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Step content */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-6">
          <div
            key={currentStep}
            className="animate-[fadeIn_0.3s_ease-out]"
            style={{
              animationFillMode: 'both',
            }}
          >
            {currentStep === 1 && (
              <Step1
                selected={formData.fundraisingFor}
                onSelect={(val) => update('fundraisingFor', val)}
              />
            )}

            {currentStep === 2 && (
              <Step2
                selected={formData.category}
                onSelect={(cat) => update('category', cat)}
              />
            )}

            {currentStep === 3 && (
              <Step3
                goalCents={formData.goalCents}
                onGoalChange={(cents) => update('goalCents', cents)}
              />
            )}

            {currentStep === 4 && (
              <Step4
                title={formData.title}
                onTitleChange={(v) => update('title', v)}
                description={formData.description}
                onDescriptionChange={(v) => update('description', v)}
                location={formData.location}
                onLocationChange={(v) => update('location', v)}
              />
            )}

            {currentStep === 5 && (
              <Step5
                hasPhoto={formData.hasPhoto}
                onPhotoChange={(v) => update('hasPhoto', v)}
              />
            )}

            {currentStep === 6 && <Step6 formData={formData} />}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <Button variant="ghost" size="lg" onClick={handleBack}>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentStep === 6 ? (
              <>
                <Button variant="outline" size="lg">
                  Save as draft
                </Button>
                <Button variant="primary" size="lg" onClick={handleLaunch}>
                  Launch your GoFundMe
                </Button>
              </>
            ) : (
              <Button variant="primary" size="lg" onClick={handleNext} disabled={!canContinue()}>
                Continue
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* fadeIn keyframes for step transitions */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
