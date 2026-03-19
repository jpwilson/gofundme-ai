'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const DemoAssistant = dynamic(
  () => import('@/components/layout/DemoAssistant').then((m) => m.DemoAssistant),
  { ssr: false }
);

export function DemoAssistantLoader() {
  const pathname = usePathname();

  // Hide demo assistant on Pro pages (Pro has its own Ray chat widget)
  if (pathname.startsWith('/pro')) return null;

  return <DemoAssistant />;
}
