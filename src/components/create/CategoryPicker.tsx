"use client";

interface CategoryPickerProps {
  selected: string;
  onSelect: (category: string) => void;
}

const CATEGORIES = [
  { id: "medical", label: "Medical", emoji: "\u{1F3E5}" },
  { id: "emergency", label: "Emergency", emoji: "\u{1F6A8}" },
  { id: "education", label: "Education", emoji: "\u{1F393}" },
  { id: "animals", label: "Animals", emoji: "\u{1F43E}" },
  { id: "environment", label: "Environment", emoji: "\u{1F33F}" },
  { id: "community", label: "Community", emoji: "\u{1F91D}" },
  { id: "business", label: "Business", emoji: "\u{1F4BC}" },
  { id: "faith", label: "Faith", emoji: "\u{1F54A}" },
  { id: "sports", label: "Sports", emoji: "\u{26BD}" },
  { id: "other", label: "Other", emoji: "\u{2728}" },
];

export function CategoryPicker({ selected, onSelect }: CategoryPickerProps) {
  return (
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
              ${
                isSelected
                  ? "border-gfm-green bg-green-50 shadow-md"
                  : "border-gray-200 bg-white"
              }
            `}
          >
            <span className="text-3xl">{cat.emoji}</span>
            <span
              className={`text-sm font-medium ${
                isSelected ? "text-gfm-dark-green" : "text-gfm-dark"
              }`}
            >
              {cat.label}
            </span>
            {isSelected && (
              <div className="w-5 h-5 bg-gfm-green rounded-full flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
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
  );
}
