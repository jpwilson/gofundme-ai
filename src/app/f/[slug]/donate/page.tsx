import { notFound } from "next/navigation";
import { getFundraiserBySlug } from "@/lib/data/mock";
import { DonateFlow } from "@/components/donate/DonateFlow";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DonatePage({ params }: PageProps) {
  const { slug } = await params;
  const fundraiser = getFundraiserBySlug(slug);

  if (!fundraiser) {
    notFound();
  }

  return <DonateFlow fundraiser={fundraiser} />;
}
