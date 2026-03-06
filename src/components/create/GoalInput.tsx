"use client";

import { useState } from "react";

interface GoalInputProps {
  goal: number;
  onGoalChange: (goal: number) => void;
  isRecurring: boolean;
  onRecurringChange: (recurring: boolean) => void;
}

export function GoalInput({
  goal,
  onGoalChange,
  isRecurring,
  onRecurringChange,
}: GoalInputProps) {
  const [inputValue, setInputValue] = useState(
    goal > 0 ? (goal / 100).toLocaleString() : ""
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw === "") {
      setInputValue("");
      onGoalChange(0);
      return;
    }
    const num = parseInt(raw, 10);
    if (num <= 1000000) {
      setInputValue(num.toLocaleString());
      onGoalChange(num * 100); // store in cents
    }
  };

  const sliderValue = Math.min(goal / 100, 1000000);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value, 10);
    setInputValue(num.toLocaleString());
    onGoalChange(num * 100);
  };

  return (
    <div className="space-y-8">
      {/* Currency input */}
      <div className="flex items-center justify-center">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-4xl font-bold text-gfm-secondary">
            $
          </span>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="0"
            className="w-72 h-20 pl-12 pr-4 text-4xl font-bold text-center text-gfm-dark bg-white border-2 border-gray-200 rounded-2xl focus:border-gfm-green focus:ring-4 focus:ring-gfm-light-green focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Suggestion */}
      <p className="text-center text-gfm-secondary text-sm">
        Suggested goal:{" "}
        <span className="font-semibold text-gfm-dark">$2,500</span> based on
        similar fundraisers
      </p>

      {/* Slider */}
      <div className="max-w-md mx-auto space-y-2">
        <input
          type="range"
          min={100}
          max={1000000}
          step={100}
          value={sliderValue || 100}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
            [&::-webkit-slider-thumb]:bg-gfm-green [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
        />
        <div className="flex justify-between text-xs text-gfm-secondary">
          <span>$100</span>
          <span>$1,000,000</span>
        </div>
      </div>

      {/* Change later note */}
      <p className="text-center text-gfm-secondary text-sm">
        You can always change this later
      </p>

      {/* Recurring checkbox */}
      <label className="flex items-center gap-3 max-w-md mx-auto p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
        <input
          type="checkbox"
          checked={isRecurring}
          onChange={(e) => onRecurringChange(e.target.checked)}
          className="w-5 h-5 rounded border-gray-300 text-gfm-green focus:ring-gfm-green accent-gfm-green"
        />
        <div>
          <p className="text-sm font-medium text-gfm-dark">
            Make this a recurring campaign
          </p>
          <p className="text-xs text-gfm-secondary">
            Accept monthly donations from supporters
          </p>
        </div>
      </label>
    </div>
  );
}
