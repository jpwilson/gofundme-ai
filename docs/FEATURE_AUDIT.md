# GoFundMe Complete Feature Audit

> **Purpose**: Document EVERY existing GoFundMe feature so we (1) include all core features in our build, (2) don't accidentally claim existing features as "novel," and (3) identify genuine gaps where we can innovate.

---

## EXISTING FEATURES (Must Include)

### Fundraiser Page (`/f/{slug}`) - CORE PAGE

**Content & Display**:
- [x] Campaign title (H1)
- [x] Image carousel (multiple images, dots navigation, arrows)
- [x] Organizer line: avatar + name + "for [Beneficiary]" + verified badge
- [x] "Tax deductible" badge (for nonprofit-linked campaigns)
- [x] Rich text campaign description (expandable with "...read more")
- [x] Campaign category + created date
- [x] "Report fundraiser" link

**Donation Sidebar (Sticky)**:
- [x] Circular progress indicator (SVG, percentage in center)
- [x] "$X,XXX raised of $Goal" display
- [x] Donation count ("21 donations")
- [x] "Donate now" button (green, primary CTA)
- [x] "Share" button (dark green)
- [x] Recent donors list (avatar/initial, name, amount, time ago)
- [x] "See all" / "See top" donor toggle
- [x] "See how this fundraiser ranks" link
- [x] "Help [Name] climb the leaderboard, donate today!" banner

**Engagement**:
- [x] React button (heart) + sparkle emoji reactions
- [x] Inline Donate / Share buttons (outlined, below description)
- [x] Words of support (donor comments with donations)
- [x] Organizer can reply to donor comments / send thank you notes
- [x] Organizer can turn off words of support

**Leaderboard**:
- [x] Leaderboard section with count badge
- [x] Top 3 podium layout (2nd teal, 1st green/yellow, 3rd orange)
- [x] Each card: avatar, name, campaign title, amount raised
- [x] "THIS FUNDRAISER" badge for current campaign
- [x] Ranked list (4th, 5th, 6th...) below podium
- [x] "See all" button

**Cause Section**:
- [x] Linked community/campaign card ("Fundraise for Watch Duty Wildfire Alerts")
- [x] "View campaign" link

**Organizer Section**:
- [x] Organizer avatar + name + "Organizer" role + location
- [x] Arrow → Beneficiary avatar + name + "Beneficiary" label
- [x] "Contact" button for organizer

**Sharing**:
- [x] Share to Facebook, Twitter, email, copy link
- [x] Embed code option
- [x] Share fundraiser outside social media (text, WhatsApp, etc.)

**Fundraiser Updates**:
- [x] Organizer posts updates (text + images)
- [x] Updates sent via email to all donors
- [x] Option to auto-post updates to social media

**Donation Flow**:
- [x] Donation amount presets + custom amount
- [x] Optional tip to GoFundMe (percentage slider)
- [x] Payment via credit/debit card
- [x] Anonymous donation option
- [x] Words of support message field
- [x] Recurring monthly donation option ("Give monthly")
- [x] Donation confirmation + receipt

**Fundraiser Management (Organizer View)**:
- [x] Edit title, description, images, goal
- [x] Post updates
- [x] Thank donors (bulk or individual)
- [x] Download donor contact info (name + email)
- [x] Set up bank info for withdrawals
- [x] Invite beneficiary to add their bank info
- [x] View donation history and stats

---

### Community Page (`/communities/{slug}`) - CORE PAGE

**Header**:
- [x] Community icon + "Community" label
- [x] Community name (H1)
- [x] Description with "...read more" truncation
- [x] Follower avatars (stacked, overlapping)
- [x] Follower count + clickable
- [x] "Follow" button
- [x] Share icon
- [x] Stats row: $X Raised | Y Donations | Z Fundraisers
- [x] "Start a GoFundMe" button
- [x] Large banner image (right side on desktop)

**Leaderboard**:
- [x] Same podium layout as fundraiser page
- [x] Count badge showing total fundraisers

**Tabs**:
- [x] Activity tab (default)
- [x] Fundraisers tab
- [x] About tab

**Activity Feed**:
- [x] Sort dropdown ("Sorting by: Latest")
- [x] Activity cards: avatar + name + time ago + "..." menu
- [x] Post text with "...read more"
- [x] Embedded fundraiser update cards (image + campaign name + progress circle)
- [x] Heart/like count, comment count, share icon
- [x] Comment threads with replies

**Fundraisers Tab**:
- [x] List/grid of fundraiser cards linked to this community

**About Tab**:
- [x] Community description and info

---

### Profile Page (`/u/{username}`) - CORE PAGE

**Public Profile (viewing someone else)**:
- [x] Cover image (default: light green abstract shape)
- [x] Profile avatar (circular, overlapping cover image)
- [x] Display name
- [x] "Inspired X people to help" green pill badge with info icon
- [x] Follower count + Following count (clickable)
- [x] "Follow" button + "..." more menu
- [x] "Discover more people" expandable section with avatar thumbnails
- [x] Top causes section: circular icons with labels (Animals, Arts & Culture, Environment, etc.)
- [x] Highlights: featured campaign cards (image, supporter count, title, progress bar, amount raised)
- [x] Activity feed: donation activities, fundraiser starts, fundraiser updates
- [x] Activity cards: heart/like, comment, share icons
- [x] "Follow" floating button that follows scroll
- [x] Share profile button
- [x] Block users option
- [x] Pin a fundraiser with 250-char personal message

**Private Profile (your own)**:
- [x] "Edit profile" instead of Follow
- [x] Customize: name, image, bio
- [x] Pin/unpin fundraisers
- [x] Choose which fundraisers/nonprofits to display
- [x] "Personalize your profile" CTA banner
- [x] "See your profile" link
- [x] Notification settings per followed user
- [x] Manage followers/following
- [x] Donation history

---

### Navigation (Global)

- [x] Search icon
- [x] "Donate" dropdown (Categories, Crisis relief, Social Impact Funds, Supporter Space, Nonprofits)
- [x] "Fundraise" dropdown (How to start, Categories, Team, Blog, Charity, Nonprofit signup)
- [x] "Giving Funds" with NEW badge
- [x] GoFundMe logo (center)
- [x] "About" dropdown (How it works, Giving Guarantee, Countries, Pricing, Help, Newsroom, Careers)
- [x] Notification bell with count
- [x] "Sign in"
- [x] "Start a GoFundMe" outlined button

---

### Mobile App (iOS + Android)

**Bottom Tabs** (from screenshot):
- [x] Fundraising (manage your campaigns)
- [x] Giving Fund (DAF management)
- [x] Notifications (donation alerts, updates)
- [x] Profile

**Features**:
- [x] Create fundraiser with phone camera/photos
- [x] Share via social media, email, text
- [x] Track donations and thank donors
- [x] Set up money transfers
- [x] Fundraising coaching tips
- [x] Post video updates
- [x] "Give monthly" - recurring contribution setup
- [x] "Set up recurring contributions" button
- [x] "In the news" / "Make Helping A Habit" content
- [x] Discover places to give (nonprofit cards with heart/favorite)
- [x] Push notifications for donation alerts

---

### Other Features

**Supporter Space**:
- [x] Browse fundraisers by category
- [x] Safe giving guides
- [x] Find charities / vetted nonprofits
- [x] Community success stories
- [x] Creative giving ideas
- [x] GoFundMe Heroes profiles
- [x] GoFundMe Giving Guarantee (donor protection)

**Giving Funds (DAF)**:
- [x] Create donor-advised fund ($0 min, $5 min contribution)
- [x] Investment options (BlackRock, Vanguard)
- [x] Grant to 501(c)(3) charities
- [x] Stock transfers
- [x] Recurring contributions
- [x] Single annual tax receipt
- [x] Track and budget giving

**AI Features (Already Exist)**:
- [x] AI Fundraising Coach (creates fundraiser in ~10 min)
- [x] Intelligent Ask Amounts (ML-powered donation suggestions - 7% more revenue)
- [x] Ray AI HelperBot (FAQ chatbot)
- [x] Suggested goal amounts based on similar campaigns
- [x] Suggested titles

**Campaign Creation**:
- [x] AI Coach path OR manual step-by-step
- [x] Recipient type: Yourself / Someone else / Charity
- [x] Location entry
- [x] Rich story editor (photos, videos, links)
- [x] AI-suggested titles and goals
- [x] Media upload (photo/video)
- [x] Category selection
- [x] Instant go-live

**Trust & Safety**:
- [x] Report fundraiser
- [x] GoFundMe Giving Guarantee
- [x] Verified badge (organizer)
- [x] Transparency Center

**Search & Discovery**:
- [x] Algolia-powered search (InstantSearch + Query Suggestions)
- [x] A/B testing (Algolia + Optimizely)
- [x] Category browsing
- [x] Trending/featured campaigns
- [x] Crisis relief discovery

---

## GENUINELY NOVEL FEATURES (What They DON'T Have)

After this audit, here's what GoFundMe genuinely lacks — these are our real differentiators:

### 1. AI Giving Agent with Auto-Distribution (FLAGSHIP)
**What exists**: Giving Funds (manual DAF), "Give monthly" (recurring to ONE campaign)
**What's missing**: An AI agent that takes a monthly pledge and AUTOMATICALLY distributes it across multiple campaigns matching your cause preferences. GoFundMe's recurring giving is per-campaign. Nobody aggregates and auto-distributes across causes.

### 2. AI-Powered Impact Reports
**What exists**: Basic donation receipts, single tax receipt from Giving Funds
**What's missing**: Rich impact reports showing "Your $200 helped 3 campaigns reach their goals," stories from campaigns you supported, before/after outcomes, aggregate giving stats over time. Shareable impact cards ("In 2026, I supported 47 campaigns").

### 3. Giving Circles (Group Giving)
**What exists**: Team fundraising (multiple people RAISING for one campaign)
**What's missing**: Group GIVING — friends pool monthly contributions and collectively decide where to donate. Shared impact dashboard. Voting on campaigns.

### 4. Smart Campaign Discovery Alerts
**What exists**: Follow users/communities for updates, notification bell
**What's missing**: AI-powered alerts: "A new campaign in your area matches your causes" or "A wildfire campaign is trending and you care about environment." Proactive, personalized push notifications based on cause affinity.

### 5. Donor Momentum Widget / Social Proof
**What exists**: Donor list on sidebar, donation count
**What's missing**: Real-time "X people are viewing this right now," "3 donations in the last hour," "If 50 more people give $20, this reaches its goal" smart nudges. Milestone celebration animations (25%, 50%, 75%, goal).

### 6. Campaign Health Score
**What exists**: AI suggested goals and titles at creation time
**What's missing**: Ongoing campaign health dashboard: "Your campaign is underperforming similar ones. Try: posting an update, sharing on Instagram, adding a video." Real-time optimization suggestions during the campaign lifecycle.

### 7. Donor-to-Donor Network Effects
**What exists**: "Discover more people" on profiles, follow system
**What's missing**: "People who donated to this also donated to..." recommendations. Cause-based matching. "Your network has raised $X total." Friend activity in donation flow ("3 of your friends donated to this").

### 8. Transparency Dashboard (Enhanced)
**What exists**: Basic verified badge, Giving Guarantee
**What's missing**: Fund disbursement tracking by organizer (how was money spent?), receipt/expense uploads, verification LEVELS (email → identity → organization → nonprofit), "Funds used for" breakdown visible to donors.

### 9. Share Analytics for Organizers
**What exists**: Share buttons, basic share count
**What's missing**: "Your share on Twitter generated $340 in donations." Per-platform share effectiveness. "Best time to share" analysis. Share-to-donation conversion tracking.

### 10. Cause Subscription Feed
**What exists**: Follow individual users and communities
**What's missing**: Subscribe to entire CAUSE categories (e.g., "All Environment campaigns in California"). Personalized feed of campaigns across multiple communities based on cause affinity.

---

## Implementation Priority

### Must-Have (Include in v1 — matches existing GoFundMe):
All features in the "EXISTING FEATURES" section above for the three core pages.

### Differentiators (Our novel value — build after core pages work):
1. AI Giving Agent + Auto-Distribution (P0 — flagship)
2. Impact Reports (P0 — ties into Giving Agent)
3. Donor Momentum / Social Proof widgets (P1 — quick win, high impact)
4. Smart Campaign Discovery Alerts (P1)
5. Giving Circles (P2)
6. Campaign Health Score (P2)
7. Transparency Dashboard (P2)
8. Donor Network Effects (P3)
9. Share Analytics (P3)
10. Cause Subscription Feed (P3)
