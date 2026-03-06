"use client";

import { useState } from "react";
import Link from "next/link";
import type { Fundraiser } from "@/lib/types";
import { formatCurrency, formatPercentage } from "@/lib/utils/format";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DonateFlowProps {
  fundraiser: Fundraiser;
}

type Step = 1 | 2 | 3 | 4;

type TipOption = "15" | "10" | "5" | "custom" | "none";

interface PaymentFields {
  cardNumber: string;
  expiry: string;
  cvv: string;
  nameOnCard: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PRESET_AMOUNTS_CENTS = [2500, 5000, 10000, 25000, 50000] as const;

const STEP_LABELS: Record<number, string> = {
  1: "Amount",
  2: "Tip",
  3: "Payment",
  4: "Complete",
};

const TIP_OPTIONS: { label: string; value: TipOption }[] = [
  { label: "15%", value: "15" },
  { label: "10%", value: "10" },
  { label: "5%", value: "5" },
  { label: "Custom", value: "custom" },
  { label: "$0", value: "none" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert cents to a display-friendly dollar string (e.g. 2500 -> "$25"). */
function centsToDollars(cents: number): string {
  return formatCurrency(cents);
}

/** Format a raw card-number string into groups of 4 digits. */
function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

/** Format a raw expiry string into MM/YY. */
function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

/** Calculate the tip amount in cents. */
function calculateTipCents(
  donationCents: number,
  tipOption: TipOption,
  customTipDollars: string,
): number {
  if (tipOption === "none") return 0;
  if (tipOption === "custom") return Math.round((Number(customTipDollars) || 0) * 100);
  const pct = Number(tipOption);
  return Math.round(donationCents * (pct / 100));
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Green numbered step indicator across the top of the card. */
function StepIndicator({ current }: { current: Step }) {
  return (
    <div className="flex items-center justify-between">
      {([1, 2, 3] as const).map((step, idx) => (
        <div key={step} className="flex items-center flex-1">
          <div className="flex items-center gap-2">
            <div
              className={`
                flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors
                ${current >= step ? "bg-gfm-green text-white" : "bg-gray-200 text-gfm-secondary"}
              `}
            >
              {current > step ? (
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step
              )}
            </div>
            <span
              className={`text-xs font-semibold hidden sm:block ${
                current >= step ? "text-gfm-dark" : "text-gfm-secondary"
              }`}
            >
              {STEP_LABELS[step]}
            </span>
          </div>
          {idx < 2 && (
            <div
              className={`flex-1 h-0.5 mx-3 rounded-full transition-colors ${
                current > step ? "bg-gfm-green" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function DonateFlow({ fundraiser }: DonateFlowProps) {
  // Step navigation
  const [currentStep, setCurrentStep] = useState<Step>(1);

  // Step 1 – Amount (all values in cents)
  const [selectedAmountCents, setSelectedAmountCents] = useState<number | null>(5000);
  const [customAmountDollars, setCustomAmountDollars] = useState("");

  // Step 2 – Tip
  const [tipOption, setTipOption] = useState<TipOption>("15");
  const [customTipDollars, setCustomTipDollars] = useState("");

  // Step 3 – Payment
  const [paymentFields, setPaymentFields] = useState<PaymentFields>({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  });
  const [sharePublicly, setSharePublicly] = useState(true);

  // Derived values (all cents)
  const donationCents =
    customAmountDollars !== ""
      ? Math.round((Number(customAmountDollars) || 0) * 100)
      : selectedAmountCents ?? 0;

  const tipCents = calculateTipCents(donationCents, tipOption, customTipDollars);
  const percentage = formatPercentage(fundraiser.raisedAmount, fundraiser.goalAmount);

  // Handlers
  const handleSelectPreset = (cents: number) => {
    setSelectedAmountCents(cents);
    setCustomAmountDollars("");
  };

  const handleCustomAmountChange = (value: string) => {
    const sanitized = value.replace(/[^0-9.]/g, "");
    const parts = sanitized.split(".");
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;
    setCustomAmountDollars(sanitized);
    if (sanitized !== "") setSelectedAmountCents(null);
  };

  const goNext = () => {
    if (currentStep < 4) setCurrentStep((currentStep + 1) as Step);
  };

  const goBack = () => {
    if (currentStep > 1) setCurrentStep((currentStep - 1) as Step);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with Stripe Elements
    setCurrentStep(4);
  };

  const updatePaymentField = (field: keyof PaymentFields, value: string) => {
    setPaymentFields((prev) => ({ ...prev, [field]: value }));
  };

  const isCustomAmountActive =
    customAmountDollars !== "" &&
    !PRESET_AMOUNTS_CENTS.includes(
      Math.round((Number(customAmountDollars) || 0) * 100) as typeof PRESET_AMOUNTS_CENTS[number],
    );

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gfm-bg">
      <div className="mx-auto max-w-lg px-4 py-6 sm:py-10">
        {/* Link back to fundraiser (steps 1-3) */}
        {currentStep < 4 && (
          <Link
            href={`/f/${fundraiser.slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-gfm-secondary hover:text-gfm-dark transition-colors mb-6"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to fundraiser
          </Link>
        )}

        {/* Card container */}
        <div className="rounded-2xl bg-white border border-gfm-border shadow-sm overflow-hidden">
          {/* Fundraiser header with progress */}
          {currentStep < 4 && (
            <div className="border-b border-gfm-border px-6 py-4">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="h-12 w-12 rounded-lg bg-gray-200 bg-cover bg-center shrink-0"
                  style={{ backgroundImage: `url(${fundraiser.coverImageUrl})` }}
                />
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-bold text-gfm-dark truncate">
                    {fundraiser.title}
                  </h2>
                  <p className="text-xs text-gfm-secondary mt-0.5">
                    {formatCurrency(fundraiser.raisedAmount)} raised of{" "}
                    {formatCurrency(fundraiser.goalAmount)} goal
                    <span className="ml-1.5 text-gfm-green font-semibold">{percentage}%</span>
                  </p>
                </div>
              </div>
              <ProgressBar percentage={percentage} />
            </div>
          )}

          {/* Step indicator (steps 1-3) */}
          {currentStep < 4 && (
            <div className="px-6 pt-5 pb-2">
              <StepIndicator current={currentStep} />
            </div>
          )}

          {/* Step content */}
          <div className="px-6 py-5">
            {/* ----------------------------------------------------------------- */}
            {/* Step 1: Amount                                                     */}
            {/* ----------------------------------------------------------------- */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-gfm-dark">
                    Choose your donation amount
                  </h3>
                  <p className="text-sm text-gfm-secondary mt-1">
                    Every contribution makes a difference
                  </p>
                </div>

                {/* Preset amounts */}
                <div className="grid grid-cols-3 gap-3">
                  {PRESET_AMOUNTS_CENTS.map((cents) => (
                    <button
                      key={cents}
                      type="button"
                      onClick={() => handleSelectPreset(cents)}
                      className={`
                        h-14 rounded-full border-2 text-lg font-bold transition-all
                        ${
                          selectedAmountCents === cents && !isCustomAmountActive
                            ? "border-gfm-green bg-gfm-green/5 text-gfm-green"
                            : "border-gfm-border bg-white text-gfm-dark hover:border-gfm-green/50"
                        }
                      `}
                    >
                      {centsToDollars(cents)}
                    </button>
                  ))}
                </div>

                {/* Custom amount input */}
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gfm-secondary">
                    $
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="Enter custom amount"
                    value={customAmountDollars}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    className={`
                      w-full h-14 pl-9 pr-4 rounded-full border-2 text-lg font-bold
                      placeholder:text-gfm-secondary/50 placeholder:font-normal
                      focus:outline-none transition-colors
                      ${
                        isCustomAmountActive
                          ? "border-gfm-green bg-gfm-green/5 text-gfm-green"
                          : "border-gfm-border bg-white text-gfm-dark focus:border-gfm-green"
                      }
                    `}
                  />
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={donationCents <= 0}
                  onClick={goNext}
                  className="h-14 text-base"
                >
                  Continue
                </Button>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* Step 2: Tip                                                        */}
            {/* ----------------------------------------------------------------- */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-gfm-dark">
                    Add a tip to support GoFundMe
                  </h3>
                  <p className="text-sm text-gfm-secondary mt-1">
                    Your tip powers the GoFundMe platform
                  </p>
                </div>

                {/* 0% fee message */}
                <div className="rounded-xl border border-gfm-border bg-gfm-bg/50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gfm-green/10">
                      <svg
                        className="h-5 w-5 text-gfm-green"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gfm-dark">
                        GoFundMe has a 0% platform fee
                      </p>
                      <p className="text-xs text-gfm-secondary mt-1">
                        GoFundMe is free for organizers. Tips are optional and help
                        us provide customer support, secure transactions, and fund
                        trust &amp; safety programs.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tip options */}
                <div className="flex flex-wrap gap-2">
                  {TIP_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setTipOption(opt.value)}
                      className={`
                        rounded-full px-5 py-2.5 text-sm font-semibold transition-all
                        ${
                          tipOption === opt.value
                            ? "bg-gfm-green text-white"
                            : "bg-white border border-gfm-border text-gfm-dark hover:border-gfm-green/50"
                        }
                      `}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Custom tip input */}
                {tipOption === "custom" && (
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gfm-secondary">
                      $
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="Enter tip amount"
                      value={customTipDollars}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9.]/g, "");
                        const parts = val.split(".");
                        if (parts.length > 2) return;
                        if (parts[1] && parts[1].length > 2) return;
                        setCustomTipDollars(val);
                      }}
                      className="w-full h-12 pl-9 pr-4 rounded-full border-2 border-gfm-green bg-gfm-green/5 text-sm font-bold text-gfm-dark focus:outline-none"
                    />
                  </div>
                )}

                {/* Calculation summary */}
                <div className="rounded-xl bg-gray-50 border border-gfm-border p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gfm-secondary">Your donation</span>
                    <span className="font-semibold text-gfm-dark">
                      {centsToDollars(donationCents)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gfm-secondary">
                      Tip to GoFundMe
                      {tipOption !== "none" && tipOption !== "custom" && (
                        <span className="text-xs ml-1">({tipOption}%)</span>
                      )}
                    </span>
                    <span className="font-semibold text-gfm-dark">
                      {centsToDollars(tipCents)}
                    </span>
                  </div>
                  <div className="border-t border-gfm-border pt-2 flex justify-between text-sm">
                    <span className="font-semibold text-gfm-dark">Total</span>
                    <span className="font-bold text-gfm-green text-base">
                      {centsToDollars(donationCents + tipCents)}
                    </span>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-3">
                  <Button variant="outline" size="lg" className="flex-1 h-14 text-base" onClick={goBack}>
                    Back
                  </Button>
                  <Button variant="primary" size="lg" className="flex-[2] h-14 text-base" onClick={goNext}>
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* Step 3: Payment                                                    */}
            {/* ----------------------------------------------------------------- */}
            {currentStep === 3 && (
              <form onSubmit={handlePaymentSubmit} className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gfm-dark">Payment details</h3>
                    <p className="text-sm text-gfm-secondary mt-1">
                      Complete your donation of{" "}
                      <span className="font-semibold text-gfm-green">
                        {centsToDollars(donationCents)}
                      </span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={goBack}
                    className="text-sm font-semibold text-gfm-green hover:underline"
                  >
                    Back
                  </button>
                </div>

                {/* TODO: Replace with Stripe Elements */}
                <div className="space-y-3">
                  {/* Name on card */}
                  <div>
                    <label htmlFor="nameOnCard" className="block text-sm font-semibold text-gfm-dark mb-1.5">
                      Name on card
                    </label>
                    <input
                      id="nameOnCard"
                      type="text"
                      placeholder="Full name"
                      value={paymentFields.nameOnCard}
                      onChange={(e) => updatePaymentField("nameOnCard", e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-gfm-border text-sm text-gfm-dark
                        placeholder:text-gfm-secondary/50 focus:outline-none focus:border-gfm-green transition-colors"
                    />
                  </div>

                  {/* Card number */}
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-semibold text-gfm-dark mb-1.5">
                      Card number
                    </label>
                    <input
                      id="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={paymentFields.cardNumber}
                      onChange={(e) => updatePaymentField("cardNumber", formatCardNumber(e.target.value))}
                      className="w-full h-12 px-4 rounded-xl border border-gfm-border text-sm text-gfm-dark
                        placeholder:text-gfm-secondary/50 focus:outline-none focus:border-gfm-green transition-colors"
                    />
                  </div>

                  {/* Expiry & CVV */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="expiry" className="block text-sm font-semibold text-gfm-dark mb-1.5">
                        Expiry
                      </label>
                      <input
                        id="expiry"
                        type="text"
                        placeholder="MM/YY"
                        value={paymentFields.expiry}
                        onChange={(e) => updatePaymentField("expiry", formatExpiry(e.target.value))}
                        className="w-full h-12 px-4 rounded-xl border border-gfm-border text-sm text-gfm-dark
                          placeholder:text-gfm-secondary/50 focus:outline-none focus:border-gfm-green transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-semibold text-gfm-dark mb-1.5">
                        CVV
                      </label>
                      <input
                        id="cvv"
                        type="text"
                        placeholder="123"
                        value={paymentFields.cvv}
                        onChange={(e) =>
                          updatePaymentField("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))
                        }
                        className="w-full h-12 px-4 rounded-xl border border-gfm-border text-sm text-gfm-dark
                          placeholder:text-gfm-secondary/50 focus:outline-none focus:border-gfm-green transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Share publicly checkbox */}
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sharePublicly}
                    onChange={(e) => setSharePublicly(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-gfm-border text-gfm-green focus:ring-gfm-green accent-gfm-green"
                  />
                  <span className="text-sm text-gfm-secondary">
                    Share my name and donation publicly
                  </span>
                </label>

                {/* Order summary */}
                <div className="rounded-xl border border-gfm-border bg-white p-4 space-y-2.5">
                  <h4 className="text-sm font-bold text-gfm-dark">Order summary</h4>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gfm-secondary">Donation</span>
                      <span className="text-gfm-dark">{centsToDollars(donationCents)}</span>
                    </div>
                    {tipCents > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gfm-secondary">GoFundMe tip</span>
                        <span className="text-gfm-dark">{centsToDollars(tipCents)}</span>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-gfm-border pt-2 flex justify-between">
                    <span className="text-sm font-bold text-gfm-dark">Total</span>
                    <span className="text-base font-bold text-gfm-green">
                      {centsToDollars(donationCents + tipCents)}
                    </span>
                  </div>
                </div>

                <Button type="submit" variant="primary" size="lg" fullWidth className="h-14 text-base">
                  Donate {centsToDollars(donationCents + tipCents)}
                </Button>

                <p className="text-xs text-gfm-secondary text-center leading-relaxed">
                  By continuing, you agree to the GoFundMe{" "}
                  <span className="underline cursor-pointer">terms of service</span> and{" "}
                  <span className="underline cursor-pointer">privacy policy</span>.
                </p>
              </form>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* Step 4: Confirmation                                               */}
            {/* ----------------------------------------------------------------- */}
            {currentStep === 4 && (
              <div className="text-center space-y-6 py-4">
                {/* Green checkmark */}
                <div className="flex justify-center">
                  <div className="relative h-24 w-24">
                    <div className="absolute inset-0 rounded-full bg-gfm-green/10 animate-ping" />
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gfm-green">
                      <svg
                        className="h-12 w-12 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                          style={{
                            strokeDasharray: 24,
                            strokeDashoffset: 24,
                            animation: "draw 0.5s ease-out 0.3s forwards",
                          }}
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Success message */}
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gfm-dark">
                    Thank you!
                  </h2>
                  <p className="text-gfm-secondary">
                    Your donation of{" "}
                    <span className="font-bold text-gfm-green">
                      {centsToDollars(donationCents)}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold">{fundraiser.title}</span>{" "}
                    is complete.
                  </p>
                </div>

                {/* Receipt notice */}
                <div className="rounded-xl border border-gfm-border bg-gfm-bg/50 p-4 text-sm text-gfm-secondary">
                  A donation receipt has been sent to your email address.
                </div>

                {/* Share buttons */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gfm-dark">
                    Share this fundraiser
                  </p>
                  <div className="flex justify-center gap-3">
                    {/* Facebook */}
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`/f/${fundraiser.slug}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1877F2] text-white hover:opacity-90 transition-opacity"
                      aria-label="Share on Facebook"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>

                    {/* Twitter / X */}
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just donated to "${fundraiser.title}" on GoFundMe!`)}&url=${encodeURIComponent(`/f/${fundraiser.slug}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-gfm-dark text-white hover:opacity-90 transition-opacity"
                      aria-label="Share on X"
                    >
                      <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>

                    {/* Copy link */}
                    <button
                      onClick={() => {
                        const url =
                          typeof window !== "undefined"
                            ? `${window.location.origin}/f/${fundraiser.slug}`
                            : `/f/${fundraiser.slug}`;
                        navigator.clipboard.writeText(url);
                      }}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gfm-dark hover:bg-gray-300 transition-colors"
                      aria-label="Copy link"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Back to fundraiser link */}
                <Link
                  href={`/f/${fundraiser.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gfm-green hover:underline"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to fundraiser
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Security footer */}
        {currentStep < 4 && (
          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gfm-secondary">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Secure donation powered by GoFundMe
          </div>
        )}
      </div>
    </div>
  );
}
