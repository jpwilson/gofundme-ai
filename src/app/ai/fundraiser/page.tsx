'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { fundraisers, getDonationsByFundraiserId } from '@/lib/data/mock';
import { IMAGES } from '@/lib/data/images';
import { formatCurrency, formatNumber } from '@/lib/utils/format';
import {
  Heart, Share2, Shield, Clock, TrendingUp, Eye, MessageCircle,
  Image as ImageIcon, Copy, CheckCircle2, ArrowUpRight,
} from 'lucide-react';

const fundraiser = fundraisers[0];
const allDonations = getDonationsByFundraiserId(fundraiser.id);
const progress = Math.min(100, Math.round((fundraiser.raisedAmount / fundraiser.goalAmount) * 100));

// Smart ask amounts derived from donation patterns
const medianDonation = (() => {
  const sorted = [...allDonations].sort((a, b) => a.amount - b.amount);
  return sorted[Math.floor(sorted.length / 2)]?.amount || 5000;
})();
const smartAmounts = [
  Math.round(medianDonation * 0.5 / 500) * 500,
  Math.round(medianDonation / 500) * 500,
  Math.round(medianDonation * 2 / 500) * 500,
  Math.round(medianDonation * 5 / 500) * 500,
].map((a) => Math.max(a, 1000));

// Goal confidence based on similar campaigns
const goalConfidence = {
  low: Math.round(fundraiser.goalAmount * 0.6),
  mid: Math.round(fundraiser.goalAmount * 1.1),
  high: Math.round(fundraiser.goalAmount * 1.8),
  percentile: 72,
};

// Story quality signals
const storySignals = [
  { label: 'Emotional resonance', score: 88, tip: 'Your personal connection comes through strongly' },
  { label: 'Specificity', score: 92, tip: 'Good use of specific numbers and details' },
  { label: 'Call to action', score: 65, tip: 'Consider adding a specific ask at the end' },
  { label: 'Update frequency', score: 45, tip: 'Campaigns with weekly updates raise 2x more' },
];

// Headline alternatives
const headlines = [
  { text: fundraiser.title, label: 'Current', selected: true },
  { text: 'Help LA Families Rebuild After the Wildfires', label: 'Empathy-focused' },
  { text: 'Every Alert Saves Lives — Fund Wildfire Safety for LA', label: 'Impact-focused' },
];

// Simulated real-time signals
const recentViewers = 47;
const trendingIn = 'Los Angeles';

// Share kit
const shareTemplates = {
  twitter: `${fundraiser.title} — every dollar helps families rebuild. Please share if you can. 🙏`,
  instagram: `I'm supporting wildfire recovery in LA. This fund helps families who lost everything — and keeps real-time alert systems running to protect more lives.\n\nLink in bio to donate. Even $25 makes a difference. 💚`,
  whatsapp: `Hey — sharing this fundraiser for LA wildfire recovery. The organizer is doing incredible work providing real-time alerts and direct family support. If you can chip in, here's the link:`,
};

// Media scoring (simulated)
const mediaScores = [
  { label: 'Cover photo', score: 82, note: 'Strong emotional impact — faces increase engagement by 38%' },
  { label: 'Photo 2', score: 74, note: 'Good context shot — shows the community impact' },
  { label: 'Photo 3', score: 68, note: 'Consider a closer crop to increase connection' },
];

export default function SmartFundraiserPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(smartAmounts[1]);
  const [copied, setCopied] = useState<string | null>(null);
  const [showUpdateDraft, setShowUpdateDraft] = useState(false);
  const viewerCountRef = useRef(recentViewers);
  const [viewers, setViewers] = useState(recentViewers);

  // Simulate fluctuating viewer count
  useEffect(() => {
    const interval = setInterval(() => {
      viewerCountRef.current += Math.floor(Math.random() * 5) - 2;
      viewerCountRef.current = Math.max(30, Math.min(70, viewerCountRef.current));
      setViewers(viewerCountRef.current);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (text: string, platform: string) => {
    navigator.clipboard.writeText(text);
    setCopied(platform);
    setTimeout(() => setCopied(null), 2000);
  };

  const [daysSinceUpdate] = useState(() => Math.floor((Date.now() - new Date(fundraiser.updatedAt).getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
      {/* Title */}
      <h1 className="mb-2 text-2xl font-bold text-gfm-dark md:text-3xl leading-tight">
        {fundraiser.title}
      </h1>

      {/* Social proof bar */}
      <div className="flex items-center gap-4 mb-6 text-sm text-gfm-secondary flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gfm-green animate-pulse" />
          <Eye className="h-3.5 w-3.5" />
          {viewers} people viewing right now
        </span>
        <span className="flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5" />
          Trending in {trendingIn}
        </span>
        <span className="flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5 text-gfm-green" />
          Verified organizer
        </span>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left column */}
        <div className="w-full space-y-6 lg:w-[60%]">
          {/* Image with media score */}
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-gfm-bg to-gfm-border aspect-video">
            <img src={fundraiser.coverImageUrl} alt={fundraiser.title} className="absolute inset-0 w-full h-full object-cover" />
            {/* Photo performance hint */}
            <button
              onClick={() => setActiveSection(activeSection === 'media' ? null : 'media')}
              className="absolute bottom-3 right-3 rounded-lg bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-gfm-dark shadow-sm hover:bg-white transition-colors"
            >
              <ImageIcon className="h-3.5 w-3.5 inline mr-1" />
              Photo tips
            </button>
          </div>

          {/* Media Advisor (expandable) */}
          {activeSection === 'media' && (
            <div className="rounded-xl border border-gfm-border p-5 animate-in slide-in-from-top-2 duration-200">
              <h3 className="font-bold text-gfm-dark mb-3">Photo Performance</h3>
              <div className="space-y-3">
                {mediaScores.map((photo, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={i === 0 ? fundraiser.coverImageUrl : IMAGES.wildfire.gallery[i - 1] || fundraiser.coverImageUrl} alt={photo.label} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gfm-dark">{photo.label}</span>
                        <span className={`text-sm font-bold ${photo.score >= 80 ? 'text-gfm-green' : photo.score >= 70 ? 'text-amber-500' : 'text-gfm-secondary'}`}>
                          {photo.score}/100
                        </span>
                      </div>
                      <div className="h-1.5 bg-gfm-bg rounded-full overflow-hidden mb-1">
                        <div className={`h-full rounded-full ${photo.score >= 80 ? 'bg-gfm-green' : photo.score >= 70 ? 'bg-amber-400' : 'bg-gfm-secondary'}`} style={{ width: `${photo.score}%` }} />
                      </div>
                      <p className="text-[10px] text-gfm-secondary">{photo.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Campaign Story */}
          <div className="rounded-xl border border-gfm-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gfm-dark">Campaign Story</h2>
              <button
                onClick={() => setActiveSection(activeSection === 'story' ? null : 'story')}
                className="text-xs text-gfm-green font-medium hover:text-gfm-dark-green transition-colors"
              >
                Story insights
              </button>
            </div>
            <div className="whitespace-pre-line text-sm text-gfm-secondary leading-relaxed">
              {fundraiser.description}
            </div>
          </div>

          {/* Story Quality Signals (expandable) */}
          {activeSection === 'story' && (
            <div className="rounded-xl border border-gfm-border p-5 animate-in slide-in-from-top-2 duration-200">
              <h3 className="font-bold text-gfm-dark mb-1">Story Quality</h3>
              <p className="text-xs text-gfm-secondary mb-4">How your story performs on key engagement signals</p>
              <div className="space-y-3">
                {storySignals.map((signal) => (
                  <div key={signal.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gfm-dark">{signal.label}</span>
                      <span className={`text-sm font-bold ${signal.score >= 80 ? 'text-gfm-green' : signal.score >= 60 ? 'text-amber-500' : 'text-red-400'}`}>
                        {signal.score}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gfm-bg rounded-full overflow-hidden mb-1">
                      <div className={`h-full rounded-full transition-all duration-700 ${signal.score >= 80 ? 'bg-gfm-green' : signal.score >= 60 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${signal.score}%` }} />
                    </div>
                    <p className="text-[10px] text-gfm-secondary">{signal.tip}</p>
                  </div>
                ))}
              </div>

              {/* Headline Alternatives */}
              <div className="mt-6 pt-4 border-t border-gfm-border">
                <h4 className="text-sm font-bold text-gfm-dark mb-3">Suggested alternatives</h4>
                <div className="space-y-2">
                  {headlines.map((h, i) => (
                    <div
                      key={i}
                      className={`rounded-lg border p-3 cursor-pointer transition-all ${
                        h.selected ? 'border-gfm-green bg-green-50/50' : 'border-gfm-border hover:border-gfm-green/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gfm-dark">{h.text}</span>
                        {h.selected && <CheckCircle2 className="h-4 w-4 text-gfm-green flex-shrink-0" />}
                      </div>
                      <span className="text-[10px] text-gfm-secondary">{h.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Momentum Alert */}
          {progress > 20 && progress < 80 && (
            <div className="rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gfm-dark">
                    <strong>You&apos;re {progress}% of the way there.</strong> Campaigns that share an update at this point raise 40% more on average.
                  </p>
                  {daysSinceUpdate > 5 && (
                    <button
                      onClick={() => setShowUpdateDraft(!showUpdateDraft)}
                      className="text-xs text-amber-700 font-medium mt-1 hover:text-amber-900 transition-colors"
                    >
                      {showUpdateDraft ? 'Hide draft' : `It's been ${daysSinceUpdate} days since your last update — here's a draft to get you started`}
                    </button>
                  )}
                </div>
              </div>
              {showUpdateDraft && (
                <div className="mt-3 rounded-lg bg-white border border-amber-200/50 p-4 text-sm text-gfm-secondary">
                  <p className="font-medium text-gfm-dark mb-2">Draft update:</p>
                  <p>
                    Thank you all for your incredible support — we&apos;ve now raised {formatCurrency(fundraiser.raisedAmount)} toward our {formatCurrency(fundraiser.goalAmount)} goal!
                    That&apos;s {progress}% of the way there, thanks to {fundraiser.donationCount} generous donors.
                  </p>
                  <p className="mt-2">
                    Your contributions have already helped [describe specific impact]. We still need {formatCurrency(fundraiser.goalAmount - fundraiser.raisedAmount)} to reach our goal — please share this campaign with anyone who might want to help.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button className="rounded-full bg-gfm-green px-4 py-1.5 text-xs font-semibold text-white hover:bg-gfm-dark-green transition-colors">
                      Edit & post update
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Goal Confidence */}
          <div className="rounded-xl border border-gfm-border p-5">
            <h3 className="font-bold text-gfm-dark mb-1">Campaign Performance</h3>
            <p className="text-xs text-gfm-secondary mb-4">Based on similar {fundraiser.category} campaigns in your area</p>
            <div className="relative h-8 bg-gfm-bg rounded-full overflow-hidden mb-2">
              <div className="absolute h-full bg-green-100 rounded-full" style={{ left: `${(goalConfidence.low / goalConfidence.high) * 100}%`, width: `${((goalConfidence.mid - goalConfidence.low) / goalConfidence.high) * 100}%` }} />
              <div
                className="absolute top-0 h-full w-0.5 bg-gfm-green"
                style={{ left: `${(fundraiser.raisedAmount / goalConfidence.high) * 100}%` }}
              />
              <div
                className="absolute top-1 bottom-1 w-6 rounded-full bg-gfm-green flex items-center justify-center"
                style={{ left: `calc(${(fundraiser.raisedAmount / goalConfidence.high) * 100}% - 12px)` }}
              >
                <span className="text-[8px] font-bold text-white">You</span>
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-gfm-secondary mb-3">
              <span>{formatCurrency(goalConfidence.low)}</span>
              <span className="font-medium text-gfm-dark">Typical range</span>
              <span>{formatCurrency(goalConfidence.mid)}</span>
            </div>
            <p className="text-xs text-gfm-secondary">
              Campaigns like yours typically raise {formatCurrency(goalConfidence.low)}–{formatCurrency(goalConfidence.mid)} in the first 30 days. You&apos;re tracking in the <strong className="text-gfm-dark">{goalConfidence.percentile}th percentile</strong>.
            </p>
          </div>

          {/* Donor Messages */}
          <div className="rounded-xl border border-gfm-border p-6">
            <h3 className="font-bold text-gfm-dark mb-4 flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-gfm-green" />
              Words of support
              <span className="text-xs font-normal text-gfm-secondary">({allDonations.filter((d) => d.message).length})</span>
            </h3>
            <div className="space-y-4">
              {allDonations.filter((d) => d.message).slice(0, 5).map((donation) => (
                <div key={donation.id} className="flex gap-3">
                  {donation.donor?.avatarUrl ? (
                    <img src={donation.donor.avatarUrl} alt={donation.displayName} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gfm-bg flex items-center justify-center text-xs font-bold text-gfm-secondary flex-shrink-0">
                      {donation.displayName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-gfm-dark">{donation.displayName}</span>
                      <span className="text-xs text-gfm-green font-medium">{formatCurrency(donation.amount)}</span>
                    </div>
                    <p className="text-sm text-gfm-secondary">{donation.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column - Donation sidebar */}
        <div className="w-full lg:w-[40%]">
          <div className="lg:sticky lg:top-20 space-y-4">
            {/* Donation Card */}
            <div className="rounded-xl border border-gfm-border p-6 shadow-sm">
              <div className="mb-4">
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-2xl font-bold text-gfm-dark">{formatCurrency(fundraiser.raisedAmount)}</span>
                  <span className="text-sm text-gfm-secondary">raised of {formatCurrency(fundraiser.goalAmount)}</span>
                </div>
                <div className="h-2 bg-gfm-bg rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-gfm-green rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs text-gfm-secondary">
                  <span>{formatNumber(fundraiser.donationCount)} donations</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {Math.ceil((fundraiser.goalAmount - fundraiser.raisedAmount) / (fundraiser.raisedAmount / 30))} days to go at current pace
                  </span>
                </div>
              </div>

              {/* Smart Ask Amounts */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {smartAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setSelectedAmount(amount)}
                    className={`rounded-lg border-2 py-2.5 text-sm font-bold transition-all ${
                      selectedAmount === amount
                        ? 'border-gfm-green bg-green-50 text-gfm-green'
                        : 'border-gfm-border text-gfm-dark hover:border-gfm-green/30'
                    }`}
                  >
                    {formatCurrency(amount)}
                  </button>
                ))}
              </div>

              <button className="w-full rounded-full bg-gfm-green py-3 text-sm font-bold text-white hover:bg-gfm-dark-green transition-colors">
                Donate {formatCurrency(selectedAmount)}
              </button>

              <button className="w-full mt-2 rounded-full border-2 border-gfm-border py-2.5 text-sm font-medium text-gfm-dark hover:border-gfm-green hover:text-gfm-green transition-colors flex items-center justify-center gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </button>

              {/* Donor intent signal */}
              <div className="mt-3 text-center">
                <p className="text-[10px] text-gfm-secondary">
                  <Heart className="h-3 w-3 inline text-gfm-pink" /> {formatNumber(fundraiser.donationCount)} people have donated
                </p>
              </div>
            </div>

            {/* Share Kit */}
            <div className="rounded-xl border border-gfm-border p-5">
              <h3 className="font-bold text-gfm-dark mb-3 text-sm">Ready to share</h3>
              <div className="space-y-2.5">
                {Object.entries(shareTemplates).map(([platform, text]) => (
                  <div key={platform} className="rounded-lg bg-gfm-bg p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-gfm-dark capitalize">{platform === 'twitter' ? 'X / Twitter' : platform === 'whatsapp' ? 'WhatsApp' : 'Instagram'}</span>
                      <button
                        onClick={() => copyToClipboard(text, platform)}
                        className="text-[10px] text-gfm-green font-medium hover:text-gfm-dark-green transition-colors flex items-center gap-1"
                      >
                        {copied === platform ? <><CheckCircle2 className="h-3 w-3" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
                      </button>
                    </div>
                    <p className="text-[11px] text-gfm-secondary line-clamp-2">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Organizer */}
            <div className="rounded-xl border border-gfm-border p-5">
              <div className="flex items-center gap-3">
                {fundraiser.organizer.avatarUrl ? (
                  <img src={fundraiser.organizer.avatarUrl} alt={fundraiser.organizer.displayName} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gfm-bg flex items-center justify-center text-sm font-bold text-gfm-secondary">
                    {fundraiser.organizer.displayName.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-gfm-dark">{fundraiser.organizer.displayName}</span>
                    <Shield className="h-3.5 w-3.5 text-gfm-green" />
                  </div>
                  <span className="text-xs text-gfm-secondary">Organizer &middot; {fundraiser.organizer.location}</span>
                </div>
              </div>
              <Link
                href={`/u/${fundraiser.organizer.username}`}
                className="mt-3 flex items-center gap-1 text-xs text-gfm-green font-medium hover:text-gfm-dark-green transition-colors"
              >
                View profile <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
