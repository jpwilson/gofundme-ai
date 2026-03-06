"use client";

interface CommunityTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "activity", label: "Activity" },
  { id: "fundraisers", label: "Fundraisers" },
  { id: "about", label: "About" },
];

export function CommunityTabs({ activeTab, onTabChange }: CommunityTabsProps) {
  return (
    <div className="border-b border-gfm-border">
      <div className="mx-auto max-w-6xl px-4">
        <nav className="flex gap-8" aria-label="Community tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative pb-3 pt-4 text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? "text-gfm-dark"
                  : "text-gfm-secondary hover:text-gfm-dark"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-gfm-green" />
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
