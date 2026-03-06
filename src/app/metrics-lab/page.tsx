'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { donations, fundraisers, users, causes } from '@/lib/data/mock';
import { formatCurrency } from '@/lib/utils/format';

// ============================================================
// Mock extended data for richer visualizations
// ============================================================

// Generate a realistic donation timeline (hourly buckets over 30 days)
function generateDonationTimeline() {
  const timeline: { date: string; hour: number; amount: number; count: number }[] = [];
  const start = new Date('2025-01-12T00:00:00Z');
  for (let day = 0; day < 30; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const d = new Date(start);
      d.setDate(d.getDate() + day);
      d.setHours(hour);
      // Simulate realistic patterns: more donations during day, spikes after "social shares"
      const isDay = hour >= 8 && hour <= 22;
      const isSpike = (day === 0 && hour === 12) || (day === 3 && hour === 18) || (day === 7 && hour === 10) || (day === 14 && hour === 15) || (day === 21 && hour === 9);
      const base = isDay ? Math.random() * 3 : Math.random() * 0.5;
      const spike = isSpike ? 5 + Math.random() * 8 : 0;
      const count = Math.round(base + spike);
      const amount = count * (1500 + Math.round(Math.random() * 5000));
      if (count > 0) {
        timeline.push({
          date: d.toISOString().split('T')[0],
          hour,
          amount,
          count,
        });
      }
    }
  }
  return timeline;
}

// User giving history across categories (12 months of rich data)
const userGivingHistory = [
  { month: 'Apr 2025', emergency: 2000, animals: 1500, medical: 0, environment: 500, education: 0, community: 1000, faith: 0 },
  { month: 'May 2025', emergency: 0, animals: 2500, medical: 3000, environment: 0, education: 1500, community: 0, faith: 500 },
  { month: 'Jun 2025', emergency: 1000, animals: 1000, medical: 4000, environment: 2000, education: 0, community: 0, faith: 0 },
  { month: 'Jul 2025', emergency: 0, animals: 3500, medical: 0, environment: 3000, education: 1000, community: 500, faith: 0 },
  { month: 'Aug 2025', emergency: 6000, animals: 1000, medical: 0, environment: 0, education: 0, community: 2000, faith: 1000 },
  { month: 'Sep 2025', emergency: 5000, animals: 3000, medical: 0, environment: 2000, education: 0, community: 0, faith: 0 },
  { month: 'Oct 2025', emergency: 3000, animals: 2000, medical: 5000, environment: 0, education: 0, community: 0, faith: 0 },
  { month: 'Nov 2025', emergency: 0, animals: 4000, medical: 2000, environment: 3000, education: 1000, community: 0, faith: 0 },
  { month: 'Dec 2025', emergency: 8000, animals: 2000, medical: 0, environment: 0, education: 0, community: 3000, faith: 2000 },
  { month: 'Jan 2026', emergency: 4000, animals: 3000, medical: 2000, environment: 1000, education: 0, community: 0, faith: 0 },
  { month: 'Feb 2026', emergency: 2000, animals: 5000, medical: 3000, environment: 0, education: 0, community: 1000, faith: 0 },
  { month: 'Mar 2026', emergency: 3000, animals: 2000, medical: 1000, environment: 2500, education: 1500, community: 0, faith: 0 },
];

const tangibleImpacts = [
  { icon: '🐕', label: 'Dogs rescued', value: 12, color: '#FDE68A', detail: 'From 4 different shelters in LA county' },
  { icon: '🐱', label: 'Cats rehomed', value: 8, color: '#FED7AA', detail: 'Through foster-to-adoption programs' },
  { icon: '🏠', label: 'Families housed', value: 3, color: '#FCA5A5', detail: 'Temporary housing after wildfire displacement' },
  { icon: '🏥', label: 'Medical treatments', value: 7, color: '#93C5FD', detail: 'Including 2 cancer treatments and 3 surgeries' },
  { icon: '🌳', label: 'Trees planted', value: 150, color: '#6EE7B7', detail: 'In fire-affected areas of Angeles National Forest' },
  { icon: '📚', label: 'Students supported', value: 5, color: '#C4B5FD', detail: 'Scholarships for displaced students' },
  { icon: '🐾', label: 'Shelters supported', value: 4, color: '#FDBA74', detail: 'Pasadena, Burbank, Santa Monica, Long Beach' },
  { icon: '🍽️', label: 'Meals provided', value: 420, color: '#FCA5A5', detail: 'Through community kitchen fundraisers' },
  { icon: '🚒', label: 'Emergency kits', value: 35, color: '#F97316', detail: 'Distributed to first responders and families' },
  { icon: '👨‍👩‍👧', label: 'Lives impacted', value: 847, color: '#A5B4FC', detail: 'Across all campaigns you have supported' },
  { icon: '💊', label: 'Prescriptions covered', value: 14, color: '#FDA4AF', detail: 'For uninsured patients in cancer treatment' },
  { icon: '🏫', label: 'School supplies', value: 200, color: '#67E8F9', detail: 'Backpacks and supplies for displaced kids' },
];

// Individual donation log (50 entries for rich timeline data)
const donationLog = [
  { id: 1, date: '2025-04-03', campaign: 'Pasadena Animal Shelter Expansion', category: 'animals', amount: 1500, goalReached: false },
  { id: 2, date: '2025-04-12', campaign: 'Emergency Aid for Tornado Victims', category: 'emergency', amount: 2000, goalReached: true },
  { id: 3, date: '2025-04-20', campaign: 'Community Garden Project', category: 'community', amount: 1000, goalReached: false },
  { id: 4, date: '2025-05-05', campaign: 'Help Maria Beat Leukemia', category: 'medical', amount: 3000, goalReached: true },
  { id: 5, date: '2025-05-15', campaign: 'Stray Cat TNR Program', category: 'animals', amount: 2500, goalReached: false },
  { id: 6, date: '2025-05-22', campaign: 'STEM Scholarships for Underserved Youth', category: 'education', amount: 1500, goalReached: true },
  { id: 7, date: '2025-05-30', campaign: 'Local Church Roof Repair', category: 'faith', amount: 500, goalReached: false },
  { id: 8, date: '2025-06-08', campaign: 'Breast Cancer Research Fund', category: 'medical', amount: 4000, goalReached: true },
  { id: 9, date: '2025-06-15', campaign: 'Reforestation After Wildfire', category: 'environment', amount: 2000, goalReached: false },
  { id: 10, date: '2025-06-22', campaign: 'Flood Relief — South Texas', category: 'emergency', amount: 1000, goalReached: true },
  { id: 11, date: '2025-07-01', campaign: 'Wildlife Corridor Protection', category: 'animals', amount: 3500, goalReached: false },
  { id: 12, date: '2025-07-10', campaign: 'Ocean Cleanup Initiative', category: 'environment', amount: 3000, goalReached: true },
  { id: 13, date: '2025-07-18', campaign: 'Youth Soccer League Equipment', category: 'community', amount: 500, goalReached: true },
  { id: 14, date: '2025-07-25', campaign: 'Summer Reading Program', category: 'education', amount: 1000, goalReached: false },
  { id: 15, date: '2025-08-02', campaign: 'Hurricane Relief — Gulf Coast', category: 'emergency', amount: 6000, goalReached: true },
  { id: 16, date: '2025-08-10', campaign: 'Dog Rescue Transport Fund', category: 'animals', amount: 1000, goalReached: true },
  { id: 17, date: '2025-08-18', campaign: 'Neighborhood Watch Program', category: 'community', amount: 2000, goalReached: false },
  { id: 18, date: '2025-08-25', campaign: 'Temple Restoration Project', category: 'faith', amount: 1000, goalReached: false },
  { id: 19, date: '2025-09-03', campaign: 'LA Wildfire Family Aid', category: 'emergency', amount: 5000, goalReached: true },
  { id: 20, date: '2025-09-12', campaign: 'Feral Cat Colony Care', category: 'animals', amount: 3000, goalReached: false },
  { id: 21, date: '2025-09-20', campaign: 'Solar Panel Community Fund', category: 'environment', amount: 2000, goalReached: false },
  { id: 22, date: '2025-10-01', campaign: 'Childhood Cancer Treatment', category: 'medical', amount: 5000, goalReached: true },
  { id: 23, date: '2025-10-10', campaign: 'Rescue Horse Sanctuary', category: 'animals', amount: 2000, goalReached: true },
  { id: 24, date: '2025-10-20', campaign: 'Earthquake Preparedness Kits', category: 'emergency', amount: 3000, goalReached: false },
  { id: 25, date: '2025-11-01', campaign: 'Senior Meals on Wheels', category: 'community', amount: 0, goalReached: false },
  { id: 26, date: '2025-11-05', campaign: 'Animal Shelter Winter Fund', category: 'animals', amount: 4000, goalReached: true },
  { id: 27, date: '2025-11-12', campaign: 'Clean Water for Rural Schools', category: 'environment', amount: 3000, goalReached: true },
  { id: 28, date: '2025-11-20', campaign: 'Spinal Surgery for Baby James', category: 'medical', amount: 2000, goalReached: true },
  { id: 29, date: '2025-11-28', campaign: 'Music Education Program', category: 'education', amount: 1000, goalReached: false },
  { id: 30, date: '2025-12-01', campaign: 'Holiday Giving Drive', category: 'community', amount: 3000, goalReached: true },
  { id: 31, date: '2025-12-05', campaign: 'Winter Wildfire Recovery', category: 'emergency', amount: 8000, goalReached: false },
  { id: 32, date: '2025-12-12', campaign: 'Sanctuary for Displaced Pets', category: 'animals', amount: 2000, goalReached: true },
  { id: 33, date: '2025-12-18', campaign: 'Mosque Community Kitchen', category: 'faith', amount: 2000, goalReached: true },
  { id: 34, date: '2025-12-25', campaign: 'Christmas Toy Drive', category: 'community', amount: 0, goalReached: true },
  { id: 35, date: '2026-01-03', campaign: 'LA Wildfire Alerts & Recovery Fund', category: 'emergency', amount: 4000, goalReached: false },
  { id: 36, date: '2026-01-10', campaign: 'Stray Dog Rescue Network', category: 'animals', amount: 3000, goalReached: true },
  { id: 37, date: '2026-01-18', campaign: 'Physical Therapy for Veterans', category: 'medical', amount: 2000, goalReached: false },
  { id: 38, date: '2026-01-25', campaign: 'Community Garden Rebuild', category: 'environment', amount: 1000, goalReached: true },
  { id: 39, date: '2026-02-02', campaign: 'Help Sarah Fight Cancer', category: 'medical', amount: 3000, goalReached: false },
  { id: 40, date: '2026-02-08', campaign: 'LA Animal Rescue Fund', category: 'animals', amount: 5000, goalReached: false },
  { id: 41, date: '2026-02-15', campaign: 'Flood Barrier Fund', category: 'emergency', amount: 2000, goalReached: true },
  { id: 42, date: '2026-02-22', campaign: 'Youth Mentorship Program', category: 'community', amount: 1000, goalReached: false },
  { id: 43, date: '2026-03-01', campaign: 'Wildfire Season Prep Fund', category: 'emergency', amount: 3000, goalReached: false },
  { id: 44, date: '2026-03-03', campaign: 'Beach Cleanup Coalition', category: 'environment', amount: 2500, goalReached: true },
  { id: 45, date: '2026-03-04', campaign: 'Coding Bootcamp Scholarships', category: 'education', amount: 1500, goalReached: true },
  { id: 46, date: '2026-03-05', campaign: 'Cat Cafe Rescue Expansion', category: 'animals', amount: 2000, goalReached: false },
  { id: 47, date: '2026-03-05', campaign: 'Dialysis Treatment Fund', category: 'medical', amount: 1000, goalReached: false },
].filter(d => d.amount > 0);

// Campaign-level comparison data (for funnel/conversion metrics)
const campaignBenchmarks = [
  { name: 'LA Wildfire Recovery', views: 12400, shares: 890, donations: 187, avgDonation: 17350, daysToGoal: 45, goalPct: 70 },
  { name: 'Help Sarah Fight Cancer', views: 8900, shares: 620, donations: 187, avgDonation: 17350, daysToGoal: null, goalPct: 65 },
  { name: 'LA Animal Rescue', views: 5600, shares: 340, donations: 62, avgDonation: 12660, daysToGoal: 30, goalPct: 78 },
  { name: 'Malibu Family Assistance', views: 18200, shares: 1450, donations: 342, avgDonation: 13220, daysToGoal: 21, goalPct: 100 },
  { name: 'Palisades Rebuild', views: 15100, shares: 1100, donations: 298, avgDonation: 12990, daysToGoal: 28, goalPct: 100 },
];

const donorPersonality = {
  type: 'Emergency Responder',
  description: 'You tend to give most during crises and emergencies. Your quick response to urgent campaigns makes you a vital first responder in the giving community.',
  traits: [
    { label: 'Urgency Response', value: 92 },
    { label: 'Consistency', value: 78 },
    { label: 'Diversity', value: 65 },
    { label: 'Generosity', value: 85 },
  ],
};

const categoryColors: Record<string, string> = {
  emergency: '#f97316',
  animals: '#eab308',
  medical: '#ef4444',
  environment: '#22c55e',
  education: '#3b82f6',
  community: '#8b5cf6',
};

// ============================================================
// Collapsible Documentation Component
// ============================================================

function DocDropdown({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3 rounded-xl border border-[var(--gfm-purple)]/20 bg-[var(--gfm-purple)]/5 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-left"
      >
        <span className="flex items-center gap-2 text-xs font-semibold text-[var(--gfm-purple)]">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          {title}
        </span>
        <svg className={`h-4 w-4 text-[var(--gfm-purple)] transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[500px] pb-4' : 'max-h-0'}`}>
        <div className="px-4 text-xs text-[var(--gfm-secondary)] leading-relaxed space-y-2">
          {children}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Visualization Components
// ============================================================

function DonationTimelineChart() {
  const timeline = useMemo(() => generateDonationTimeline(), []);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Aggregate to daily
  const daily = useMemo(() => {
    const map = new Map<string, { date: string; amount: number; count: number }>();
    for (const entry of timeline) {
      const existing = map.get(entry.date);
      if (existing) {
        existing.amount += entry.amount;
        existing.count += entry.count;
      } else {
        map.set(entry.date, { ...entry });
      }
    }
    return Array.from(map.values());
  }, [timeline]);

  const maxCount = Math.max(...daily.map((d) => d.count));

  return (
    <div>
      <h3 className="text-lg font-bold text-[var(--gfm-dark)] mb-1">Donation Timeline</h3>
      <p className="text-sm text-[var(--gfm-secondary)] mb-6">When donations come in over time — reveals momentum patterns and social share spikes</p>

      <div className="flex items-end gap-[3px] h-48">
        {daily.map((day, i) => {
          const heightPct = (day.count / maxCount) * 100;
          const isHovered = hoveredDay === i;
          const isSpike = day.count > maxCount * 0.6;
          return (
            <div
              key={day.date}
              className="relative flex-1 group"
              onMouseEnter={() => setHoveredDay(i)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              {isHovered && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[var(--gfm-dark)] px-3 py-2 text-xs text-white shadow-lg z-10">
                  <p className="font-semibold">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  <p>{day.count} donations</p>
                  <p>{formatCurrency(day.amount)}</p>
                </div>
              )}
              <div
                className={`w-full rounded-t transition-all duration-200 cursor-pointer ${
                  isSpike
                    ? 'bg-gradient-to-t from-[var(--gfm-dark-green)] to-[var(--gfm-green)]'
                    : isHovered
                      ? 'bg-[var(--gfm-green)]'
                      : 'bg-[var(--gfm-green)]/30'
                }`}
                style={{ height: `${Math.max(heightPct, 2)}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-[10px] text-[var(--gfm-secondary)]">Jan 12</span>
        <span className="text-[10px] text-[var(--gfm-secondary)]">Jan 22</span>
        <span className="text-[10px] text-[var(--gfm-secondary)]">Feb 1</span>
        <span className="text-[10px] text-[var(--gfm-secondary)]">Feb 11</span>
      </div>
      <div className="mt-4 flex items-center gap-4 text-xs text-[var(--gfm-secondary)]">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-gradient-to-t from-[var(--gfm-dark-green)] to-[var(--gfm-green)]" />
          Social share spikes
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-[var(--gfm-green)]/30" />
          Regular donations
        </span>
      </div>
    </div>
  );
}

function DonationHeatmap() {
  const timeline = useMemo(() => generateDonationTimeline(), []);

  // Aggregate by day-of-week and hour
  const heatmap = useMemo(() => {
    const grid: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
    for (const entry of timeline) {
      const d = new Date(entry.date + 'T00:00:00Z');
      const dow = d.getUTCDay();
      grid[dow][entry.hour] += entry.count;
    }
    return grid;
  }, [timeline]);

  const maxVal = Math.max(...heatmap.flat());
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [hovered, setHovered] = useState<{ day: number; hour: number } | null>(null);

  return (
    <div>
      <h3 className="text-lg font-bold text-[var(--gfm-dark)] mb-1">Donation Heatmap</h3>
      <p className="text-sm text-[var(--gfm-secondary)] mb-6">Activity by day of week and time of day — helps optimize campaign promotion timing</p>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="flex gap-[2px]">
            <div className="w-10 shrink-0" />
            {Array.from({ length: 24 }, (_, h) => (
              <div key={h} className="flex-1 text-center text-[9px] text-[var(--gfm-secondary)]">
                {h % 4 === 0 ? `${h}:00` : ''}
              </div>
            ))}
          </div>
          {heatmap.map((row, dayIdx) => (
            <div key={dayIdx} className="flex gap-[2px] mt-[2px]">
              <div className="w-10 shrink-0 text-[10px] font-medium text-[var(--gfm-secondary)] flex items-center">{days[dayIdx]}</div>
              {row.map((val, hourIdx) => {
                const intensity = maxVal > 0 ? val / maxVal : 0;
                const isHov = hovered?.day === dayIdx && hovered?.hour === hourIdx;
                return (
                  <div
                    key={hourIdx}
                    className="flex-1 aspect-square rounded-sm cursor-pointer transition-transform"
                    style={{
                      backgroundColor: intensity > 0
                        ? `rgba(2, 169, 92, ${0.1 + intensity * 0.9})`
                        : 'var(--gfm-bg)',
                      transform: isHov ? 'scale(1.3)' : 'scale(1)',
                      zIndex: isHov ? 10 : 0,
                    }}
                    title={`${days[dayIdx]} ${hourIdx}:00 - ${val} donations`}
                    onMouseEnter={() => setHovered({ day: dayIdx, hour: hourIdx })}
                    onMouseLeave={() => setHovered(null)}
                  />
                );
              })}
            </div>
          ))}
          <div className="flex items-center justify-end gap-2 mt-3">
            <span className="text-[10px] text-[var(--gfm-secondary)]">Less</span>
            {[0.1, 0.3, 0.5, 0.7, 0.9].map((opacity) => (
              <div key={opacity} className="h-3 w-3 rounded-sm" style={{ backgroundColor: `rgba(2, 169, 92, ${opacity})` }} />
            ))}
            <span className="text-[10px] text-[var(--gfm-secondary)]">More</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryStackedChart() {
  const allCatKeys = ['emergency', 'animals', 'medical', 'environment', 'education', 'community', 'faith'] as const;
  type HistoryEntry = (typeof userGivingHistory)[number];
  const getVal = (m: HistoryEntry, k: string) => (m as unknown as Record<string, number>)[k] ?? 0;
  const maxTotal = Math.max(
    ...userGivingHistory.map((m) => allCatKeys.reduce((s, k) => s + getVal(m, k), 0))
  );
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  return (
    <div>
      <h3 className="text-lg font-bold text-[var(--gfm-dark)] mb-1">Giving by Category Over Time</h3>
      <p className="text-sm text-[var(--gfm-secondary)] mb-4">12 months of donations distributed across 7 cause categories</p>

      <div className="flex items-end gap-2 h-48">
        {userGivingHistory.map((month, i) => {
          const cats = allCatKeys
            .map((key) => ({ key, val: getVal(month, key), color: categoryColors[key] || '#ccc' }))
            .filter((c) => c.val > 0);
          const total = cats.reduce((s, c) => s + c.val, 0);

          return (
            <div
              key={month.month}
              className="flex-1 flex flex-col justify-end cursor-pointer"
              onMouseEnter={() => setHoveredMonth(i)}
              onMouseLeave={() => setHoveredMonth(null)}
            >
              {hoveredMonth === i && (
                <div className="text-center mb-2">
                  <span className="text-xs font-bold text-[var(--gfm-dark)]">{formatCurrency(total)}</span>
                </div>
              )}
              <div
                className="flex flex-col rounded-t-lg overflow-hidden transition-all duration-200"
                style={{
                  height: `${(total / maxTotal) * 100}%`,
                  transform: hoveredMonth === i ? 'scaleY(1.05)' : 'scaleY(1)',
                  transformOrigin: 'bottom',
                }}
              >
                {cats.map((c) => (
                  <div
                    key={c.key}
                    className="w-full"
                    style={{
                      height: `${(c.val / total) * 100}%`,
                      backgroundColor: c.color,
                    }}
                  />
                ))}
              </div>
              <span className="mt-2 text-[10px] text-[var(--gfm-secondary)] text-center truncate">
                {month.month.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {Object.entries(categoryColors).map(([key, color]) => (
          <span key={key} className="flex items-center gap-1.5 text-xs text-[var(--gfm-secondary)]">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </span>
        ))}
      </div>

      <DocDropdown title="About this visualization">
        <p><strong>Target page:</strong> User profile page</p>
        <p><strong>Data source:</strong> 12 months of giving history across 7 cause categories (emergency, animals, medical, environment, education, community, faith)</p>
        <p><strong>Purpose:</strong> Shows how a donor&apos;s interests shift over time. Useful for the AI Giving Agent to understand seasonal patterns (e.g., emergency spikes during wildfire/hurricane seasons).</p>
        <p><strong>Interaction:</strong> Hover to see monthly total. Stacked bars show category proportions.</p>
      </DocDropdown>
    </div>
  );
}

function DonationLogTimeline() {
  const [filter, setFilter] = useState<string>('all');
  const filtered = filter === 'all' ? donationLog : donationLog.filter((d) => d.category === filter);
  const categories = Array.from(new Set(donationLog.map((d) => d.category)));

  return (
    <div>
      <h3 className="text-lg font-bold text-[var(--gfm-dark)] mb-1">Donation Log</h3>
      <p className="text-sm text-[var(--gfm-secondary)] mb-4">{donationLog.length} donations across {categories.length} categories — your complete giving history</p>

      <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar pb-1">
        <button
          onClick={() => setFilter('all')}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filter === 'all' ? 'bg-[var(--gfm-green)] text-white' : 'border border-[var(--gfm-border)] text-[var(--gfm-secondary)] hover:border-[var(--gfm-green)]'}`}
        >
          All ({donationLog.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filter === cat ? 'bg-[var(--gfm-green)] text-white' : 'border border-[var(--gfm-border)] text-[var(--gfm-secondary)] hover:border-[var(--gfm-green)]'}`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)} ({donationLog.filter((d) => d.category === cat).length})
          </button>
        ))}
      </div>

      <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
        {filtered.map((donation) => (
          <div
            key={donation.id}
            className="flex items-center gap-3 rounded-xl border border-[var(--gfm-border)] bg-white p-3 hover:shadow-sm transition-shadow"
          >
            <div
              className="h-10 w-1 rounded-full shrink-0"
              style={{ backgroundColor: categoryColors[donation.category] || '#ccc' }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--gfm-dark)] truncate">{donation.campaign}</p>
              <p className="text-xs text-[var(--gfm-secondary)]">
                {new Date(donation.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                {donation.goalReached && (
                  <span className="ml-2 text-[var(--gfm-green)] font-medium">Goal reached</span>
                )}
              </p>
            </div>
            <span className="text-sm font-bold text-[var(--gfm-dark)] shrink-0">{formatCurrency(donation.amount)}</span>
          </div>
        ))}
      </div>

      <DocDropdown title="About this visualization">
        <p><strong>Target page:</strong> User profile page (activity tab)</p>
        <p><strong>Data source:</strong> {donationLog.length} individual donations with campaign names, dates, categories, amounts, and goal-reached flags</p>
        <p><strong>Purpose:</strong> Complete chronological record of all giving. Filterable by category. Shows which campaigns the user helped reach their goal.</p>
        <p><strong>Interaction:</strong> Category filter pills, scrollable list, goal-reached badge</p>
      </DocDropdown>
    </div>
  );
}

function ConversionFunnelChart() {
  return (
    <div>
      <h3 className="text-lg font-bold text-[var(--gfm-dark)] mb-1">Campaign Conversion Funnel</h3>
      <p className="text-sm text-[var(--gfm-secondary)] mb-4">Views → Shares → Donations for top campaigns — shows share-to-donation effectiveness</p>

      <div className="space-y-4">
        {campaignBenchmarks.map((campaign) => {
          const shareRate = ((campaign.shares / campaign.views) * 100).toFixed(1);
          const donationRate = ((campaign.donations / campaign.views) * 100).toFixed(1);
          const maxViews = Math.max(...campaignBenchmarks.map((c) => c.views));
          return (
            <div key={campaign.name} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--gfm-dark)] truncate pr-2">{campaign.name}</span>
                {campaign.goalPct >= 100 && (
                  <span className="shrink-0 text-[10px] font-bold text-[var(--gfm-green)] bg-[var(--gfm-green)]/10 px-2 py-0.5 rounded-full">FUNDED</span>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[var(--gfm-secondary)] w-14 shrink-0">Views</span>
                  <div className="flex-1 h-4 rounded-full bg-[var(--gfm-bg)] overflow-hidden">
                    <div className="h-full rounded-full bg-blue-400/60" style={{ width: `${(campaign.views / maxViews) * 100}%` }} />
                  </div>
                  <span className="text-[10px] text-[var(--gfm-secondary)] w-14 text-right">{campaign.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[var(--gfm-secondary)] w-14 shrink-0">Shares</span>
                  <div className="flex-1 h-4 rounded-full bg-[var(--gfm-bg)] overflow-hidden">
                    <div className="h-full rounded-full bg-purple-400/60" style={{ width: `${(campaign.shares / maxViews) * 100}%` }} />
                  </div>
                  <span className="text-[10px] text-[var(--gfm-secondary)] w-14 text-right">{campaign.shares.toLocaleString()} ({shareRate}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[var(--gfm-secondary)] w-14 shrink-0">Donations</span>
                  <div className="flex-1 h-4 rounded-full bg-[var(--gfm-bg)] overflow-hidden">
                    <div className="h-full rounded-full bg-[var(--gfm-green)]/60" style={{ width: `${(campaign.donations / maxViews) * 100}%` }} />
                  </div>
                  <span className="text-[10px] text-[var(--gfm-secondary)] w-14 text-right">{campaign.donations.toLocaleString()} ({donationRate}%)</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <DocDropdown title="About this visualization">
        <p><strong>Target page:</strong> Fundraiser detail page (organizer analytics view)</p>
        <p><strong>Data source:</strong> 5 campaigns with views, shares, donations, average donation size, and goal completion data</p>
        <p><strong>Purpose:</strong> Helps organizers understand their campaign&apos;s conversion funnel. A low share-to-donation rate might indicate the landing page needs work. A high share rate shows strong social amplification.</p>
        <p><strong>Key insight:</strong> Each GoFundMe share generates ~$13-15 in donations (company stat). This visualization lets organizers see their own share effectiveness.</p>
      </DocDropdown>
    </div>
  );
}

function CumulativeGivingChart() {
  const cumulative = useMemo(() => {
    return donationLog.reduce<Array<{ date: string; total: number; campaign: string }>>((acc, d) => {
      const prevTotal = acc.length > 0 ? acc[acc.length - 1].total : 0;
      acc.push({ date: d.date, total: prevTotal + d.amount, campaign: d.campaign });
      return acc;
    }, []);
  }, []);

  const maxTotal = cumulative[cumulative.length - 1]?.total || 0;
  const width = 600;
  const height = 180;
  const padding = { top: 10, right: 10, bottom: 30, left: 50 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  const points = cumulative.map((d, i) => {
    const x = padding.left + (i / Math.max(cumulative.length - 1, 1)) * plotW;
    const y = padding.top + plotH - (d.total / maxTotal) * plotH;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + plotH} L ${points[0].x} ${padding.top + plotH} Z`;

  return (
    <div>
      <h3 className="text-lg font-bold text-[var(--gfm-dark)] mb-1">Cumulative Giving</h3>
      <p className="text-sm text-[var(--gfm-secondary)] mb-4">Your total giving over time — {formatCurrency(maxTotal)} across {donationLog.length} donations</p>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        <defs>
          <linearGradient id="cum-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--gfm-green)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--gfm-green)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const y = padding.top + plotH - pct * plotH;
          return (
            <g key={pct}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="var(--gfm-border)" strokeWidth="1" strokeDasharray="4 4" />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" className="text-[10px] fill-[var(--gfm-secondary)]">
                ${Math.round((maxTotal * pct) / 100)}
              </text>
            </g>
          );
        })}
        <path d={areaPath} fill="url(#cum-gradient)" />
        <path d={linePath} fill="none" stroke="var(--gfm-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="var(--gfm-green)" />
        ))}
        {/* X axis dates */}
        {[0, Math.floor(points.length / 4), Math.floor(points.length / 2), Math.floor(3 * points.length / 4), points.length - 1].map((idx) => {
          const p = points[idx];
          if (!p) return null;
          return (
            <text key={idx} x={p.x} y={height - 5} textAnchor="middle" className="text-[10px] fill-[var(--gfm-secondary)]">
              {new Date(p.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
            </text>
          );
        })}
      </svg>

      <DocDropdown title="About this visualization">
        <p><strong>Target page:</strong> User profile page (impact section) or AI Giving Agent dashboard</p>
        <p><strong>Data source:</strong> {donationLog.length} donations from Apr 2025 to Mar 2026 totaling {formatCurrency(maxTotal)}</p>
        <p><strong>Purpose:</strong> Shows the donor&apos;s giving trajectory. Steeper slopes indicate periods of higher giving activity. Useful for showing personal growth and motivating continued generosity.</p>
        <p><strong>Interaction:</strong> Each dot represents an individual donation. The step-like pattern shows how each donation contributes to the total.</p>
      </DocDropdown>
    </div>
  );
}

function TangibleImpactGrid() {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <h3 className="text-lg font-bold text-[var(--gfm-dark)] mb-1">Tangible Impact</h3>
      <p className="text-sm text-[var(--gfm-secondary)] mb-6">Real-world outcomes your donations have helped achieve</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {tangibleImpacts.map((impact, i) => (
          <div
            key={impact.label}
            className="rounded-2xl border border-[var(--gfm-border)] bg-white p-5 text-center transition-all duration-500 hover:shadow-lg hover:-translate-y-1"
            style={{
              opacity: animated ? 1 : 0,
              transform: animated ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: `${i * 100}ms`,
            }}
          >
            <div
              className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
              style={{ backgroundColor: impact.color }}
            >
              {impact.icon}
            </div>
            <p className="text-3xl font-bold text-[var(--gfm-dark)]">{impact.value}</p>
            <p className="mt-1 text-sm text-[var(--gfm-secondary)]">{impact.label}</p>
            <p className="mt-0.5 text-[10px] text-[var(--gfm-secondary)]/70 leading-tight">{impact.detail}</p>
          </div>
        ))}
      </div>

      <DocDropdown title="About this visualization">
        <p><strong>Target page:</strong> User profile page (impact highlights section)</p>
        <p><strong>Data source:</strong> {tangibleImpacts.length} tangible impact metrics with specific details (e.g., &quot;12 dogs rescued from 4 shelters in LA county&quot;)</p>
        <p><strong>Purpose:</strong> Translates dollar amounts into real-world outcomes people can relate to. Much more motivating than just showing &quot;$500 donated&quot; — instead show &quot;12 dogs rescued.&quot;</p>
        <p><strong>Challenge:</strong> These metrics would need campaign organizers to report outcomes. Could be self-reported or estimated based on campaign type and goal.</p>
      </DocDropdown>
    </div>
  );
}

function GivingPersonalityCard() {
  return (
    <div>
      <h3 className="text-lg font-bold text-[var(--gfm-dark)] mb-1">Giving Personality</h3>
      <p className="text-sm text-[var(--gfm-secondary)] mb-6">Based on your giving patterns, here is your donor profile</p>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(145deg, #02a95c 0%, #017a3e 50%, #015e30 100%)' }}>
        <div className="relative p-6 text-white">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute bottom-0 left-1/4 h-32 w-32 rounded-full bg-white/5 blur-3xl" />
          </div>
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Your Type</p>
            <h4 className="text-2xl font-bold mb-2">{donorPersonality.type}</h4>
            <p className="text-sm text-white/80 leading-relaxed mb-6">{donorPersonality.description}</p>
            <div className="space-y-3">
              {donorPersonality.traits.map((trait) => (
                <div key={trait.label}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-white/90">{trait.label}</span>
                    <span className="text-white/60">{trait.value}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/15">
                    <div
                      className="h-full rounded-full bg-white/80 transition-all duration-1000"
                      style={{ width: `${trait.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function seededVelocity(day: number): number {
  if (day === 0) return 8;
  if (day === 1) return 12;
  if (day === 2) return 6;
  if (day < 7) return 3 + ((day * 7 + 3) % 10) / 5;
  if (day === 7) return 9;
  if (day < 14) return 2 + ((day * 13 + 5) % 10) / 6.7;
  if (day === 14) return 7;
  if (day < 21) return 1.5 + ((day * 17 + 7) % 10) / 10;
  return 0.8 + ((day * 23 + 11) % 10) / 20;
}

function CampaignVelocityChart() {
  const velocityData = useMemo(() => {
    return Array.from({ length: 30 }, (_, day) => ({
      day,
      velocity: Math.round(seededVelocity(day) * 10) / 10,
    }));
  }, []);

  const maxV = Math.max(...velocityData.map((d) => d.velocity));

  // Build SVG path
  const width = 600;
  const height = 160;
  const padding = { top: 10, right: 10, bottom: 30, left: 40 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  const points = velocityData.map((d, i) => {
    const x = padding.left + (i / (velocityData.length - 1)) * plotW;
    const y = padding.top + plotH - (d.velocity / maxV) * plotH;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + plotH} L ${points[0].x} ${padding.top + plotH} Z`;

  return (
    <div>
      <h3 className="text-lg font-bold text-[var(--gfm-dark)] mb-1">Donation Velocity</h3>
      <p className="text-sm text-[var(--gfm-secondary)] mb-6">Donations per hour over campaign lifetime — spikes indicate social share moments</p>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        <defs>
          <linearGradient id="vel-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--gfm-green)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--gfm-green)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* Y axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const y = padding.top + plotH - pct * plotH;
          const val = Math.round(maxV * pct);
          return (
            <g key={pct}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="var(--gfm-border)" strokeWidth="1" strokeDasharray="4 4" />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" className="text-[10px] fill-[var(--gfm-secondary)]">{val}</text>
            </g>
          );
        })}
        {/* Area */}
        <path d={areaPath} fill="url(#vel-gradient)" />
        {/* Line */}
        <path d={linePath} fill="none" stroke="var(--gfm-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Spike annotations */}
        {points.filter((p) => p.velocity > maxV * 0.6).map((p) => (
          <g key={p.day}>
            <circle cx={p.x} cy={p.y} r="4" fill="var(--gfm-green)" />
            <circle cx={p.x} cy={p.y} r="7" fill="var(--gfm-green)" opacity="0.2" />
          </g>
        ))}
        {/* X axis */}
        {[0, 7, 14, 21, 29].map((day) => {
          const x = padding.left + (day / 29) * plotW;
          return (
            <text key={day} x={x} y={height - 5} textAnchor="middle" className="text-[10px] fill-[var(--gfm-secondary)]">
              Day {day + 1}
            </text>
          );
        })}
      </svg>
      <p className="text-xs text-[var(--gfm-secondary)] mt-2 italic">Green dots indicate viral moments from social sharing</p>

      <DocDropdown title="About this visualization">
        <p><strong>Target page:</strong> Fundraiser detail page (organizer analytics)</p>
        <p><strong>Data source:</strong> 30 days of simulated donation velocity with realistic patterns: launch spike (day 1-2), social share spikes (days 7, 14), and gradual decline</p>
        <p><strong>Purpose:</strong> Helps organizers identify when their campaign has momentum and when they need to re-share. Viral moments are annotated with green dots.</p>
        <p><strong>Key insight:</strong> Most campaigns see 70% of donations in the first 5 days and after social shares. This chart helps organizers time their promotion strategy.</p>
      </DocDropdown>
    </div>
  );
}

function DonorGeographicMap() {
  // Simple US regions with mock data
  const regions = [
    { name: 'West Coast', donations: 45, amount: 8500000, x: 15, y: 40 },
    { name: 'Southwest', donations: 12, amount: 240000, x: 25, y: 60 },
    { name: 'Midwest', donations: 18, amount: 360000, x: 50, y: 35 },
    { name: 'Southeast', donations: 22, amount: 440000, x: 65, y: 60 },
    { name: 'Northeast', donations: 35, amount: 700000, x: 75, y: 25 },
  ];
  const maxDonations = Math.max(...regions.map((r) => r.donations));
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  return (
    <div>
      <h3 className="text-lg font-bold text-[var(--gfm-dark)] mb-1">Donor Geography</h3>
      <p className="text-sm text-[var(--gfm-secondary)] mb-6">Where donations are coming from across the country</p>

      <div className="relative h-64 rounded-2xl bg-[var(--gfm-bg)] border border-[var(--gfm-border)] overflow-hidden">
        {/* Simple US outline hint */}
        <div className="absolute inset-4 rounded-xl border border-dashed border-[var(--gfm-border)]" />
        {regions.map((region) => {
          const size = 24 + (region.donations / maxDonations) * 48;
          const isHovered = hoveredRegion === region.name;
          return (
            <div
              key={region.name}
              className="absolute flex items-center justify-center cursor-pointer transition-all duration-300"
              style={{
                left: `${region.x}%`,
                top: `${region.y}%`,
                transform: `translate(-50%, -50%) scale(${isHovered ? 1.2 : 1})`,
              }}
              onMouseEnter={() => setHoveredRegion(region.name)}
              onMouseLeave={() => setHoveredRegion(null)}
            >
              <div
                className="rounded-full bg-[var(--gfm-green)] transition-all duration-300"
                style={{
                  width: size,
                  height: size,
                  opacity: isHovered ? 0.9 : 0.4,
                }}
              />
              {isHovered && (
                <div className="absolute bottom-full mb-2 whitespace-nowrap rounded-lg bg-[var(--gfm-dark)] px-3 py-2 text-xs text-white shadow-lg z-10">
                  <p className="font-bold">{region.name}</p>
                  <p>{region.donations} donations</p>
                  <p>{formatCurrency(region.amount)}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// Main Page
// ============================================================

export default function MetricsLabPage() {
  return (
    <div className="min-h-screen bg-[var(--gfm-bg)]">
      {/* Header */}
      <div className="border-b border-[var(--gfm-border)] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gfm-purple)]/10">
              <svg className="h-5 w-5 text-[var(--gfm-purple)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--gfm-dark)]">Metrics Lab</h1>
              <p className="text-sm text-[var(--gfm-secondary)]">
                Experimental visualizations — the best ones will be promoted to main pages
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        {/* Section: Campaign Analytics */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--gfm-purple)] mb-4">Campaign Analytics</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-[var(--gfm-border)] bg-white p-6 shadow-sm">
              <DonationTimelineChart />
            </div>
            <div className="rounded-2xl border border-[var(--gfm-border)] bg-white p-6 shadow-sm">
              <CampaignVelocityChart />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--gfm-border)] bg-white p-6 shadow-sm">
          <DonationHeatmap />
        </div>

        {/* Section: Donor Profile Metrics */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--gfm-purple)] mb-4">Donor Profile Metrics</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-[var(--gfm-border)] bg-white p-6 shadow-sm">
              <CategoryStackedChart />
            </div>
            <div className="rounded-2xl border border-[var(--gfm-border)] bg-white p-6 shadow-sm">
              <GivingPersonalityCard />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--gfm-border)] bg-white p-6 shadow-sm">
          <TangibleImpactGrid />
        </div>

        {/* Section: Giving History & Conversion */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--gfm-purple)] mb-4">Giving History & Conversion</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-[var(--gfm-border)] bg-white p-6 shadow-sm">
              <DonationLogTimeline />
            </div>
            <div className="rounded-2xl border border-[var(--gfm-border)] bg-white p-6 shadow-sm">
              <ConversionFunnelChart />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--gfm-border)] bg-white p-6 shadow-sm">
          <CumulativeGivingChart />
        </div>

        {/* Section: Geographic */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--gfm-purple)] mb-4">Geographic & Community</h2>
        </div>

        <div className="rounded-2xl border border-[var(--gfm-border)] bg-white p-6 shadow-sm">
          <DonorGeographicMap />
        </div>

        {/* Notes */}
        <div className="rounded-2xl border border-dashed border-[var(--gfm-purple)]/30 bg-[var(--gfm-purple)]/5 p-6">
          <h3 className="font-bold text-[var(--gfm-dark)] mb-2">About this page</h3>
          <p className="text-sm text-[var(--gfm-secondary)] leading-relaxed">
            This is an experimental metrics sandbox. Each visualization above is a candidate for promotion to one of the main pages:
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-[var(--gfm-secondary)]">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--gfm-green)]" />
              <strong>Donation Timeline + Velocity + Heatmap</strong> → Fundraiser detail page (organizer view)
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--gfm-green)]" />
              <strong>Category Stacked Chart + Tangible Impact</strong> → User profile page
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--gfm-green)]" />
              <strong>Giving Personality Card</strong> → AI Giving Agent dashboard or profile
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--gfm-green)]" />
              <strong>Donor Geography Map</strong> → Community page or fundraiser detail
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
