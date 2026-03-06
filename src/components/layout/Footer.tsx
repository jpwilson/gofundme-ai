"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const footerColumns = [
  {
    title: "Donate",
    links: [
      { label: "Donate to a fundraiser", href: "/search" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Fundraise",
    links: [
      { label: "Start a GoFundMe", href: "/create" },
      { label: "How GoFundMe works", href: "/how-it-works" },
      { label: "Fundraising tips", href: "/tips" },
      { label: "Fundraising categories", href: "/categories" },
      { label: "Team fundraising", href: "/team" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "About GoFundMe", href: "/about" },
      { label: "Newsroom", href: "/newsroom" },
      { label: "GoFundMe Giving", href: "/giving" },
      { label: "Careers", href: "/careers" },
      { label: "Contact us", href: "/contact" },
    ],
  },
  {
    title: "More",
    links: [
      { label: "GoFundMe Guarantee", href: "/guarantee" },
      { label: "Help center", href: "/help" },
      { label: "Blog", href: "/blog" },
      { label: "Press center", href: "/press" },
      { label: "Partnerships", href: "/partnerships" },
    ],
  },
];

const moreResources = [
  { label: "Success stories", href: "/success-stories" },
  { label: "Fundraising ideas", href: "/fundraising-ideas" },
  { label: "Charity fundraising", href: "/charity" },
  { label: "Crisis relief", href: "/crisis-relief" },
  { label: "Rent assistance", href: "/rent-assistance" },
];

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com/gofundme" },
  { label: "YouTube", href: "https://youtube.com/gofundme" },
  { label: "X", href: "https://x.com/gofundme" },
  { label: "Instagram", href: "https://instagram.com/gofundme" },
  { label: "TikTok", href: "https://tiktok.com/@gofundme" },
  { label: "Podcast", href: "/podcast" },
];

const legalLinks = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Legal", href: "/legal" },
  { label: "Accessibility", href: "/accessibility" },
];

export function Footer() {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <footer className="bg-gfm-bg border-t border-gfm-border">
      {/* Main footer columns */}
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-4 text-sm font-bold text-gfm-dark">
                {column.title}
              </h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gfm-secondary hover:text-gfm-green transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* More resources expandable */}
        <div className="mt-10 border-t border-gfm-border pt-6">
          <button
            className="flex items-center gap-2 text-sm font-bold text-gfm-dark"
            onClick={() => setMoreOpen(!moreOpen)}
          >
            More resources
            <ChevronDown
              className={`h-4 w-4 transition-transform ${moreOpen ? "rotate-180" : ""}`}
            />
          </button>
          {moreOpen && (
            <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
              {moreResources.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gfm-secondary hover:text-gfm-green transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gfm-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-6 md:flex-row md:justify-between lg:px-8">
          {/* Social links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gfm-secondary hover:text-gfm-green transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Language selector */}
          <div className="flex items-center gap-4">
            <select
              className="rounded-[8px] border border-gfm-border bg-white px-3 py-1.5 text-xs text-gfm-dark"
              defaultValue="en"
              aria-label="Select language"
            >
              <option value="en">English</option>
              <option value="es">Espanol</option>
              <option value="fr">Francais</option>
              <option value="de">Deutsch</option>
              <option value="pt">Portugues</option>
              <option value="it">Italiano</option>
            </select>
          </div>

          {/* Legal links */}
          <div className="flex items-center gap-4">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-gfm-secondary hover:text-gfm-green transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gfm-border">
          <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
            <p className="text-center text-xs text-gfm-secondary">
              &copy; 2010-{new Date().getFullYear()} GoFundMe Clone. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
