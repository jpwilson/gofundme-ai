import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--gfm-light-green)]">
          <svg className="h-10 w-10 text-[var(--gfm-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[var(--gfm-dark)]">Sign in coming soon</h1>
        <p className="mt-3 text-[var(--gfm-secondary)] leading-relaxed">
          Authentication is on the roadmap. For now, explore the demo as Jean-Paul Wilson.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/u/jpwilson"
            className="rounded-full bg-[var(--gfm-green)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--gfm-dark-green)] transition-colors"
          >
            View your profile
          </Link>
          <Link
            href="/"
            className="rounded-full border-2 border-[var(--gfm-border)] px-6 py-2.5 text-sm font-semibold text-[var(--gfm-dark)] hover:border-[var(--gfm-green)] hover:text-[var(--gfm-green)] transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
