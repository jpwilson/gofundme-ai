"use client";

import { useState } from "react";

export function PhotoUpload() {
  const [hasPhoto, setHasPhoto] = useState(false);
  const [showTips, setShowTips] = useState(false);

  return (
    <div className="space-y-6">
      {/* Drop zone / preview */}
      {!hasPhoto ? (
        <div
          onClick={() => setHasPhoto(true)}
          className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-gfm-green hover:bg-green-50/50 transition-all cursor-pointer group"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gfm-light-green transition-colors">
              <svg
                className="w-8 h-8 text-gfm-secondary group-hover:text-gfm-green transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21zM8.25 8.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold text-gfm-dark">
                Drag and drop your photo here
              </p>
              <p className="text-sm text-gfm-secondary mt-1">
                or click to browse your files
              </p>
            </div>
            <button
              type="button"
              className="mt-2 px-6 py-2.5 bg-white border-2 border-gfm-green text-gfm-green rounded-full font-semibold text-sm hover:bg-gfm-green hover:text-white transition-all"
            >
              Choose a photo
            </button>
            <p className="text-xs text-gfm-secondary">
              JPG, PNG, or GIF. Max 20MB.
            </p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden bg-gray-100">
          {/* Placeholder image preview */}
          <div className="w-full aspect-video bg-gradient-to-br from-gfm-light-green via-green-100 to-emerald-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-10 h-10 text-gfm-green"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gfm-dark-green">
                Photo preview
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setHasPhoto(false)}
            className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Tips section */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowTips(!showTips)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <span className="text-sm font-medium text-gfm-dark">
            Tips for great fundraiser photos
          </span>
          <svg
            className={`w-5 h-5 text-gfm-secondary transition-transform duration-200 ${
              showTips ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {showTips && (
          <div className="px-4 py-3 space-y-2">
            <TipItem text="Use a high-quality, well-lit photo" />
            <TipItem text="Show the person or cause you are fundraising for" />
            <TipItem text="Avoid text overlays - let the image speak for itself" />
            <TipItem text="Horizontal photos work best for the cover" />
            <TipItem text="Photos with faces tend to receive more donations" />
          </div>
        )}
      </div>
    </div>
  );
}

function TipItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <svg
        className="w-4 h-4 text-gfm-green mt-0.5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 13l4 4L19 7"
        />
      </svg>
      <span className="text-sm text-gfm-secondary">{text}</span>
    </div>
  );
}
