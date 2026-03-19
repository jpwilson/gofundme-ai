"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Fundraisers", href: "/f/la-wildfire-alerts-and-recovery", match: "/f/" },
  { label: "Communities", href: "/communities/watch-duty", match: "/communities/" },
  { label: "Campaign Builder", href: "/campaign-builder", match: "/campaign-builder" },
  { label: "Impact", href: "/impact-feed", match: "/impact-feed" },
  { label: "Docs", href: "/docs", match: "/docs" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide consumer navbar on Pro pages (Pro has its own navbar)
  if (pathname.startsWith('/pro')) return null;

  const getActiveNav = (): string | null => {
    for (const link of navLinks) {
      if (pathname.startsWith(link.match)) return link.match;
    }
    return null;
  };
  const activeNav = getActiveNav();

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-gfm-border bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto flex h-[64px] max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Left section: hamburger (mobile) + logo */}
        <div className="flex items-center gap-2">
          <button
            className="p-2 text-gfm-dark hover:text-gfm-green transition-colors lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <Link
            href="/"
            className="logo-heart flex items-center gap-0 text-[22px] font-bold tracking-tight text-gfm-green select-none"
          >
            <span>gofundme</span>
            <svg
              className="heart-icon ml-0.5 h-5 w-5 text-gfm-green"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </Link>
        </div>

        {/* Right section: nav links + sign in + CTA */}
        <div className="flex items-center gap-1 lg:gap-2">
          <div className="hidden lg:flex lg:items-center lg:gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.match}
                href={link.href}
                className={`text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
                  activeNav === link.match
                    ? "text-pink-600 bg-pink-50"
                    : "text-gfm-dark hover:text-gfm-green hover:bg-gfm-bg"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href="/create"
            className="hidden rounded-full border-2 border-gfm-green px-5 py-2 text-sm font-semibold text-gfm-green hover:bg-gfm-green hover:text-white transition-all duration-200 lg:block"
          >
            Start a GoFundMe
          </Link>
          <Link
            href="/u/jpwilson"
            className="ml-2 flex items-center gap-2 rounded-full hover:bg-gfm-bg px-2 py-1.5 transition-colors"
            title="Jean-Paul Wilson"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gfm-green text-sm font-bold text-white">
              J
            </span>
            <span className="hidden text-sm font-medium text-gfm-dark lg:block">Jean-Paul</span>
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gfm-border bg-white lg:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.match}
                href={link.href}
                className={`block py-3 text-sm font-medium transition-colors ${
                  activeNav === link.match
                    ? "text-pink-600"
                    : "text-gfm-dark hover:text-gfm-green"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-gfm-border pt-4 mt-4 space-y-3">
              <Link
                href="/u/jpwilson"
                className="flex items-center gap-2 text-sm font-medium text-gfm-dark hover:text-gfm-green"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gfm-green text-xs font-bold text-white">J</span>
                Jean-Paul Wilson
              </Link>
              <Link
                href="/u/janahan"
                className="flex items-center gap-2 text-sm font-medium text-gfm-dark hover:text-gfm-green"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-400 text-xs font-bold text-white">J</span>
                Janahan Sivaraman
              </Link>
              <Link
                href="/create"
                className="block w-full rounded-full border-2 border-gfm-green px-4 py-2.5 text-center text-sm font-semibold text-gfm-green hover:bg-gfm-green hover:text-white transition-colors"
              >
                Start a GoFundMe
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
