"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Globe } from "lucide-react";

const footerColumns = [
  {
    title: "Donate",
    links: [
      { label: "Donate to a fundraiser", href: "/search" },
      { label: "Pricing", href: "/pricing" },
      { label: "GoFundMe Giving Guarantee", href: "/guarantee" },
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
      { label: "Charity fundraising", href: "/charity" },
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
      { label: "Help center", href: "/help" },
      { label: "Blog", href: "/blog" },
      { label: "Press center", href: "/press" },
      { label: "Partnerships", href: "/partnerships" },
      { label: "Success stories", href: "/success-stories" },
      { label: "Crisis relief", href: "/crisis-relief" },
    ],
  },
];

const moreResources = [
  { label: "Fundraising ideas", href: "/fundraising-ideas" },
  { label: "Rent assistance", href: "/rent-assistance" },
  { label: "Medical fundraising", href: "/medical" },
  { label: "Memorial fundraising", href: "/memorial" },
  { label: "Emergency fundraising", href: "/emergency" },
  { label: "Nonprofit fundraising", href: "/nonprofit" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com/gofundme",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com/gofundme",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/gofundme",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/gofundme",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@gofundme",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    label: "Podcast",
    href: "/podcast",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 1a9 9 0 0 0-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2a7 7 0 0 1 14 0v2h-4v8h3c1.66 0 3-1.34 3-3v-7a9 9 0 0 0-9-9z" />
      </svg>
    ),
  },
];

const legalLinks = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Legal", href: "/legal" },
  { label: "Accessibility", href: "/accessibility" },
];

export function Footer() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  // Hide consumer footer on Pro pages (Pro has its own footer)
  if (pathname.startsWith('/pro')) return null;

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
            className="flex items-center gap-2 text-sm font-bold text-gfm-dark hover:text-gfm-green transition-colors"
            onClick={() => setMoreOpen(!moreOpen)}
          >
            More resources
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                moreOpen ? "rotate-180" : ""
              }`}
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
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-6 md:flex-row md:justify-between lg:px-8">
          {/* Social links with icons */}
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gfm-secondary hover:text-gfm-green hover:bg-gfm-light-green/50 transition-colors"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>

          {/* Language selector */}
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-gfm-secondary" />
            <select
              className="rounded-lg border border-gfm-border bg-white px-3 py-1.5 text-sm text-gfm-dark cursor-pointer focus:outline-none focus:ring-2 focus:ring-gfm-green/20 focus:border-gfm-green"
              defaultValue="en"
              aria-label="Select language"
            >
              <option value="en">English</option>
              <option value="es">Espanol</option>
              <option value="fr">Francais</option>
              <option value="de">Deutsch</option>
              <option value="pt">Portugues</option>
              <option value="it">Italiano</option>
              <option value="nl">Nederlands</option>
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
              &copy; 2010-{new Date().getFullYear()} GoFundMe. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
