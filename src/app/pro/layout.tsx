import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GoFundMe Pro — The #1 Fundraising Platform for Nonprofits',
  description:
    'Community-powered fundraising for nonprofits. GoFundMe Pro offers intelligent donation optimization, global reach, and enterprise-grade tools.',
};

export default function ProLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
