# GoFundMe Clone - Technical Specification

## Project Overview

A full-stack GoFundMe-inspired platform featuring three core page types (Profile, Fundraiser, Community) plus supporting pages, built with modern web technologies. Includes web app + React Native mobile apps (iOS/Android).

## Brand & Design System

### Colors (from GoFundMe)
- **Primary Green**: `#02a95c` (buttons, CTAs, progress bars)
- **Dark Green**: `#017a3e` (Share button, hover states)
- **Lime/Light Green**: `#d0f2c8` / `#c8f7c5` (profile banner, badges)
- **Yellow/Gold**: `#f5c542` (leaderboard 1st place)
- **Light Blue/Teal**: `#c5e8f7` (leaderboard 2nd place)
- **Orange**: `#f5a623` (leaderboard 3rd place)
- **Dark text**: `#1a1a1a`
- **Secondary text**: `#6b6b6b`
- **Light gray background**: `#f8f8f8`
- **Border gray**: `#e0e0e0`
- **White**: `#ffffff`
- **Black (nav/footer)**: `#333333`

### Typography
- **Font Family**: `"GoFundMeSans"` (custom), fallback: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`
- **Weights**: Regular (400), Medium (500), Bold (700)
- **Heading sizes**: H1: 32px, H2: 24px, H3: 20px
- **Body**: 16px, Small: 14px

### Border Radius
- Cards: 12px
- Buttons: 8px (Donate), 50px (Share, pill-shaped)
- Avatars: 50% (circle)

## URL Patterns
- Fundraiser: `/f/{slug}`
- Community: `/communities/{slug}`
- Profile: `/u/{username}`
- Home: `/`
- Search: `/search`
- Categories: `/c/{category}`
- Sign in: `/sign-in`
- Sign up: `/sign-up`
- Start fundraiser: `/create`
- Donate: `/f/{slug}/donate`
- Settings: `/settings`

## Pages

### 1. Fundraiser Page (`/f/{slug}`)

**Layout**: Two-column (main content left, sticky donation sidebar right)

**Main Content (Left)**:
- Campaign title (H1)
- Image carousel with dots/arrows
- Organizer line: avatar + "Name for Beneficiary" + verified badge
- "Tax deductible" badge (if applicable)
- Campaign description (rich text, expandable)
- React button + sparkle count
- Donate / Share buttons (inline, outlined)
- "Take your nonprofit giving to the next level" CTA card
- **Cause section**: linked community/campaign card
- **Leaderboard** (count badge): Top 3 podium (2nd-1st-3rd layout with colored cards: teal, green/yellow, orange) + ranked list below
- "See all" button
- **Organizer section**: Organizer avatar + name + role + location + "Contact" button, arrow to Beneficiary avatar + name + "Beneficiary" label
- Created date + category
- "Report fundraiser" link

**Sidebar (Right, Sticky)**:
- "See how this fundraiser ranks" link
- Circular progress indicator (percentage)
- "$X raised of $Goal" with donation count
- "Donate now" button (green, full-width)
- "Share" button (dark green, full-width)
- Recent donors list (avatar, name, amount, time ago)
- "See all" / "See top" toggle buttons
- "Help [Name] climb the leaderboard" banner (green)

### 2. Community Page (`/communities/{slug}`)

**Header Section**:
- Community icon + "Community" label
- Community name (H1)
- Description text with "...read more" truncation
- Follower avatars (stacked) + "X followers" link
- Follow button + share icon
- Stats row: Raised | Donations | Fundraisers
- "Start a GoFundMe" button (green)
- Large community banner image (right side)

**Leaderboard Section**:
- "Leaderboard" heading with count badge
- Top 3 podium (same style as fundraiser)
- "See all" button

**Tabs**: Activity | Fundraisers | About

**Activity Tab**:
- Sort dropdown ("Sorting by: Latest")
- Activity feed cards:
  - User avatar + name + time ago + "..." menu
  - Post text with "...read more"
  - Embedded fundraiser update cards (image + campaign name + progress circle)
  - Engagement: heart count, comment count, share icon

**Fundraisers Tab**:
- Grid/list of fundraiser cards linked to this community

**About Tab**:
- Community description, guidelines, admin info

### 3. Profile Page (`/u/{username}`)

**Public View** (viewing someone else's profile):
- Cover image (light green abstract shape default)
- Profile avatar (circular, overlapping cover)
- Display name
- "Inspired X people to help" badge (green pill with info icon)
- "X followers | Y following"
- Follow button + "..." more menu
- "Discover more people" expandable section with avatar thumbnails
- **Top causes**: circular icons with labels (Animals, Arts & Culture, Environment, etc.)
- **Highlights**: Featured campaign cards with image, supporter count, title, progress bar, amount raised
- **Activity feed**: Same card format as community - donation activities, fundraiser starts, updates

**Private View** (your own profile):
- Same layout but with:
  - "Edit profile" button instead of Follow
  - "Personalize your profile" CTA banner at bottom
  - Settings gear icon
  - Edit cover photo option
  - Manage highlights (reorder, add/remove)
  - Draft fundraisers visible
  - Donation history (private to you)
  - Withdrawal/payout information

### 4. Home Page (`/`)
- Navigation bar
- Hero: "Successful fundraisers start here" + "Start a GoFundMe" CTA
- Category cards row
- Stats: "$50M+ raised weekly", "1 donation/second", "8K+ daily starts"
- How it works (3 steps)
- Featured/trending fundraisers
- Footer

### 5. Search Page (`/search`)
- Search bar with filters
- Category filter pills
- Results grid of fundraiser cards
- Sort options (trending, recent, most funded)

### 6. Auth Pages (`/sign-in`, `/sign-up`)
- Email/password form
- Social login (Google, Facebook, Apple)
- Password reset flow

### 7. Create Fundraiser (`/create`)
- Multi-step wizard:
  1. Category selection
  2. Goal amount
  3. Title & description
  4. Cover photo/video upload
  5. Beneficiary info
  6. Review & publish

### 8. Donate Page (`/f/{slug}/donate`)
- Donation amount presets + custom
- Tip to GoFundMe (optional, with slider)
- Payment method
- Anonymous toggle
- Message to organizer
- Confirmation

## Navigation Bar (Global)
- Search icon
- Donate dropdown
- Fundraise dropdown
- Giving Funds (NEW badge)
- GoFundMe logo (center)
- About dropdown
- Notification bell (with count badge)
- Sign in
- "Start a GoFundMe" button (outlined)

## Footer (Global)
- **Donate**: Categories, Crisis relief, Social Impact Funds, Supporter Space
- **Fundraise**: How to start, Fundraising categories, Team fundraising, Blog, Charity fundraising, Sign up as nonprofit
- **About**: How GoFundMe works, Giving Guarantee, Supported countries, Pricing, Help Center, About GoFundMe
- **More**: Newsroom, Careers, GoFundMe.org, Partnerships, GoFundMe Pro
- Social links, language selector, legal links

## Tech Stack

### Web App
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **Testing**: Vitest + React Testing Library + Playwright (E2E)
- **Auth**: NextAuth.js / Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (images)
- **Payments**: Stripe (donations + tips)
- **Analytics**: Custom event tracking (see Instrumentation section)

### Mobile App (Future Phase)
- **Framework**: React Native + Expo
- **Navigation**: Expo Router
- **Shared**: Shared TypeScript types and API client with web

## Database Schema

### Core Tables

```sql
-- Users
users (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  display_name text NOT NULL,
  avatar_url text,
  cover_image_url text,
  bio text,
  location text,
  created_at timestamptz,
  updated_at timestamptz
)

-- Fundraisers
fundraisers (
  id uuid PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  organizer_id uuid REFERENCES users(id),
  beneficiary_id uuid REFERENCES users(id),
  community_id uuid REFERENCES communities(id),
  title text NOT NULL,
  description text NOT NULL,
  goal_amount integer NOT NULL, -- in cents
  raised_amount integer DEFAULT 0,
  donation_count integer DEFAULT 0,
  category text NOT NULL,
  status text DEFAULT 'active', -- draft, active, completed, paused
  is_tax_deductible boolean DEFAULT false,
  cover_image_url text,
  images text[], -- array of image URLs
  created_at timestamptz,
  updated_at timestamptz
)

-- Donations
donations (
  id uuid PRIMARY KEY,
  fundraiser_id uuid REFERENCES fundraisers(id),
  donor_id uuid REFERENCES users(id), -- null if anonymous
  amount integer NOT NULL, -- in cents
  tip_amount integer DEFAULT 0, -- tip to platform
  is_anonymous boolean DEFAULT false,
  display_name text,
  message text,
  created_at timestamptz
)

-- Communities
communities (
  id uuid PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  banner_image_url text,
  icon_url text,
  created_at timestamptz,
  updated_at timestamptz
)

-- Community followers
community_follows (
  id uuid PRIMARY KEY,
  community_id uuid REFERENCES communities(id),
  user_id uuid REFERENCES users(id),
  created_at timestamptz,
  UNIQUE(community_id, user_id)
)

-- User follows
user_follows (
  id uuid PRIMARY KEY,
  follower_id uuid REFERENCES users(id),
  following_id uuid REFERENCES users(id),
  created_at timestamptz,
  UNIQUE(follower_id, following_id)
)

-- Activity feed
activities (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  type text NOT NULL, -- 'donation', 'fundraiser_created', 'fundraiser_update', 'comment'
  fundraiser_id uuid REFERENCES fundraisers(id),
  community_id uuid REFERENCES communities(id),
  content text,
  image_url text,
  created_at timestamptz
)

-- Reactions (likes on activities)
reactions (
  id uuid PRIMARY KEY,
  activity_id uuid REFERENCES activities(id),
  user_id uuid REFERENCES users(id),
  type text DEFAULT 'heart',
  created_at timestamptz,
  UNIQUE(activity_id, user_id)
)

-- Comments
comments (
  id uuid PRIMARY KEY,
  activity_id uuid REFERENCES activities(id),
  user_id uuid REFERENCES users(id),
  content text NOT NULL,
  created_at timestamptz
)

-- User causes (top causes on profile)
user_causes (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  cause text NOT NULL, -- 'animals', 'arts_culture', 'environment', etc.
  UNIQUE(user_id, cause)
)

-- Profile highlights
profile_highlights (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  fundraiser_id uuid REFERENCES fundraisers(id),
  display_order integer,
  UNIQUE(user_id, fundraiser_id)
)
```

## Instrumentation & Metrics

### What We Capture and Why

**Page Performance Metrics**:
- **Time to First Byte (TTFB)**: Measures server response time - critical for SEO and user experience
- **Largest Contentful Paint (LCP)**: Measures perceived load speed - GoFundMe pages are image-heavy so this is crucial
- **First Input Delay (FID)**: Measures interactivity - donation buttons must be responsive immediately
- **Cumulative Layout Shift (CLS)**: Prevents janky layouts when images/donation widgets load

**User Engagement Metrics**:
- **Page views** (with referrer tracking): Understand where traffic comes from (social shares are key)
- **Time on page**: Longer time = more engaged = higher conversion to donate
- **Scroll depth**: How far users read the campaign story (correlates with donation likelihood)
- **Share button clicks** (by platform): Track which social channels drive the most re-shares
- **Share-to-donation conversion**: The critical viral loop metric - each share should generate ~$13-15 in donations

**Donation Funnel Metrics**:
- **Donate button clicks**: Top of donation funnel
- **Donation page views**: Did they reach the payment form?
- **Donation completion rate**: Conversion rate from button click to completed donation
- **Average donation amount**: Track trends, segment by campaign type
- **Tip rate and amount**: Revenue metric - what % of donors leave a tip and how much
- **Donation abandonment**: Where in the flow do people drop off?

**Campaign Success Metrics**:
- **Fundraiser creation funnel**: Step-by-step drop-off in campaign creation wizard
- **Time to first donation**: How quickly does a new campaign get traction?
- **Social share rate**: % of visitors who share (most important growth metric)
- **Donor return rate**: Do donors come back and give to other campaigns?
- **Campaign goal completion rate**: What % of campaigns reach their goal?

**Trust & Safety Metrics**:
- **Report rate**: Campaigns reported as fraudulent
- **Verification completion rate**: How many organizers verify identity
- **Refund rate**: Indicator of donor trust issues

**Community Metrics**:
- **Follow rate**: Community page visitors who click Follow
- **Activity engagement**: Likes, comments, shares on community posts
- **Leaderboard participation**: Does gamification drive more fundraising?
- **Community-driven fundraiser creation**: Do community members create fundraisers?

### Implementation
- Custom analytics via Supabase (events table)
- Web Vitals API for performance metrics
- Middleware-based page view tracking
- Client-side event tracking with batched sends
- Dashboard for real-time metrics visualization

## Novel Features (Enhancements Beyond Current GoFundMe)

### 1. AI-Powered Campaign Optimizer
- Analyze campaign title/description and suggest improvements
- "Your title could reach 40% more donors" suggestions
- Optimal image recommendations based on successful campaigns
- Best time to share analysis

### 2. Impact Visualization
- Animated counter showing real-time donation impact
- "Your $50 provides 2 days of wildfire monitoring"
- Interactive map showing where donations come from
- Community impact timeline

### 3. Smart Social Sharing
- Auto-generate optimized share cards for each platform
- Share templates with personalized messages
- "Share streak" - gamify sharing with badges
- One-click share to multiple platforms simultaneously
- QR code generation for offline sharing

### 4. Donor Momentum Widget
- Real-time "others are donating right now" notifications
- "X people viewing this campaign" counter
- Milestone celebrations (50%, 75%, goal reached animations)
- "Fastest growing campaign in [category]" badges

### 5. Recurring Giving
- Monthly donation subscriptions
- "Impact over time" calculator
- Subscription management dashboard

### 6. Enhanced Leaderboard
- Time-based leaderboards (daily, weekly, all-time)
- Fundraiser challenges between friends
- Team fundraising with combined progress
- Achievement badges (first donation, top fundraiser, etc.)

### 7. Campaign Updates with Rich Media
- Video updates from organizers
- Photo galleries with before/after
- Milestone update auto-generation
- Push notifications for campaign updates

### 8. Donor Network Effects
- "People who donated to this also donated to..."
- Cause-based recommendation engine
- "Your network raised $X total" stat on profile
- Suggested campaigns based on giving history

### 9. Transparency Dashboard
- Fund disbursement tracking
- Receipt/expense uploads by organizer
- Verification badges (identity, organization, nonprofit status)
- "Funds used for" breakdown

### 10. Offline-First Mobile Experience
- Cache campaigns for offline viewing
- Queue donations when offline
- Push notifications for updates
- Deep linking from social shares

## Testing Strategy

### Unit Tests (Vitest + React Testing Library)
- Component rendering tests for all page components
- Utility function tests (currency formatting, date formatting, etc.)
- Hook tests (custom hooks for data fetching, auth state)
- Form validation tests

### Integration Tests
- API route tests (donation flow, campaign creation)
- Auth flow tests (sign up, sign in, sign out)
- Database query tests with test fixtures

### E2E Tests (Playwright)
- Full donation flow
- Campaign creation wizard
- Profile view (public vs private)
- Community page interactions
- Search and discovery
- Mobile responsive testing

### Performance Tests
- Lighthouse CI scores (target: 90+ on all metrics)
- Load testing for donation endpoints
- Image optimization verification

## File Structure

```
gofundme-v1/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Home
│   │   ├── f/[slug]/
│   │   │   └── page.tsx        # Fundraiser page
│   │   ├── communities/[slug]/
│   │   │   └── page.tsx        # Community page
│   │   ├── u/[username]/
│   │   │   └── page.tsx        # Profile page
│   │   ├── search/
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   ├── create/
│   │   └── api/                # API routes
│   ├── components/
│   │   ├── ui/                 # Shared UI primitives
│   │   ├── layout/             # Nav, Footer, etc.
│   │   ├── fundraiser/         # Fundraiser-specific components
│   │   ├── community/          # Community-specific components
│   │   ├── profile/            # Profile-specific components
│   │   └── donation/           # Donation flow components
│   ├── lib/
│   │   ├── supabase/           # Supabase client + queries
│   │   ├── stripe/             # Stripe integration
│   │   ├── analytics/          # Event tracking
│   │   ├── utils/              # Shared utilities
│   │   └── types/              # TypeScript types
│   ├── hooks/                  # Custom React hooks
│   └── stores/                 # Zustand stores
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── public/
│   └── fonts/                  # GoFundMeSans alternative font
├── supabase/
│   └── migrations/             # Database migrations
├── mobile/                     # React Native (Expo) app
│   ├── app/
│   ├── components/
│   └── ...
└── docs/
    ├── FEATURES.md             # Novel feature ideas
    └── METRICS.md              # Metrics documentation
```

## Development Phases

### Phase 1 - Core Web (Current)
1. Project setup (Next.js, Tailwind, Supabase, testing)
2. Design system (colors, typography, shared components)
3. Navigation + Footer
4. Fundraiser page (full implementation)
5. Community page (full implementation)
6. Profile page (public + private views)
7. Home page
8. Auth (sign in/up)
9. Donation flow (Stripe)
10. Search
11. Analytics instrumentation
12. Tests (unit, integration, E2E)

### Phase 2 - Mobile
1. Expo project setup
2. Shared types/API client
3. Core screens (fundraiser, community, profile)
4. Push notifications
5. Deep linking

### Phase 3 - Novel Features
1. AI campaign optimizer
2. Impact visualization
3. Smart sharing
4. Donor momentum
5. Enhanced leaderboard
