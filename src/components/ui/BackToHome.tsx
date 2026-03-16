'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export function BackToHome() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-3 pb-1">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-xs font-medium text-gfm-secondary hover:text-gfm-green transition-colors"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Back to home
      </Link>
    </div>
  );
}
