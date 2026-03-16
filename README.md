# GoFundMe AI — Product Exploration

A deep product exploration that reimagines GoFundMe's three core pages with AI — built the same week GoFundMe launched their Smart Fundraising Coach (March 12, 2026).

**Live demo:** [gfmv1.vercel.app](https://gfmv1.vercel.app)

## What's Here

Three AI-enhanced GoFundMe pages, each with features that map to real business problems:

### Fundraiser Page
AI trust badge, donor sentiment analysis, story coaching, share content generator, intelligent ask amounts

### Community Page
AI-generated community digest, smart campaign tags (urgency, momentum)

### Profile Page
AI giving personality, impact narrative, personalized campaign recommendations

### Additional
- **Fraud Detection** — AI trust scoring dashboard
- **Giving Agent** — Automated monthly giving
- **AI Analytics** — LangFuse observability, cost projections
- **3D Explorer** — Interactive feature map
- **Docs** — Full project documentation

## AI Cost at Scale

| Users | Monthly Cost |
|-------|-------------|
| 1K | $5 |
| 100K | $500 |
| 1M | $5,000 |

Claude Haiku via OpenRouter. ~5 AI calls per user per month.

## Tech Stack

Next.js 16 · TypeScript · Tailwind CSS 4 · Claude API (OpenRouter) · LangFuse · Vercel · 205 tests

## Getting Started

```bash
npm install
npm run dev
```

Set `OPENROUTER_API_KEY` in `.env.local` for real AI features (falls back to mock without it).
