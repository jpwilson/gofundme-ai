import { notFound } from "next/navigation";
import {
  getFundraiserBySlug,
  getDonationsByFundraiserId,
  getLeaderboardByCommunitySlug,
} from "@/lib/data/mock";
import { FundraiserPage } from "@/components/fundraiser/FundraiserPage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function FundraiserRoute({ params }: PageProps) {
  const { slug } = await params;
  const fundraiser = getFundraiserBySlug(slug);

  if (!fundraiser) {
    notFound();
  }

  const donations = getDonationsByFundraiserId(fundraiser.id);
  const leaderboard = fundraiser.community
    ? getLeaderboardByCommunitySlug(fundraiser.community.slug)
    : [];

  return (
    <FundraiserPage
      fundraiser={fundraiser}
      donations={donations}
      leaderboard={leaderboard}
    />
  );
}
