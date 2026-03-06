import { CommunityPage } from "@/components/community/CommunityPage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CommunityRoute({ params }: PageProps) {
  const { slug } = await params;
  return <CommunityPage slug={slug} />;
}

export function generateMetadata() {
  return {
    title: "Community | GoFundMe",
  };
}
