"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Menu, X, ChevronDown } from "lucide-react";

interface NavDropdownProps {
  label: string;
  badge?: string;
  items: { label: string; href: string; description?: string }[];
  isActive?: boolean;
}

function NavDropdown({ label, badge, items, isActive }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`flex items-center gap-1 text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
          isActive
            ? "text-pink-600 bg-pink-50"
            : open
              ? "text-gfm-green bg-gfm-light-green/40"
              : "text-gfm-dark hover:text-gfm-green"
        }`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {label}
        {badge && (
          <span className="ml-1 rounded-full bg-gfm-green px-1.5 py-0.5 text-[10px] font-bold text-white leading-none uppercase tracking-wide">
            {badge}
          </span>
        )}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[220px] rounded-xl border border-gfm-border bg-white py-1.5 shadow-xl shadow-black/5">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2.5 text-sm text-gfm-dark hover:bg-gfm-bg hover:text-gfm-green transition-colors"
            >
              {item.label}
              {item.description && (
                <span className="block text-xs text-gfm-secondary mt-0.5">
                  {item.description}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determine which SINGLE nav item should be active.
  // Priority: direct links first, then dropdowns with unique routes.
  // Dropdowns that share hrefs with direct links (About→/docs) don't count.
  const getActiveNav = (): string | null => {
    if (pathname === '/docs') return 'docs';
    if (pathname === '/explore') return 'explore';
    if (pathname.startsWith('/ai2/') || pathname.startsWith('/giving-agent')) return 'ai2';
    if (pathname.startsWith('/ai/')) return 'ai';
    if (pathname.startsWith('/f/') || pathname.startsWith('/communities/') || pathname.startsWith('/u/')) return 'core';
    if (pathname === '/search') return 'donate';
    if (pathname === '/create') return 'fundraise';
    return null;
  };
  const activeNav = getActiveNav();

  // Close mobile menu on route change / resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const donateItems = [
    { label: "Donate to a fundraiser", href: "/search" },
    { label: "Pricing", href: "/create" },
  ];

  const fundraiseItems = [
    { label: "Start a GoFundMe", href: "/create" },
    { label: "How it works", href: "/docs" },
    { label: "Fundraising tips", href: "/docs" },
  ];

  const aboutItems = [
    { label: "About GoFundMe", href: "/docs" },
    { label: "Documentation", href: "/docs" },
    { label: "GitHub", href: "https://github.com/jpwilson/gofundme-ai" },
  ];

  const ai2IdeationItems = [
    { label: "Fraud Detection", href: "/ai2/fraud-detection", description: "Anomaly detection & trust scores" },
    { label: "Jira Agent", href: "/ai2/jira-agent", description: "AI-powered engineering workflows" },
    { label: "Persona Recommendations", href: "/ai2/persona-recommendations", description: "Social media donor targeting" },
    { label: "Agent Observability", href: "/ai2/agent-observability", description: "Agent behavior tracking & traces" },
    { label: "Giving Agent", href: "/giving-agent", description: "Automated monthly giving by AI" },
  ];

  const aiIdeationItems = [
    { label: "AI Fundraiser", href: "/ai/fundraiser", description: "Story coach, sentiment & trust AI" },
    { label: "AI Community", href: "/ai/community", description: "Smart digests & cause matching" },
    { label: "AI Profile", href: "/ai/profile", description: "Giving insights & recommendations" },
    { label: "AI Analytics", href: "/ai/analytics", description: "Costs, scale & observability" },
  ];


  return (
    <header className="sticky top-0 z-50 border-b border-gfm-border bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto flex h-[64px] max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Left section */}
        <div className="flex items-center gap-1 lg:gap-1">
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
            href="/search"
            className="p-2 text-gfm-dark hover:text-gfm-green transition-colors rounded-lg hover:bg-gfm-bg"
          >
            <Search className="h-5 w-5" />
          </Link>
          <div className="hidden lg:flex lg:items-center lg:gap-0.5">
            <NavDropdown label="Donate" items={donateItems} isActive={activeNav === 'donate'} />
            <NavDropdown label="Fundraise" items={fundraiseItems} isActive={activeNav === 'fundraise'} />
          </div>
        </div>

        {/* Center logo */}
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

        {/* Right section */}
        <div className="flex items-center gap-1 lg:gap-2">
          <div className="hidden lg:flex lg:items-center lg:gap-0.5">
            <NavDropdown label="About" items={aboutItems} />
            <Link href="/docs" className={`text-sm font-medium transition-colors px-3 py-2 rounded-lg ${activeNav === 'docs' ? 'text-pink-600 bg-pink-50' : 'text-gfm-dark hover:text-gfm-green hover:bg-gfm-bg'}`}>Docs</Link>
            <Link href="/explore" className={`text-sm font-medium transition-colors px-3 py-2 rounded-lg ${activeNav === 'explore' ? 'text-pink-600 bg-pink-50' : 'text-gfm-dark hover:text-gfm-green hover:bg-gfm-bg'}`}>Explore</Link>
            <NavDropdown label="AI Ideation2" badge="JP" items={ai2IdeationItems} isActive={activeNav === 'ai2'} />
            <NavDropdown label="AI Ideation" badge="JP" items={aiIdeationItems} isActive={activeNav === 'ai'} />
          </div>
          <button
            className="relative p-2 text-gfm-dark hover:text-gfm-green transition-colors rounded-lg hover:bg-gfm-bg"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>
          <Link
            href="/sign-in"
            className="hidden text-sm font-medium text-gfm-dark hover:text-gfm-green transition-colors lg:block px-3 py-2 rounded-lg hover:bg-gfm-bg"
          >
            Sign in
          </Link>
          <Link
            href="/create"
            className="hidden rounded-full border-2 border-gfm-green px-5 py-2 text-sm font-semibold text-gfm-green hover:bg-gfm-green hover:text-white transition-all duration-200 lg:block"
          >
            Start a GoFundMe
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gfm-border bg-white lg:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4">
            <MobileSection title="Donate" items={donateItems} />
            <MobileSection title="Fundraise" items={fundraiseItems} />
            <MobileSection title="About" items={aboutItems} />
            <Link href="/docs" className="block py-3 text-sm font-medium text-gfm-dark hover:text-gfm-green transition-colors">Docs</Link>
            <MobileSection title="AI Ideation2" badge="JP" items={ai2IdeationItems} />
            <MobileSection title="AI Ideation" badge="JP" items={aiIdeationItems} />
            <div className="border-t border-gfm-border pt-4 mt-4 space-y-3">
              <Link
                href="/sign-in"
                className="block text-sm font-medium text-gfm-dark hover:text-gfm-green"
              >
                Sign in
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

function MobileSection({
  title,
  badge,
  items,
}: {
  title: string;
  badge?: string;
  items: { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        className="flex w-full items-center justify-between py-3 text-sm font-medium text-gfm-dark"
        onClick={() => setOpen(!open)}
      >
        <span className="flex items-center gap-2">
          {title}
          {badge && (
            <span className="rounded-full bg-gfm-green px-1.5 py-0.5 text-[10px] font-bold text-white leading-none uppercase tracking-wide">
              {badge}
            </span>
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="ml-4 space-y-1 pb-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-2 text-sm text-gfm-secondary hover:text-gfm-green transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
