"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Bell, Menu, X, ChevronDown } from "lucide-react";

interface NavDropdownProps {
  label: string;
  badge?: string;
  items: { label: string; href: string }[];
}

function NavDropdown({ label, badge, items }: NavDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-1 text-sm font-medium text-gfm-dark hover:text-gfm-green transition-colors px-2 py-1">
        {label}
        {badge && (
          <span className="ml-1 rounded-full bg-gfm-green px-1.5 py-0.5 text-[10px] font-bold text-white leading-none">
            {badge}
          </span>
        )}
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[200px] rounded-[12px] border border-gfm-border bg-white py-2 shadow-lg">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 text-sm text-gfm-dark hover:bg-gfm-bg transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const donateItems = [
    { label: "Donate to a fundraiser", href: "/search" },
    { label: "Pricing", href: "/pricing" },
  ];

  const fundraiseItems = [
    { label: "Start a GoFundMe", href: "/create" },
    { label: "How it works", href: "/how-it-works" },
    { label: "Fundraising tips", href: "/tips" },
  ];

  const givingFundsItems = [
    { label: "Giving Funds overview", href: "/giving-funds" },
    { label: "Browse Giving Funds", href: "/giving-funds/browse" },
  ];

  const aboutItems = [
    { label: "About GoFundMe", href: "/about" },
    { label: "Newsroom", href: "/newsroom" },
    { label: "Careers", href: "/careers" },
    { label: "Contact us", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gfm-border bg-white">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Left section */}
        <div className="flex items-center gap-1 lg:gap-2">
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
          <Link href="/search" className="p-2 text-gfm-dark hover:text-gfm-green transition-colors">
            <Search className="h-5 w-5" />
          </Link>
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            <NavDropdown label="Donate" items={donateItems} />
            <NavDropdown label="Fundraise" items={fundraiseItems} />
            <NavDropdown label="Giving Funds" badge="NEW" items={givingFundsItems} />
          </div>
        </div>

        {/* Center logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-gfm-green select-none"
        >
          gofundme
        </Link>

        {/* Right section */}
        <div className="flex items-center gap-1 lg:gap-2">
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            <NavDropdown label="About" items={aboutItems} />
          </div>
          <button className="p-2 text-gfm-dark hover:text-gfm-green transition-colors" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </button>
          <Link
            href="/sign-in"
            className="hidden text-sm font-medium text-gfm-dark hover:text-gfm-green transition-colors lg:block px-2"
          >
            Sign in
          </Link>
          <Link
            href="/create"
            className="hidden rounded-full border-2 border-gfm-green px-4 py-2 text-sm font-semibold text-gfm-green hover:bg-gfm-green hover:text-white transition-colors lg:block"
          >
            Start a GoFundMe
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gfm-border bg-white lg:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4">
            <MobileSection title="Donate" items={donateItems} />
            <MobileSection title="Fundraise" items={fundraiseItems} />
            <MobileSection title="Giving Funds" items={givingFundsItems} />
            <MobileSection title="About" items={aboutItems} />
            <div className="border-t border-gfm-border pt-4 mt-4 space-y-3">
              <Link
                href="/sign-in"
                className="block text-sm font-medium text-gfm-dark hover:text-gfm-green"
              >
                Sign in
              </Link>
              <Link
                href="/create"
                className="block w-full rounded-full border-2 border-gfm-green px-4 py-2 text-center text-sm font-semibold text-gfm-green hover:bg-gfm-green hover:text-white transition-colors"
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
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        className="flex w-full items-center justify-between py-2 text-sm font-medium text-gfm-dark"
        onClick={() => setOpen(!open)}
      >
        {title}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="ml-4 space-y-1 pb-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-1.5 text-sm text-gfm-secondary hover:text-gfm-green transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
