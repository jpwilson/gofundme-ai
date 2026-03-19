import Link from 'next/link';
import Image from 'next/image';
import { fundraisers } from '@/lib/data/mock';
import { formatCurrency, formatPercentage } from '@/lib/utils/format';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';

/* ─── Category metadata ─── */
const CATEGORY_META: Record<string, {
  title: string;
  description: string;
  heroImage: string;
  color: string;
}> = {
  medical: {
    title: 'Medical',
    description: 'Help others by donating to their medical fundraiser, or start one for someone you care about.',
    heroImage: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800&q=80',
    color: 'from-rose-500 to-pink-600',
  },
  emergency: {
    title: 'Emergency',
    description: 'Support people facing unexpected emergencies — from natural disasters to sudden crises.',
    heroImage: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80',
    color: 'from-orange-500 to-red-600',
  },
  education: {
    title: 'Education',
    description: 'Fund scholarships, school supplies, and educational programs that change lives.',
    heroImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800&q=80',
    color: 'from-blue-500 to-indigo-600',
  },
  animals: {
    title: 'Animals',
    description: 'Help rescue animals, fund veterinary care, and support animal shelters in your community.',
    heroImage: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80',
    color: 'from-amber-500 to-orange-600',
  },
  environment: {
    title: 'Environment',
    description: 'Protect our planet by supporting environmental conservation, cleanup, and sustainability projects.',
    heroImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    color: 'from-emerald-500 to-green-600',
  },
  community: {
    title: 'Community',
    description: 'Strengthen your community through local projects, mutual aid, and neighborhood initiatives.',
    heroImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    color: 'from-teal-500 to-cyan-600',
  },
  business: {
    title: 'Business',
    description: 'Support small businesses, startups, and entrepreneurs working to build something meaningful.',
    heroImage: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80',
    color: 'from-slate-600 to-gray-800',
  },
  faith: {
    title: 'Faith',
    description: 'Support faith-based organizations, missions, and community outreach programs.',
    heroImage: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&q=80',
    color: 'from-violet-500 to-purple-600',
  },
};

/* ─── Generate mock fundraisers for categories with no real data ─── */
function getMockFundraisersForCategory(category: string) {
  const names: Record<string, { titles: string[]; organizers: string[] }> = {
    medical: {
      titles: [
        'Help Sarah Fight Leukemia',
        'Surgery Fund for Baby Noah',
        'Mental Health Recovery for Veterans',
        'Emergency Heart Surgery for Dad',
        'Cancer Treatment for Maria',
        'Wheelchair Accessible Van Fund',
      ],
      organizers: ['Sarah Chen', 'Noah Williams', 'James Parker', 'Rosa Martinez', 'Maria Lopez', 'David Kim'],
    },
    emergency: {
      titles: [
        'Wildfire Family Displacement Relief',
        'Flood Victims Emergency Housing',
        'House Fire Recovery — The Johnsons',
        'Tornado Relief for Springfield',
        'Emergency Food & Shelter Fund',
        'Car Accident Recovery — Help Needed',
      ],
      organizers: ['Emergency Relief Fund', 'City of Hope', 'Johnson Family', 'Springfield Aid', 'Community Care', 'Rebecca Taylor'],
    },
    education: {
      titles: [
        'First-Gen College Scholarship Fund',
        'Books for Kids in Rural Schools',
        'STEM Camp for Underserved Youth',
        'Teacher Classroom Supply Drive',
        'After-School Tutoring Program',
        'Study Abroad Opportunity Fund',
      ],
      organizers: ['Education Forward', 'ReadMore Foundation', 'TechKids', 'Ms. Thompson', 'Community Tutors', 'Alex Rivera'],
    },
    animals: {
      titles: [
        'Save the Rescue Dogs of LA',
        'Emergency Vet Bills for Shelter Cats',
        'Horse Sanctuary Winter Feed Fund',
        'Wildlife Rehabilitation Center',
        'Stray Animal Spay/Neuter Program',
        'Service Dog Training Scholarship',
      ],
      organizers: ['LA Dog Rescue', 'CatCare Shelter', 'Hope Ranch', 'Wildlife Warriors', 'Paws & Claws', 'Service Dog Academy'],
    },
    environment: {
      titles: [
        'Community Garden & Green Space',
        'Ocean Plastic Cleanup Expedition',
        'Plant 10,000 Trees Initiative',
        'Solar Panels for Local School',
        'River Watershed Restoration',
        'Community Composting Program',
      ],
      organizers: ['Green Future', 'OceanCrew', 'TreesForAll', 'SolarSchools', 'Clean Water Coalition', 'EcoCity'],
    },
    community: {
      titles: [
        'Neighborhood Youth Center Fund',
        'Community Food Pantry Expansion',
        'Free Library & Reading Room',
        'Homeless Shelter Winter Drive',
        'Community Mural & Art Project',
        'Senior Citizens Activity Center',
      ],
      organizers: ['Youth Forward', 'FeedMore', 'BookHaven', 'Warm Hearts', 'ArtWorks', 'Senior Connect'],
    },
    business: {
      titles: [
        'Help Rebuild Our Family Restaurant',
        'Startup Tech Lab for Students',
        'Main Street Shop Recovery Fund',
        'Bakery Equipment Replacement',
        'Co-Working Space for Artists',
        'Food Truck Dream Fund',
      ],
      organizers: ['Chen Family', 'TechStart', 'Main Street Alliance', 'Sweet Treats Bakery', 'Creative Hub', 'Chef Marcus'],
    },
    faith: {
      titles: [
        'Church Roof Repair Fund',
        'Youth Mission Trip to Guatemala',
        'Community Outreach Kitchen',
        'Temple Renovation Project',
        'Faith-Based Recovery Program',
        'Holiday Gift Drive for Families',
      ],
      organizers: ['Grace Church', 'Youth Missions', 'Community Kitchen', 'Peace Temple', 'New Hope Recovery', 'Holiday Hearts'],
    },
  };

  const data = names[category] || names.community;
  const goals = [5000, 10000, 15000, 25000, 50000, 75000];
  const raised = [0.3, 0.45, 0.6, 0.75, 0.85, 0.95];

  return data.titles.map((title, i) => ({
    id: `mock-${category}-${i}`,
    slug: `${category}-fundraiser-${i}`,
    title,
    organizer: data.organizers[i],
    goalAmount: goals[i % goals.length] * 100,
    raisedAmount: Math.round(goals[i % goals.length] * raised[i % raised.length]) * 100,
    donationCount: Math.floor(Math.random() * 200) + 20,
  }));
}

/* ─── Gradient for cards ─── */
const GRADIENTS = [
  'from-emerald-400 to-cyan-500',
  'from-violet-500 to-purple-500',
  'from-rose-400 to-orange-400',
  'from-blue-400 to-indigo-500',
  'from-amber-400 to-yellow-500',
  'from-teal-400 to-green-500',
];

/* ─── Page ─── */
interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const meta = CATEGORY_META[category];

  if (!meta) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gfm-dark mb-2">Category not found</h1>
          <p className="text-gfm-secondary mb-4">The category &ldquo;{category}&rdquo; doesn&apos;t exist.</p>
          <Link href="/">
            <Button variant="primary">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get real fundraisers for this category, or mock ones
  const realFundraisers = fundraisers.filter(
    (f) => f.category.toLowerCase() === category.toLowerCase()
  );
  const mockFundraisers = getMockFundraisersForCategory(category);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gfm-dark overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={meta.heroImage}
            alt={meta.title}
            fill
            sizes="100vw"
            className="object-cover opacity-30"
            priority
          />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-white md:text-5xl leading-[1.1]">
              Discover {meta.title.toLowerCase()}
              <br />
              fundraisers
              <br />
              on GoFundMe
            </h1>
            <p className="mt-4 text-lg text-white/70 leading-relaxed">
              {meta.description}
            </p>
            <div className="mt-8">
              <Link href="/create">
                <Button variant="primary" size="lg">
                  Start a GoFundMe
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="border-t border-gfm-border my-0" />
      </div>

      {/* Real fundraisers (if any) */}
      {realFundraisers.length > 0 && (
        <section className="py-12">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="mb-8 text-2xl font-bold text-gfm-dark">
              Featured {meta.title.toLowerCase()} fundraisers
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {realFundraisers.map((fundraiser) => (
                <Link
                  key={fundraiser.id}
                  href={`/f/${fundraiser.slug}`}
                  className="group overflow-hidden rounded-xl border border-gfm-border bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="aspect-video overflow-hidden bg-gray-100">
                    {fundraiser.coverImageUrl ? (
                      <Image
                        src={fundraiser.coverImageUrl}
                        alt={fundraiser.title}
                        width={400}
                        height={225}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className={`flex h-full items-center justify-center bg-gradient-to-br ${meta.color} p-4 text-center text-sm font-medium text-white`}>
                        {fundraiser.title}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gfm-dark group-hover:text-gfm-green transition-colors line-clamp-2">
                      {fundraiser.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-2">
                      <Avatar name={fundraiser.organizer.displayName} size="xs" />
                      <span className="text-sm text-gfm-secondary">
                        by {fundraiser.organizer.displayName}
                      </span>
                    </div>
                    <div className="mt-3">
                      <ProgressBar
                        percentage={formatPercentage(fundraiser.raisedAmount, fundraiser.goalAmount)}
                        height="sm"
                      />
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="font-semibold text-gfm-dark">
                          {formatCurrency(fundraiser.raisedAmount)} raised
                        </span>
                        <span className="text-sm text-gfm-secondary">
                          of {formatCurrency(fundraiser.goalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Browse category fundraisers */}
      <section className="py-12 bg-gfm-bg">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-8 text-2xl font-bold text-gfm-dark">
            Browse {meta.title.toLowerCase()} fundraisers
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockFundraisers.map((item, i) => (
              <Link
                key={item.id}
                href="/search"
                className="group overflow-hidden rounded-xl border border-gfm-border bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="aspect-video overflow-hidden">
                  <div className={`flex h-full items-center justify-center bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} p-4 text-center text-sm font-medium text-white transition-transform duration-300 group-hover:scale-105`}>
                    {item.title}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gfm-dark group-hover:text-gfm-green transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-2">
                    <Avatar name={item.organizer} size="xs" />
                    <span className="text-sm text-gfm-secondary">
                      by {item.organizer}
                    </span>
                  </div>
                  <div className="mt-3">
                    <ProgressBar
                      percentage={formatPercentage(item.raisedAmount, item.goalAmount)}
                      height="sm"
                    />
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="font-semibold text-gfm-green">
                        {formatCurrency(item.raisedAmount)} raised
                      </span>
                      <span className="text-sm text-gfm-secondary">
                        of {formatCurrency(item.goalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl font-bold text-gfm-dark mb-4">
            Ready to make a difference?
          </h2>
          <p className="text-gfm-secondary mb-8 max-w-xl mx-auto">
            Start a GoFundMe for {meta.title.toLowerCase()} causes or donate to an existing fundraiser.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create">
              <Button variant="primary" size="lg">Start a GoFundMe</Button>
            </Link>
            <Link href="/search">
              <Button variant="outline" size="lg">Browse all fundraisers</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
