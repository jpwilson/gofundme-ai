# GoFundMe — Product Exploration

A high-fidelity Next.js prototype exploring new features and enhancements for GoFundMe's fundraising platform. This project reconstructs core GoFundMe pages with pixel-level attention to detail, then layers on original ideas designed to help GoFundMe better serve donors, organizers, and the communities they support.

**Live demo:** [gfmv1.vercel.app](https://gfmv1.vercel.app)

## What's Here

### Core Pages (Rebuilt)
- **Fundraiser Page** — Campaign detail view with donation sidebar, donor list, updates, and social sharing
- **Community Page** — Community hub with leaderboard, activity feed, and related fundraisers
- **Profile Page** — User profile with giving history, highlights, and follower network
- **Search** — Filterable fundraiser search with category browsing
- **Create Fundraiser** — Multi-step campaign creation wizard

### Original Features
- **Metrics Lab** — An analytics dashboard exploring how donors and organizers could gain deeper insight into campaign performance, donation velocity, and giving patterns
- **AI Giving Agent** — A concept for automated, values-aligned monthly giving — set a pledge, choose causes, and let an AI distribute donations with full transparency
- **Donation Flow** — Streamlined checkout with tip selection and payment method options

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **State:** Zustand, React Query
- **Forms:** React Hook Form + Zod validation
- **Testing:** Vitest + Testing Library (175 tests)
- **CI:** GitHub Actions (lint, test, build)
- **Hosting:** Vercel

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── api/              # API routes (fundraisers, communities, users, search)
│   ├── communities/      # Community detail page
│   ├── create/           # Fundraiser creation wizard
│   ├── f/[slug]/         # Fundraiser detail + donate flow
│   ├── giving-agent/     # AI Giving Agent (setup, dashboard)
│   ├── metrics-lab/      # Analytics dashboard
│   ├── search/           # Search & browse
│   └── u/[username]/     # User profile
├── components/           # Reusable UI and feature components
├── lib/
│   ├── api/              # API client
│   ├── data/             # Mock data layer
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Formatting and helper utilities
└── __tests__/            # Unit tests
```

## Tests

```bash
npm run test:run    # Run all tests once
npm test            # Watch mode
npm run lint        # ESLint
```

## Philosophy

The goal isn't to rebuild GoFundMe — it's to understand the product deeply enough to identify where there's room to add more value. Each page and feature here is an exploration of how the platform could better connect generosity with impact.
