"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { StepIndicator } from "./StepIndicator";
import { CategoryPicker } from "./CategoryPicker";
import { GoalInput } from "./GoalInput";
import { StoryEditor } from "./StoryEditor";
import { PhotoUpload } from "./PhotoUpload";
import { LaunchSuccess } from "./LaunchSuccess";

const CATEGORY_LABELS: Record<string, string> = {
  medical: "Medical",
  emergency: "Emergency",
  education: "Education",
  animals: "Animals",
  environment: "Environment",
  community: "Community",
  business: "Business",
  faith: "Faith",
  sports: "Sports",
  other: "Other",
};

interface WizardData {
  fundraisingFor: "yourself" | "someone_else" | "charity" | "";
  category: string;
  goal: number;
  isRecurring: boolean;
  title: string;
  description: string;
}

const TOTAL_STEPS = 6;

export function CreateWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLaunched, setIsLaunched] = useState(false);
  const [formData, setFormData] = useState<WizardData>({
    fundraisingFor: "",
    category: "",
    goal: 0,
    isRecurring: false,
    title: "",
    description: "",
  });

  const canContinue = (): boolean => {
    switch (currentStep) {
      case 1:
        return formData.fundraisingFor !== "";
      case 2:
        return formData.category !== "";
      case 3:
        return formData.goal >= 10000; // at least $100
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
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleLaunch = () => {
    setIsLaunched(true);
  };

  if (isLaunched) {
    return (
      <div className="min-h-screen bg-gfm-bg py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-8">
          <LaunchSuccess title={formData.title} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gfm-bg py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gfm-dark mb-8">
          Start a GoFundMe
        </h1>

        {/* Step indicator */}
        <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        {/* Step content */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-6">
          <div
            key={currentStep}
            className="animate-[fadeIn_0.3s_ease-out]"
          >
            {currentStep === 1 && (
              <Step1
                selected={formData.fundraisingFor}
                onSelect={(val) =>
                  setFormData({ ...formData, fundraisingFor: val })
                }
              />
            )}
            {currentStep === 2 && (
              <div>
                <h2 className="text-xl font-bold text-gfm-dark mb-2">
                  What are you fundraising for?
                </h2>
                <p className="text-gfm-secondary mb-6">
                  Choose the category that best fits your fundraiser.
                </p>
                <CategoryPicker
                  selected={formData.category}
                  onSelect={(cat) =>
                    setFormData({ ...formData, category: cat })
                  }
                />
              </div>
            )}
            {currentStep === 3 && (
              <div>
                <h2 className="text-xl font-bold text-gfm-dark mb-2">
                  How much would you like to raise?
                </h2>
                <p className="text-gfm-secondary mb-6">
                  Set a goal for your fundraiser. You can always adjust it
                  later.
                </p>
                <GoalInput
                  goal={formData.goal}
                  onGoalChange={(g) => setFormData({ ...formData, goal: g })}
                  isRecurring={formData.isRecurring}
                  onRecurringChange={(r) =>
                    setFormData({ ...formData, isRecurring: r })
                  }
                />
              </div>
            )}
            {currentStep === 4 && (
              <div>
                <h2 className="text-xl font-bold text-gfm-dark mb-2">
                  Tell your story
                </h2>
                <p className="text-gfm-secondary mb-6">
                  A compelling story helps donors connect with your cause.
                </p>
                <StoryEditor
                  title={formData.title}
                  onTitleChange={(t) =>
                    setFormData({ ...formData, title: t })
                  }
                  description={formData.description}
                  onDescriptionChange={(d) =>
                    setFormData({ ...formData, description: d })
                  }
                />
              </div>
            )}
            {currentStep === 5 && (
              <div>
                <h2 className="text-xl font-bold text-gfm-dark mb-2">
                  Add a cover photo
                </h2>
                <p className="text-gfm-secondary mb-6">
                  A great photo helps your fundraiser stand out.
                </p>
                <PhotoUpload />
              </div>
            )}
            {currentStep === 6 && (
              <ReviewStep formData={formData} />
            )}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <Button variant="ghost" size="lg" onClick={handleBack}>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
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
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleLaunch}
                >
                  Launch fundraiser
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={handleNext}
                disabled={!canContinue()}
              >
                Continue
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Step 1 Component ----
function Step1({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (val: "yourself" | "someone_else" | "charity") => void;
}) {
  const options = [
    {
      id: "yourself" as const,
      title: "Yourself",
      subtitle: "You'll manage the funds",
      icon: (
        <svg
          className="w-10 h-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
      ),
    },
    {
      id: "someone_else" as const,
      title: "Someone else",
      subtitle: "You'll invite them to receive funds",
      icon: (
        <svg
          className="w-10 h-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
          />
        </svg>
      ),
    },
    {
      id: "charity" as const,
      title: "Charity",
      subtitle: "Funds go directly to a nonprofit",
      icon: (
        <svg
          className="w-10 h-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-gfm-dark mb-2">
        Who are you fundraising for?
      </h2>
      <p className="text-gfm-secondary mb-6">
        Choose who will receive the funds from your fundraiser.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {options.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              className={`
                flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-200
                hover:shadow-md hover:border-gfm-green cursor-pointer
                ${
                  isSelected
                    ? "border-gfm-green bg-green-50 shadow-md"
                    : "border-gray-200 bg-white"
                }
              `}
            >
              <div
                className={`${
                  isSelected ? "text-gfm-green" : "text-gfm-secondary"
                } transition-colors`}
              >
                {opt.icon}
              </div>
              <div className="text-center">
                <p
                  className={`font-semibold ${
                    isSelected ? "text-gfm-dark-green" : "text-gfm-dark"
                  }`}
                >
                  {opt.title}
                </p>
                <p className="text-xs text-gfm-secondary mt-1">
                  {opt.subtitle}
                </p>
              </div>
              {isSelected && (
                <div className="w-6 h-6 bg-gfm-green rounded-full flex items-center justify-center">
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
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

// ---- Review Step Component ----
function ReviewStep({ formData }: { formData: WizardData }) {
  const goalDollars = (formData.goal / 100).toLocaleString();

  return (
    <div>
      <h2 className="text-xl font-bold text-gfm-dark mb-2">
        Review your fundraiser
      </h2>
      <p className="text-gfm-secondary mb-6">
        Everything look good? You can always edit after launching.
      </p>

      {/* Preview card */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        {/* Cover image placeholder */}
        <div className="w-full aspect-video bg-gradient-to-br from-gfm-light-green via-green-100 to-emerald-50 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gfm-green"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
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
              {CATEGORY_LABELS[formData.category] || formData.category}
            </span>
          )}

          {/* Title */}
          <h3 className="text-lg font-bold text-gfm-dark">
            {formData.title || "Your fundraiser title"}
          </h3>

          {/* Goal */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gfm-green">
              ${goalDollars}
            </span>
            <span className="text-sm text-gfm-secondary">goal</span>
            {formData.isRecurring && (
              <span className="ml-2 px-2 py-0.5 bg-purple-50 text-gfm-purple text-xs font-medium rounded-full">
                Recurring
              </span>
            )}
          </div>

          {/* Progress bar (empty) */}
          <div className="w-full h-2 bg-gray-100 rounded-full">
            <div className="h-full w-0 bg-gfm-green rounded-full" />
          </div>

          {/* Description preview */}
          {formData.description && (
            <p className="text-sm text-gfm-secondary line-clamp-3">
              {formData.description}
            </p>
          )}

          {/* Organizer */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-gfm-secondary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gfm-dark">
                Organized by You
              </p>
              <p className="text-xs text-gfm-secondary">
                Fundraising for{" "}
                {formData.fundraisingFor === "yourself"
                  ? "yourself"
                  : formData.fundraisingFor === "someone_else"
                  ? "someone else"
                  : "charity"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
