"use client";

import { useState } from "react";

interface StoryEditorProps {
  title: string;
  onTitleChange: (title: string) => void;
  description: string;
  onDescriptionChange: (description: string) => void;
}

const AI_TITLE_SUGGESTIONS = [
  "Help Me Get Back on My Feet",
  "Together We Can Make a Difference",
  "Every Dollar Brings Hope",
];

const AI_STORY_EXAMPLE = `Hi, my name is [Your Name], and I'm reaching out to ask for your support during a challenging time in my life.

Like many people, I've faced unexpected circumstances that have made it difficult to cover essential expenses. Despite my best efforts, the costs have become overwhelming, and I need help from my community.

Your generous contribution will go directly toward [describe what the funds will be used for]. Every dollar makes a real difference and brings me one step closer to [describe your goal or outcome].

I am incredibly grateful for any support you can offer, whether it's a donation or simply sharing this fundraiser with others. Together, we can make a real impact.

Thank you from the bottom of my heart for your kindness and generosity.`;

export function StoryEditor({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
}: StoryEditorProps) {
  const [showTitleSuggestions, setShowTitleSuggestions] = useState(false);
  const [showAiStory, setShowAiStory] = useState(false);
  const maxTitleLength = 100;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gfm-dark mb-2">
          Fundraiser title
        </label>
        <div className="relative">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              if (e.target.value.length <= maxTitleLength) {
                onTitleChange(e.target.value);
              }
            }}
            placeholder="Give your fundraiser a title..."
            className="w-full h-12 px-4 text-gfm-dark bg-white border-2 border-gray-200 rounded-xl focus:border-gfm-green focus:ring-4 focus:ring-gfm-light-green focus:outline-none transition-all"
          />
          <span
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${
              title.length >= maxTitleLength
                ? "text-red-500 font-semibold"
                : "text-gfm-secondary"
            }`}
          >
            {title.length}/{maxTitleLength}
          </span>
        </div>

        {/* AI title suggestions */}
        <button
          type="button"
          onClick={() => setShowTitleSuggestions(!showTitleSuggestions)}
          className="mt-2 inline-flex items-center gap-1.5 text-sm text-gfm-purple hover:text-gfm-purple/80 font-medium transition-colors cursor-pointer"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
            />
          </svg>
          AI-suggested titles
        </button>

        {showTitleSuggestions && (
          <div className="mt-2 space-y-2">
            {AI_TITLE_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  onTitleChange(suggestion);
                  setShowTitleSuggestions(false);
                }}
                className="block w-full text-left px-4 py-2.5 text-sm bg-purple-50 text-gfm-purple rounded-lg hover:bg-purple-100 transition-colors cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gfm-dark mb-2">
          Your story
        </label>
        <div className="relative">
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Tell potential donors why you are fundraising. A good story helps people connect with your cause..."
            rows={8}
            className="w-full px-4 py-3 text-gfm-dark bg-white border-2 border-gray-200 rounded-xl focus:border-gfm-green focus:ring-4 focus:ring-gfm-light-green focus:outline-none transition-all resize-y"
          />
          <span className="absolute right-3 bottom-3 text-xs text-gfm-secondary">
            {description.length} characters
          </span>
        </div>

        {/* AI story help */}
        <button
          type="button"
          onClick={() => {
            if (!showAiStory) {
              setShowAiStory(true);
            } else {
              onDescriptionChange(AI_STORY_EXAMPLE);
              setShowAiStory(false);
            }
          }}
          className="mt-2 inline-flex items-center gap-1.5 text-sm text-gfm-purple hover:text-gfm-purple/80 font-medium transition-colors cursor-pointer"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
            />
          </svg>
          {showAiStory ? "Use this story" : "Let AI help write your story"}
        </button>

        {showAiStory && (
          <div className="mt-2 p-4 bg-purple-50 rounded-xl border border-purple-200">
            <p className="text-xs text-gfm-purple font-medium mb-2">
              AI-generated draft:
            </p>
            <p className="text-sm text-gfm-dark whitespace-pre-line leading-relaxed">
              {AI_STORY_EXAMPLE}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
